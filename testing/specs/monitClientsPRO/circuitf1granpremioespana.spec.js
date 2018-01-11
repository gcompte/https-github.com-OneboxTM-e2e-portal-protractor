var VenueMapPO = require('./../../page-objects/venue-map.po.js'),
    VenueNavPO = require('./../../page-objects/venue-nav.po.js'),
    SummaryPO = require('./../../page-objects/summary.po.js'),
    SiteCartPO = require('./../../page-objects/site-cart.po.js'),
    ValidateCartPO = require('./../../page-objects/validate-cart.po.js'),
    AppPO = require('./../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../generic-data.json'),
    qaData = require('./suite-data.json').circuitf1granpremioespana;


describe('QAA-1402 Circuit de Barcelona - F1 Gran Premio de España 2017', function() {
    var venueMapPO = new VenueMapPO(),
        venueNavPO = new VenueNavPO(),
        summaryPO = new SummaryPO(),
        siteCartPO = new SiteCartPO(),
        validateCartPO = new ValidateCartPO(),
        appPO = new AppPO();

    it('Accedemos a una sesión y seleccionamos dos localidades', function() {
        browser.get(qaData.url);
        expect(appPO.getNextStepButtonAttribute('class')).toMatch('disabled');

        browser.driver.sleep(2000);
        venueMapPO.selectZone(qaData.firstGraphicNumberedZone);
        venueMapPO.selectZone(qaData.secondGraphicNumberedZone);
        venueMapPO.selectNumberedSeats(1, true);
        venueNavPO.mapGoBack();
        venueNavPO.mapGoBack();

        venueMapPO.selectIrregularZone(qaData.graphicNoNumberedZone);
        venueMapPO.selectNoNumberedSeats(1);

        expect(appPO.getNextStepButtonAttribute('class')).not.toMatch('disabled');
    });

    it('Verificamos que la localidad aparece correctamente en el summary', function(){
        //Verificamos que en el summary aparecen dos localidades seleccionadas, el nombre del sector, y el precio de estas localidades
        summaryPO.expandSummary();
        expect(summaryPO.getNumberSeatsSelected()).toEqual('Localidades (2)');
        expect(summaryPO.getSeatsSelectedSectors().count()).toBe(2);

        //No verificamos el nombre del sector ya que será variable, porque en una misma vista del mapa se incluyen las butacas de varios sectores.

        summaryPO.getSeatsSelectedPrices().getText().then(function(seatsSelectedPrices){
            for(var i = 0; i < seatsSelectedPrices.length; i++){
                expect(seatsSelectedPrices[i]).toEqual(qaData.totalPrice[i]);
            }
        });
        summaryPO.collapseSummary();
    });

    it('Accedemos a la pantalla de validate cart y verificamos que los datos son correctos', function(){
        //Verificamos que sea correcta la fecha de la sesión, el número de localidades seleccionadas, el precio de cada una de las localidades y el precio final
        siteCartPO.expandCollapseSiteCart();
        siteCartPO.validateCart();

        expect(validateCartPO.getTotalSessionsSelected()).toBe(1);

        expect(validateCartPO.getSessionDate(qaData.sessionId, 0)).toEqual(qaData.sessionDate);
        expect(validateCartPO.getNumberSessionTicketsSelected(qaData.sessionId)).toEqual('2 Entradas');
        validateCartPO.getSessionSeatsSelectedInfo(qaData.sessionId, 'ticket.price.finalPrice').getText().then(function(sessionSeatsSelectedPrices){
            for(var i = 0; i < sessionSeatsSelectedPrices.length; i++){
                expect(sessionSeatsSelectedPrices[i]).toEqual(qaData.totalPrice[i]);
            }
        });
        expect(validateCartPO.getTotalPrice()).toEqual(qaData.finalPrice);

        validateCartPO.deleteAllSessionTickets(qaData.sessionId, 'delete');
    });
});