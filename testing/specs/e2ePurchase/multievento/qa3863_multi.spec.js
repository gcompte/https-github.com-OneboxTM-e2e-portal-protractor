var VenueMapPO = require('./../../../page-objects/venue-map.po.js'),
    UserDataPO = require('./../../../page-objects/user-data.po.js'),
    PaymentDetailsPO = require('./../../../page-objects/payment-details.po.js'),
    PurchaseConfirmPO = require('./../../../page-objects/purchase-confirm.po.js'),
    AppPO = require('./../../../page-objects/app.po.js');

var genericData = require('./../../generic-data.json'),
    qaData = require('./suite-data.' + browser.params.env + '.json').qa3863;

describe('QA-3863 Verificar que en una sesión en estado "Pendiente publicación" puede finalizarse una compra sólo si se accede con el token', function() {
    it('Verificamos que no se puede acceder a una sesión en estado "Pendiente de Publicación" sin el "previewToken"', function(){
        browser.get(browser.baseUrl + qaData.previewSessionUrl);
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + genericData.channels.genericMulti + genericData.channels.states.billboard);
    });

    it('Verificamos que no se puede acceder a una sesión en estado "Pendiente de Publicación" con un "previewToken" erróneo', function(){
        browser.get(browser.baseUrl + qaData.previewSessionUrl + "?previewToken=" + qaData.previewTokenKO);
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + genericData.channels.genericMulti + genericData.channels.states.billboard);
    });

    it('Accedemos a la misma sesión con el "previewToken" correcto y verificamos que se puede finalizar una compra multisesión', function() {
        browser.get(browser.baseUrl + qaData.previewSessionUrl + "?previewToken=" + qaData.previewToken);
        VenueMapPO.selectZone(qaData.previewGraphicNumberedZone);
        VenueMapPO.selectNumberedSeats(qaData.seatsToSelect, true);

        browser.get(browser.baseUrl + qaData.preparedSessionUrl);
        VenueMapPO.selectZone(qaData.preparedGraphicNumberedZone);
        VenueMapPO.selectNumberedSeats(qaData.seatsToSelect, true);

        AppPO.browserScrollTo(0, 500);
        AppPO.goToNextStepSales();

        UserDataPO.setUserData(genericData.userData.name, genericData.userData.surname, genericData.userData.email);
        UserDataPO.selectPaymentMethod(qaData.paymentMethodPosition);
        AppPO.goToNextStep();
        browser.driver.sleep(5000);

        PaymentDetailsPO.paymentCash(qaData.priceWithoutCurrency).then(function(){
            expect(PurchaseConfirmPO.getOrderCode().isPresent()).toBe(true);
        });
    });
});