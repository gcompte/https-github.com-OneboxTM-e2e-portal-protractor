var VenueMapPO = require('./../../../page-objects/venue-map.po.js'),
    VenueNavPO = require('./../../../page-objects/venue-nav.po.js'),
    PromotionsPO = require('./../../../page-objects/promotions.po.js'),
    SiteCartPO = require('./../../../page-objects/site-cart.po.js'),
    ValidateCartPO = require('./../../../page-objects/validate-cart.po.js'),
    AppPO = require('./../../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa624;

describe('QA-624 No es posible aplicar una promción con un código promocional pendiente de activarse', function() {
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

    it('Avanzamos hasta la pantalla de validar carrito, desde el carrito, insertamos un código que no esté activo por fecha, y validamos que no se valida la promoción', function(){
        SiteCartPO.expandCollapseSiteCart();
        SiteCartPO.validateCart();

        ValidateCartPO.getSessionSeatsSelectedInfo(qaData.sessionId).then(function(sessionSeatsSelectedInfo){
            sessionSeatsSelectedInfo[0].element(by.css('.validate-promo-block .button')).click();
        });

        PromotionsPO.setPromotionalCode(genericData.promotions.promotionalCodeFutureDate).then(function(promotionalCodeInputTxt){
            expect(promotionalCodeInputTxt).toEqual(genericData.promotions.promotionalCodeFutureDate);

            PromotionsPO.getValidatePromotionalCodeButton().click().then(function(){
                expect(element(by.css('.reveal-modal .icon.fi-x')).isDisplayed()).toBe(true);
                expect(element(by.css('.reveal-modal .icon.fi-check.success')).isDisplayed()).toBe(false);
            });
        });

    });

    it('Insertamos un código que esté activo por fecha, y validamos que se valida la promoción', function(){
        PromotionsPO.setPromotionalCode(genericData.promotions.promotionalCodeOK).then(function(promotionalCodeInputTxt){
            expect(promotionalCodeInputTxt).toEqual(genericData.promotions.promotionalCodeOK);

            PromotionsPO.getValidatePromotionalCodeButton().click().then(function(){
                expect(element(by.css('.reveal-modal .icon.fi-x')).isDisplayed()).toBe(false);
                expect(element(by.css('.reveal-modal .icon.fi-check.success')).isDisplayed()).toBe(true);
            });
        });

    });
});