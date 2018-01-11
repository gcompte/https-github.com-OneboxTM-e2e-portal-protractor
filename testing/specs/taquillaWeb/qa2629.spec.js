var TaquillaWebPO = require('./../../page-objects/taquilla-web.po.js');

var env = browser.params.env,
    genericData = require('./../generic-data.json');

describe('QA-2629 Verificar que al acceder a un canal Taquilla Web 3.0 se visualiza correctamente el menú superior', function() {
    beforeAll(function() {
        browser.ignoreSynchronization = true;
        browser.get(browser.baseUrl + genericData.channels.taquillaWebMono);
    });

    it('Accedemos al canal taquilla mono y nos logueamos con un usuario, verificamos que se loguea correctamente', function() {

        expect(TaquillaWebPO.userIsLogged()).toBe(false);
        TaquillaWebPO.loginUser(genericData.taquillaWebUsersData.users[0].email, genericData.taquillaWebUsersData.password);
        expect(TaquillaWebPO.userIsLogged()).toBe(true);
    });

    it('Verificamos que se muestra correctamente el menú superior del canal taquilla web', function(){
        expect(TaquillaWebPO.getTaquillaButton().isPresent()).toBe(true);
        expect(TaquillaWebPO.getTaquillaButton().getText()).toEqual('Taquilla');
        expect(TaquillaWebPO.getBuyTiquetsButton().isPresent()).toBe(true);
        expect(TaquillaWebPO.getBuyTiquetsButton().getText()).toEqual('Comprar entradas');
        expect(TaquillaWebPO.getOperationsButton().isPresent()).toBe(true);
        expect(TaquillaWebPO.getOperationsButton().getText()).toEqual('Listado de operaciones');
        expect(TaquillaWebPO.getLoggedUser().isPresent()).toBe(true);
        expect(TaquillaWebPO.getLoggedUser().getText()).toEqual(genericData.taquillaWebUsersData.users[0].name);
        expect(TaquillaWebPO.getLogOutButton().isPresent()).toBe(true);
        expect(TaquillaWebPO.getLogOutButton().getText()).toEqual('Cerrar sesión');
    });
});