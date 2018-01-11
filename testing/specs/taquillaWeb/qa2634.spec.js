var TaquillaWebPO = require('./../../page-objects/taquilla-web.po.js'),
    AppPO = require('./../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa2634;

describe('QA-2634 Verificar que en un canal Taquilla Web 3.0 se pueden filtrar las transacciones por fecha', function() {
    var moment = require('moment');

    beforeAll(function() {
        browser.ignoreSynchronization = true;
        browser.get(browser.baseUrl + genericData.channels.taquillaWebMono);
    });


    it('Accedemos al canal taquilla mono y nos logueamos con un usuario, verificamos que se loguea correctamente', function() {
        expect(TaquillaWebPO.userIsLogged()).toBe(false);
        TaquillaWebPO.loginUser(genericData.taquillaWebUsersData.users[0].email, genericData.taquillaWebUsersData.password);
        expect(TaquillaWebPO.userIsLogged()).toBe(true);
    });

    it('Accedemos al listado de transacciones, las filtramos por fecha y verificamos que las fechas de las operaciones se encuentran dentro de las fechas seleccionadas', function(){
        var initDate = new Date(moment(qaData.initDate + ' 00:00:00', 'DD/MM/YYYY HH:mm:ss').format('MM/DD/YYYY HH:mm:ss')),
            endDate = new Date(moment(qaData.endDate + ' 23:59:59', 'DD/MM/YYYY HH:mm:ss').format('MM/DD/YYYY HH:mm:ss')),
            actDate = '';

        TaquillaWebPO.getOperationsButton().click();

        AppPO.switchContext('boxoffice-view');

        TaquillaWebPO.selectDate(qaData.initDate, 'init');
        browser.driver.sleep(5000);
        TaquillaWebPO.selectDate(qaData.endDate, 'end').then(function(){
            browser.driver.sleep(2000);

            TaquillaWebPO.getOperationsList().then(function(operationsList){
                expect(TaquillaWebPO.operationsInDates(operationsList, initDate, endDate)).toBe(true);
            });
        });
    });
});