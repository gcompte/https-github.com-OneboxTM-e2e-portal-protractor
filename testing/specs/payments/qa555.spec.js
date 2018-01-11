var VenueNoMapPO = require('./../../page-objects/venue-no-map.po.js'),
    SummaryPO = require('./../../page-objects/summary.po.js'),
    UserDataPO = require('./../../page-objects/user-data.po.js'),
    PaymentDetailsPO = require('./../../page-objects/payment-details.po.js'),
    PurchaseConfirmPO = require('./../../page-objects/purchase-confirm.po.js'),
    AppPO = require('./../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json');

describe('QA-555 Credomatic: Compra OK', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.sessionUrl);
    });

    it('Accedemos a una sesión, seleccionamos una localidad y avanzamos hasta la pantalla de datos de usuario.', function() {
        VenueNoMapPO.selectNoGraphicSeats(qaData.noGraphicZone, 1);
        
        expect(SummaryPO.getTicketsInfo(qaData.sessionId, 0)).toEqual(qaData.ticketsInfo[0]);
        expect(SummaryPO.getFinalPrice()).toEqual(qaData.priceWithCurrency);

        browser.driver.sleep(2000);
        AppPO.goToNextStep();
    });

    it('Accedemos a la pantalla de datos personales, seleccionamos método de pago y terminamos la compra', function(){
        UserDataPO.setUserData(genericData.userData.name, genericData.userData.surname, genericData.userData.email);
        AppPO.browserScrollTo(0, 600);
        UserDataPO.selectPaymentMethod(2);
        AppPO.goToNextStep();
        browser.driver.sleep(2000);
        AppPO.switchContext('pasarelaIframe');
        browser.ignoreSynchronization = true;

        PaymentDetailsPO.paymentCredomatic(genericData.userData.name, genericData.paymentData.card, genericData.paymentData.securityCode);
        PaymentDetailsPO.continuePaymentCredomatic();

        AppPO.switchContext('default');
        browser.ignoreSynchronization = false;
        browser.driver.sleep(2000);
        expect(PurchaseConfirmPO.getOrderCode().isPresent()).toBe(true);
    });
});