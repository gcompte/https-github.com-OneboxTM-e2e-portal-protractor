var env = browser.params.env,
    qaData = require('./suite-data.' + env + '.json').qa3808;

describe('QA-3808 Verificar que si un canal tiene un solo evento publicado y ademas este evento tiene una única sesión, al acceder a portal se navega directamente a la selección de localidades', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.channelUrl);
    });

    it('Accedemos a un canal que solo tiene un evento publicado y, a su vez, este evento solo tiene una sesión, y verificamos que nos redirige a la selección de localidades de dicha sesión', function(){
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + qaData.sessionUrl);
    });
});