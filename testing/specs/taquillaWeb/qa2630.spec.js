var TaquillaWebPO = require('./../../page-objects/taquilla-web.po.js');

var env = browser.params.env,
    genericData = require('./../generic-data.json');

describe('QA-2630 Verificar que al acceder a un canal Taquilla Web 3.0 se visualiza una columna desplegable a la izquierda', function() {
    beforeAll(function() {
        browser.ignoreSynchronization = true;
        browser.get(browser.baseUrl + genericData.channels.taquillaWebMono);
    });

    it('Accedemos al canal taquilla mono y nos logueamos con un usuario, verificamos que se loguea correctamente', function() {
        expect(TaquillaWebPO.userIsLogged()).toBe(false);
        TaquillaWebPO.loginUser(genericData.taquillaWebUsersData.users[0].email, genericData.taquillaWebUsersData.password);
        expect(TaquillaWebPO.userIsLogged()).toBe(true);
    });

    it('Verificamos que a la izquierda se muestra una columna con los eventos publicados', function(){
        expect(TaquillaWebPO.getLeftColumn().isDisplayed()).toBe(true);
        expect(TaquillaWebPO.getEventsList().count()).toBeGreaterThan(0);
    });

    it('Verificamos que la columna de la izquierda se puede ocultar y mostrar mediante el botón del menú superior', function(){
        TaquillaWebPO.getTaquillaButton().click();
        browser.driver.sleep(1000);
        expect(TaquillaWebPO.getLeftColumn().isDisplayed()).toBe(false);
        TaquillaWebPO.getTaquillaButton().click();
        browser.driver.sleep(1000);
        expect(TaquillaWebPO.getLeftColumn().isDisplayed()).toBe(true);
    });
});