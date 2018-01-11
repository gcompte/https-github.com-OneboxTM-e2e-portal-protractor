var VenueMapPO = require('./../../page-objects/venue-map.po.js'),
    SummaryPO = require('./../../page-objects/summary.po.js'),
    SiteCartPO = require('./../../page-objects/site-cart.po.js'),
    AppPO = require('./../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../generic-data.json'),
    qaData = require('./suite-data.json').campeonatoligamalagacf;


describe('QAA-1401 Málaga CF - Campeonato de Liga 2016-17 M WS', function() {
    var venueMapPO = new VenueMapPO(),
        summaryPO = new SummaryPO(),
        siteCartPO = new SiteCartPO(),
        appPO = new AppPO();

    it('Accedemos a una sesión y seleccionamos dos localidades', function() {
        browser.get(qaData.url);

        expect(appPO.getNextStepButtonAttribute('class')).toMatch('disabled');

        browser.driver.sleep(2000);
        venueMapPO.selectZone(qaData.firstGraphicNumberedZone);
        venueMapPO.selectZone(qaData.secondGraphicNumberedZone);
        venueMapPO.selectNumberedSeats(2, true);

        expect(appPO.getNextStepButtonAttribute('class')).not.toMatch('disabled');
    });

    it('Verificamos que la localidad aparece correctamente en el summary', function(){
        //Verificamos que en el summary aparecen dos localidades seleccionadas, el nombre del sector, y el precio de estas localidades
        expect(summaryPO.getTotalPrice()).toEqual(qaData.finalPrice);
        summaryPO.expandSummary();
        expect(summaryPO.getNumberSeatsSelected()).toEqual('Localidades (2)');
        expect(summaryPO.getSeatsSelectedSectors().count()).toBe(2);
        expect(summaryPO.getSectorPriceZoneName(0)).toEqual(qaData.sectorPriceZoneName);
        expect(summaryPO.getSessionDate(qaData.eventId)).toEqual(qaData.sessionDate);

        summaryPO.getSeatsSelectedPrices().getText().then(function(seatsSelectedPrices){
            for(var i = 0; i < seatsSelectedPrices.length; i++){
                expect(seatsSelectedPrices[i]).toEqual(qaData.totalPrice);
            }
        });


        summaryPO.deleteSeatSelected(0, 'delete');
        summaryPO.deleteSeatSelected(0, 'delete');
    });
});