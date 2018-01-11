var TaquillaWebPO = require('./../../page-objects/taquilla-web.po.js'),
    VenueNoMapPO = require('./../../page-objects/venue-no-map.po.js'),
    SummaryPO = require('./../../page-objects/summary.po.js'),
    UserDataPO = require('./../../page-objects/user-data.po.js'),
    PaymentDetailsPO = require('./../../page-objects/payment-details.po.js'),
    PurchaseConfirmPO = require('./../../page-objects/purchase-confirm.po.js'),
    AppPO = require('./../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json'),
    testData = require('./suite-data.' + env + '.json').qa553;

describe('QA-552 CASH: Compra OK con importe ≠ 0.00€ en un canal taquilla web', function() {
    beforeAll(function() {
        browser.ignoreSynchronization = true;
        browser.get(browser.baseUrl + genericData.channels.paymentsTaquillaWebMono);
    });

    it('Accedemos al canal taquilla mono y nos logueamos con un usuario, verificamos que se loguea correctamente', function() {
        TaquillaWebPO.loginUser(genericData.taquillaWebUsersData.users[0].email, genericData.taquillaWebUsersData.password);
        expect(TaquillaWebPO.userIsLogged()).toBe(true);
    });

    it('Accedemos a una sesión, seleccionamos una localidad y avanzamos hasta la pantalla de datos de usuario.', function() {
        TaquillaWebPO.selectEvent(qaData.eventId);
        browser.driver.sleep(2000);
        TaquillaWebPO.selectSession(qaData.sessionId);

        browser.ignoreSynchronization = false;
        AppPO.switchContext('boxoffice-view');
        VenueNoMapPO.selectNoGraphicSeats(qaData.noGraphicZone, 1);
        
        expect(SummaryPO.getTicketsInfo(qaData.sessionId, 0)).toEqual(qaData.ticketsInfo[0]);
        expect(SummaryPO.getFinalPrice()).toEqual(qaData.priceWithCurrency);

        browser.driver.sleep(2000);
        AppPO.browserScrollTo(0, 600);
        AppPO.goToNextStep();
    });

    it('Accedemos a la pantalla de datos personales, seleccionamos método de pago y terminamos la compra', function(){
        UserDataPO.setUserData(genericData.userData.name, genericData.userData.surname, genericData.userData.email);
        AppPO.goToNextStep();
        browser.driver.sleep(5000);

        PaymentDetailsPO.paymentCash(qaData.priceWithoutCurrency).then(function(){
            expect(PurchaseConfirmPO.getOrderCode().isPresent()).toBe(true);
        });
    });
});