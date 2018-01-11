var VenueMapPO = require('./../../page-objects/venue-map.po.js'),
    SummaryPO = require('./../../page-objects/summary.po.js'),
    SelectLocationsPO = require('./../../page-objects/select-locations.po.js'),
    AppPO = require('./../../page-objects/app.po.js');

var genericData = require('./../generic-data.json'),
    qaData = require('./suite-data.' + browser.params.env + '.json').qa267;

describe('QA-267 Verificar funcionamiento de Zona no numerada en mapa de butacas', function() {
    //Accedemos a una sesión del evento con recinto gráfico
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.url);
    });

    it('Seleccionamos localidades de la zona no numerada, y verificamos que se han seleccionado correctamente', function(){
        if(browser.params.device === 'mobile'){
            browser.driver.sleep(3000);
            AppPO.browserScrollTo(0, 0).then(function(){
                SelectLocationsPO.changeSelectedMode();
            });
        };

        VenueMapPO.selectZone(qaData.graphicNumberedZone);
        VenueMapPO.selectZone(qaData.graphicNoNumberedZone);
        VenueMapPO.selectNoNumberedSeats(qaData.seatsToSelect);

        expect(SummaryPO.getTicketsInfo(qaData.sessionId)).toEqual(qaData.ticketsInfo);
        expect(SummaryPO.getFinalPrice()).toEqual(qaData.finalPrice);
    });
});