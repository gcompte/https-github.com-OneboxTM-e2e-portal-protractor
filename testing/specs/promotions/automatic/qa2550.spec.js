var VenueNoMapPO = require('./../../../page-objects/venue-no-map.po.js'),
    SelectLocationsPO = require('./../../../page-objects/select-locations.po.js'),
    SummaryPO = require('./../../../page-objects/summary.po.js');

var env = browser.params.env,
    genericData = require('./../../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa2550;

describe('QA-2550 Promoción automática con recargos alternativos de organizador y de canal - Incentivo porcentual', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.sessionUrl);
    });

    it('Accedemos a la selección de localidades de una sesión que tenga una promoción automática activa y seleccionamos una localidad', function() {
        VenueNoMapPO.selectNoGraphicSeats(qaData.noGraphicZone, 1);
    });

    it('Verificamos que el precio final y el desglose es correcto', function() {
        SummaryPO.getSummaryBreakdown().then(function(summaryBreakdown){
            for(var i = 0; i < summaryBreakdown.length; i++){
                expect(summaryBreakdown[i].getText()).toEqual(qaData.breakdownPrice[i]);
            }
        });

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.breakdownPrice[qaData.breakdownPrice.length-1]);
        expect(SummaryPO.getTicketsBasePrice()).toEqual(qaData.basePrice);

        if(browser.params.device === 'mobile'){
            expect(SelectLocationsPO.getFinalPriceAmount()).toEqual(qaData.breakdownPrice[qaData.breakdownPrice.length-1]);
        }
    });
});