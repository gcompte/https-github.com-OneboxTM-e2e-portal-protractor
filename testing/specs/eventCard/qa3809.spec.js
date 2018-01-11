var EventCardPO = require('./../../page-objects/event-card.po.js'),
	AppPO = require('./../../page-objects/app.po.js');

var env = browser.params.env,
    qaData = require('./suite-data.' + env + '.json').qa3809;

describe('QA-3809 Verificar que al acceder a un SUPRA evento se redirecciona desde ficha evento a selección de localidades directamente, omitiendo ficha sesión', function() {
    beforeAll(function() {
		browser.get(browser.baseUrl + qaData.eventUrl);
    });

    it('Accedemos a un supraevento, clicamos en una sesión y verificamos que accede directamente a la pantalla de selección de localidades', function(){
        browser.driver.sleep(2000);
        AppPO.browserScrollTo(0, 1000);
        EventCardPO.supraeventGallerySessionBuyTickets(qaData.sessionId);

        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + qaData.selectLocationsUrl);
    });
});