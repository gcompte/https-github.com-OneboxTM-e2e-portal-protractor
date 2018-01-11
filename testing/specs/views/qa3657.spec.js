var CatalogChannelPO = require('./../../page-objects/catalog-channel.po.js'),
    AppPO = require('./../../page-objects/app.po.js');

var env = browser.params.env,
    qaData = require('./suite-data.' + env + '.json').qa3657;

describe('QA-3657 Verificar que se puede filtrar un evento por nombre de evento, nombre de recinto o nombre de ciudad', function() {
    var eventsCount;

    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.channelUrl);
    });

    it('Accedemos a un canal que tenga varios eventos publicados y verificamos que existe el campo para filtrar', function() {
        AppPO.loadAllScroll(qaData.scrollSteps);

        CatalogChannelPO.getAllEvents().count().then(function(totalEvents){
            eventsCount = totalEvents;
        });

        expect(CatalogChannelPO.getEventsFilter().isPresent()).toBe(true);
        expect(CatalogChannelPO.getNoEventsFilteredMessage().isDisplayed()).toBe(false);
    });

    it('Modificamos el tipo de vista y verificamos que sigue mostrándose el campo para filtrar', function(){
        AppPO.browserScrollTo(0, 0);

        CatalogChannelPO.changeEventsView('list');
        expect(CatalogChannelPO.getEventsFilter().isPresent()).toBe(true);
        CatalogChannelPO.changeEventsView('gallery');
    });

    it('Filtramos por una ciudad y verificamos que se muestran los eventos correspondientes', function(){
        CatalogChannelPO.setEventsFilter(qaData.filterCity).then(function(){
            CatalogChannelPO.getEventsFilteredInfo().then(function(eventsFilteredInfo){
                for(var i = 0; i < eventsFilteredInfo.length; i++){
                    expect(eventsFilteredInfo[i]).toMatch(qaData.filterCity);
                }
            });
        });
    });

    it('Borramos el filtro y verificamos que se vuelven a mostrar todos los eventos', function(){
        CatalogChannelPO.clearEventsFilter().then(function(){
            expect(CatalogChannelPO.getAllEvents().count()).toBe(eventsCount);
        });
    });

    it('Filtramos por recinto y verificamos que se muestran los eventos correspondientes', function(){
        CatalogChannelPO.setEventsFilter(qaData.filterVenue).then(function(){
            CatalogChannelPO.getEventsFilteredInfo().then(function(eventsFilteredInfo){
                for(var i = 0; i < eventsFilteredInfo.length; i++){
                    expect(eventsFilteredInfo[i]).toMatch(qaData.filterVenue);
                }
            });
        });
    });

    it('Filtramos por nombre del evento y verificamos que se muestran los eventos correspondientes', function(){
        CatalogChannelPO.clearEventsFilter();
        CatalogChannelPO.setEventsFilter(qaData.filterTitle).then(function(){
            CatalogChannelPO.getEventsFilteredInfo().then(function(eventsFilteredInfo){
                for(var i = 0; i < eventsFilteredInfo.length; i++){
                    expect(eventsFilteredInfo[i]).toMatch(qaData.filterTitle);
                }
            });
        });
    });

    it('Filtramos por una palabra que no coincida con ningún evento y verificamos que se muestra un mensaje informando que no se han encontrado eventos', function(){
        CatalogChannelPO.clearEventsFilter();
        CatalogChannelPO.setEventsFilter(qaData.filterNoResults).then(function(){
            expect(CatalogChannelPO.getAllEvents().count()).toBe(0);
            expect(CatalogChannelPO.getNoEventsFilteredMessage().isDisplayed()).toBe(true);
            expect(CatalogChannelPO.getNoEventsFilteredMessage().getText()).toEqual(qaData.noEventsText);
        });
    });
});