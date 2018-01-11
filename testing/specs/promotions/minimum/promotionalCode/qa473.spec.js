var VenueMapPO = require('./../../../../page-objects/venue-map.po.js'),
    VenueNavPO = require('./../../../../page-objects/venue-nav.po.js'),
    SummaryPO = require('./../../../../page-objects/summary.po.js'),
    PromotionsPO = require('./../../../../page-objects/promotions.po.js'),
    ValidateCartPO = require('./../../../../page-objects/validate-cart.po.js'),
    UserDataPO = require('./../../../../page-objects/user-data.po.js'),
    PaymentDetailsPO = require('./../../../../page-objects/payment-details.po.js'),
    PurchaseConfirmPO = require('./../../../../page-objects/purchase-confirm.po.js'),
    AppPO = require('./../../../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../../../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa473;

describe('QA-473 Aplicar Descuento de Código Promocional con restricción de Numero mí­nimo de entradas para poder aplicarlo combinado con Promoción Simple', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.sessionUrl);
    });

    it('Accedemos a una sesión y seleccionamos localidades', function() {
        expect(AppPO.getNextStepButtonAttribute('class')).toMatch('disabled');

        browser.driver.sleep(2000);
        VenueMapPO.selectZone(qaData.graphicNumberedZone);
        VenueNavPO.mapTransform('down');
        VenueNavPO.mapTransform('down');
        VenueMapPO.selectNumberedSeats(qaData.seatsToSelect, true);

        expect(AppPO.getNextStepButtonAttribute('class')).not.toMatch('disabled');
    });

    it('Desplegamos el módulo de promociones, verificamos que existe el campo para insertar el código', function(){
        browser.driver.sleep(2000);
        expect(PromotionsPO.getValidatePromotionalCodeButton().getAttribute('class')).toMatch('disabled');
        expect(PromotionsPO.isApplicablePromotion(0)).toBe(false);

        PromotionsPO.setPromotionalCode(genericData.promotions.promotionalCodeOK).then(function(promotionalCodeInputTxt){
            expect(promotionalCodeInputTxt).toEqual(genericData.promotions.promotionalCodeOK);
            expect(PromotionsPO.getValidatePromotionalCodeButton().getAttribute('class')).not.toMatch('disabled');

            PromotionsPO.getValidatePromotionalCodeButton().click().then(function(){
                PromotionsPO.isApplicablePromotion(0).then(function(isApplicablePromotion){
                    if(isApplicablePromotion){
                        expect(PromotionsPO.getSaleMinTitle()).toEqual(qaData.discountName);
                        PromotionsPO.applyMinPromotion(0);
                    }else{
                        expect(PromotionsPO.isApplicablePromotion(0)).toBe(true);
                    }
                });
            });

            SummaryPO.getSummaryBreakdown().then(function(summaryBreakdown){
                for(var i = 0; i < summaryBreakdown.length; i++){
                    expect(summaryBreakdown[i].getText()).toEqual(qaData.summarySelection[0].breakdown[i]);
                }
            });

            expect(SummaryPO.getFinalPrice()).toEqual(qaData.finalPrice[0]);
            SummaryPO.getTicketsBasePrice().then(function(ticketsBasePriceList){
                for(var i = 0; i < ticketsBasePriceList.length; i++){
                    expect(ticketsBasePriceList[i]).toEqual(qaData.basePrice);
                }
            });
        });
    });

    it('Seleccionamos la promoción simple, la aplicamos a una de las entradas y verificamos el precio en el summary', function(){
        PromotionsPO.selectPromotionByPosition(1);
        PromotionsPO.applyPromotionSeats(1);

        SummaryPO.getSummaryBreakdown().then(function(summaryBreakdown){
            for(var i = 0; i < summaryBreakdown.length; i++){
                expect(summaryBreakdown[i].getText()).toEqual(qaData.summarySelection[1].breakdown[i]);
            }
        });

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.finalPrice[1]);
        SummaryPO.getTicketsBasePrice().then(function(ticketsBasePriceList){
            for(var i = 0; i < ticketsBasePriceList.length; i++){
                expect(ticketsBasePriceList[i]).toEqual(qaData.basePrice);
            }
        });
    });

    //Acabar la compra
    it('Accedemos a la pantalla de validate-cart y verificamos que el precio de las localidades es correcto', function(){
        AppPO.goToNextStep();

        ValidateCartPO.getSessionSeatsSelectedInfo(qaData.sessionId, 'ticket.price.manualDiscount.name').getText().then(function(sessionSeatsSelectedDiscountName){
            expect(sessionSeatsSelectedDiscountName.length).toEqual(qaData.seatsToSelect);
            for(var i = 0; i < sessionSeatsSelectedDiscountName.length; i++){
                expect(sessionSeatsSelectedDiscountName[i]).toEqual(qaData.discountName);
            }
        });

        ValidateCartPO.getSessionSeatsSelectedInfo(qaData.sessionId, 'ticket.price.manualPromotion.name').getText().then(function(sessionSeatsSelectedPromoName){
            expect(sessionSeatsSelectedPromoName.length).toEqual(qaData.seatsToSelect);
            expect(sessionSeatsSelectedPromoName[0]).toEqual(qaData.promotionName);
            for(var i = 1; i < sessionSeatsSelectedPromoName.length; i++){
                expect(sessionSeatsSelectedPromoName[i]).toEqual('');
            }
        });

        ValidateCartPO.getSessionSeatsSelectedInfo(qaData.sessionId, 'ticket.price.finalPrice').getText().then(function(sessionSeatsSelectedPrice){
            expect(sessionSeatsSelectedPrice.length).toEqual(qaData.seatsToSelect);
            expect(sessionSeatsSelectedPrice[0]).toEqual(qaData.seatSelectedPriceDiscountPromo);
            for(var i = 1; i < sessionSeatsSelectedPrice.length; i++){
                expect(sessionSeatsSelectedPrice[i]).toEqual(qaData.seatSelectedPriceDiscount);
            }
        });
    });

    it('Accedemos a la pantalla de datos personales, seleccionamos método de pago y terminamos la compra', function(){
        AppPO.goToNextStep();
        UserDataPO.setUserData(genericData.userData.name, genericData.userData.surname, genericData.userData.email);

        AppPO.goToNextStep();
        browser.driver.sleep(5000);
        browser.ignoreSynchronization = true;
        AppPO.switchContext('pasarelaIframe');
        browser.driver.sleep(2000);

        PaymentDetailsPO.paymentRedsys(genericData.paymentData.card, genericData.paymentData.securityCode);

        PaymentDetailsPO.setCipCode(genericData.paymentData.cipCode);

        PaymentDetailsPO.endPayment();
    });

    it('Verificamos que llegamos a la pantalla de confirmación de la compra, y que el precio de las localidades es correcto', function(){
        AppPO.switchContext('default');
        browser.ignoreSynchronization = false;

        expect(PurchaseConfirmPO.getOrderCode().isPresent()).toBe(true);

        PurchaseConfirmPO.getSessionSeatsBoughtInfo(qaData.sessionId, 'ticket.price.manualDiscount.name').getText().then(function(sessionSeatsBoughtDiscountName){
            expect(sessionSeatsBoughtDiscountName.length).toEqual(qaData.seatsToSelect);
            for(var i = 0; i < sessionSeatsBoughtDiscountName.length; i++){
                expect(sessionSeatsBoughtDiscountName[i]).toEqual(qaData.discountName);
            }
        });

        PurchaseConfirmPO.getSessionSeatsBoughtInfo(qaData.sessionId, 'ticket.price.manualPromotion.name').getText().then(function(sessionSeatsBoughtPromoName){
            expect(sessionSeatsBoughtPromoName.length).toEqual(qaData.seatsToSelect);
            expect(sessionSeatsBoughtPromoName[0]).toEqual(qaData.promotionName);
            for(var i = 1; i < sessionSeatsBoughtPromoName.length; i++){
                expect(sessionSeatsBoughtPromoName[i]).toEqual('');
            }
        });

        PurchaseConfirmPO.getSessionSeatsBoughtInfo(qaData.sessionId, 'ticket.price.finalPrice').getText().then(function(sessionSeatsBoughtPrice){
            expect(sessionSeatsBoughtPrice.length).toEqual(qaData.seatsToSelect);

            expect(sessionSeatsBoughtPrice[0]).toEqual(qaData.seatSelectedPriceDiscountPromo);
            for(var i = 1; i < sessionSeatsBoughtPrice.length; i++){
                expect(sessionSeatsBoughtPrice[i]).toEqual(qaData.seatSelectedPriceDiscount);
            }
        });
    });
});