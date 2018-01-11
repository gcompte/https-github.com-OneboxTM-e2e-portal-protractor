var EventCardPO = require('./../../../page-objects/event-card.po.js'),
    SelectLocationsPO = require('./../../../page-objects/select-locations.po.js'),
    VenueNoMapPO = require('./../../../page-objects/venue-no-map.po.js'),
    PromotionsPO = require('./../../../page-objects/promotions.po.js'),
    SummaryPO = require('./../../../page-objects/summary.po.js'),
    AppPO = require('./../../../page-objects/app.po.js');

var env = browser.params.env,
    qaData = require('./suite-data.' + env + '.json').qa2666;

describe('QA-2666 Vista de abono con promoción muestra precio "Desde" más bajo - promoción promoción', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.eventUrl);
    });

    it('Accedemos a la ficha de un evento con abono y promociones y verificamos el precio que se muestra para el abono', function() {
        AppPO.closeCookiesPolicy();
        browser.driver.sleep(2000);
        expect(EventCardPO.getSessionMinPrice(qaData.sessionId, 'container')).toEqual(qaData.seasonContainerPrice);
    });
});