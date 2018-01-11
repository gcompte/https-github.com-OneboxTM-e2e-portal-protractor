var EventCardPO = require('./../../../page-objects/event-card.po.js'),
    SelectLocationsPO = require('./../../../page-objects/select-locations.po.js'),
    VenueNoMapPO = require('./../../../page-objects/venue-no-map.po.js'),
    SummaryPO = require('./../../../page-objects/summary.po.js'),
    PromotionsPO = require('./../../../page-objects/promotions.po.js'),
    AppPO = require('./../../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa2580;

describe('QA-2580 Visualizar y aplicar una promoción tipo promoción - descuento fijo', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.eventUrl);
    });

    it('Accedemos a una sesión que tenga activa la promoción promoción, y seleccionamos dos localidades', function() {
        AppPO.closeCookiesPolicy();
        EventCardPO.boxSessionTime(qaData.firstSessionId).then(function(){
            VenueNoMapPO.selectNoGraphicSeats(qaData.vipNoGraphicZone, 1);
            VenueNoMapPO.selectNoGraphicSeats(qaData.normalNoGraphicZone, 1);

            expect(SelectLocationsPO.getSessionTitle()).toEqual(qaData.eventTitle);
        });
    });

    it('Verificamos que se puede aplicar la promoción a las dos localidades, la aplicamos y verificamos que el precio final es correcto', function(){
        browser.driver.sleep(3000);
        if(browser.params.device === 'mobile'){
            AppPO.browserScrollTo(0, 1000);
        }
        PromotionsPO.selectPromotionByPosition(0);

        expect(PromotionsPO.getSeatToApplyPromotion().count()).toBe(2);
        PromotionsPO.applyPromotionSeats(2);

        SummaryPO.getSummaryBreakdown().then(function(summaryBreakdown){
            for(var i = 0; i < summaryBreakdown.length; i++){
                expect(summaryBreakdown[i].getText()).toEqual(qaData.breakdown[i]);
            }
        });

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.finalPrice);
        expect(SummaryPO.getTicketsBasePrice()).toEqual(qaData.basePrice);
    });

    it('Accedemos a otra sesión que tenga activa la promoción promoción, y seleccionamos dos localidades', function() {
        browser.get(browser.baseUrl + qaData.eventUrl);

        if(browser.params.device === 'mobile'){
            EventCardPO.getSessionsByDay(qaData.dayToSelect);
        }

        EventCardPO.boxSessionTime(qaData.secondSessionId).then(function(){
            VenueNoMapPO.selectNoGraphicSeats(qaData.vipNoGraphicZone, 1);
            VenueNoMapPO.selectNoGraphicSeats(qaData.normalNoGraphicZone, 1);

            expect(SelectLocationsPO.getSessionTitle()).toEqual(qaData.eventTitle);         
        });
    });

    it('Verificamos que se puede aplicar la promoción a las dos localidades, la aplicamos y verificamos que el precio final es correcto', function(){
        browser.driver.sleep(3000);

        if(browser.params.device === 'mobile'){
            AppPO.browserScrollTo(0, 1000);
        }

        PromotionsPO.selectPromotionByPosition(0);
        expect(PromotionsPO.getSeatToApplyPromotion().count()).toBe(2);
        PromotionsPO.applyPromotionSeats(2);

        SummaryPO.getSummaryBreakdown().then(function(summaryBreakdown){
            for(var i = 0; i < summaryBreakdown.length; i++){
                expect(summaryBreakdown[i].getText()).toEqual(qaData.breakdown[i]);
            }
        });

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.finalPrice);
        expect(SummaryPO.getTicketsBasePrice()).toEqual(qaData.basePrice);
    });
});