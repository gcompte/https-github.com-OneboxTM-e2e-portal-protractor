var CatalogChannelPO = require('./../../page-objects/catalog-channel.po.js'),
    EventCardPO = require('./../../page-objects/event-card.po.js')
    AppPO = require('./../../page-objects/app.po.js');

var env = browser.params.env,
    qaData = require('./suite-data.' + env + '.json').qa877;

describe('QA-877 Verificar la hora en la info de un evento con sesiones a la misma hora', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.eventUrl);
    });

    it('Accedemos a la ficha del canal y verificamos que todas las horas mostradas son correctas', function() {
        //Validamos la hora mostrada en el sidebar del evento
        expect(EventCardPO.getEventTime()).toEqual(qaData.eventSessionTime);

        //Validamos la hora mostrada en las sesiones
        EventCardPO.getAllListSessions('time').getText().then(function(timeSessionsList){
            for(var i = 0; i < timeSessionsList.length; i++){
                expect(timeSessionsList[i]).toEqual(qaData.eventSessionTime);
            }
        });
    });
});