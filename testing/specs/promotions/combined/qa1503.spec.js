var VenueMapPO = require('./../../../page-objects/venue-map.po.js'),
    VenueNoMapPO = require('./../../../page-objects/venue-no-map.po.js'),
    SummaryPO = require('./../../../page-objects/summary.po.js'),
    SelectLocationsPO = require('./../../../page-objects/select-locations.po.js'),
    PromotionsPO = require('./../../../page-objects/promotions.po.js'),
    AppPO = require('./../../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa1503;

describe('QA-1503 Entrada con promociones (descuento y promoción) - Rangos de precios', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.sessionUrl);
    });

    it('Accedemos a la selección de localidades de una sesión que tenga 2 promociones (descuento y promoción) activas y seleccionamos una localidad', function() {
        browser.driver.sleep(2000);

        if(browser.params.device === 'mobile'){
            VenueNoMapPO.selectNoGraphicSeats(qaData.noGraphicNumberedZone, 1);
        }else{
            browser.driver.sleep(3000);
            VenueMapPO.selectZone(qaData.graphicNumberedZone);
            VenueMapPO.selectNumberedSeats(1, true);
        }
    });

    it('Aplicamos la promoción tipo descuento', function(){
        browser.driver.sleep(2000);
        if(browser.params.device === 'mobile'){
            AppPO.browserScrollTo(0, 1200);
        }

        PromotionsPO.selectPromotionByPosition(0);
        PromotionsPO.applyPromotionSeats(1);
    });

    it('Verificamos que el precio y el desglose de este son correctos cuando aplicamos la promoción descuento', function() {
        SummaryPO.getSummaryBreakdown().then(function(summaryBreakdown){
            for(var i = 0; i < summaryBreakdown.length; i++){
                expect(summaryBreakdown[i].getText()).toEqual(qaData.breakdownPriceDesc[i]);
            }
        });

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.breakdownPriceDesc[qaData.breakdownPriceDesc.length-1]);

        if(browser.params.device === 'mobile'){
            expect(SelectLocationsPO.getFinalPriceAmount()).toEqual(qaData.breakdownPriceDesc[qaData.breakdownPriceDesc.length-1]);
        }
    });

    it('Aplicamos la promoción tipo promoción', function(){
        if(browser.params.device === 'mobile'){
            PromotionsPO.seeAllPromotions(0);
        }

        PromotionsPO.selectPromotionByPosition(1);
        PromotionsPO.applyPromotionSeats(1);
    });

    it('Verificamos que el precio y el desglose de este son correctos cuando aplicamos las dos promociones (en este orden, descuento --> promoción)', function() {
        SummaryPO.getSummaryBreakdown().then(function(summaryBreakdown){
            for(var i = 0; i < summaryBreakdown.length; i++){
                expect(summaryBreakdown[i].getText()).toEqual(qaData.breakdownPricePromoDesc[i]);
            }
        });

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.breakdownPricePromoDesc[qaData.breakdownPricePromoDesc.length-1]);

        if(browser.params.device === 'mobile'){
            expect(SelectLocationsPO.getFinalPriceAmount()).toEqual(qaData.breakdownPricePromoDesc[qaData.breakdownPricePromoDesc.length-1]);
        }
    });

    it('Des-aplicamos la promoción tipo descuento', function(){
        if(browser.params.device === 'mobile'){
            PromotionsPO.seeAllPromotions(1);
        }

        PromotionsPO.selectPromotionByPosition(0);
        PromotionsPO.applyPromotionSeats(1);
    });

    it('Verificamos que el precio y el desglose de este son correctos cuando solo tenemos aplicada la promoción tipo promoción', function() {
        SummaryPO.getSummaryBreakdown().then(function(summaryBreakdown){
            for(var i = 0; i < summaryBreakdown.length; i++){
                expect(summaryBreakdown[i].getText()).toEqual(qaData.breakdownPricePromo[i]);
            }
        });

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.breakdownPricePromo[qaData.breakdownPricePromo.length-1]);

        if(browser.params.device === 'mobile'){
            expect(SelectLocationsPO.getFinalPriceAmount()).toEqual(qaData.breakdownPricePromo[qaData.breakdownPricePromo.length-1]);
        }
    });

    it('Volvemos a aplicar la promoción tipo descuento', function(){
        if(browser.params.device !== 'mobile'){
            PromotionsPO.selectPromotionByPosition(0);
        }

        PromotionsPO.applyPromotionSeats(1);
    });

    it('Verificamos que el precio y el desglose de este son correctos cuando aplicamos las dos promociones (en este orden, promoción --> descuento)', function() {
        SummaryPO.getSummaryBreakdown().then(function(summaryBreakdown){
            for(var i = 0; i < summaryBreakdown.length; i++){
                expect(summaryBreakdown[i].getText()).toEqual(qaData.breakdownPricePromoDesc[i]);
            }
        });

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.breakdownPricePromoDesc[qaData.breakdownPricePromoDesc.length-1]);

        if(browser.params.device === 'mobile'){
            expect(SelectLocationsPO.getFinalPriceAmount()).toEqual(qaData.breakdownPricePromoDesc[qaData.breakdownPricePromoDesc.length-1]);
        }
    });
});