var VenueMapPO = require('./../../../page-objects/venue-map.po.js'),
    VenueNoMapPO = require('./../../../page-objects/venue-no-map.po.js'),
    SelectLocationsPO = require('./../../../page-objects/select-locations.po.js'),
    PromotionsPO = require('./../../../page-objects/promotions.po.js'),
    UserDataPO = require('./../../../page-objects/user-data.po.js'),
    PaymentDetailsPO = require('./../../../page-objects/payment-details.po.js'),
    PurchaseConfirmPO = require('./../../../page-objects/purchase-confirm.po.js'),
    AppPO = require('./../../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa1677;

describe('QA-1677 Verificar que se puede comprar entrada de evento tipo actividad con promoción bloqueante y entrada de evento normal en la misma operación', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.firstEvent.sessionUrl);
    });

    it('Accedemos a una sesión que tenga activa una promoción bloqueante y seleccionamos una localidad', function() {
        expect(AppPO.getNextStepButtonAttribute('class')).toMatch('disabled');

        VenueMapPO.selectZone(qaData.firstEvent.graphicNumberedZone);
        VenueMapPO.selectNumberedSeats(1, true);
    });

    it('Verificamos que no se puede continuar la compra si no validamos la promoción bloqueante y la aplicamos a todas las localidades', function(){
        expect(AppPO.getNextStepButtonAttribute('class')).toMatch('disabled');
        expect(SelectLocationsPO.getMandatorySalesText().isDisplayed()).toBe(true);

        browser.driver.sleep(3000);
        expect(PromotionsPO.isApplicablePromotion(0)).toBe(false);
        expect(PromotionsPO.getValidatePromotionalCodeButton().getAttribute('class')).toMatch('disabled');

        PromotionsPO.setPromotionalCode(genericData.promotions.promotionalCodeOK).then(function(promotionalCodeInputTxt){
            expect(promotionalCodeInputTxt).toEqual(genericData.promotions.promotionalCodeOK);
            expect(PromotionsPO.getValidatePromotionalCodeButton().getAttribute('class')).not.toMatch('disabled');

            PromotionsPO.getValidatePromotionalCodeButton().click().then(function(){
                expect(AppPO.getNextStepButtonAttribute('class')).toMatch('disabled');
                expect(PromotionsPO.getSeatToApplyPromotion('promotionalCode').count()).toBe(1);
                PromotionsPO.applyPromotionalCodeSeats(0, 1);
            });
        });

        expect(AppPO.getNextStepButtonAttribute('class')).not.toMatch('disabled');
    });

    it('Accedemos a una sesión de otro evento, que no tenga promoción bloqueante activa y seleccionamos una localidad', function(){
        browser.get(browser.baseUrl + qaData.secondEvent.sessionUrl);

        expect(AppPO.getNextStepButtonAttribute('class')).not.toMatch('disabled');

        VenueNoMapPO.selectNoGraphicSeats(qaData.secondEvent.noGraphicZone, 1);

        browser.driver.sleep(4000);
    });

    //Acabar la compra
    it('Accedemos a la pantalla de datos de usuario y rellenamos todos los campos obligatorios', function(){
        AppPO.goToNextStep();
        AppPO.goToNextStep();

        expect(UserDataPO.setName(genericData.userData.name)).toEqual(genericData.userData.name);
        expect(UserDataPO.setSurname(genericData.userData.surname)).toEqual(genericData.userData.surname);
        expect(UserDataPO.setEmail(genericData.userData.email)).toEqual(genericData.userData.email);
        expect(UserDataPO.setCheckEmail(genericData.userData.email)).toEqual(genericData.userData.email);
        expect(UserDataPO.acceptTermsAndConditions()).toBe('true');

        //AppPO.goToNextStep();
    });

    it('Avanzamos hasta la pasarela de pago y terminamos la compra', function(){
        UserDataPO.selectPaymentMethod(0);
        AppPO.goToNextStep();

        expect(PaymentDetailsPO.setAmount(qaData.finalAmount)).toEqual(qaData.finalAmount);
        PaymentDetailsPO.endCashPayment();

        expect(PurchaseConfirmPO.getOrderCode().isPresent()).toBe(true);
    });
});