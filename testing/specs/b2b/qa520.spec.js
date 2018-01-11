var B2bPO = require('./../../page-objects/b2b.po.js');

var genericData = require('./../generic-data.json');

describe ('QA-520 Verificar funcionamiento del Log-in en un canal B2B', function (){
    beforeAll(function() {
        browser.get(browser.baseUrl + genericData.channels.b2b + genericData.channels.states.login);
    });

    it('Login in b2b channel', function(){
        B2bPO.loginUser(genericData.b2bUsersData[0].user, genericData.b2bUsersData[0].password).then(function(){
            expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + genericData.channels.b2b + genericData.channels.states.billboard);
        });
    });
});