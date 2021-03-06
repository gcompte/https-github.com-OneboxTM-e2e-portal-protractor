var EventCardPO = require('./../../../page-objects/event-card.po.js'),
    SelectLocationsPO = require('./../../../page-objects/select-locations.po.js'),
    VenueNoMapPO = require('./../../../page-objects/venue-no-map.po.js'),
    PromotionsPO = require('./../../../page-objects/promotions.po.js'),
    SummaryPO = require('./../../../page-objects/summary.po.js'),
    AppPO = require('./../../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa2579;

describe('QA-2579 Visualizar y aplicar una promoción tipo descuento - descuento fijo - sesión concreta', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.eventUrl);
    });

    it('Accedemos a la selección de localidades de una sesión que tenga una promoción promoción activa y seleccionamos dos localidades', function() {
        AppPO.closeCookiesPolicy();
        EventCardPO.boxSessionTime(qaData.firstSessionId).then(function(){
            VenueNoMapPO.selectNoGraphicSeats(qaData.vipNoGraphicZone, 1);
            VenueNoMapPO.selectNoGraphicSeats(qaData.normalNoGraphicZone, 1);

            expect(SelectLocationsPO.getSessionTitle()).toEqual(qaData.eventTitle);         
        });
    });

    it('Aplicamos la promoción y verificamos que el precio final es correcto', function(){
        browser.driver.sleep(3000);

        if(browser.params.device === 'mobile'){
            AppPO.browserScrollTo(0, 1000);
        }

        PromotionsPO.selectPromotionByPosition(0);
        PromotionsPO.applyPromotionSeats(2);

        SummaryPO.getSummaryBreakdown().then(function(summaryBreakdown){
            for(var i = 0; i < summaryBreakdown.length; i++){
                expect(summaryBreakdown[i].getText()).toEqual(qaData.breakdown[i]);
            }
        });

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.finalPrice[0]);
        expect(SummaryPO.getTicketsBasePrice()).toEqual(qaData.basePrice);

        if(browser.params.device === 'mobile'){
            expect(SelectLocationsPO.getFinalPriceAmount()).toEqual(qaData.finalPrice[0]);
        }
    });

    it('Accedemos a otra sesión para la cual la promoción descuento no está activa, seleccionamos dos localidades y verificamos que no se pueden aplicar promociones', function() {
        browser.get(browser.baseUrl + qaData.eventUrl);
        
        if(browser.params.device === 'mobile'){
            EventCardPO.getSessionsByDay(qaData.dayToSelect);
        }

        EventCardPO.boxSessionTime(qaData.secondSessionId).then(function(){
            VenueNoMapPO.selectNoGraphicSeats(qaData.vipNoGraphicZone, 1);
            VenueNoMapPO.selectNoGraphicSeats(qaData.normalNoGraphicZone, 1);

            expect(SelectLocationsPO.getSessionTitle()).toEqual(qaData.eventTitle);         
        });

        expect(SelectLocationsPO.havePromotion()).toBe(false);  

        if(browser.params.device === 'mobile'){
            expect(SelectLocationsPO.getFinalPriceAmount()).toEqual(qaData.finalPrice[1]);
        }
    });
});