var B2bPO = require('./../../page-objects/b2b.po.js');

var genericData = require('./../generic-data.json');

describe ('QA-2928 Realizar una búsqueda por localizador en el Listado de Compras en un canal portal B2B', function (){
    beforeAll(function() {
        browser.get(browser.baseUrl + genericData.channels.b2b + genericData.channels.states.login);
    });

    it('Login in b2b channel', function(){
        expect(B2bPO.loginUser(genericData.b2bUsersData[0].user, genericData.b2bUsersData[0].password)).toEqual(browser.baseUrl + genericData.channels.b2b + genericData.channels.states.billboard);
    });

    it('Open side menu', function() {
        browser.driver.sleep(1000);
        expect(B2bPO.getSideMenu().isDisplayed()).toBe(false);
        B2bPO.openSideMenu();
        expect(B2bPO.getSideMenu().isDisplayed()).toBe(true);
    });
    
    it('Go to Operation List', function() {
        B2bPO.selectPurchasesInMenu();
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + genericData.channels.b2b + genericData.channels.states.operationsList);
    });
    
    it('Search by operation code and get one result', function() {
        B2bPO.getPurchaseList('orderCode').getText().then(function(purchasesList){
            B2bPO.setSearchField(purchasesList[0]);
            B2bPO.sendSearch();
            expect(B2bPO.getPurchaseList().count()).toEqual(1);
        });
    });
});