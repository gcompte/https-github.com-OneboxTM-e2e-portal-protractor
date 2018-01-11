var VenueNoMapPO = require('./../../../page-objects/venue-no-map.po.js'),
    SummaryPO = require('./../../../page-objects/summary.po.js'),
    UserDataPO = require('./../../../page-objects/user-data.po.js'),
    PaymentDetailsPO = require('./../../../page-objects/payment-details.po.js'),
    PurchaseConfirmPO = require('./../../../page-objects/purchase-confirm.po.js'),
    AppPO = require('./../../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa3543;

describe('QA-3543 Compra 1 entrada individual de actividad/parque en PAW', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.url);
    });

    it('Accedemos a una sesión, seleccionamos una localidad y avanzamos hasta la pantalla de datos de usuario.', function() {
        browser.driver.sleep(3000);
        VenueNoMapPO.selectNoGraphicSeats(qaData.noGraphicZone, 1);

        browser.driver.sleep(2000);
        expect(SummaryPO.getTicketsInfo(qaData.sessionId, 0)).toEqual(qaData.ticketsInfo[0]);
        expect(SummaryPO.getFinalPrice()).toEqual(qaData.priceWithCurrency);

        AppPO.browserScrollTo(0, 500);
        browser.driver.sleep(2000);
        AppPO.goToNextStep();
        AppPO.goToNextStep();
    });

    it('Accedemos a la pantalla de datos personales, seleccionamos método de pago y terminamos la compra', function(){
        UserDataPO.setUserData(genericData.userData.name, genericData.userData.surname, genericData.userData.email);

        UserDataPO.selectPaymentMethod(1);
        AppPO.goToNextStep();
        browser.driver.sleep(2000);
        AppPO.switchContext('pasarelaIframe');
        browser.ignoreSynchronization = true;

        PaymentDetailsPO.paymentConnexFlow(genericData.paymentData.card, genericData.paymentData.securityCode);
        PaymentDetailsPO.continuePaymentConnexFlow(genericData.paymentData.cipCode);

        AppPO.switchContext('default');
        browser.ignoreSynchronization = false;
        browser.driver.sleep(2000);
        expect(PurchaseConfirmPO.getOrderCode().isPresent()).toBe(true);
    });
});