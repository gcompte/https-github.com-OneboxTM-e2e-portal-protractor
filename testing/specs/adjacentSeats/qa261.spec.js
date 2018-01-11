var VenueMapPO = require('./../../page-objects/venue-map.po.js'),
    VenueNavPO = require('./../../page-objects/venue-nav.po.js'),
    SelectLocationsPO = require('./../../page-objects/select-locations.po.js'),
    AppPO = require('./../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa261;

describe('QA-261 Comportamiento avisos localidades no contiguas en Z.Numerada', function() {
    var seatsSelected = browser.params.seatsSelected;

    //Accedemos a una sesión del evento con recinto gráfico
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.url);
    });

    it('Seleccionamos dos localidades de una misma zona de precio y verificamos que no muestra ningún mensaje de butacas no contiguas', function(){
        if(browser.params.device === 'mobile'){
            browser.driver.sleep(2000);
            SelectLocationsPO.changeSelectedMode();
            AppPO.browserScrollTo(0, 500);
        }

        VenueMapPO.selectZone(qaData.firstGraphicNumberedZone);

        VenueMapPO.selectNumberedSeats(2, true); //firstSeat, numberOfSeats, adjacentSeats

        expect(AppPO.getAdjacentWarnings('selectlocations').count()).toBe(0);
    });

    it('Deseleccionamos una de las localidades', function(){
        VenueMapPO.selectUnselectSeat(seatsSelected[1], 'unselect');
        seatsSelected.pop(seatsSelected[1]);

        expect(AppPO.getAdjacentWarnings('selectlocations').count()).toBe(0);
    });

    it('Seleccionamos otra localidad, en la misma zona de precio, pero no contigua a la anterior', function(){
        VenueMapPO.selectNumberedSeats(1, false);

        expect(AppPO.getAdjacentWarnings('selectlocations').count()).toBe(1);
        expect(AppPO.getAdjacentWarnings('selectlocations').get(0).getText()).toEqual(qaData.notAdjacentSeatsMessage);
    });

    it('Deseleccionamos de nuevo una de las localidades', function(){
        VenueMapPO.selectUnselectSeat(seatsSelected[1], 'unselect');
        seatsSelected.pop(seatsSelected[1]);

        expect(AppPO.getAdjacentWarnings('selectlocations').count()).toBe(0);
    });

    it('Seleccionamos otra localidad en una zona de precio distinta', function(){
        VenueNavPO.mapGoBack();

        VenueMapPO.selectZone(qaData.secondGraphicNumberedZone);
        VenueMapPO.selectNumberedSeats(1, true);

        expect(AppPO.getAdjacentWarnings('selectlocations').count()).toBe(1);
        expect(AppPO.getAdjacentWarnings('selectlocations').get(0).getText()).toEqual(qaData.notAdjacentSeatsMessage);
    });

    it('Deseleccionamos de nuevo una de las localidades', function(){
        VenueMapPO.selectUnselectSeat(seatsSelected[1], 'unselect');
        seatsSelected.pop(seatsSelected[1]);

        expect(AppPO.getAdjacentWarnings('selectlocations').count()).toBe(0);
    });
});