var VenueNoMapPO = require('./../../../../page-objects/venue-no-map.po.js'),
    SummaryPO = require('./../../../../page-objects/summary.po.js'),
    PromotionsPO = require('./../../../../page-objects/promotions.po.js'),
    ValidateCartPO = require('./../../../../page-objects/validate-cart.po.js'),
    UserDataPO = require('./../../../../page-objects/user-data.po.js'),
    PaymentDetailsPO = require('./../../../../page-objects/payment-details.po.js'),
    PurchaseConfirmPO = require('./../../../../page-objects/purchase-confirm.po.js'),
    AppPO = require('./../../../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../../../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa895;

describe('QA-895 Aplicar Promoción bloqueante con restricción de Aplicar a Grupos de entradas y Máximo de entradas por operación con incentivo porcentual', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.sessionUrl);
    });

    it('Accedemos a una sesión y seleccionamos 1 localidad, verificamos que no podemos aplicar la promoción', function() {
        expect(AppPO.getNextStepButtonAttribute('class')).toMatch('disabled');

        VenueNoMapPO.selectNoGraphicSeats(qaData.noGraphicZone, 1);

        expect(AppPO.getNextStepButtonAttribute('class')).toMatch('disabled');
    });

    it('Insertamos el código de validación y verificamos que la promoción no se valida', function() {
        browser.driver.sleep(2000);
        expect(PromotionsPO.getValidatePromotionalCodeButton().getAttribute('class')).toMatch('disabled');
        expect(PromotionsPO.getSeatToApplyPromotion('promotionalCode').count()).toBe(0);

        PromotionsPO.setPromotionalCode(genericData.promotions.promotionalCodeOK).then(function(promotionalCodeInputTxt){
            expect(promotionalCodeInputTxt).toEqual(genericData.promotions.promotionalCodeOK);

            PromotionsPO.getValidatePromotionalCodeButton().click().then(function(){
                expect(PromotionsPO.getSeatToApplyPromotion('promotionalCode').count()).toBe(0);
            });
        });
    });

    it('Añadimos otra localidad y validamos la promoción', function() {
        VenueNoMapPO.selectNoGraphicSeats(qaData.noGraphicZone, 2);

        PromotionsPO.setPromotionalCode(genericData.promotions.promotionalCodeOK).then(function(promotionalCodeInputTxt){
            expect(promotionalCodeInputTxt).toEqual(genericData.promotions.promotionalCodeOK);

            PromotionsPO.getValidatePromotionalCodeButton().click().then(function(){
                expect(PromotionsPO.getSeatToApplyPromotion('promotionalCode').count()).toBe(2);
            });
        });
    });

    it('Seleccionamos cuatro localidades en total, validamos la promoción e intentamos aplicarla a todas las localidades, verificamos que se aplica en packs de dos y solo a dos localidades', function() {
        VenueNoMapPO.selectNoGraphicSeats(qaData.noGraphicZone, 4);

        expect(PromotionsPO.getSeatToApplyPromotion('promotionalCode').count()).toBe(4);
        for(var i = 0; i < 4; i++){
            AppPO.browserScrollTo(0, 600);
            PromotionsPO.applyPromotionalCodeSeats(i, 1);
            if(i === 0){
                expect(PromotionsPO.getSeatsWithAppliedPromotion('promotionalCode').count()).toBe(0);
            }else{
                expect(PromotionsPO.getSeatsWithAppliedPromotion('promotionalCode').count()).toBe(2);
            }
        }

        SummaryPO.getSummaryBreakdown().then(function(summaryBreakdown){
            for(var i = 0; i < summaryBreakdown.length; i++){
                expect(summaryBreakdown[i].getText()).toEqual(qaData.breakdown[i]);
            }
        });
        expect(SummaryPO.getFinalPrice()).toEqual(qaData.finalPrice[0]);
        expect(AppPO.getNextStepButtonAttribute('class')).toMatch('disabled');
    });

    it('Eliminamos dos localidades del carrito y verificamos que las dos restantes tienen aplicada la promoción y que el botón de "Validar carrito" se habilita', function() {
        VenueNoMapPO.selectNoGraphicSeats(qaData.noGraphicZone, 2);

        expect(PromotionsPO.getSeatsWithAppliedPromotion('promotionalCode').count()).toBe(2);

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.finalPrice[1]);
        expect(AppPO.getNextStepButtonAttribute('class')).not.toMatch('disabled');
    });

    it('Accedemos a la pantalla de datos personales, seleccionamos método de pago y terminamos la compra', function(){
        AppPO.browserScrollTo(0, 600);
        AppPO.goToNextStep();
        AppPO.goToNextStep();
        UserDataPO.setUserData(genericData.userData.name, genericData.userData.surname, genericData.userData.email);

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.finalPrice[1]);

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
        
        expect(PurchaseConfirmPO.getFinalPrice()).toEqual(qaData.finalPrice[1]);
    });
});