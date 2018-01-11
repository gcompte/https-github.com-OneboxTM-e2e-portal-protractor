var VenueMapPO = require('./../../../page-objects/venue-map.po.js'),
    VenueNavPO = require('./../../../page-objects/venue-nav.po.js'),
    SelectLocationsPO = require('./../../../page-objects/select-locations.po.js'),
    SiteCartPO = require('./../../../page-objects/site-cart.po.js'),
    ValidateCartPO = require('./../../../page-objects/validate-cart.po.js'),
    AppPO = require('./../../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa628;

describe('QA-628 Promo block: Aparece el literal informativo "Una o mas entradas requieren ser validadas..." para continuar con la compra', function() {
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

    it('Verificamos que aparece un mensaje iformando que las localidades están sujetas a una promoción bloqueante', function(){
        expect(AppPO.getNextStepButtonAttribute('class')).toMatch('disabled');
        expect(SelectLocationsPO.getMandatorySalesText().isDisplayed()).toBe(true);
    });

    it('Avanzamos hasta la pantalla de validar carrito, desde el carrito, y verificamos que aparece el mensaje de localidades sujetas a promoción', function(){
        SiteCartPO.expandCollapseSiteCart();
        SiteCartPO.validateCart();

        ValidateCartPO.getSessionSeatsSelectedInfo(qaData.sessionId).then(function(sessionSeatsSelectedInfo){
            for(var i = 0; i < sessionSeatsSelectedInfo.length; i++){
                expect(sessionSeatsSelectedInfo[i].element(by.css('.validate-promo-block.alert')).isDisplayed()).toBe(true);
            }
        });
    });
});