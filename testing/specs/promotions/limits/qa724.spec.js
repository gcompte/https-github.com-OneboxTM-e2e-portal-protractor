var VenueMapPO = require('./../../../page-objects/venue-map.po.js'),
    VenueNavPO = require('./../../../page-objects/venue-nav.po.js'),
    PromotionsPO = require('./../../../page-objects/promotions.po.js'),
    SiteCartPO = require('./../../../page-objects/site-cart.po.js'),
    AppPO = require('./../../../page-objects/app.po.js');

var env = browser.params.env,
    qaData = require('./suite-data.' + env + '.json'),
    qaDataGeneric = qaData.generic,
    qaDataActTest = qaData.qa724;

describe('QA-724 Actualización de contador de usos de una promoción con Limite máximo por sesión al liberar localidades por navegar a otra sesión', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaDataActTest.sessionUrlMulti);
    });

    //Multievento
    it('Accedemos a la ficha de una sesión y seleccionamos N localidades', function() {
        browser.driver.sleep(4000);
        VenueMapPO.selectZone(qaDataGeneric.graphicNumberedZone);
        VenueNavPO.mapTransform('down');
        VenueMapPO.selectNumberedSeats(qaDataActTest.seatsToSelect, true);
    });

    it('Verificamos que el contador para esa promoción está actualmente a 0', function() {
        protractor.promise.controlFlow().wait(PromotionsPO.getCounterValue(qaDataActTest.sessionId, qaDataActTest.promotionId, 'session')).then(function (result) {
            expect(result.counter).toEqual(0);
        });
    });

    it('Aplicamos la promoción activa a todas las localidades', function(){
        browser.driver.sleep(2000);
        AppPO.browserScrollTo(0, 600);

        PromotionsPO.selectPromotionByPosition(0);
        PromotionsPO.applyPromotionSeats(qaDataActTest.seatsToSelect);
    });

    it('Verificamos que el contador para esa promoción se ha actualizado correctamente', function() {
        protractor.promise.controlFlow().wait(PromotionsPO.getCounterValue(qaDataActTest.sessionId, qaDataActTest.promotionId, 'session')).then(function (result) {
            expect(result.counter).toEqual(qaDataActTest.seatsToSelect);
        });
    });

    it('Accedemos a otra sesión y verificamos que el valor del contador no ha cambiado', function(){
        browser.get(browser.baseUrl + qaDataGeneric.sessionUrlMulti);
        browser.driver.sleep(1000).then(function(){
            protractor.promise.controlFlow().wait(PromotionsPO.getCounterValue(qaDataActTest.sessionId, qaDataActTest.promotionId, 'session')).then(function (result) {
                expect(result.counter).toEqual(qaDataActTest.seatsToSelect);
            });
        });
    });

    it('Liberamos las localidades', function() {
        SiteCartPO.expandCollapseSiteCart();
        SiteCartPO.removeSessionTickets(qaDataActTest.sessionId, 'delete');
    });

    //Monoevento
    it('Accedemos a la ficha de una sesión y seleccionamos N localidades', function() {
        browser.get(browser.baseUrl + qaDataActTest.sessionUrlMono);

        browser.driver.sleep(2000);
        VenueMapPO.selectZone(qaDataGeneric.graphicNumberedZone);
        VenueNavPO.mapTransform('down');
        VenueMapPO.selectNumberedSeats(qaDataActTest.seatsToSelect, true);
    });

    it('Verificamos que el contador para esa promoción está actualmente a 0', function() {
        protractor.promise.controlFlow().wait(PromotionsPO.getCounterValue(qaDataActTest.sessionId, qaDataActTest.promotionId, 'session')).then(function (result) {
            expect(result.counter).toEqual(0);
        });
    });

    it('Aplicamos la promoción activa a todas las localidades', function(){
        browser.driver.sleep(2000);
        //AppPO.browserScrollTo(0, 0);

        PromotionsPO.selectPromotionByPosition(0);
        PromotionsPO.applyPromotionSeats(qaDataActTest.seatsToSelect);
    });

    it('Verificamos que el contador para esa promoción se ha actualizado correctamente', function() {
        browser.driver.sleep(1000).then(function(){
            protractor.promise.controlFlow().wait(PromotionsPO.getCounterValue(qaDataActTest.sessionId, qaDataActTest.promotionId, 'session')).then(function (result) {
                expect(result.counter).toEqual(qaDataActTest.seatsToSelect);
            });
        });
    });

    it('Accedemos a otra sesión y verificamos que el valor del contador se ha actualizado a 0', function(){
        browser.get(browser.baseUrl + qaDataGeneric.sessionUrlMono).then(function(){
            browser.driver.sleep(1000).then(function(){
                protractor.promise.controlFlow().wait(PromotionsPO.getCounterValue(qaDataActTest.sessionId, qaDataActTest.promotionId, 'session')).then(function (result) {
                    expect(result.counter).toEqual(0);
                });
            });
        });
    });
});