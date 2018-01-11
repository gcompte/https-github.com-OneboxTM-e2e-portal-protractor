var VenueMapPO = require('./../../../page-objects/venue-map.po.js'),
    VenueNavPO = require('./../../../page-objects/venue-nav.po.js'),
    PromotionsPO = require('./../../../page-objects/promotions.po.js'),
    SiteCartPO = require('./../../../page-objects/site-cart.po.js'),
    ValidateCartPO = require('./../../../page-objects/validate-cart.po.js'),
    AppPO = require('./../../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa633;

describe('QA-633 Promo block: botón PAGAR habilitado cuando se han validado todas las entradas del carrito', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.sessionUrl);
    });

    it('Accedemos a una sesión y seleccionamos cuatro localidades', function() {
        expect(AppPO.getNextStepButtonAttribute('class')).toMatch('disabled');

        VenueMapPO.selectZone(qaData.graphicNumberedZone);
        VenueNavPO.mapTransform('down');
        VenueNavPO.mapTransform('down');
        VenueMapPO.selectNumberedSeats(2, true);
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

    it('Aplicamos la promoción a todas las localidades, y verificamos que el botón de pagar se habilita', function(){
        ValidateCartPO.getSessionSeatsSelectedInfo(qaData.sessionId).get(0).click();

        PromotionsPO.setPromotionalCode(qaData.promotionalCodeTxt).then(function(promotionalCodeInputTxt){
            expect(promotionalCodeInputTxt).toEqual(qaData.promotionalCodeTxt);
            expect(PromotionsPO.getValidatePromotionalCodeButton().getAttribute('class')).not.toMatch('disabled');

            PromotionsPO.getValidatePromotionalCodeButton().click().then(function(){
                expect(AppPO.getNextStepButtonAttribute('class')).toMatch('disabled');
                PromotionsPO.applyPromotionalCodeSeats(0, 2).then(function(){
                    AppPO.closeRevealModal();
                });
            });
        });

        expect(AppPO.getNextStepButtonAttribute('class')).not.toMatch('disabled');

        ValidateCartPO.getSessionSeatsSelectedInfo(qaData.sessionId).then(function(sessionSeatsSelectedInfo){
            for(var i = 0; i < sessionSeatsSelectedInfo.length; i++){
                expect(sessionSeatsSelectedInfo[i].element(by.css('.validate-promo-block.alert')).isPresent()).toBe(false);
                expect(sessionSeatsSelectedInfo[i].element(by.css('.validate-promo-block.alert .button.alert')).isPresent()).toBe(false);
            }
        });
    });
});