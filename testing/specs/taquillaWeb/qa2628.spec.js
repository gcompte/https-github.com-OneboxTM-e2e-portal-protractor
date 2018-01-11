var TaquillaWebPO = require('./../../page-objects/taquilla-web.po.js');

var env = browser.params.env,
    genericData = require('./../generic-data.json');

describe('QA-2628 Verificar que un usuario taquillero puede acceder a todos los canales Taquilla Web 3.0 de su entidad', function() {
    beforeAll(function() {
        browser.ignoreSynchronization = true;
        browser.get(browser.baseUrl + genericData.channels.taquillaWebMono);
    });

    it('Accedemos al canal taquilla mono y nos logueamos con un usuario, verificamos que se loguea correctamente', function() {
        expect(TaquillaWebPO.userIsLogged()).toBe(false);
        TaquillaWebPO.loginUser(genericData.taquillaWebUsersData.users[0].email, genericData.taquillaWebUsersData.password);
        expect(TaquillaWebPO.userIsLogged()).toBe(true);
        TaquillaWebPO.logoutUser();
    });

    it('Accedemos al canal taquilla multi y nos logueamos con el mismo usuario, verificamos que se loguea correctamente', function() {
        browser.get(browser.baseUrl + genericData.channels.taquillaWebMulti);

        expect(TaquillaWebPO.userIsLogged()).toBe(false);
        TaquillaWebPO.loginUser(genericData.taquillaWebUsersData.users[0].email, genericData.taquillaWebUsersData.password);
        expect(TaquillaWebPO.userIsLogged()).toBe(true);
        TaquillaWebPO.logoutUser();
    });
});