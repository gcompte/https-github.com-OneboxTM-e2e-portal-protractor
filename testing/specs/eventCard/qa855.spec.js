var env = browser.params.env,
    qaData = require('./suite-data.' + env + '.json').qa855;

describe('QA-855 Canal con más de un evento no redirecciona desde cartelera a ficha evento', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.channelUrl);
    });

    it('Accedemos a un canal que tiene varios eventos publicados y verificamos que estamos en la cartelera de dicho canal', function() {
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + qaData.channelUrl);
    });
});