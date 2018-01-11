var VenueNoMapPO = require('./../../../page-objects/venue-no-map.po.js'),
    PromotionsPO = require('./../../../page-objects/promotions.po.js'),
    SiteCartPO = require('./../../../page-objects/site-cart.po.js');

var env = browser.params.env,
    qaData = require('./suite-data.' + env + '.json'),
    qaDataGeneric = qaData.generic,
    qaDataActTest = qaData.qa731;

describe('QA-731. Actualización de contador de usos de una promoción automática con Limite máximo por sesión y para toda la promoción al liberar localidades por navegar a otra sesión', function() {
    //Multievento
    it('Verificamos que los contadores para esa promoción están actualmente a 0', function() {
        protractor.promise.controlFlow().wait(PromotionsPO.getCounterValue(qaDataActTest.sessionId, qaDataActTest.promotionId, 'session')).then(function (result) {
            expect(result.counter).toEqual(0);
        });
        protractor.promise.controlFlow().wait(PromotionsPO.getCounterValue(qaDataGeneric.eventId, qaDataActTest.promotionId, 'event')).then(function (result) {
            expect(result.counter).toEqual(0);
        });
    });

    it('Accedemos a la ficha de una sesión y seleccionamos N localidades', function() {
        browser.get(browser.baseUrl + qaDataActTest.sessionUrlMulti);
        browser.driver.sleep(1000);
        VenueNoMapPO.selectNoGraphicSeats(qaDataGeneric.noGraphicZone, qaDataActTest.seatsToSelect);
    });

    it('Verificamos que los contadores para esa promoción se han actualizado correctamente', function() {
        browser.driver.sleep(1000).then(function(){
            protractor.promise.controlFlow().wait(PromotionsPO.getCounterValue(qaDataActTest.sessionId, qaDataActTest.promotionId, 'session')).then(function (result) {
                expect(result.counter).toEqual(qaDataActTest.seatsToSelect);
            });
            protractor.promise.controlFlow().wait(PromotionsPO.getCounterValue(qaDataGeneric.eventId, qaDataActTest.promotionId, 'event')).then(function (result) {
                expect(result.counter).toEqual(qaDataActTest.seatsToSelect);
            });            
        });
    });

    it('Accedemos a otra sesión y verificamos que los valores de los contadores no han cambiado', function(){
        browser.get(browser.baseUrl + qaDataGeneric.sessionUrlMulti);
        browser.driver.sleep(1000).then(function(){
            protractor.promise.controlFlow().wait(PromotionsPO.getCounterValue(qaDataActTest.sessionId, qaDataActTest.promotionId, 'session')).then(function (result) {
                expect(result.counter).toEqual(qaDataActTest.seatsToSelect);
            });
            protractor.promise.controlFlow().wait(PromotionsPO.getCounterValue(qaDataGeneric.eventId, qaDataActTest.promotionId, 'event')).then(function (result) {
                expect(result.counter).toEqual(qaDataActTest.seatsToSelect);
            });
        });
    });

    it('Liberamos las localidades', function() {
        SiteCartPO.expandCollapseSiteCart();
        SiteCartPO.removeSessionTickets(qaDataActTest.sessionId, 'delete');
    });

    //Monoevento
    it('Verificamos que los contadores para esa promoción están actualmente a 0', function() {
        browser.driver.sleep(1000).then(function(){
            protractor.promise.controlFlow().wait(PromotionsPO.getCounterValue(qaDataActTest.sessionId, qaDataActTest.promotionId, 'session')).then(function (result) {
                expect(result.counter).toEqual(0);
            });
            protractor.promise.controlFlow().wait(PromotionsPO.getCounterValue(qaDataGeneric.eventId, qaDataActTest.promotionId, 'event')).then(function (result) {
                expect(result.counter).toEqual(0);
            });
        });
    });

    it('Accedemos a la ficha de una sesión y seleccionamos N localidades', function() {
        browser.get(browser.baseUrl + qaDataActTest.sessionUrlMono);

        VenueNoMapPO.selectNoGraphicSeats(qaDataGeneric.noGraphicZone, qaDataActTest.seatsToSelect);
    });

    it('Verificamos que los contadores para esa promoción se han actualizado correctamente', function() {
        browser.driver.sleep(1000).then(function(){
            protractor.promise.controlFlow().wait(PromotionsPO.getCounterValue(qaDataActTest.sessionId, qaDataActTest.promotionId, 'session')).then(function (result) {
                expect(result.counter).toEqual(qaDataActTest.seatsToSelect);
            });
            protractor.promise.controlFlow().wait(PromotionsPO.getCounterValue(qaDataGeneric.eventId, qaDataActTest.promotionId, 'event')).then(function (result) {
                expect(result.counter).toEqual(qaDataActTest.seatsToSelect);
            });
        });
    });

    it('Accedemos a otra sesión y verificamos que el valor de los contadores se ha actualizado a 0', function(){
        browser.get(browser.baseUrl + qaDataGeneric.sessionUrlMono).then(function(){
            protractor.promise.controlFlow().wait(PromotionsPO.getCounterValue(qaDataActTest.sessionId, qaDataActTest.promotionId, 'session')).then(function (result) {
                expect(result.counter).toEqual(0);
            });
            protractor.promise.controlFlow().wait(PromotionsPO.getCounterValue(qaDataGeneric.eventId, qaDataActTest.promotionId, 'event')).then(function (result) {
                expect(result.counter).toEqual(0);
            });
        });
    });
});