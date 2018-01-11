var UserDataPO = require('./../../page-objects/user-data.po.js'),
    VenueNoMapPO = require('./../../page-objects/venue-no-map.po.js'),
    AppPO = require('./../../page-objects/app.po.js');

var genericData = require('./../generic-data.json'),
    qaData = require('./suite-data.' + browser.params.env + '.json').qa3031;

describe('QA-3031 Verificar longitud máxima de campo NIF/NIE en la página de Datos de Usuario', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.sessionUrl);
    });

    it('Seleccionamos localidades de una sesión y avanzamos hasta la pantalla de datos de usuario, verificamos que en el campo NIF solo se pueden introducir 20 caracteres', function() {
        VenueNoMapPO.selectNoGraphicSeats(qaData.noGraphicZone, 1);

        browser.driver.sleep(2000);
        AppPO.goToNextStepSales();
        expect(UserDataPO.setNif(qaData.nif)).toEqual(qaData.nif.substring(0, qaData.nif.length-1));
    });
});