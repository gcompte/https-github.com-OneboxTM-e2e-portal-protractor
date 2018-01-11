var VenueMapPO = require('./../../../../page-objects/venue-map.po.js'),
    SummaryPO = require('./../../../../page-objects/summary.po.js'),
    PromotionsPO = require('./../../../../page-objects/promotions.po.js'),
    ValidateCartPO = require('./../../../../page-objects/validate-cart.po.js'),
    UserDataPO = require('./../../../../page-objects/user-data.po.js'),
    PaymentDetailsPO = require('./../../../../page-objects/payment-details.po.js'),
    PurchaseConfirmPO = require('./../../../../page-objects/purchase-confirm.po.js'),
    AppPO = require('./../../../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../../../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa822;

describe('QA-822 Aplicar Descuento de código promocional con restricción de Mínimo de entradas para aplicar a la totalidad de la compra con incentivo fijo', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.sessionUrl);
    });

    it('Accedemos a una sesión y seleccionamos localidades', function() {
        expect(AppPO.getNextStepButtonAttribute('class')).toMatch('disabled');

        browser.driver.sleep(2000);
        VenueMapPO.selectZone(qaData.graphicNumberedZone);
        VenueMapPO.selectNumberedSeats(2, true);

        expect(AppPO.getNextStepButtonAttribute('class')).not.toMatch('disabled');
    });

    it('Desplegamos el módulo de promociones, verificamos que existe el campo para insertar el código pero que no es aplicable', function(){
        browser.driver.sleep(2000);
        expect(PromotionsPO.getValidatePromotionalCodeButton().getAttribute('class')).toMatch('disabled');
        expect(PromotionsPO.isApplicablePromotion(0)).toBe(false);

        PromotionsPO.setPromotionalCode(qaData.promotionalCodeTxt).then(function(promotionalCodeInputTxt){
            expect(promotionalCodeInputTxt).toEqual(qaData.promotionalCodeTxt);
            expect(PromotionsPO.getValidatePromotionalCodeButton().getAttribute('class')).not.toMatch('disabled');

            PromotionsPO.getValidatePromotionalCodeButton().click().then(function(){
                expect(PromotionsPO.isApplicablePromotion(0)).toBe(false);
            });
        });
    });

    it('Seleccionamos una localidad más, aplicamos la promoción y verificamos que se aplica correctamente a todas las localidades', function(){
        AppPO.browserScrollTo(0, 0);
        VenueMapPO.selectNumberedSeats(1, true);

        browser.driver.sleep(2000);
        AppPO.browserScrollTo(0, 600);
        PromotionsPO.getValidatePromotionalCodeButton().click().then(function(){
            PromotionsPO.isApplicablePromotion(0).then(function(isApplicablePromotion){
                if(isApplicablePromotion){
                    expect(PromotionsPO.getSaleMinTitle()).toEqual(qaData.promotionName);
                    PromotionsPO.applyMinPromotion(0);
                }else{
                    expect(PromotionsPO.isApplicablePromotion(0)).toBe(true);
                }
            });
        });

        SummaryPO.getSummaryBreakdown().then(function(summaryBreakdown){
            for(var i = 0; i < summaryBreakdown.length; i++){
                expect(summaryBreakdown[i].getText()).toEqual(qaData.breakdown[i]);
            }
        });

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.finalPrice);
        SummaryPO.getTicketsBasePrice().then(function(ticketsBasePriceList){
            for(var i = 0; i < ticketsBasePriceList.length; i++){
                expect(ticketsBasePriceList[i]).toEqual(qaData.basePrice);
            }
        });
    });

    //Acabar la compra
    it('Accedemos a la pantalla de validate-cart y verificamos que el precio de las localidades es correcto', function(){
        AppPO.goToNextStep();

        ValidateCartPO.getSessionSeatsSelectedInfo(qaData.sessionId, 'ticket.price.manualDiscount.name').getText().then(function(sessionSeatsSelectedPromoName){
            expect(sessionSeatsSelectedPromoName.length).toEqual(3);
            for(var i = 0; i < sessionSeatsSelectedPromoName.length; i++){
                expect(sessionSeatsSelectedPromoName[i]).toEqual(qaData.promotionName);
            }
        });

        ValidateCartPO.getSessionSeatsSelectedInfo(qaData.sessionId, 'ticket.price.finalPrice').getText().then(function(sessionSeatsSelectedPrice){
            expect(sessionSeatsSelectedPrice.length).toEqual(3);
            for(var i = 0; i < sessionSeatsSelectedPrice.length; i++){
                expect(sessionSeatsSelectedPrice[i]).toEqual(qaData.seatSelectedPricePromo);
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

        expect(PaymentDetailsPO.setCard(genericData.paymentData.card)).toEqual(genericData.paymentData.card);
        expect(PaymentDetailsPO.setExpirationMonth(genericData.paymentData.month)).toEqual(genericData.paymentData.month);
        expect(PaymentDetailsPO.setExpirationYear(genericData.paymentData.year)).toEqual(genericData.paymentData.year);
        expect(PaymentDetailsPO.setSecurityCode(genericData.paymentData.securityCode)).toEqual(genericData.paymentData.securityCode);

        PaymentDetailsPO.acceptPayment();

        expect(PaymentDetailsPO.setCipCode(genericData.paymentData.cipCode)).toEqual(genericData.paymentData.cipCode);

        PaymentDetailsPO.endPayment();
    });

    it('Verificamos que llegamos a la pantalla de confirmación de la compra, y que el precio de las localidades es correcto', function(){
        AppPO.switchContext('default');
        browser.ignoreSynchronization = false;

        expect(PurchaseConfirmPO.getOrderCode().isPresent()).toBe(true);

        PurchaseConfirmPO.getSessionSeatsBoughtInfo(qaData.sessionId, 'ticket.price.manualDiscount.name').getText().then(function(sessionSeatsBoughtPromotionName){
            expect(sessionSeatsBoughtPromotionName.length).toEqual(3);

            for(var i = 0; i < sessionSeatsBoughtPromotionName.length; i++){
                expect(sessionSeatsBoughtPromotionName[i]).toEqual(qaData.promotionName);
            }
        });

        PurchaseConfirmPO.getSessionSeatsBoughtInfo(qaData.sessionId, 'ticket.price.finalPrice').getText().then(function(sessionSeatsBoughtPrice){
            expect(sessionSeatsBoughtPrice.length).toEqual(3);

            for(var i = 0; i < sessionSeatsBoughtPrice.length; i++){
                expect(sessionSeatsBoughtPrice[i]).toEqual(qaData.seatSelectedPricePromo);
            }
        });
    });
});