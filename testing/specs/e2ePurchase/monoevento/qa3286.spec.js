var VenueMapPO = require('./../../../page-objects/venue-map.po.js'),
    SummaryPO = require('./../../../page-objects/summary.po.js'),
    UserDataPO = require('./../../../page-objects/user-data.po.js'),
    PaymentDetailsPO = require('./../../../page-objects/payment-details.po.js'),
    PurchaseConfirmPO = require('./../../../page-objects/purchase-confirm.po.js'),
    SelectLocationsPO = require('./../../../page-objects/select-locations.po.js'),
    AppPO = require('./../../../page-objects/app.po.js');

var env = browser.params.env,
       genericData = require('./../../generic-data.json'),
       qaData = require('./suite-data.' + env + '.json').qa3286;

describe('QA-3286 [Portal 3.0] [Monoevento] Compra entradas: Recinto gráfico ZNN método de pago Paypal', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.url);
    });

    it('Accedemos a una sesión y seleccionamos una localidad', function() {
        expect(AppPO.getNextStepButtonAttribute('class')).toMatch('disabled');

        if(browser.params.device === 'mobile'){
            SelectLocationsPO.changeSelectedMode();
            AppPO.browserScrollTo(0, 600);
        };

        VenueMapPO.selectZone(qaData.graphicZone);
        VenueMapPO.selectZone(qaData.graphicNoNumberedZone);
        VenueMapPO.selectNoNumberedSeats(1);
        
        expect(AppPO.getNextStepButtonAttribute('class')).not.toMatch('disabled');
    });

     it('Verificamos que la localidad aparece correctamente en el summary', function(){
        expect(SummaryPO.getAllTickets().count()).toBe(1);
        expect(SummaryPO.getTicketsInfo(qaData.sessionId)).toEqual(qaData.ticketsInfo);
        expect(SummaryPO.getFinalPrice()).toEqual(qaData.finalPrice);

        AppPO.goToNextStep();
    });

    it('Accedemos a la pantalla de datos personales, seleccionamos método de pago PAYPAL y terminamos la compra', function(){
        UserDataPO.setUserData(genericData.userData.name, genericData.userData.surname, genericData.userData.email);
        AppPO.browserScrollTo(0, 600);
        UserDataPO.selectPaymentMethod(1);

        AppPO.goToNextStep();
        browser.driver.sleep(10000);
        browser.ignoreSynchronization = true;
        browser.driver.sleep(10000);
        AppPO.switchContextByName('injectedUl');
        PaymentDetailsPO.loginPaypal(genericData.paymentData.paypalUser, genericData.paymentData.paypalPwd);
        browser.driver.sleep(10000);
        PaymentDetailsPO.finishPayPalPayment();
    });
    
    it('Verificamos que llegamos a la pantalla de confirmación de la compra, y que nos muestra el código de compra', function(){
        AppPO.switchContext('default');
        browser.driver.sleep(10000);
        browser.ignoreSynchronization = false;

        expect(PurchaseConfirmPO.getOrderCode().isPresent()).toBe(true); 
    });
});