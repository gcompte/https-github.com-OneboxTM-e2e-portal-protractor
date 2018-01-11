var VenueNoMapPO = require('./../../../page-objects/venue-no-map.po.js'),
    PromotionsPO = require('./../../../page-objects/promotions.po.js'),
    SiteCartPO = require('./../../../page-objects/site-cart.po.js');

var env = browser.params.env,
    qaData = require('./suite-data.' + env + '.json'),
    qaDataGeneric = qaData.generic,
    qaDataActTest = qaData.qa730;

describe('QA-730 Actualización de contador de usos de una promoción automática con Limite máximo por sesión al liberar localidades por navegar a otra sesión', function() {
    //Multievento
    it('Verificamos que el contador de la promoción automática está actualmente a 0', function() {
        protractor.promise.controlFlow().wait(PromotionsPO.getCounterValue(qaDataActTest.sessionId, qaDataActTest.promotionId, 'session')).then(function (result) {
            expect(result.counter).toEqual(0);
        });
    });

    it('Accedemos a la ficha de una sesión y seleccionamos N localidades', function() {
        browser.get(browser.baseUrl + qaDataActTest.sessionUrlMulti);

        VenueNoMapPO.selectNoGraphicSeats(qaDataGeneric.noGraphicZone, qaDataActTest.seatsToSelect);

        browser.driver.sleep(10000);
    });

    it('Verificamos que el contador para esa promoción se ha actualizado correctamente', function() {
        protractor.promise.controlFlow().wait(PromotionsPO.getCounterValue(qaDataActTest.sessionId, qaDataActTest.promotionId, 'session')).then(function (result) {
            expect(result.counter).toEqual(qaDataActTest.seatsToSelect);
        });
    });

    it('Accedemos a otra sesión y verificamos que el valor del contador no ha cambiado', function(){
        browser.get(browser.baseUrl + qaDataGeneric.sessionUrlMulti);
        protractor.promise.controlFlow().wait(PromotionsPO.getCounterValue(qaDataActTest.sessionId, qaDataActTest.promotionId, 'session')).then(function (result) {
            expect(result.counter).toEqual(qaDataActTest.seatsToSelect);
        });
    });

    it('Liberamos las localidades', function() {
        SiteCartPO.expandCollapseSiteCart();
        SiteCartPO.removeSessionTickets(qaDataActTest.sessionId, 'delete');
    });

    //Monoevento
    it('Verificamos que el contador de la promoción automática está actualmente a 0', function() {
        browser.driver.sleep(1000).then(function(){
            protractor.promise.controlFlow().wait(PromotionsPO.getCounterValue(qaDataActTest.sessionId, qaDataActTest.promotionId, 'session')).then(function (result) {
                expect(result.counter).toEqual(0);
            });
        });
    });

    it('Accedemos a la ficha de una sesión y seleccionamos N localidades', function() {
        browser.get(browser.baseUrl + qaDataActTest.sessionUrlMono);

        VenueNoMapPO.selectNoGraphicSeats(qaDataGeneric.noGraphicZone, qaDataActTest.seatsToSelect);
    });

    it('Verificamos que el contador para esa promoción se ha actualizado correctamente', function() {
        browser.driver.sleep(1000).then(function(){
            protractor.promise.controlFlow().wait(PromotionsPO.getCounterValue(qaDataActTest.sessionId, qaDataActTest.promotionId, 'session')).then(function (result) {
                expect(result.counter).toEqual(qaDataActTest.seatsToSelect);
            });
        });
    });

    it('Accedemos a otra sesión y verificamos que el valor del contador se ha actualizado a 0', function(){
        browser.get(browser.baseUrl + qaDataGeneric.sessionUrlMono);
        browser.driver.sleep(1000).then(function(){
            protractor.promise.controlFlow().wait(PromotionsPO.getCounterValue(qaDataActTest.sessionId, qaDataActTest.promotionId, 'session')).then(function (result) {
                expect(result.counter).toEqual(0);
            });
        });
    });
});