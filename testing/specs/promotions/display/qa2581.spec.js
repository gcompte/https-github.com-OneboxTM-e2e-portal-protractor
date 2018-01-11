var EventCardPO = require('./../../../page-objects/event-card.po.js'),
    SelectLocationsPO = require('./../../../page-objects/select-locations.po.js'),
    VenueNoMapPO = require('./../../../page-objects/venue-no-map.po.js'),
    SummaryPO = require('./../../../page-objects/summary.po.js'),
    PromotionsPO = require('./../../../page-objects/promotions.po.js'),
    AppPO = require('./../../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa2581;

describe('QA-2581 Visualizar y aplicar una promoción tipo promoción - descuento porcentual - canal, sesión y zona de precio concretos', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.eventUrl);
    });

    it('Accedemos a una sesión para la cual la promoción promoción no está activa, seleccionamos dos localidades y verificamos que no se puede aplicar la promoción', function() {
        AppPO.closeCookiesPolicy();
        EventCardPO.boxSessionTime(qaData.firstSessionId).then(function(){
            VenueNoMapPO.selectNoGraphicSeats(qaData.vipNoGraphicZone, 1);
            VenueNoMapPO.selectNoGraphicSeats(qaData.normalNoGraphicZone, 1);

            expect(SelectLocationsPO.getSessionTitle()).toEqual(qaData.eventTitle);         
        });

        //El evento puede tener promociones, pero no la promoción tipo promoción
        SelectLocationsPO.havePromotion().then(function(eventHavePromotion){
            if(eventHavePromotion){
                browser.driver.sleep(3000);
                PromotionsPO.getPromotions().getText().then(function(promotions){

                    var promotionIsActive = false;
                    for(var i = 0; i < promotions.length; i++){
                        promotionIsActive = promotions[i] === qaData.promocionPromocionName;
                    }
                    expect(promotionIsActive).toBe(false);
                });
            }
        });
    });

    it('Accedemos a una sesión que tenga activa la promoción promoción, y seleccionamos dos localidades', function() {
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

    it('Verificamos que solo se puede aplicar la promoción a la localidad de la zona vip, la aplicamos y verificamos que el precio final es correcto', function(){
        browser.driver.sleep(3000);
        if(browser.params.device === 'mobile'){
            AppPO.browserScrollTo(0, 1000);
        }

        PromotionsPO.selectPromotionByPosition(1);
        expect(PromotionsPO.getSeatToApplyPromotion(1).count()).toBe(1);
        PromotionsPO.applyPromotionSeats(1);

        SummaryPO.getSummaryBreakdown().then(function(summaryBreakdown){
            for(var i = 0; i < summaryBreakdown.length; i++){
                expect(summaryBreakdown[i].getText()).toEqual(qaData.breakdown[i]);
            }
        });

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.finalPrice);
        expect(SummaryPO.getTicketsBasePrice()).toEqual(qaData.basePrice);

        if(browser.params.device === 'mobile'){
            expect(SelectLocationsPO.getFinalPriceAmount()).toEqual(qaData.finalPrice);
        }
    });
});