var VenueNoMapPO = require('./../../../page-objects/venue-no-map.po.js'),
    SummaryPO = require('./../../../page-objects/summary.po.js'),
    PromotionsPO = require('./../../../page-objects/promotions.po.js'),
    SelectLocationsPO = require('./../../../page-objects/select-locations.po.js'),
    AppPO = require('./../../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa1502;

describe('QA-1502 Entrada con promociones (automática y descuento) - Rangos de precios', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.sessionUrl);
    });

    it('Accedemos a la selección de localidades de una sesión que tenga una promoción automática y una promoción tipo descuento activas y seleccionamos una localidad', function() {
        browser.driver.sleep(2000);
        VenueNoMapPO.selectNoGraphicSeats(qaData.noGraphicZone, 1);
    });

    it('Verificamos que el precio y el desglose de este son correctos cuando aplicamos la promoción automática', function() {
        SummaryPO.getSummaryBreakdown().then(function(summaryBreakdown){
            for(var i = 0; i < summaryBreakdown.length; i++){
                expect(summaryBreakdown[i].getText()).toEqual(qaData.breakdownPriceAuto[i]);
            }
        });

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.breakdownPriceAuto[qaData.breakdownPriceAuto.length-1]);

        if(browser.params.device === 'mobile'){
            expect(SelectLocationsPO.getFinalPriceAmount()).toEqual(qaData.breakdownPriceAuto[qaData.breakdownPriceAuto.length-1]);
        }
    });

    it('Aplicamos la promoción tipo descuento', function(){
        if(browser.params.device === 'mobile'){
            AppPO.browserScrollTo(0, 2000);
        }
        browser.driver.sleep(2000);

        PromotionsPO.selectPromotionByPosition(0);
        PromotionsPO.applyPromotionSeats(1);
    });

    it('Verificamos que el precio y el desglose de este son correctos cuando aplicamos la promoción tipo descuento además de la automática', function() {
        SummaryPO.getSummaryBreakdown().then(function(summaryBreakdown){
            for(var i = 0; i < summaryBreakdown.length; i++){
                expect(summaryBreakdown[i].getText()).toEqual(qaData.breakdownPriceAutoDesc[i]);
            }
        });

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.breakdownPriceAutoDesc[qaData.breakdownPriceAutoDesc.length-1]);

        if(browser.params.device === 'mobile'){
            expect(SelectLocationsPO.getFinalPriceAmount()).toEqual(qaData.breakdownPriceAutoDesc[qaData.breakdownPriceAutoDesc.length-1]);
        }
    });
});