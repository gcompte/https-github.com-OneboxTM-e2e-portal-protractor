var CatalogChannelPO = require('./../../page-objects/catalog-channel.po.js');

var env = browser.params.env,
    qaData = require('./suite-data.' + env + '.json').qa856;

describe('QA-856 Canal con más de un evento y filtro con un sólo resultado no redirecciona desde cartelera a ficha evento', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.channelUrl);
    });

    it('Accedemos a un canal que tenga varios eventos publicados y aplicamos un filtro', function() {
        browser.driver.sleep(2000);
        CatalogChannelPO.setEventsFilter(qaData.filterWord);
    });

    it('Verificamos que seguimos estando en la cartelera del canal, y que tenemos un único resultado', function(){
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + qaData.channelUrl);
        expect(CatalogChannelPO.getAllEvents().count()).toBe(1);
    });
});