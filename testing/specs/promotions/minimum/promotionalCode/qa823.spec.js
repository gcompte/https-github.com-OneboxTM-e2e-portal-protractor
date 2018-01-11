var VenueMapPO = require('./../../../../page-objects/venue-map.po.js'),
    VenueNavPO = require('./../../../../page-objects/venue-nav.po.js'),
    SelectLocationsPO = require('./../../../../page-objects/select-locations.po.js'),
    PromotionsPO = require('./../../../../page-objects/promotions.po.js'),
    ValidateCartPO = require('./../../../../page-objects/validate-cart.po.js'),
    UserDataPO = require('./../../../../page-objects/user-data.po.js'),
    PaymentDetailsPO = require('./../../../../page-objects/payment-details.po.js'),
    PurchaseConfirmPO = require('./../../../../page-objects/purchase-confirm.po.js'),
    AppPO = require('./../../../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../../../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa823;

describe('QA-823 Aplicar Promoción bloqueante de código promocional con restricción Mínimo de entradas para poder aplicarla a la totalidad de la compra con incentivo fijo', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.sessionUrl);
    });

    it('Accedemos a una sesión y seleccionamos tres localidades, verificamos que no podemos continuar la compra debido a la promoción bloqueante', function() {
        expect(AppPO.getNextStepButtonAttribute('class')).toMatch('disabled');

        browser.driver.sleep(2000);
        VenueMapPO.selectZone(qaData.graphicNumberedZone);
        VenueNavPO.mapTransform('down');
        VenueNavPO.mapTransform('down');
        VenueMapPO.selectNumberedSeats(3, true);

        expect(AppPO.getNextStepButtonAttribute('class')).toMatch('disabled');
        expect(SelectLocationsPO.getMandatorySalesText().isDisplayed()).toBe(true);
        expect(SelectLocationsPO.getMandatorySalesText().getText()).toEqual('Una o más de las localidades que has seleccionado requieren la validación de una promoción o descuento para poder continuar el proceso de compra.');
    });

    it('Desplegamos el módulo de promociones, verificamos que existe el campo para validar el código, lo validamos y aplicamos la promoción', function(){
        browser.driver.sleep(2000);
        expect(PromotionsPO.getValidatePromotionalCodeButton().getAttribute('class')).toMatch('disabled');
        expect(PromotionsPO.isApplicablePromotion(0)).toBe(false);

        PromotionsPO.setPromotionalCode(qaData.promotionalCodeTxt).then(function(promotionalCodeInputTxt){
            expect(promotionalCodeInputTxt).toEqual(qaData.promotionalCodeTxt);
            expect(PromotionsPO.getValidatePromotionalCodeButton().getAttribute('class')).not.toMatch('disabled');

            PromotionsPO.getValidatePromotionalCodeButton().click().then(function(){
                expect(AppPO.getNextStepButtonAttribute('class')).toMatch('disabled');
                PromotionsPO.isApplicablePromotion(0).then(function(isApplicablePromotion){
                    if(isApplicablePromotion){
                        expect(PromotionsPO.getSaleMinTitle()).toEqual(qaData.promotionName);
                        PromotionsPO.applyMinPromotion(0);
                    }else{
                        expect(PromotionsPO.isApplicablePromotion(0)).toBe(true);
                    }
                });
            });
        });
    });

    it('Verificamos que el botón para validar el carrito ya está activo y que el mensaje de promoción bloqueante ha desaparecido', function(){
        expect(AppPO.getNextStepButtonAttribute('class')).not.toMatch('disabled');

        AppPO.browserScrollTo(0, 0);
        expect(SelectLocationsPO.getMandatorySalesText().isDisplayed()).toBe(false);
    });

    //Acabar la compra
    it('Accedemos a la pantalla de validate-cart y verificamos que el precio de las localidades es correcto', function(){
        AppPO.browserScrollTo(0, 600);
        AppPO.goToNextStep();

        ValidateCartPO.getSessionSeatsSelectedInfo(qaData.sessionId, 'ticket.price.manualPromotion.name').getText().then(function(sessionSeatsSelectedPromoName){
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

        PurchaseConfirmPO.getSessionSeatsBoughtInfo(qaData.sessionId, 'ticket.price.manualPromotion.name').getText().then(function(sessionSeatsBoughtPromotionName){
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