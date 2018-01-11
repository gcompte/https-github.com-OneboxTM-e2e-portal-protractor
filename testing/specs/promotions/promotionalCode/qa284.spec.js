var VenueMapPO = require('./../../../page-objects/venue-map.po.js'),
    VenueNavPO = require('./../../../page-objects/venue-nav.po.js'),
    SelectLocationsPO = require('./../../../page-objects/select-locations.po.js'),
    PromotionsPO = require('./../../../page-objects/promotions.po.js'),
    SummaryPO = require('./../../../page-objects/summary.po.js'),
    UserDataPO = require('./../../../page-objects/user-data.po.js'),
    PaymentDetailsPO = require('./../../../page-objects/payment-details.po.js'),
    PurchaseConfirmPO = require('./../../../page-objects/purchase-confirm.po.js'),
    AppPO = require('./../../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa284;

describe('QA-284 Compra de entradas donde una de ellas tiene promo bloqueante en canal monoevento', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.sessionUrl);
    });

    it('Accedemos a una sesión, seleccionamos dos localidades de dos zonas de precio distintas (una de ellas con promoción bloqueante asociada)', function() {
        expect(AppPO.getNextStepButtonAttribute('class')).toMatch('disabled');

        VenueMapPO.selectZone(qaData.firstGraphicNumberedZone);
        VenueMapPO.selectNumberedSeats(qaData.seatsToSelect, true);
        VenueNavPO.mapGoBack();
        VenueMapPO.selectZone(qaData.secondGraphicNumberedZone);
        VenueMapPO.selectNumberedSeats(qaData.seatsToSelect, true);
    });

    it('Verificamos que no se puede continuar la compra si no validamos la promoción bloqueante y la aplicamos a todas las localidades', function(){
        expect(AppPO.getNextStepButtonAttribute('class')).toMatch('disabled');
        expect(SelectLocationsPO.getMandatorySalesText().isDisplayed()).toBe(true);

        browser.driver.sleep(3000);
        expect(PromotionsPO.isApplicablePromotion(0)).toBe(false);
        expect(PromotionsPO.getValidatePromotionalCodeButton().getAttribute('class')).toMatch('disabled');

        PromotionsPO.setPromotionalCode(qaData.promotionalCodeTxt).then(function(promotionalCodeInputTxt){
            expect(promotionalCodeInputTxt).toEqual(qaData.promotionalCodeTxt);
            expect(PromotionsPO.getValidatePromotionalCodeButton().getAttribute('class')).not.toMatch('disabled');

            PromotionsPO.getValidatePromotionalCodeButton().click().then(function(){
                expect(AppPO.getNextStepButtonAttribute('class')).toMatch('disabled');
                expect(PromotionsPO.getSeatToApplyPromotion('promotionalCode').count()).toBe(qaData.seatsToSelect);
                PromotionsPO.applyPromotionalCodeSeats(0, qaData.seatsToSelect);
            });
        });

        expect(AppPO.getNextStepButtonAttribute('class')).not.toMatch('disabled');
        expect(SelectLocationsPO.getMandatorySalesText().isDisplayed()).toBe(false);
    });

    it('Verificamos que el precio final y el desglose es correcto', function() {
        SummaryPO.getSummaryBreakdown().then(function(summaryBreakdown){
            for(var i = 0; i < summaryBreakdown.length; i++){
                expect(summaryBreakdown[i].getText()).toEqual(qaData.breakdownPrice[i]);
            }
        });

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.breakdownPrice[qaData.breakdownPrice.length-1]);
        expect(SummaryPO.getTicketsBasePrice()).toEqual(qaData.basePrice);
    });

    //Acabar la compra
    it('Accedemos a la pantalla de datos personales, seleccionamos método de pago y terminamos la compra', function(){
        AppPO.goToNextStep();
        UserDataPO.setUserData(genericData.userData.name, genericData.userData.surname, genericData.userData.email);

        UserDataPO.selectPaymentMethod(0);
        AppPO.goToNextStep();

        expect(PaymentDetailsPO.setAmount(qaData.totalPrice)).toEqual(qaData.totalPrice);
        PaymentDetailsPO.endCashPayment();
    });

    it('Verificamos que llegamos a la pantalla de confirmación de la compra, y que el precio de las localidades es correcto', function(){
        expect(PurchaseConfirmPO.getOrderCode().isPresent()).toBe(true);
        PurchaseConfirmPO.getSessionSeatsBoughtInfo(qaData.sessionId, 'ticket.price.finalPrice').getText().then(function(sessionSeatsBoughtPrice){
            expect(sessionSeatsBoughtPrice[0]).toEqual(qaData.ticketFinalPrice[0]);
            expect(sessionSeatsBoughtPrice[1]).toEqual(qaData.ticketFinalPrice[1]);
        });
    });
});