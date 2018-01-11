var TaquillaWebPO = require('./../../page-objects/taquilla-web.po.js');

var env = browser.params.env,
    genericData = require('./../generic-data.json');

describe('QA-2627 Verificar que a un canal Taquilla Web 3.0 pueden acceder todos los user taquilleros de la misma entidad', function() {
    beforeAll(function() {
        browser.ignoreSynchronization = true;
        browser.get(browser.baseUrl + genericData.channels.taquillaWebMono);
    });

    it('Accedemos al canal taquilla y nos logueamos con todos los usuarios taquilleros de la misma entidad', function() {
        for(var i = 0; i < genericData.taquillaWebUsersData.users.length; i++){
            expect(TaquillaWebPO.userIsLogged()).toBe(false);
            TaquillaWebPO.loginUser(genericData.taquillaWebUsersData.users[i].email, genericData.taquillaWebUsersData.password);
            expect(TaquillaWebPO.userIsLogged()).toBe(true);
            TaquillaWebPO.logoutUser();
        }
    });
});