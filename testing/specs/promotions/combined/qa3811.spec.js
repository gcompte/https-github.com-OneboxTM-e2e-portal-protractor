var VenueMapPO = require('./../../../page-objects/venue-map.po.js'),
    SummaryPO = require('./../../../page-objects/summary.po.js'),
    VenueNoMapPO = require('./../../../page-objects/venue-no-map.po.js'),
    PromotionsPO = require('./../../../page-objects/promotions.po.js'),
    SelectLocationsPO = require('./../../../page-objects/select-locations.po.js'),
    AppPO = require('./../../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa3811;

describe('QA-3811 Validar algoritmo aplicación promociones sin las autogestionables', function() {
    it('Seleccionamos una localidad con 3 promociones disponibles y verificamos el precio al aplicar automática, descuento y promoción', function() {
        browser.get(browser.baseUrl + qaData.sessionInfo[0].sessionUrl);

        if(browser.params.device === 'mobile'){
            VenueNoMapPO.selectNoGraphicSeats(qaData.noGraphicNoNumberedZone, 1);
        }else{
            browser.driver.sleep(4000);
            VenueMapPO.selectZone(qaData.graphicNoNumberedZone, '', qaData.graphicZoneCoordenates);
            VenueMapPO.selectNoNumberedSeats(1);     
        }

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.sessionInfo[0].finalPrice[0]);

        if(browser.params.device === 'mobile'){
            PromotionsPO.seeAllPromotions(1);
        }
        PromotionsPO.selectPromotionByPosition(0);
        PromotionsPO.applyPromotionSeats(1);

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.sessionInfo[0].finalPrice[1]);

        PromotionsPO.selectPromotionByPosition(1);
        PromotionsPO.applyPromotionSeats(1);

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.sessionInfo[0].finalPrice[2]);

        SummaryPO.deleteSeatBySessionAndPosition(qaData.sessionInfo[0].sessionId, 0, 'delete');
    });

    it('Seleccionamos una localidad con 2 promociones disponibles y verificamos el precio al aplicar descuento y promoción', function() {
        browser.get(browser.baseUrl + qaData.sessionInfo[1].sessionUrl);

        if(browser.params.device === 'mobile'){
            VenueNoMapPO.selectNoGraphicSeats(qaData.noGraphicNoNumberedZone, 1);
        }else{
            browser.driver.sleep(4000);
            VenueMapPO.selectZone(qaData.graphicNoNumberedZone, '', qaData.graphicZoneCoordenates);
            VenueMapPO.selectNoNumberedSeats(1);     
        }

        if(browser.params.device === 'mobile'){
            PromotionsPO.seeAllPromotions(1);
        }
        PromotionsPO.selectPromotionByPosition(0);
        PromotionsPO.applyPromotionSeats(1);

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.sessionInfo[1].finalPrice[0]);

        PromotionsPO.selectPromotionByPosition(1);
        PromotionsPO.applyPromotionSeats(1);

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.sessionInfo[1].finalPrice[1]);

        SummaryPO.deleteSeatBySessionAndPosition(qaData.sessionInfo[1].sessionId, 0, 'delete');
    });
    
    it('Seleccionamos una localidad con 2 promociones disponibles y verificamos el precio al aplicar automática y promoción', function() {
        browser.get(browser.baseUrl + qaData.sessionInfo[2].sessionUrl);

        if(browser.params.device === 'mobile'){
            VenueNoMapPO.selectNoGraphicSeats(qaData.noGraphicNoNumberedZone, 1);
        }else{
            browser.driver.sleep(4000);
            VenueMapPO.selectZone(qaData.graphicNoNumberedZone, '', qaData.graphicZoneCoordenates);
            VenueMapPO.selectNoNumberedSeats(1);     
        }

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.sessionInfo[2].finalPrice[0]);

        if(browser.params.device === 'mobile'){
            PromotionsPO.seeAllPromotions(1);
        }
        PromotionsPO.selectPromotionByPosition(0);
        PromotionsPO.applyPromotionSeats(1);

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.sessionInfo[2].finalPrice[1]);

        SummaryPO.deleteSeatBySessionAndPosition(qaData.sessionInfo[2].sessionId, 0, 'delete');
    });
    
    it('Seleccionamos una localidad con 2 promociones disponibles y verificamos el precio al aplicar automática y descuento', function() {
        browser.get(browser.baseUrl + qaData.sessionInfo[3].sessionUrl);

        if(browser.params.device === 'mobile'){
            VenueNoMapPO.selectNoGraphicSeats(qaData.noGraphicNoNumberedZone, 1);
        }else{
            browser.driver.sleep(4000);
            VenueMapPO.selectZone(qaData.graphicNoNumberedZone, '', qaData.graphicZoneCoordenates);
            VenueMapPO.selectNoNumberedSeats(1);     
        }

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.sessionInfo[3].finalPrice[0]);

        if(browser.params.device === 'mobile'){
            PromotionsPO.seeAllPromotions(1);
        }
        PromotionsPO.selectPromotionByPosition(0);
        PromotionsPO.applyPromotionSeats(1);

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.sessionInfo[3].finalPrice[1]);

        SummaryPO.deleteSeatBySessionAndPosition(qaData.sessionInfo[3].sessionId, 0, 'delete');
    });

    it('Seleccionamos una localidad con 3 promociones disponibles y verificamos el precio al aplicar automática, promoción y descuento', function() {
        browser.get(browser.baseUrl + qaData.sessionInfo[4].sessionUrl);

        if(browser.params.device === 'mobile'){
            VenueNoMapPO.selectNoGraphicSeats(qaData.noGraphicNoNumberedZone, 1);
        }else{
            browser.driver.sleep(4000);
            VenueMapPO.selectZone(qaData.graphicNoNumberedZone, '', qaData.graphicZoneCoordenates);
            VenueMapPO.selectNoNumberedSeats(1);     
        }

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.sessionInfo[4].finalPrice[0]);

        if(browser.params.device === 'mobile'){
            PromotionsPO.seeAllPromotions(1);
        }
        PromotionsPO.selectPromotionByPosition(1);
        PromotionsPO.applyPromotionSeats(1);

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.sessionInfo[4].finalPrice[1]);

        PromotionsPO.selectPromotionByPosition(0);
        PromotionsPO.applyPromotionSeats(1);

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.sessionInfo[4].finalPrice[2]);

        SummaryPO.deleteSeatBySessionAndPosition(qaData.sessionInfo[4].sessionId, 0, 'delete');
    });

    it('Seleccionamos una localidad con 3 promociones disponibles y verificamos el precio al aplicar automática, descuento y promoción', function() {
        browser.get(browser.baseUrl + qaData.sessionInfo[5].sessionUrl);

        if(browser.params.device === 'mobile'){
            VenueNoMapPO.selectNoGraphicSeats(qaData.noGraphicNoNumberedZone, 1);
        }else{
            browser.driver.sleep(4000);
            VenueMapPO.selectZone(qaData.graphicNoNumberedZone, '', qaData.graphicZoneCoordenates);
            VenueMapPO.selectNoNumberedSeats(1);     
        }

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.sessionInfo[5].finalPrice[0]);

        if(browser.params.device === 'mobile'){
            PromotionsPO.seeAllPromotions(1);
        }
        PromotionsPO.selectPromotionByPosition(0);
        PromotionsPO.applyPromotionSeats(1);

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.sessionInfo[5].finalPrice[1]);

        PromotionsPO.selectPromotionByPosition(1);
        PromotionsPO.applyPromotionSeats(1);

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.sessionInfo[5].finalPrice[2]);

        SummaryPO.deleteSeatBySessionAndPosition(qaData.sessionInfo[5].sessionId, 0, 'delete');
    });

    it('Seleccionamos una localidad con 3 promociones disponibles y verificamos el precio al aplicar automática, descuento y promoción', function() {
        browser.get(browser.baseUrl + qaData.sessionInfo[6].sessionUrl);

        if(browser.params.device === 'mobile'){
            VenueNoMapPO.selectNoGraphicSeats(qaData.noGraphicNoNumberedZone, 1);
        }else{
            browser.driver.sleep(4000);
            VenueMapPO.selectZone(qaData.graphicNoNumberedZone, '', qaData.graphicZoneCoordenates);
            VenueMapPO.selectNoNumberedSeats(1);     
        }

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.sessionInfo[6].finalPrice[0]);

        if(browser.params.device === 'mobile'){
            PromotionsPO.seeAllPromotions(1);
        }
        PromotionsPO.selectPromotionByPosition(0);
        PromotionsPO.applyPromotionSeats(1);

        SummaryPO.getSummaryBreakdown().then(function(summaryBreakdown){
            for(var i = 0; i < summaryBreakdown.length; i++){
                expect(summaryBreakdown[i].getText()).toEqual(qaData.sessionInfo[6].breakdownPrice[i]);
            }
        });

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.sessionInfo[6].finalPrice[1]);
    });
});