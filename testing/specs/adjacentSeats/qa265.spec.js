var AppPO = require('./../../page-objects/app.po.js'),
    VenueNoMapPO = require('./../../page-objects/venue-no-map.po.js'),
    UserDataPO = require('./../../page-objects/user-data.po.js'),
    PaymentDetailsPO = require('./../../page-objects/payment-details.po.js');

var env = browser.params.env,
    genericData = require('./../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa265;

describe('QA-265 Avisos localidades no contiguas al comprar butacas distinto sector ZNN', function() {
    //Accedemos a una sesión del evento con recinto no gráfico
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.url);
    });

    it('Seleccionamos dos localidades de una misma zona de precio y verificamos que no muestra ningún mensaje de butacas no contiguas', function(){
        AppPO.closeCookiesPolicy();
        VenueNoMapPO.selectNoGraphicSeats(qaData.firstNoGraphicZone, 2);
        expect(AppPO.getAdjacentWarnings('selectlocations').count()).toBe(0);
    });

    it('Deseleccionamos una de las dos localidades', function(){
        VenueNoMapPO.selectNoGraphicSeats(qaData.firstNoGraphicZone, 0);
        VenueNoMapPO.selectNoGraphicSeats(qaData.firstNoGraphicZone, 1);
        expect(AppPO.getAdjacentWarnings('selectlocations').count()).toBe(0);
    });

    it('Seleccionamos una localidad de otra zona de precio', function(){
        VenueNoMapPO.selectNoGraphicSeats(qaData.secondNoGraphicZone, 1);
        expect(AppPO.getAdjacentWarnings('selectlocations').count()).toBe(1);
        expect(AppPO.getAdjacentWarnings('selectlocations').get(0).getText()).toEqual(qaData.notAdjacentSeatsMessage);
        AppPO.goToNextStep();
    });

    it('Verificar que en la pantalla de "validar carrito" también aparece el mensaje de "localidades no contiguas"', function(){
        expect(AppPO.getAdjacentWarnings('session').count()).toBe(1);
        expect(AppPO.getAdjacentWarnings('session').get(0).getText()).toEqual(qaData.notAdjacentSeatsMessage);
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

    it('Verificamos que llegamos a la pantalla de confirmación de la compra, y que aparece el mensaje de localidades no contiguas', function(){
        AppPO.switchContext('default');
        browser.ignoreSynchronization = false;

        browser.driver.sleep(5000);

        expect(AppPO.getAdjacentWarnings('session').count()).toBe(1);
        expect(AppPO.getAdjacentWarnings('session').get(0).getText()).toEqual(qaData.notAdjacentSeatsMessage);
    });

});