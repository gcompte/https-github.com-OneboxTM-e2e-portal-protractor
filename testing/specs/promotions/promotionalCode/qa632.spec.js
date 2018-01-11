var VenueMapPO = require('./../../../page-objects/venue-map.po.js'),
    VenueNavPO = require('./../../../page-objects/venue-nav.po.js'),
    PromotionsPO = require('./../../../page-objects/promotions.po.js'),
    SiteCartPO = require('./../../../page-objects/site-cart.po.js'),
    ValidateCartPO = require('./../../../page-objects/validate-cart.po.js'),
    AppPO = require('./../../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa632;

describe('QA-632 Promo block: botón "PAGAR" deshabilitado cuando no se han validado todas las entradas', function() {
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

    it('Avanzamos hasta la pantalla de validar carrito, desde el carrito, y verificamos que informa de la necesidad de validar la promoción y el botón de pagar está inactivo', function(){
        SiteCartPO.expandCollapseSiteCart();
        SiteCartPO.validateCart();

        ValidateCartPO.getSessionSeatsSelectedInfo(qaData.sessionId).then(function(sessionSeatsSelectedInfo){
            for(var i = 0; i < sessionSeatsSelectedInfo.length; i++){
                expect(sessionSeatsSelectedInfo[i].element(by.css('.validate-promo-block.alert')).isPresent()).toBe(true);
                expect(sessionSeatsSelectedInfo[i].element(by.css('.validate-promo-block.alert .button.alert')).isPresent()).toBe(true);
            }
        });

        expect(AppPO.getNextStepButtonAttribute('class')).toMatch('disabled');
    });

    it('Aplicamos la promoción a algunas localidades, no a todas, y verificamos que el botón de pagar sigue deshabilitado', function(){
        ValidateCartPO.getSessionSeatsSelectedInfo(qaData.sessionId).get(0).click();

        PromotionsPO.setPromotionalCode(qaData.promotionalCodeTxt).then(function(promotionalCodeInputTxt){
            expect(promotionalCodeInputTxt).toEqual(qaData.promotionalCodeTxt);
            expect(PromotionsPO.getValidatePromotionalCodeButton().getAttribute('class')).not.toMatch('disabled');

            PromotionsPO.getValidatePromotionalCodeButton().click().then(function(){
                expect(AppPO.getNextStepButtonAttribute('class')).toMatch('disabled');
                PromotionsPO.applyPromotionalCodeSeats(0, 1).then(function(){
                    AppPO.closeRevealModal();
                });
            });
        });

        expect(AppPO.getNextStepButtonAttribute('class')).toMatch('disabled');

        ValidateCartPO.getSessionSeatsSelectedInfo(qaData.sessionId).then(function(sessionSeatsSelectedInfo){
            for(var i = 0; i < 1; i++){
                expect(sessionSeatsSelectedInfo[i].element(by.css('.validate-promo-block.alert')).isPresent()).toBe(false);
                expect(sessionSeatsSelectedInfo[i].element(by.css('.validate-promo-block.alert .button.alert')).isPresent()).toBe(false);
            }

            for(var j = 1; j < sessionSeatsSelectedInfo.length; j++){
                expect(sessionSeatsSelectedInfo[j].element(by.css('.validate-promo-block.alert')).isDisplayed()).toBe(true);
                expect(sessionSeatsSelectedInfo[j].element(by.css('.validate-promo-block.alert .button.alert')).isDisplayed()).toBe(true);
            }
        });
    });
});