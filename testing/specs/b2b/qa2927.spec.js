var B2bPO = require('./../../page-objects/b2b.po.js');

var genericData = require('./../generic-data.json');

describe ('QA-2927 Verificar la visualización del Listado de Compras en un canal portal B2B', function (){
    beforeAll(function() {
        browser.get(browser.baseUrl + genericData.channels.b2b + genericData.channels.states.login);
    });
    
    it('Entramos en un canal B2B, accedemos al listado de compras, y verificamos los datos', function(){
        B2bPO.loginUser(genericData.b2bUsersData[0].user, genericData.b2bUsersData[0].password)

        B2bPO.openSideMenu();
        browser.driver.sleep(2000);
        B2bPO.selectPurchasesInMenu();
        B2bPO.getPurchaseList().count().then(function(purchaseListCount){
            expect(purchaseListCount.toString()).toEqual(B2bPO.getOperationsListLength());
        });
    });
});