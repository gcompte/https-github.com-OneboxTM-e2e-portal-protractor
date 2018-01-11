var VenueNoMapPO = require('./../../../page-objects/venue-no-map.po.js'),
    VenueMapPO = require('./../../../page-objects/venue-map.po.js'),
    VenueNavPO = require('./../../../page-objects/venue-nav.po.js'),
    SelectLocationsPO = require('./../../../page-objects/select-locations.po.js'),
    PromotionsPO = require('./../../../page-objects/promotions.po.js'),
    UserDataPO = require('./../../../page-objects/user-data.po.js'),
    PaymentDetailsPO = require('./../../../page-objects/payment-details.po.js'),
    PurchaseConfirmPO = require('./../../../page-objects/purchase-confirm.po.js'),
    AppPO = require('./../../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json'),
    qaDataGeneric = qaData.generic,
    qaDataActTest = qaData.qa735;

describe('QA-735 Actualización de contador de usos de una promoción con Limite máximo para esa promoción al comprar localidades de una sesión', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaDataActTest.firstSessionUrlMono);
    });

    //Monoevento
    it('Accedemos a la ficha de una sesión y seleccionamos N localidades', function() {
        VenueNoMapPO.selectNoGraphicSeats(qaDataGeneric.noGraphicZone, qaDataActTest.firstSeatsToSelect);
    });

    it('Verificamos que el contador para esa promoción está actualmente a 0', function() {
        protractor.promise.controlFlow().wait(PromotionsPO.getCounterValue(qaDataGeneric.eventId, qaDataActTest.promotionId, 'event')).then(function (result) {
            expect(result.counter).toEqual(0);
        });
    });

    it('Aplicamos la promoción activa a todas las localidades', function(){
        browser.driver.sleep(2000);
        AppPO.browserScrollTo(0, 300);
        PromotionsPO.applyPromotionSeats(qaDataActTest.firstSeatsToSelect);
    });

    it('Verificamos que el contador para esa promoción se ha actualizado correctamente', function() {
        protractor.promise.controlFlow().wait(PromotionsPO.getCounterValue(qaDataGeneric.eventId, qaDataActTest.promotionId, 'event')).then(function (result) {
            expect(result.counter).toEqual(qaDataActTest.firstSeatsToSelect);
        });
    });

    it('Accedemos a otra sesión y verificamos que el valor del contador se ha actualizado a 0', function(){
        browser.get(browser.baseUrl + qaDataActTest.secondSessionUrlMono).then(function(){
            protractor.promise.controlFlow().wait(PromotionsPO.getCounterValue(qaDataGeneric.eventId, qaDataActTest.promotionId, 'event')).then(function (result) {
                expect(result.counter).toEqual(0);
            });
        });
    });

    it('Seleccionamos una localidad más que el límite por sesión de la promoción y verificamos que podemos aplicar la promoción a todas menos una de las localidades', function() {
        browser.driver.sleep(2000);
        VenueMapPO.selectZone(qaDataGeneric.graphicNumberedZone);
        VenueNavPO.mapTransform('down');
        VenueMapPO.selectNumberedSeats(qaDataActTest.secondSeatsToSelect, true);

        browser.driver.sleep(2000);
        AppPO.browserScrollTo(0, 300);
        expect(PromotionsPO.applyPromotionSeats(qaDataActTest.secondSeatsToSelect-1)).toBe(qaDataActTest.secondSeatsToSelect - 1);
    });

    //Acabar la compra
    it('Avanzamos hasta la pantalla de datos personales, seleccionamos método de pago y terminamos la compra', function() {
        browser.driver.sleep(2000);
        AppPO.goToNextStepSales().then(function(){
            UserDataPO.setUserData(genericData.userData.name, genericData.userData.surname, genericData.userData.email);
            UserDataPO.selectPaymentMethod(qaDataActTest.paymentMethodPosition);
            UserDataPO.continueToPay();

            browser.driver.sleep(5000);

            PaymentDetailsPO.paymentCash(qaDataActTest.totalPrice);
        });
    });

    it('Verificamos que llegamos a la pantalla de confirmación de la compra, y que el precio de las localidades es correcto', function(){
        expect(PurchaseConfirmPO.getOrderCode().isPresent()).toBe(true);
        PurchaseConfirmPO.getSessionSeatsBoughtInfo(qaDataActTest.secondSessionId, 'ticket.price.finalPrice').getText().then(function(sessionSeatsBoughtPrice){
            for(var i = 0; i < sessionSeatsBoughtPrice.length - 1; i++){
                expect(sessionSeatsBoughtPrice[i]).toEqual(qaDataActTest.seatSelectedPricePromo);
            }
            expect(sessionSeatsBoughtPrice[sessionSeatsBoughtPrice.length-1]).toEqual(qaDataActTest.seatSelectedPrice);
        });
    });

    it('Accedemos a la misma sesión y volvemos a seleccionar las mismas localidades', function() {
        browser.get(browser.baseUrl + qaDataActTest.secondSessionUrlMono);

        browser.driver.sleep(2000);
        VenueMapPO.selectZone(qaDataGeneric.graphicNumberedZone);
        VenueNavPO.mapTransform('down');
        VenueMapPO.selectNumberedSeats(qaDataActTest.secondSeatsToSelect, true);

        expect(SelectLocationsPO.havePromotion()).toBe(false);
    });
});