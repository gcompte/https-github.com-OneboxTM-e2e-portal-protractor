var TaquillaWebPO = require('./../../../page-objects/taquilla-web.po.js'),
    UserDataPO = require('./../../../page-objects/user-data.po.js'),
    VenueNoMapPO = require('./../../../page-objects/venue-no-map.po.js'),
    SummaryPO = require('./../../../page-objects/summary.po.js'),
    PaymentDetailsPO = require('./../../../page-objects/payment-details.po.js'),
    PurchaseConfirmPO = require('./../../../page-objects/purchase-confirm.po.js'),
    AppPO = require('./../../../page-objects/app.po.js');

var genericData = require('./../../generic-data.json'),
    qaData = require('./suite-data.' + browser.params.env + '.json').qa186;

describe('QA-186 Comprar en taquilla web 3.0 con método de pago Cash', function() {
    beforeAll(function() {
        browser.ignoreSynchronization = true;
        browser.get(genericData.channels.taquillaWebMono);
    });

    it('Accedemos al canal taquilla web y rellenamos los datos del login', function() {
        expect(TaquillaWebPO.userIsLogged()).toBe(false);
        TaquillaWebPO.loginUser(genericData.taquillaWebUsersData.users[0].email, genericData.taquillaWebUsersData.password);
        expect(TaquillaWebPO.userIsLogged()).toBe(true);
    });

    it('Accedemos a un evento y sesión en concreto y seleccionamos localidades de un recinto gráfico', function(){
        TaquillaWebPO.selectEvent(qaData.eventId);
        TaquillaWebPO.selectSession(qaData.sessionId);

        browser.ignoreSynchronization = false;
        browser.driver.sleep(6000);
        AppPO.switchContext('boxoffice-view');

        VenueNoMapPO.selectNoGraphicSeats(qaData.noGraphicZone, qaData.seatsToSelect);

        browser.executeScript('window.scrollTo(0, 0);');

        SummaryPO.getSummaryBreakdown().then(function(summaryBreakdown){
            for(var i = 0; i < summaryBreakdown.length; i++){
                expect(summaryBreakdown[i].getText()).toEqual(qaData.breakdownPrice[i]);
            }
        });

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.breakdownPrice[qaData.breakdownPrice.length-1]);
    });

    it('Accedemos a la pantalla de datos personales, seleccionamos método de pago y terminamos la compra', function() {
        AppPO.browserScrollTo(0, 500);
        browser.driver.sleep(2000);
        AppPO.goToNextStepSales();

        UserDataPO.setUserData(genericData.userData.name, genericData.userData.surname, genericData.userData.email);
        UserDataPO.selectPaymentMethod(qaData.paymentMethodPosition);

        UserDataPO.continueToPay();

        PaymentDetailsPO.paymentCash(qaData.amount);
        expect(PurchaseConfirmPO.getOrderCode().isPresent()).toBe(true);
    });

    it('Cerramos la sesión de taquilla', function() {
        AppPO.switchContext('default');
        browser.ignoreSynchronization = true;
        TaquillaWebPO.logoutUser();
        expect(TaquillaWebPO.userIsLogged()).toBe(false);
    });
});