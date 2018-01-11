var DatePickerPO = require('./../../page-objects/date-picker.po.js'),
    CatalogChannelPO = require('./../../page-objects/catalog-channel.po.js');

var env = browser.params.env,
    qaData = require('./suite-data.' + env + '.json').qa857;

describe('QA-857 Canal con más de un evento y filtro que devuelve varios eventos no redirecciona desde cartelera a ninguna ficha', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.channelUrl);
    });

    it('Accedemos a un canal que tenga varios eventos publicados y aplicamos un filtro', function() {
        browser.driver.sleep(2000);
        CatalogChannelPO.setEventsFilter(qaData.filterWord);
    });

    it('Verificamos que el filtro nos devuelve varios eventos y que no nos redirige a ninguno de ellos, si no que nos mantenemos en la cartelera', function(){
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + qaData.channelUrl);
        expect(CatalogChannelPO.getAllEvents().count()).toBeGreaterThan(1);
    });
});