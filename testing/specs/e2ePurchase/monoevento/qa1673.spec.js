var VenueMapPO = require('./../../../page-objects/venue-map.po.js'),
    VenueNavPO = require('./../../../page-objects/venue-nav.po.js'),
    EventCardPO = require('./../../../page-objects/event-card.po.js'),
    SummaryPO = require('./../../../page-objects/summary.po.js'),
    UserDataPO = require('./../../../page-objects/user-data.po.js'),
    PaymentDetailsPO = require('./../../../page-objects/payment-details.po.js'),
    PurchaseConfirmPO = require('./../../../page-objects/purchase-confirm.po.js'),
    SelectLocationsPO = require('./../../../page-objects/select-locations.po.js'),
    AppPO = require('./../../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa1673;

describe('QA-1673 [Portal 3.0] [Monoevento] Comprar entradas en recinto gráfico con ZNN', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.url);
    });

    it('Accedemos a un evento y sesión con recinto gráfico, y seleccionamos una localidad de una zona numerada', function() {
        AppPO.closeCookiesPolicy();
        AppPO.browserScrollTo(0, 500);
        EventCardPO.changeSessionsView('sessions-list');
        EventCardPO.sessionsListViewBuyTickets(qaData.sessionId);

        expect(AppPO.getNextStepButtonAttribute('class')).toMatch('disabled');

        if(browser.params.device === 'mobile'){
            SelectLocationsPO.changeSelectedMode();
            AppPO.browserScrollTo(0, 500);
        };

        VenueMapPO.selectZone(qaData.firstGraphicNumberedZone);
        VenueMapPO.selectNumberedSeats(1, true); //firstSeat, numberOfSeats, adjacentSeats

        expect(AppPO.getNextStepButtonAttribute('class')).not.toMatch('disabled');

        expect(SummaryPO.getTicketsInfo(qaData.sessionId, 0)).toEqual(qaData.ticketsInfo[0]);
        expect(SummaryPO.getFinalPrice()).toEqual(qaData.finalPrice[0]);
    });

    it('Seleccionamos una localidad de la zona no numerada', function() {
        browser.driver.sleep(10000);

        VenueNavPO.mapGoBack();
        VenueMapPO.selectZone(qaData.secondGraphicNumberedZone);
        VenueMapPO.selectZone(qaData.graphicNoNumberedZone);
        VenueMapPO.selectNoNumberedSeats(1);

        expect(SummaryPO.getTicketsInfo(qaData.sessionId)).toEqual(qaData.ticketsInfo);
        expect(SummaryPO.getFinalPrice()).toEqual(qaData.finalPrice[1]);

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