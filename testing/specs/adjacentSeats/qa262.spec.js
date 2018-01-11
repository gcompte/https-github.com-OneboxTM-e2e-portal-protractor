var VenueMapPO = require('./../../page-objects/venue-map.po.js'),
    VenueNavPO = require('./../../page-objects/venue-nav.po.js'),
    UserDataPO = require('./../../page-objects/user-data.po.js'),
    PaymentDetailsPO = require('./../../page-objects/payment-details.po.js'),
    SelectLocationsPO = require('./../../page-objects/select-locations.po.js'),
    AppPO = require('./../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa262;

describe('QA-262 Avisos localidades no contiguas al comprar butacas distintos sectores ZN y ZNN', function() {
    //Accedemos a una sesión del evento con recinto gráfico
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.url);
    });

    it('Seleccionamos una localidad de una zona no numerada y una de una zona numerada', function(){
        if(browser.params.device === 'mobile'){
            SelectLocationsPO.changeSelectedMode();
            AppPO.browserScrollTo(0, 500);
        }

        VenueMapPO.selectZone(qaData.firstGraphicNumberedZone);
        VenueMapPO.selectZone(qaData.graphicNoNumberedZone);
        VenueMapPO.selectNoNumberedSeats(2);
        VenueNavPO.mapGoBack();
        VenueMapPO.selectZone(qaData.secondGraphicNumberedZone);
        VenueMapPO.selectNumberedSeats(1, true);

        expect(AppPO.getAdjacentWarnings('selectlocations').count()).toBe(1);
        expect(AppPO.getAdjacentWarnings('selectlocations').get(0).getText()).toBe(qaData.notAdjacentSeatsMessage);

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

        expect(AppPO.getAdjacentWarnings('session').count()).toBe(1);
        expect(AppPO.getAdjacentWarnings('session').get(0).getText()).toEqual(qaData.notAdjacentSeatsMessage);
    });
});
