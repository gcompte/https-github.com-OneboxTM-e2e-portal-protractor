var VenueNoMapPO = require('./../../../page-objects/venue-no-map.po.js'),
    SummaryPO = require('./../../../page-objects/summary.po.js'),
    PromotionsPO = require('./../../../page-objects/promotions.po.js'),
    SelectLocationsPO = require('./../../../page-objects/select-locations.po.js'),
    AppPO = require('./../../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa818;

describe('QA-818 Aplicar Descuento con restricción de Número mínimo para poder aplicar a toda la compra y límite máximo de entradas por operación con incentivo porcentual', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.sessionUrl);
    });

    it('Accedemos a una sesión y seleccionamos localidades', function() {
        expect(AppPO.getNextStepButtonAttribute('class')).toMatch('disabled');

        VenueNoMapPO.selectNoGraphicSeats(qaData.noGraphicZone, 1);

        expect(AppPO.getNextStepButtonAttribute('class')).not.toMatch('disabled');
    });

    it('Verificamos que no se puede aplicar la promoción por no cumplir el mínimo', function(){
        browser.driver.sleep(2000);
        expect(PromotionsPO.isApplicablePromotion(0)).toBe(false);
    });

    it('Seleccionamos cuatro localidades más (cinco en total) y aplicamos la promoción', function(){
        AppPO.browserScrollTo(0, 0);
        VenueNoMapPO.selectNoGraphicSeats(qaData.noGraphicZone, 5);

        browser.driver.sleep(2000);
        PromotionsPO.isApplicablePromotion(0).then(function(isApplicablePromotion){
            if(isApplicablePromotion){
                if(browser.params.device === 'mobile'){
                    AppPO.browserScrollTo(0, 1300);
                    PromotionsPO.selectPromotionByPosition(0);
                    browser.driver.sleep(2000);
                }else{
                    AppPO.browserScrollTo(0, 600);
                }
                PromotionsPO.applyMinPromotion(0);
            }else{
                expect(PromotionsPO.isApplicablePromotion(0)).toBe(true);
            }
        });
    });

    it('Verificamos que la promoción se ha aplicado solamente a cuatro localidades y que los precios son correctos', function() {
        SummaryPO.getSummaryBreakdown().then(function(summaryBreakdown){
            for(var i = 0; i < summaryBreakdown.length; i++){
                expect(summaryBreakdown[i].getText()).toEqual(qaData.breakdown[i]);
            }
        });

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.breakdown[qaData.breakdown.length-1]);
        expect(SummaryPO.getTicketsBasePrice()).toEqual(qaData.basePrice);

        if(browser.params.device === 'mobile'){
            expect(SelectLocationsPO.getFinalPriceAmount()).toEqual(qaData.breakdown[qaData.breakdown.length-1]);
        }

        PromotionsPO.applyMinPromotion(0); //Des-aplicamos la promoción para dejar libre el contador
    });
});