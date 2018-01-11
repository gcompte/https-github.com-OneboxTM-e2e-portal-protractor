var TaquillaWebPO = require('./../../page-objects/taquilla-web.po.js'),
    AppPO = require('./../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa2633;

describe('QA-2633 Verificar que en un canal Taquilla Web 3.0 se puede acceder al listado de transacciones', function() {
    beforeAll(function() {
        browser.ignoreSynchronization = true;
        browser.get(browser.baseUrl + genericData.channels.taquillaWebMono);
    });

    it('Accedemos al canal taquilla mono y nos logueamos con un usuario, verificamos que se loguea correctamente', function() {
        expect(TaquillaWebPO.userIsLogged()).toBe(false);
        TaquillaWebPO.loginUser(genericData.taquillaWebUsersData.users[0].email, genericData.taquillaWebUsersData.password);
        expect(TaquillaWebPO.userIsLogged()).toBe(true);
    });

    it('Accedemos al listado de transacciones y verificamos que se muestran correctamente', function(){
        TaquillaWebPO.getOperationsButton().click();

        AppPO.switchContext('boxoffice-view');

        TaquillaWebPO.selectDate(qaData.initDate, 'init');
        browser.driver.sleep(7000);
        TaquillaWebPO.selectDate(qaData.endDate, 'end').then(function(){
            browser.driver.sleep(2000);

            TaquillaWebPO.getOperationsList().then(function(operationsList){
                expect(operationsList.length).toBe(qaData.operationsCode.length);
                for(var i = 0; i < operationsList.length; i++){
                    expect(operationsList[i].element(by.css('.operation-locator')).getText()).toEqual(qaData.operationsCode[i]);
                }
            });
        });
    });
});