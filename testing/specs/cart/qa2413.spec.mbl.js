var OffCanvasMenuPO = require('./../../page-objects/off-canvas-menu.po.js'),
    CookiesPolicyPO = require('./../../page-objects/cookies-policy.po.js');

var genericData = require('./../generic-data.json');

describe('QA-2413 Visualizar menu offcanvas - Movil Portal3', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + genericData.channels.genericMono);
    });

    it('Accedemos a la cartelera de un canal y desplegamos el menú "off-canvas izquierdo", verificamos que aparecen las opciones correctas', function() {
        CookiesPolicyPO.closeCookiesPolicy();
        expect(OffCanvasMenuPO.getOffCanvasMenu().isDisplayed()).toBe(false);

        OffCanvasMenuPO.expandOffCanvasMenu().then(function(){
            expect(OffCanvasMenuPO.getOffCanvasMenu().isDisplayed()).toBe(true);

            OffCanvasMenuPO.getOffCanvasMenuOptions().then(function(offCanvasMenuOptionsArray){
                expect(offCanvasMenuOptionsArray.length).toEqual(genericData.offCanvasOptions.length);
                expect(offCanvasMenuOptionsArray).toEqual(genericData.offCanvasOptions);
            });
        });

        browser.driver.sleep(5000);
    });
});