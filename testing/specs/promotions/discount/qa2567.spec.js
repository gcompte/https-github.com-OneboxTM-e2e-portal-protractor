var VenueMapPO = require('./../../../page-objects/venue-map.po.js'),
    SummaryPO = require('./../../../page-objects/summary.po.js'),
    SelectLocationsPO = require('./../../../page-objects/select-locations.po.js'),
    PromotionsPO = require('./../../../page-objects/promotions.po.js'),
    AppPO = require('./../../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa2567;

describe('QA-2567 Promoción descuento con recargos alternativos de organizador y de canal - Nuevo Precio', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.sessionUrl);
    });

    it('Accedemos a la selección de localidades de una sesión que tenga una promoción tipo descuento activa y seleccionamos una localidad', function() {
        if(browser.params.device === 'mobile'){
            SelectLocationsPO.changeSelectedMode();
        }

        browser.driver.sleep(3000);
        VenueMapPO.selectZone(qaData.graphicNoNumberedZone, '', qaData.graphicZoneCoordenates);
        VenueMapPO.selectNoNumberedSeats(1);
    });

    it('Aplicamos la promoción descuento deseada', function(){
        browser.driver.sleep(3000);
        if(browser.params.device === 'mobile'){
            AppPO.browserScrollTo(0, 3000);
        }
        
        PromotionsPO.selectPromotionByPosition(0);
        PromotionsPO.applyPromotionSeats(1);
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