var UserDataPO = require('./../../page-objects/user-data.po.js'),
    VenueNoMapPO = require('./../../page-objects/venue-no-map.po.js'),
    AppPO = require('./../../page-objects/app.po.js');

var genericData = require('./../generic-data.json'),
    qaData = require('./suite-data.' + browser.params.env + '.json').qa3031;

describe('QA-3606 Verificar que NO puede realizar compra teniendo activado el uso de blacklist a nivel de canal y con emails asociados', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.sessionUrl);
    });

    it('Accedemos a un evento en un canal que tenga activada la blacklist, avanzamos y verificamos que no podemos comprar con un email que esté en dicha lista', function() {
        VenueNoMapPO.selectNoGraphicSeats(qaData.noGraphicZone, 1);

        browser.driver.sleep(2000);
        AppPO.goToNextStepSales();
        UserDataPO.setUserData(genericData.userData.name, genericData.userData.surname, genericData.userData.blacklistEmail);
        AppPO.goToNextStep();

        expect(browser.getCurrentUrl()).toMatch('user-data');
        expect(browser.getCurrentUrl()).not.toMatch('payment-details');
    });
});