var env = browser.params.env,
    qaData = require('./suite-data.' + env + '.json').qaa1314;

describe('QAA-1407 Cartelera Grup Balañá', function() {
    it('Accedemos a la cartelera de Balañá y verificamos que los eventos tienen la url bien formada', function() {
        browser.ignoreSynchronization = true;
        browser.get(qaData.channelUrl);

        browser.driver.sleep(2000);

        element(by.css('.fa-list-ul')).click().then(function(){
            element.all(by.css('article .btns a:nth-child(2)')).getAttribute('href').then(function(hrefArticles){
                console.log('hrefArticles', hrefArticles);
                for(var i = 0; i < hrefArticles.length; i++){
                    expect(hrefArticles[i]).toMatch(/https:\/\/proticketing.com\/balanatickets_.*\/es_ES\/entradas\/evento\/[0-9]*/);
                }
            });
        });
    });
});