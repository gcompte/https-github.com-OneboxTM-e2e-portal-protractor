var VenueMapPO = require('./../../../page-objects/venue-map.po.js'),
    VenueNavPO = require('./../../../page-objects/venue-nav.po.js'),
    PromotionsPO = require('./../../../page-objects/promotions.po.js'),
    SiteCartPO = require('./../../../page-objects/site-cart.po.js'),
    ValidateCartPO = require('./../../../page-objects/validate-cart.po.js'),
    AppPO = require('./../../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa631;

describe('QA-631 Promo block: Si el código de validación es incorrecto aparece una "X"', function() {
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

    it('Avanzamos hasta la pantalla de validar carrito, desde el carrito, e insertamos un código incorrecto en el input', function(){
        SiteCartPO.expandCollapseSiteCart();
        SiteCartPO.validateCart();

        ValidateCartPO.getSessionSeatsSelectedInfo(qaData.sessionId).then(function(sessionSeatsSelectedInfo){
            sessionSeatsSelectedInfo[0].element(by.css('.validate-promo-block .button')).click();
        });

        PromotionsPO.setPromotionalCode(qaData.promotionalCodeErrorTxt).then(function(promotionalCodeInputTxt){
            expect(promotionalCodeInputTxt).toEqual(qaData.promotionalCodeErrorTxt);

            PromotionsPO.getValidatePromotionalCodeButton().click().then(function(){
                expect(element(by.css('.reveal-modal .icon.fi-x')).isDisplayed()).toBe(true);
                expect(element(by.css('.reveal-modal .icon.fi-check.success')).isDisplayed()).toBe(false);
            });
        });

    });
});