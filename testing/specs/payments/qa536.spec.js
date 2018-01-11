var VenueNoMapPO = require('./../../page-objects/venue-no-map.po.js'),
    SummaryPO = require('./../../page-objects/summary.po.js'),
    UserDataPO = require('./../../page-objects/user-data.po.js'),
    PaymentDetailsPO = require('./../../page-objects/payment-details.po.js'),
    AppPO = require('./../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json');

describe('QA-536 Redsys: Compra KO por tarjeta incorrecta y hasta 3 reintentos', function() {
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
        AppPO.goToNextStep();

        browser.ignoreSynchronization = true;

        for(var i = 0; i < qaData.numberRetries; i++){
            browser.driver.sleep(2000);
            AppPO.switchContext('pasarelaIframe');
            PaymentDetailsPO.paymentRedsys(genericData.paymentData.wrongCard, genericData.paymentData.securityCode, genericData.paymentData.cipCode);

            //expect(element(by.css('.errorRecibo')).isPresent()).toBe(true);

            AppPO.switchContext('default');
        }

        browser.driver.sleep(2000);
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + qaData.paymentErrorUrl);
    });
});