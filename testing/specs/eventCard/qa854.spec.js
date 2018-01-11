var env = browser.params.env,
    qaData = require('./suite-data.' + env + '.json').qa854;

describe('QA-854 Canal con un único evento redirecciona desde cartelera a ficha evento', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.channelUrl);
    });

    it('Accedemos a un canal que solo tiene un supraevento publicado y verificamos que nos ha redireccionado a la ficha del único evento publicado en ese canal', function() {
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + qaData.supraeventUrl);
    });
});