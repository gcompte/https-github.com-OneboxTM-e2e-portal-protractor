var VenueMapPO = require('./../../../../page-objects/venue-map.po.js'),
    VenueNavPO = require('./../../../../page-objects/venue-nav.po.js'),
    SummaryPO = require('./../../../../page-objects/summary.po.js'),
    PromotionsPO = require('./../../../../page-objects/promotions.po.js'),
    ValidateCartPO = require('./../../../../page-objects/validate-cart.po.js'),
    AppPO = require('./../../../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../../../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa470;

describe('QA-470 Descuento o Promoción de Código Promocional sólo aplicable a packs de entradas no se puede aplicar si el número de entradas es insuficiente', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.sessionUrl);
    });

    it('Accedemos a una sesión y seleccionamos tantas localidades como el pack de la promoción', function() {
        expect(AppPO.getNextStepButtonAttribute('class')).toMatch('disabled');

        browser.driver.sleep(3000);
        VenueMapPO.selectZone(qaData.graphicNumberedZone);
        VenueNavPO.mapTransform('down');
        VenueNavPO.mapTransform('down');
        VenueMapPO.selectNumberedSeats(3, true);

        expect(AppPO.getNextStepButtonAttribute('class')).not.toMatch('disabled');
    });

    it('Validamos el código y vemos las localidades a las que podemos aplicar la promoción', function(){
        browser.driver.sleep(2000);
        expect(PromotionsPO.getValidatePromotionalCodeButton().getAttribute('class')).toMatch('disabled');
        expect(PromotionsPO.isApplicablePromotion(0)).toBe(false);

        PromotionsPO.setPromotionalCode(genericData.promotions.promotionalCodeOK).then(function(promotionalCodeInputTxt){
            expect(promotionalCodeInputTxt).toEqual(genericData.promotions.promotionalCodeOK);
            expect(PromotionsPO.getValidatePromotionalCodeButton().getAttribute('class')).not.toMatch('disabled');

            PromotionsPO.getValidatePromotionalCodeButton().click().then(function(){
                expect(PromotionsPO.getSeatToApplyPromotion('promotionalCode').count()).toBe(qaData.seatsToSelect);
                for(var i = 0; i < qaData.seatsToSelect-1; i++){
                    PromotionsPO.applyPromotionalCodeSeats(i, 1);
                    expect(SummaryPO.getFinalPrice()).toEqual(qaData.finalPrice[0]);
                }
                PromotionsPO.applyPromotionalCodeSeats(qaData.seatsToSelect-1, 1);
            });

            SummaryPO.getSummaryBreakdown().then(function(summaryBreakdown){
                for(var i = 0; i < summaryBreakdown.length; i++){
                    expect(summaryBreakdown[i].getText()).toEqual(qaData.summarySelection[0].breakdown[i]);
                }
            });

            expect(SummaryPO.getFinalPrice()).toEqual(qaData.finalPrice[1]);
            SummaryPO.getTicketsBasePrice().then(function(ticketsBasePriceList){
                for(var i = 0; i < ticketsBasePriceList.length; i++){
                    expect(ticketsBasePriceList[i]).toEqual(qaData.basePrice);
                }
            });
        });
    });

    it('Eliminamos la promoción de una de las entradas y verificamos que se elimina de todas, después la volvemos a aplicar', function(){
        PromotionsPO.applyPromotionalCodeSeats(2, 1);
        expect(SummaryPO.getFinalPrice()).toEqual(qaData.finalPrice[0]);

        PromotionsPO.applyPromotionalCodeSeats(0, qaData.seatsToSelect);
        expect(SummaryPO.getFinalPrice()).toEqual(qaData.finalPrice[1]);
    });

    it('Eliminamos una entrada y verificamos que se elimina la promoción de las otras localidades', function(){
        AppPO.browserScrollTo(0, 600);
        SummaryPO.deleteSeatBySessionAndPosition(qaData.sessionId, 0, 'delete');
        SummaryPO.getSummaryBreakdown().then(function(summaryBreakdown){
            for(var i = 0; i < summaryBreakdown.length; i++){
                expect(summaryBreakdown[i].getText()).toEqual(qaData.summarySelection[1].breakdown[i]);
            }
        });

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.finalPrice[2]);
        SummaryPO.getTicketsBasePrice().then(function(ticketsBasePriceList){
            for(var i = 0; i < ticketsBasePriceList.length; i++){
                expect(ticketsBasePriceList[i]).toEqual(qaData.basePrice);
            }
        });
    });

    it('Seleccionamos dos localidades más, una más de las necesarias para completar un pack, y aplicamos la promoción de nuevo', function(){
        AppPO.browserScrollTo(0, 400);
        VenueMapPO.selectNumberedSeats(2, true);

        PromotionsPO.applyPromotionalCodeSeats(2, 1);
        PromotionsPO.applyPromotionalCodeSeats(2, 1);
        expect(SummaryPO.getFinalPrice()).toEqual(qaData.finalPrice[3]);
    });

    it('Accedemos a la pantalla de validate-cart y verificamos que el precio de las localidades es correcto', function(){
        AppPO.goToNextStep();

        ValidateCartPO.getSessionSeatsSelectedInfo(qaData.sessionId, 'ticket.price.manualPromotion.name').getText().then(function(sessionSeatsSelectedPromoName){
            expect(sessionSeatsSelectedPromoName.length).toEqual(qaData.seatsToSelect+1);
            for(var i = 0; i < sessionSeatsSelectedPromoName.length-1; i++){
                expect(sessionSeatsSelectedPromoName[i]).toEqual(qaData.promotionName);
            }
            expect(sessionSeatsSelectedPromoName[qaData.seatsToSelect]).toEqual('');
        });

        ValidateCartPO.getSessionSeatsSelectedInfo(qaData.sessionId, 'ticket.price.finalPrice').getText().then(function(sessionSeatsSelectedPrice){
            expect(sessionSeatsSelectedPrice.length).toEqual(qaData.seatsToSelect+1);
            for(var i = 0; i < sessionSeatsSelectedPrice.length-1; i++){
                expect(sessionSeatsSelectedPrice[i]).toEqual(qaData.seatSelectedPricePromo);
            }
            expect(sessionSeatsSelectedPrice[qaData.seatsToSelect]).toEqual(qaData.seatSelectedPrice);
        });
    });
});