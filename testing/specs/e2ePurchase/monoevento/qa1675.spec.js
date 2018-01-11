var VenueNoMapPO = require('./../../../page-objects/venue-no-map.po.js'),
    SummaryPO = require('./../../../page-objects/summary.po.js'),
    AppPO = require('./../../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa1675;

describe('QA-1675 [Portal 3.0] [Monoevento] Selección de localidades en recinto no gráfico', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.url);
    });

    it('Accedemos a un evento, seleccionamos una sesión con recinto no gráfico y seleccionamos una localidad', function() {
        expect(VenueNoMapPO.getPriceZones().count()).toBe(qaData.totalPriceZones);
        expect(VenueNoMapPO.getPriceZonePromotion(qaData.firstNoGraphicZone)).toEqual(qaData.automaticPromotion);
        expect(AppPO.getNextStepButtonAttribute('class')).toMatch('disabled');

        VenueNoMapPO.selectNoGraphicSeats(qaData.firstNoGraphicZone, 1);

        expect(AppPO.getNextStepButtonAttribute('class')).not.toMatch('disabled');
    });

    it('Verificamos que la localidad aparece correctamente en el summary', function(){
        expect(SummaryPO.getTicketsInfo(qaData.sessionId)).toEqual(qaData.ticketsInfo);
        expect(SummaryPO.getFinalPrice()).toEqual(qaData.finalPrice);
    });
});