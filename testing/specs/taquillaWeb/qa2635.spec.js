var TaquillaWebPO = require('./../../page-objects/taquilla-web.po.js'),
    AppPO = require('./../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa2635;

describe('QA-2635 Verificar que en un canal Taquilla Web 3.0 se pueden filtrar las transacciones por tipo de pago', function() {
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
        browser.driver.sleep(6000);
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

    it('Filtramos las transacciones por el método de pago "Efectivo" y verificamos que se ven correctamente', function(){
        TaquillaWebPO.filterByPaymentMethod('efectivo').then(function(){
            browser.driver.sleep(2000);

            TaquillaWebPO.getOperationsList().then(function(operationsList){
                expect(operationsList.length).toBe(qaData.operationsCodeCash.length);
                for(var i = 0; i < operationsList.length; i++){
                    expect(operationsList[i].element(by.css('.operation-locator')).getText()).toEqual(qaData.operationsCodeCash[i]);
                }
            });
        });
    });

    it('Filtramos las transacciones por el método de pago "Tarjeta" y verificamos que se ven correctamente', function(){
        element(by.id('payment-method-select')).click();

        TaquillaWebPO.filterByPaymentMethod('tarjeta').then(function(){
            browser.driver.sleep(2000);

            TaquillaWebPO.getOperationsList().then(function(operationsList){
                expect(operationsList.length).toBe(qaData.operationsCodeCard.length);
                for(var i = 0; i < operationsList.length; i++){
                    expect(operationsList[i].element(by.css('.operation-locator')).getText()).toEqual(qaData.operationsCodeCard[i]);
                }
            });
        });
    });
});