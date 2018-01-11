var VenueMapPO = require('./../../../page-objects/venue-map.po.js'),
    VenueNavPO = require('./../../../page-objects/venue-nav.po.js'),
    SelectLocationsPO = require('./../../../page-objects/select-locations.po.js'),
    PromotionsPO = require('./../../../page-objects/promotions.po.js'),
    AppPO = require('./../../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa627;

describe('QA-627 Promo block: el botón "VALIDAR CARRITO" no se habilita si NO seleccionas todas las entradas', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.sessionUrl);
    });

    it('Accedemos a una sesión y seleccionamos cuatro localidades', function() {
        expect(AppPO.getNextStepButtonAttribute('class')).toMatch('disabled');

        VenueMapPO.selectZone(qaData.graphicNumberedZone);
        VenueNavPO.mapTransform('down');
        VenueNavPO.mapTransform('down');
        VenueMapPO.selectNumberedSeats(4, true);
    });

    it('Verificamos que no se puede continuar la compra si no validamos la promoción bloqueante y la aplicamos a todas las localidades', function(){
        expect(AppPO.getNextStepButtonAttribute('class')).toMatch('disabled');
        expect(SelectLocationsPO.getMandatorySalesText().isDisplayed()).toBe(true);

        browser.driver.sleep(3000);
        expect(PromotionsPO.isApplicablePromotion(0)).toBe(false);
        expect(PromotionsPO.getValidatePromotionalCodeButton().getAttribute('class')).toMatch('disabled');

        PromotionsPO.setPromotionalCode(qaData.promotionalCodeTxt).then(function(promotionalCodeInputTxt){
            expect(promotionalCodeInputTxt).toEqual(qaData.promotionalCodeTxt);
            expect(PromotionsPO.getValidatePromotionalCodeButton().getAttribute('class')).not.toMatch('disabled');

            PromotionsPO.getValidatePromotionalCodeButton().click().then(function(){
                expect(AppPO.getNextStepButtonAttribute('class')).toMatch('disabled');
                PromotionsPO.applyPromotionalCodeSeats(0, 1);
            });
        });

        expect(AppPO.getNextStepButtonAttribute('class')).toMatch('disabled');
    });

    it('Verificamos que al aplicar la promoción a todas las localidades, se desbloquea el botón de validar el carrito', function(){
        browser.driver.sleep(3000);
        
        for(var i = 1; i < 4; i++){
            PromotionsPO.applyPromotionalCodeSeats(i, 1);    
        }
        expect(AppPO.getNextStepButtonAttribute('class')).not.toMatch('disabled');

        expect(SelectLocationsPO.getMandatorySalesText().isDisplayed()).toBe(false);
    });
});