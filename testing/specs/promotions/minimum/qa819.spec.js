var VenueNoMapPO = require('./../../../page-objects/venue-no-map.po.js'),
    SummaryPO = require('./../../../page-objects/summary.po.js'),
    PromotionsPO = require('./../../../page-objects/promotions.po.js'),
    SelectLocationsPO = require('./../../../page-objects/select-locations.po.js'),
    AppPO = require('./../../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa819;

describe('QA-819 Aplicar Descuento con restricción de Número mínimo para poder aplicar a toda la compra y límite máximo de entradas para esta promoción con incentivo porcentual', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.sessionUrl);
    });

    it('Accedemos a una sesión y seleccionamos dos localidades', function() {
        expect(AppPO.getNextStepButtonAttribute('class')).toMatch('disabled');

        VenueNoMapPO.selectNoGraphicSeats(qaData.noGraphicZone, 2);

        expect(AppPO.getNextStepButtonAttribute('class')).not.toMatch('disabled');
    });

    it('Desplegamos el acordeón de promociones y aplicamos la promoción', function(){
        browser.driver.sleep(2000);
        PromotionsPO.isApplicablePromotion(0).then(function(isApplicablePromotion){
            if(isApplicablePromotion){
                if(browser.params.device === 'mobile'){
                    AppPO.browserScrollTo(0, 1300);
                    PromotionsPO.selectPromotionByPosition(0);
                }else{
                    AppPO.browserScrollTo(0, 600);
                }
                browser.driver.sleep(1000);
                PromotionsPO.applyMinPromotion(0);
            }else{
                expect(PromotionsPO.isApplicablePromotion(0)).toBe(true);
            }
        });
    });

    it('Verificamos que la promoción se aplica a todas las localidades y que los precios son correctos', function() {
        SummaryPO.getSummaryBreakdown().then(function(summaryBreakdown){
            for(var i = 0; i < summaryBreakdown.length; i++){
                expect(summaryBreakdown[i].getText()).toEqual(qaData.summarySelection[0].breakdown[i]);
            }
        });

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.summarySelection[0].breakdown[qaData.summarySelection[0].breakdown.length-1]);
        expect(SummaryPO.getTicketsBasePrice()).toEqual(qaData.summarySelection[0].basePrice);

        if(browser.params.device === 'mobile'){
            expect(SelectLocationsPO.getFinalPriceAmount()).toEqual(qaData.summarySelection[0].breakdown[qaData.summarySelection[0].breakdown.length-1]);
        }
    });

    it('Seleccionamos cinco localidades más y verificamos que no se aplica la promoción a las nuevas, ya que hemos superado el límite', function(){
        AppPO.browserScrollTo(0, 0);
        VenueNoMapPO.selectNoGraphicSeats(qaData.noGraphicZone, 7);

        SummaryPO.getSummaryBreakdown().then(function(summaryBreakdown){
            for(var i = 0; i < summaryBreakdown.length; i++){
                expect(summaryBreakdown[i].getText()).toEqual(qaData.summarySelection[1].breakdown[i]);
            }
        });

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.summarySelection[1].breakdown[qaData.summarySelection[1].breakdown.length-1]);
        expect(SummaryPO.getTicketsBasePrice()).toEqual(qaData.summarySelection[1].basePrice);

        if(browser.params.device === 'mobile'){
            expect(SelectLocationsPO.getFinalPriceAmount()).toEqual(qaData.summarySelection[1].breakdown[qaData.summarySelection[1].breakdown.length-1]);
        }

        if(browser.params.device === 'mobile'){
            AppPO.browserScrollTo(0, 1300);
        }else{
            AppPO.browserScrollTo(0, 600);
        }
        PromotionsPO.applyMinPromotion(0); //Des-aplicamos la promoción para dejar libre el contador
    });
});