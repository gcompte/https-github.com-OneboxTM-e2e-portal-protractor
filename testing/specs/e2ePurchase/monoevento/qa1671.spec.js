var VenueNoMapPO = require('./../../../page-objects/venue-no-map.po.js'),
    EventCardPO = require('./../../../page-objects/event-card.po.js'),
    SummaryPO = require('./../../../page-objects/summary.po.js'),
    UserDataPO = require('./../../../page-objects/user-data.po.js'),
    PaymentDetailsPO = require('./../../../page-objects/payment-details.po.js'),
    PurchaseConfirmPO = require('./../../../page-objects/purchase-confirm.po.js'),
    AppPO = require('./../../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa1671;

describe('QA-1671 [Portal 3.0] [Monoevento] Comprar entrada en recinto no gráfico', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.url);
    });

    it('Accedemos a un evento, seleccionamos una sesión con recinto no gráfico y seleccionamos una localidad', function() {
        browser.driver.sleep(3000);
        AppPO.closeCookiesPolicy();
        EventCardPO.changeSessionsView('sessions-list');
        EventCardPO.sessionsListViewBuyTickets(qaData.sessionId);

        expect(AppPO.getNextStepButtonAttribute('class')).toMatch('disabled');

        VenueNoMapPO.selectNoGraphicSeats(qaData.firstNoGraphicZone, 1);

        expect(AppPO.getNextStepButtonAttribute('class')).not.toMatch('disabled');
    });

    it('Verificamos que la localidad aparece correctamente en el summary', function(){
        browser.driver.sleep(2000);
        expect(SummaryPO.getTicketsInfo(qaData.sessionId)).toEqual(qaData.ticketsInfo);
        expect(SummaryPO.getFinalPrice()).toEqual(qaData.finalPrice);

        AppPO.goToNextStep();
    });

    it('Accedemos a la pantalla de datos personales, seleccionamos método de pago y terminamos la compra', function(){
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

    it('Verificamos que llegamos a la pantalla de confirmación de la compra, y que nos muestra el código de compra', function(){
        AppPO.switchContext('default');
        browser.ignoreSynchronization = false;

        expect(PurchaseConfirmPO.getOrderCode().isPresent()).toBe(true);
    });
});