var TaquillaWebPO = require('./../../page-objects/taquilla-web.po.js'),
    VenueMapPO = require('./../../page-objects/venue-map.po.js'),
    SummaryPO = require('./../../page-objects/summary.po.js'),
    UserDataPO = require('./../../page-objects/user-data.po.js'),
    PurchaseConfirmPO = require('./../../page-objects/purchase-confirm.po.js'),
    AppPO = require('./../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json'),
    testData = require('./suite-data.' + env + '.json').qa553;

describe('QA-553 No gateway: Compra OK con importe = a 0.00€ en canal taquilla web', function() {
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
        TaquillaWebPO.selectSession(qaData.secondSessionId);

        browser.ignoreSynchronization = false;
        AppPO.switchContext('boxoffice-view');
        VenueMapPO.selectZone(qaData.graphicZone);
        VenueMapPO.selectNumberedSeats(1);
        
        expect(SummaryPO.getTicketsInfo(qaData.secondSessionId, 0)).toEqual(qaData.ticketsInfo[1]);
        expect(SummaryPO.getFinalPrice()).toEqual('0,00 €');

        browser.driver.sleep(2000);
        AppPO.goToNextStep();
    });

    it('Accedemos a la pantalla de datos personales, seleccionamos método de pago y terminamos la compra', function(){
        UserDataPO.setUserData(genericData.userData.name, genericData.userData.surname, genericData.userData.email);

        AppPO.goToNextStep();
        expect(PurchaseConfirmPO.getOrderCode().isPresent()).toBe(true);
    });
});