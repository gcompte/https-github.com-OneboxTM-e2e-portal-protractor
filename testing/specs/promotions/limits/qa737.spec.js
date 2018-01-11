var VenueMapPO = require('./../../../page-objects/venue-map.po.js'),
    PromotionsPO = require('./../../../page-objects/promotions.po.js'),
    SiteCartPO = require('./../../../page-objects/site-cart.po.js'),
    AppPO = require('./../../../page-objects/app.po.js');

var env = browser.params.env,
    qaData = require('./suite-data.' + env + '.json'),
    qaDataGeneric = qaData.generic,
    qaDataActTest = qaData.qa737;

describe('QA-737 Actualización de contador de usos de 3 promociones distintas con Limites máximos por sesión al liberar localidades por navegar a otra sesión', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaDataActTest.sessionUrlMulti);
    });

    //Multievento
    it('Accedemos a la ficha de una sesión, seleccionamos N localidades y aplicamos todas las promociones a todas las localidades', function() {
        browser.driver.sleep(2000);
        VenueMapPO.selectZone(qaDataGeneric.graphicNumberedZone);
        VenueMapPO.selectNumberedSeats(qaDataActTest.seatsToSelect, true);

        browser.driver.sleep(2000);
        AppPO.browserScrollTo(0, 300);
        PromotionsPO.selectPromotionByPosition(0);
        PromotionsPO.applyPromotionSeats(qaDataActTest.seatsToSelect);

        PromotionsPO.selectPromotionByPosition(1);
        PromotionsPO.applyPromotionSeats(qaDataActTest.seatsToSelect);
    });

    it('Verificamos que los contadores de las promociones se han actualizado correctamente', function() {
        protractor.promise.controlFlow().wait(PromotionsPO.getCounterValue(qaDataActTest.sessionId, qaDataActTest.promotionAutoId, 'session')).then(function (result) {
            expect(result.counter).toEqual(qaDataActTest.seatsToSelect);
        });
        protractor.promise.controlFlow().wait(PromotionsPO.getCounterValue(qaDataActTest.sessionId, qaDataActTest.promotionDescId, 'session')).then(function (result) {
            expect(result.counter).toEqual(qaDataActTest.seatsToSelect);
        });
        protractor.promise.controlFlow().wait(PromotionsPO.getCounterValue(qaDataActTest.sessionId, qaDataActTest.promotionPromoId, 'session')).then(function (result) {
            expect(result.counter).toEqual(qaDataActTest.seatsToSelect);
        });
    });

    it('Accedemos a otra sesión y verificamos que los valores de los contadores no han cambiado', function(){
        browser.get(browser.baseUrl + qaDataGeneric.sessionUrlMulti);
        protractor.promise.controlFlow().wait(PromotionsPO.getCounterValue(qaDataActTest.sessionId, qaDataActTest.promotionAutoId, 'session')).then(function (result) {
            expect(result.counter).toEqual(qaDataActTest.seatsToSelect);
        });
        protractor.promise.controlFlow().wait(PromotionsPO.getCounterValue(qaDataActTest.sessionId, qaDataActTest.promotionDescId, 'session')).then(function (result) {
            expect(result.counter).toEqual(qaDataActTest.seatsToSelect);
        });
        protractor.promise.controlFlow().wait(PromotionsPO.getCounterValue(qaDataActTest.sessionId, qaDataActTest.promotionPromoId, 'session')).then(function (result) {
            expect(result.counter).toEqual(qaDataActTest.seatsToSelect);
        });
    });

    it('Liberamos las localidades', function() {
        SiteCartPO.expandCollapseSiteCart();
        SiteCartPO.removeSessionTickets(qaDataActTest.sessionId, 'delete');
    });

    //Monoevento
    it('Accedemos a la ficha de una sesión, seleccionamos N localidades y aplicamos todas las promociones a todas las localidades', function() {
        browser.get(browser.baseUrl + qaDataActTest.sessionUrlMono);

        browser.driver.sleep(2000);
        VenueMapPO.selectZone(qaDataGeneric.graphicNumberedZone);
        VenueMapPO.selectNumberedSeats(qaDataActTest.seatsToSelect, true);

        browser.driver.sleep(2000);
        AppPO.browserScrollTo(0, 300);
        PromotionsPO.selectPromotionByPosition(0);
        PromotionsPO.applyPromotionSeats(qaDataActTest.seatsToSelect);

        PromotionsPO.selectPromotionByPosition(1);
        PromotionsPO.applyPromotionSeats(qaDataActTest.seatsToSelect);
    });

    it('Verificamos que los contadores de las promociones se han actualizado correctamente', function() {
        protractor.promise.controlFlow().wait(PromotionsPO.getCounterValue(qaDataActTest.sessionId, qaDataActTest.promotionAutoId, 'session')).then(function (result) {
            expect(result.counter).toEqual(qaDataActTest.seatsToSelect);
        });
        protractor.promise.controlFlow().wait(PromotionsPO.getCounterValue(qaDataActTest.sessionId, qaDataActTest.promotionDescId, 'session')).then(function (result) {
            expect(result.counter).toEqual(qaDataActTest.seatsToSelect);
        });
        protractor.promise.controlFlow().wait(PromotionsPO.getCounterValue(qaDataActTest.sessionId, qaDataActTest.promotionPromoId, 'session')).then(function (result) {
            expect(result.counter).toEqual(qaDataActTest.seatsToSelect);
        });
    });

    it('Accedemos a otra sesión y verificamos que el valor de los contadores se ha actualizado a 0', function(){
        browser.get(browser.baseUrl + qaDataGeneric.sessionUrlMono).then(function(){
            protractor.promise.controlFlow().wait(PromotionsPO.getCounterValue(qaDataActTest.sessionId, qaDataActTest.promotionAutoId, 'session')).then(function (result) {
                expect(result.counter).toEqual(0);
            });
            protractor.promise.controlFlow().wait(PromotionsPO.getCounterValue(qaDataActTest.sessionId, qaDataActTest.promotionDescId, 'session')).then(function (result) {
                expect(result.counter).toEqual(0);
            });
            protractor.promise.controlFlow().wait(PromotionsPO.getCounterValue(qaDataActTest.sessionId, qaDataActTest.promotionPromoId, 'session')).then(function (result) {
                expect(result.counter).toEqual(0);
            });
        });
    });
});