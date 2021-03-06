var EventCardPO = require('./../../../page-objects/event-card.po.js'),
    SelectLocationsPO = require('./../../../page-objects/select-locations.po.js'),
    VenueNoMapPO = require('./../../../page-objects/venue-no-map.po.js'),
    SummaryPO = require('./../../../page-objects/summary.po.js'),
    AppPO = require('./../../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa2583;

describe('QA-2583 Visualizar y aplicar una promoción automática - descuento fijo', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.firstEventUrl);
    });

    it('Accedemos a la selección de localidades de una sesión en un canal concreto, y seleccionamos una localidad de cada zona de precio', function() {
        AppPO.closeCookiesPolicy();
        EventCardPO.boxSessionTime(qaData.firstSessionId).then(function(){
            VenueNoMapPO.selectNoGraphicSeats(qaData.vipNoGraphicZone, 1);
            VenueNoMapPO.selectNoGraphicSeats(qaData.normalNoGraphicZone, 1);

            expect(SelectLocationsPO.getSessionTitle()).toEqual(qaData.eventTitle);         
        });
    });

    it('Verificamos que el precio final y el desglose es correcto, es decir, que la promoción automática se ha aplicado', function() {
        SummaryPO.getSummaryBreakdown().then(function(summaryBreakdown){
            for(var i = 0; i < summaryBreakdown.length; i++){
                expect(summaryBreakdown[i].getText()).toEqual(qaData.channelMono.breakdown[i]);
            }
        });

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.channelMono.finalPrice);
        expect(SummaryPO.getTicketsBasePrice()).toEqual(qaData.channelMono.basePrice);

        if(browser.params.device === 'mobile'){
            expect(SelectLocationsPO.getFinalPriceAmount()).toEqual(qaData.channelMono.finalPrice);
        }
    });

    it('Accedemos a la selección de localidades de una sesión en otro canal, y seleccionamos una localidad de cada zona de precio', function() {
        browser.get(browser.baseUrl + qaData.secondEventUrl);

        AppPO.closeCookiesPolicy();
        EventCardPO.sessionsListViewBuyTickets(qaData.secondSessionId).then(function(){
            VenueNoMapPO.selectNoGraphicSeats(qaData.vipNoGraphicZone, 1);
            VenueNoMapPO.selectNoGraphicSeats(qaData.normalNoGraphicZone, 1);

            expect(SelectLocationsPO.getSessionTitle()).toEqual(qaData.eventTitle);         
        });
    });

    it('Verificamos que el precio final y el desglose es correcto, es decir, que la promoción automática se ha aplicado', function() {
        SummaryPO.getSummaryBreakdown().then(function(summaryBreakdown){
            for(var i = 0; i < summaryBreakdown.length; i++){
                expect(summaryBreakdown[i].getText()).toEqual(qaData.channelMulti.breakdown[i]);
            }
        });

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.channelMulti.finalPrice);
        expect(SummaryPO.getTicketsBasePrice()).toEqual(qaData.channelMulti.basePrice);

        if(browser.params.device === 'mobile'){
            expect(SelectLocationsPO.getFinalPriceAmount()).toEqual(qaData.channelMulti.finalPrice);
        }
    });
});