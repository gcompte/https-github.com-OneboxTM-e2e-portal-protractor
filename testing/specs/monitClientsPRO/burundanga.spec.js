var VenueMapPO = require('./../../page-objects/venue-map.po.js'),
    SummaryPO = require('./../../page-objects/summary.po.js'),
    SiteCartPO = require('./../../page-objects/site-cart.po.js'),
    ValidateCartPO = require('./../../page-objects/validate-cart.po.js'),
    AppPO = require('./../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../generic-data.json'),
    qaData = require('./suite-data.json').burundanga;


describe('QAA-1404 Teatro Lara - Burundanga', function() {
    var venueMapPO = new VenueMapPO(),
        summaryPO = new SummaryPO(),
        siteCartPO = new SiteCartPO(),
        validateCartPO = new ValidateCartPO(),
        appPO = new AppPO();

    it('Accedemos a una sesión y seleccionamos dos localidades', function() {
        browser.get(qaData.url);

        expect(appPO.getNextStepButtonAttribute('class')).toMatch('disabled');

        browser.driver.sleep(10000);
        venueMapPO.selectZone(qaData.graphicNumberedZone);
        browser.driver.sleep(4000);
        venueMapPO.select3DNumberedSeats(0, 2, true);

        expect(appPO.getNextStepButtonAttribute('class')).not.toMatch('disabled');
    });

    it('Verificamos que la localidad aparece correctamente en el summary', function(){
        //Verificamos que en el summary aparecen dos localidades seleccionadas, el nombre del sector, y el precio de estas localidades
        appPO.browserScrollTo(0, 0);

        summaryPO.expandSummary();
        expect(summaryPO.getNumberSeatsSelected()).toEqual('Localidades (2)');
        expect(summaryPO.getSeatsSelectedSectors().count()).toBe(2);
        expect(summaryPO.getSectorPriceZoneName(0)).toEqual(qaData.sectorPriceZoneName);

        summaryPO.getSeatsSelectedPrices().getText().then(function(seatsSelectedPrices){
            for(var i = 0; i < seatsSelectedPrices.length; i++){
                expect(seatsSelectedPrices[i]).toEqual(qaData.totalPrice);
            }
        });
        summaryPO.collapseSummary();
    });

    it('Accedemos a la pantalla de validate cart y verificamos que los datos son correctos', function(){
        //Verificamos que sea correcta la fecha de la sesión, el número de localidades seleccionadas y el precio final
        siteCartPO.expandCollapseSiteCart();
        siteCartPO.validateCart();

        expect(validateCartPO.getTotalSessionsSelected()).toBe(1);

        expect(validateCartPO.getSessionDate(qaData.sessionId, 0)).toEqual(qaData.sessionDate);
        expect(validateCartPO.getNumberSessionTicketsSelected(qaData.sessionId)).toEqual('2 Entradas');
        expect(validateCartPO.getTotalPrice()).toEqual(qaData.finalPrice);

        validateCartPO.deleteAllSessionTickets(qaData.sessionId, 'delete');
    });
});