var EventCardPO = require('./../../page-objects/event-card.po.js'),
    VenueMapPO = require('./../../page-objects/venue-map.po.js'),
    SelectLocationsPO = require('./../../page-objects/select-locations.po.js'),
    AppPO = require('./../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa2999;

describe('QA-2999 Verificar que se muestra deshabilitado el botón "Continuar" en la pantalla Selección de Localidades.', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + genericData.channels.genericMulti + qaData.sessionUrl);
    });

    it('Accedemos a la selección de localidades de una sesión en un canal multievento y verificamos que el botón de "Comprar" está deshabilitado y que aparece el botón "Volver"', function() {
        expect(AppPO.getNextStepSalesButtonAttribute('class')).toMatch('disabled');
        expect(SelectLocationsPO.keepBuyingButton().isDisplayed()).toBe(true);
    });

    it('Seleccionamos una localidad y verificamos que el botón se habilita', function() {
        VenueMapPO.selectZone(qaData.graphicNumberedZone);
        VenueMapPO.selectNumberedSeats(1, true);

        expect(AppPO.getNextStepSalesButtonAttribute('class')).not.toMatch('disabled');
    });

    it('Avanzamos hasta la pantalla de datos de usuario y pago y verificamos que el botón de "Continuar" está habilitado', function() {
        AppPO.goToNextStepSales();
        AppPO.goToNextStep();

        expect(AppPO.getNextStepButtonAttribute('class')).not.toMatch('disabled');
    });

    it('Accedemos a la selección de localidades de una sesión en un canal monoevento y verificamos que el botón de "Comprar" está deshabilitado y que no existe el botón "Volver"', function() {
        browser.get(browser.baseUrl + genericData.channels.genericMono + qaData.sessionUrl);

        expect(AppPO.getNextStepSalesButtonAttribute('class')).toMatch('disabled');
        expect(SelectLocationsPO.keepBuyingButton().isDisplayed()).toBe(false);
    });

    it('Seleccionamos una localidad y verificamos que el botón se habilita', function() {
        VenueMapPO.selectZone(qaData.graphicNumberedZone);
        VenueMapPO.selectNumberedSeats(1, true);

        expect(AppPO.getNextStepSalesButtonAttribute('class')).not.toMatch('disabled');
    });

    it('Avanzamos hasta la pantalla de datos de usuario y pago y verificamos que el botón de "Continuar" está habilitado', function() {
        AppPO.goToNextStepSales();
        AppPO.goToNextStep();

        expect(AppPO.getNextStepButtonAttribute('class')).not.toMatch('disabled');
    });
});