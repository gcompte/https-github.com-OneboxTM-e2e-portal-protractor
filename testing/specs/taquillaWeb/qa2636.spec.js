var TaquillaWebPO = require('./../../page-objects/taquilla-web.po.js'),
    AppPO = require('./../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa2636;

describe('QA-2636 Verificar que en un canal Taquilla Web 3.0 se pueden buscar transacciones mediante el buscador', function() {
    beforeAll(function() {
        browser.ignoreSynchronization = true;
        browser.get(browser.baseUrl + genericData.channels.taquillaWebMono);
    });

    it('Accedemos al canal taquilla mono y nos logueamos con un usuario, verificamos que se loguea correctamente', function() {
        expect(TaquillaWebPO.userIsLogged()).toBe(false);
        TaquillaWebPO.loginUser(genericData.taquillaWebUsersData.users[0].email, genericData.taquillaWebUsersData.password);
        expect(TaquillaWebPO.userIsLogged()).toBe(true);
    });

    it('Accedemos al listado de transacciones, seleccionamos una fecha de inicio y buscamos una transacción en concreto mediante el buscador', function(){
        TaquillaWebPO.getOperationsButton().click();

        AppPO.switchContext('boxoffice-view');

        TaquillaWebPO.selectDate(qaData.initDate, 'init');
        browser.driver.sleep(5000);
        TaquillaWebPO.searchOperation(qaData.operationCode).then(function(){
            browser.driver.sleep(2000);

            TaquillaWebPO.getOperationsList().then(function(operationsList){
                expect(operationsList.length).toBe(1);
                expect(operationsList[0].element(by.css('.operation-locator')).getText()).toEqual(qaData.operationCode);
            });
        });
    });
});