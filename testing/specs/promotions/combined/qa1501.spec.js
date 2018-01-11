var VenueMapPO = require('./../../../page-objects/venue-map.po.js'),
    VenueNavPO = require('./../../../page-objects/venue-nav.po.js'),
    SummaryPO = require('./../../../page-objects/summary.po.js'),
    SelectLocationsPO = require('./../../../page-objects/select-locations.po.js'),
    PromotionsPO = require('./../../../page-objects/promotions.po.js'),
    AppPO = require('./../../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa1501;

describe('QA-1501 Compra con promociones 3 promociones: automática, promoción y descuento', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.sessionUrl);
    });

    it('Accedemos a la selección de localidades de una sesión que tenga 3 promociones (automática, descuento y promoción) activas y seleccionamos una localidad', function() {
        if(browser.params.device === 'mobile'){
            SelectLocationsPO.changeSelectedMode();
        }

        browser.driver.sleep(3000);
        VenueMapPO.selectZone(qaData.graphicNoNumberedZone, '', qaData.graphicZoneCoordenates);
        VenueMapPO.selectNoNumberedSeats(1);

        browser.driver.sleep(3000);
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

    it('Aplicamos la promoción tipo promoción', function(){
        if(browser.params.device === 'mobile'){
            AppPO.browserScrollTo(0, 2000);
        }

        browser.driver.sleep(3000);

        PromotionsPO.selectPromotionByPosition(1);
        PromotionsPO.applyPromotionSeats(1);
    });

    it('Verificamos que el precio y el desglose de este son correctos cuando aplicamos la promoción tipo promoción además de la automática', function() {
        SummaryPO.getSummaryBreakdown().then(function(summaryBreakdown){
            for(var i = 0; i < summaryBreakdown.length; i++){
                expect(summaryBreakdown[i].getText()).toEqual(qaData.breakdownPriceAutoPromo[i]);
            }
        });
        expect(SummaryPO.getFinalPrice()).toEqual(qaData.breakdownPriceAutoPromo[qaData.breakdownPriceAutoPromo.length-1]);

        if(browser.params.device === 'mobile'){
            expect(SelectLocationsPO.getFinalPriceAmount()).toEqual(qaData.breakdownPriceAutoPromo[qaData.breakdownPriceAutoPromo.length-1]);
        }
    });

    it('Aplicamos la promoción tipo descuento', function(){
        if(browser.params.device === 'mobile'){
            PromotionsPO.seeAllPromotions(1);
        }

        PromotionsPO.selectPromotionByPosition(0);
        PromotionsPO.applyPromotionSeats(1);
    });

    it('Verificamos que el precio y el desglose de este son correctos cuando tenemos aplicadas las tres promociones (en este orden, automática --> promoción --> descuento', function() {
        SummaryPO.getSummaryBreakdown().then(function(summaryBreakdown){
            for(var i = 0; i < summaryBreakdown.length; i++){
                expect(summaryBreakdown[i].getText()).toEqual(qaData.breakdownPriceAutoDescPromo[i]);
            }
        });

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.breakdownPriceAutoDescPromo[qaData.breakdownPriceAutoDescPromo.length-1]);

        if(browser.params.device === 'mobile'){
            expect(SelectLocationsPO.getFinalPriceAmount()).toEqual(qaData.breakdownPriceAutoDescPromo[qaData.breakdownPriceAutoDescPromo.length-1]);
        }
    });

    it('Des-aplicamos la promoción tipo promoción', function(){
        if(browser.params.device === 'mobile'){
            PromotionsPO.seeAllPromotions(0);
        }

        PromotionsPO.selectPromotionByPosition(1);
        PromotionsPO.applyPromotionSeats(1);
    });

    it('Verificamos que el precio y el desglose de este son correctos cuando tenemos aplicada la automática y el descuento', function() {
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

    it('Volvemos a aplicar la promoción tipo promoción', function(){
        if(browser.params.device !== 'mobile'){
            PromotionsPO.selectPromotionByPosition(1);
        }

        PromotionsPO.applyPromotionSeats(1);
    });

    it('Verificamos que el precio y el desglose de este son correctos cuando tenemos aplicadas las tres promociones (en este orden, automática --> descuento --> promoción', function() {
        SummaryPO.getSummaryBreakdown().then(function(summaryBreakdown){
            for(var i = 0; i < summaryBreakdown.length; i++){
                expect(summaryBreakdown[i].getText()).toEqual(qaData.breakdownPriceAutoDescPromo[i]);
            }
        });

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.breakdownPriceAutoDescPromo[qaData.breakdownPriceAutoDescPromo.length-1]);

        if(browser.params.device === 'mobile'){
            expect(SelectLocationsPO.getFinalPriceAmount()).toEqual(qaData.breakdownPriceAutoDescPromo[qaData.breakdownPriceAutoDescPromo.length-1]);
        }
    });
});