var EventCardPO = require('./../../page-objects/event-card.po.js'),
    SelectLocationsPO = require('./../../page-objects/select-locations.po.js'),
    AppPO = require('./../../page-objects/app.po.js');

var env = browser.params.env,
    qaData = require('./suite-data.' + env + '.json').qa2998;

describe('QA-2998 Volver atrás con enlace "Ver todas las sesiones"', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.eventUrl);
    });

    it('Accedemos a la ficha de un evento', function() {
        AppPO.closeCookiesPolicy();
        expect(browser.getCurrentUrl()).toBe(browser.baseUrl + qaData.eventUrl);
    });

    it('Accedemos a la selección de localidades de una sesión', function() {
        EventCardPO.boxSessionTime(qaData.sessionId).then(function(){
            expect(browser.getCurrentUrl()).toBe(browser.baseUrl + qaData.sessionUrl);        
        });
    });

    it('Verificamos que el enlace "Ver todas las sesiones" nos devuelve a la ficha del evento', function() {
        browser.driver.sleep(2000);
        AppPO.browserScrollTo(0, 0);
        SelectLocationsPO.seeAllSessions();

        expect(browser.getCurrentUrl()).toBe(browser.baseUrl + qaData.eventUrl);
    });

    it('Verificamos que el enlace "Ver todos los eventos" nos lleva a la cartelera del canal', function() {
        EventCardPO.seeAllEvents();

        expect(browser.getCurrentUrl()).toBe(browser.baseUrl + qaData.channelUrl);
    });
});