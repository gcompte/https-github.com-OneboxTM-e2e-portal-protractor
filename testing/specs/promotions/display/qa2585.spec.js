var EventCardPO = require('./../../../page-objects/event-card.po.js'),
    SelectLocationsPO = require('./../../../page-objects/select-locations.po.js'),
    VenueNoMapPO = require('./../../../page-objects/venue-no-map.po.js'),
    SummaryPO = require('./../../../page-objects/summary.po.js'),
    AppPO = require('./../../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa2585;

describe('QA-2585 Visualizar y aplicar una promoción automática - descuento porcentual - sesión concreta', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.eventUrl);
    });

    it('Accedemos a la selección de localidades de una sesión que tenga una promoción automática activa y seleccionamos dos localidades', function() {
        AppPO.closeCookiesPolicy();
        browser.driver.sleep(2000);
        if(browser.params.device === 'mobile'){
            EventCardPO.getSessionsByDay(qaData.dayToSelect);
        }

        EventCardPO.boxSessionTime(qaData.secondSessionId).then(function(){
            VenueNoMapPO.selectNoGraphicSeats(qaData.vipNoGraphicZone, 1);
            VenueNoMapPO.selectNoGraphicSeats(qaData.normalNoGraphicZone, 1);

            expect(SelectLocationsPO.getSessionTitle()).toEqual(qaData.eventTitle);         
        });
    });

    it('Verificamos que el precio final y el desglose es correcto, es decir, que la promoción automática se ha aplicado', function() {
        SummaryPO.getSummaryBreakdown().then(function(summaryBreakdown){
            for(var i = 0; i < summaryBreakdown.length; i++){
                expect(summaryBreakdown[i].getText()).toEqual(qaData.priceWithAuto.breakdown[i]);
            }
        });

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.priceWithAuto.finalPrice);
        expect(SummaryPO.getTicketsBasePrice()).toEqual(qaData.priceWithAuto.basePrice);

        if(browser.params.device === 'mobile'){
            expect(SelectLocationsPO.getFinalPriceAmount()).toEqual(qaData.priceWithAuto.finalPrice);
        }
    });

    it('Accedemos a otra sesión para la cual la promoción automática no está activa, y seleccionamos dos localidades', function() {
        browser.get(browser.baseUrl + qaData.eventUrl);
        EventCardPO.boxSessionTime(qaData.firstSessionId).then(function(){
            VenueNoMapPO.selectNoGraphicSeats(qaData.vipNoGraphicZone, 1);
            VenueNoMapPO.selectNoGraphicSeats(qaData.normalNoGraphicZone, 1);

            expect(SelectLocationsPO.getSessionTitle()).toEqual(qaData.eventTitle);         
        });
    });

    it('Verificamos que el precio final y el desglose es correcto, es decir, que la promoción automática no se ha aplicado', function() {
        SummaryPO.getSummaryBreakdown().then(function(summaryBreakdown){
            for(var i = 0; i < summaryBreakdown.length; i++){
                expect(summaryBreakdown[i].getText()).toEqual(qaData.priceWithoutAuto.breakdown[i]);
            }
        });

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.priceWithoutAuto.finalPrice);
        expect(SummaryPO.getTicketsBasePrice()).toEqual(qaData.priceWithoutAuto.basePrice);

        if(browser.params.device === 'mobile'){
            expect(SelectLocationsPO.getFinalPriceAmount()).toEqual(qaData.priceWithoutAuto.finalPrice);
        }
    });
});