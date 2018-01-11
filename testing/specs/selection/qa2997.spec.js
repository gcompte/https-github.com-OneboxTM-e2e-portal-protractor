var SelectLocationsPO = require('./../../page-objects/select-locations.po.js'),
    VenueMapPO = require('./../../page-objects/venue-map.po.js');

var env = browser.params.env,
    qaData = require('./suite-data.' + env + '.json').qa2997;

describe('QA-2997 Ver que botón "Seguir Comprando" sólo se muestra en multievento', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.eventUrlMulti);
    });

    it('Seleccionamos una localidad en un canal multievento y verificamos que aparece el botón "Continuar comprando"', function() {
        VenueMapPO.selectZone(qaData.graphicNumberedZone);
        VenueMapPO.selectNumberedSeats(1, true);

        expect(SelectLocationsPO.keepBuyingButton().isDisplayed()).toBe(true);
    });

    it('Seleccionamos una localidad en un canal monoevento y verificamos que NO aparece el botón "Continuar comprando"', function() {
        browser.get(browser.baseUrl + qaData.eventUrlMono);

        VenueMapPO.selectZone(qaData.graphicNumberedZone);
        VenueMapPO.selectNumberedSeats(1, true);

        expect(SelectLocationsPO.keepBuyingButton().isDisplayed()).toBe(false);
    });
});