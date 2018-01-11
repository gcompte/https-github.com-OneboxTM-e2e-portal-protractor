var env = browser.params.env,
    qaData = require('./suite-data.' + env + '.json').qa3829;

describe('QA-3829 Verificar redirección a selección de localidades con varias sesiones pero solo una en estado "preparado" y publicada', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.eventUrl);
    });

    it('Accedemos a un evento con una sola sesión en estado "preparada"', function() {
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + qaData.sessionUrl);
    });
});