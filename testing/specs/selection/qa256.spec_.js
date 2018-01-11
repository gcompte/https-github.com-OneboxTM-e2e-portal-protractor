var VenueNoMapPO = require('./../../page-objects/venue-no-map.po.js'),
    SummaryPO = require('./../../page-objects/summary.po.js'),
    AppPO = require('./../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa256;

describe('QA-256 Visualización de Timer de carrito. Canal mono 3.0', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.url);
    });

    it('Accedemos a una sesión y seleccionamos una localidad', function() {
        VenueNoMapPO.selectNoGraphicSeats(qaData.noGraphicZone, 1);

        expect(AppPO.getNextStepButtonAttribute('class')).not.toMatch('disabled');
    });

    it('Verificamos que se muestra el countdown de tiempo en el summary', function(){
        SummaryPO.expandSummary();
        expect(SummaryPO.getCountdown().isDisplayed()).toBe(true);
        SummaryPO.collapseSummary();
    });

    it('Esperamos un tiempo, eliminamos la localidad seleccionada y verificamos que el countdown se ha reiniciado', function() {
        browser.driver.sleep(10000);

        SummaryPO.expandSummary();
        SummaryPO.getCountdown().getText().then(function(countdownText){
            VenueNoMapPO.selectNoGraphicSeats(qaData.noGraphicZone, 0).then(function(){
                browser.driver.sleep(2000);

                expect(SummaryPO.getCountdown().getText()).toBeGreaterThan(countdownText);
                expect(SummaryPO.getCountdown().getText()).toBeGreaterThan('09:50');
                SummaryPO.collapseSummary();
            });
        });
    });

    it('Esperamos un tiempo y seleccionamos dos nuevas localidades, verificamos que el countdown se reinicia de nuevo', function() {
        browser.driver.sleep(10000);

        SummaryPO.expandSummary();
        SummaryPO.getCountdown().getText().then(function(countdownText){
            VenueNoMapPO.selectNoGraphicSeats(qaData.noGraphicZone, 2).then(function(){
                browser.driver.sleep(2000);

                expect(SummaryPO.getCountdown().getText()).toBeGreaterThan(countdownText);
                expect(SummaryPO.getCountdown().getText()).toBeGreaterThan('09:50');
            });
        });
    });

    it('Esperamos un tiempo y eliminamos una de las dos localidades, verificamos que el countdown se reinicia otra vez', function() {
        browser.driver.sleep(10000);

        SummaryPO.getCountdown().getText().then(function(countdownText){
            SummaryPO.deleteSeatSelected(0, 'delete').then(function(){
                browser.driver.sleep(2000);

                expect(SummaryPO.getCountdown().getText()).toBeGreaterThan(countdownText);
                expect(SummaryPO.getCountdown().getText()).toBeGreaterThan('09:50');
            });
        });
    });
});