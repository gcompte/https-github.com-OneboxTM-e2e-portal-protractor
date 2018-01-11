var SiteCartPO = require('./../../page-objects/site-cart.po.js'),
    CatalogChannelPO = require('./../../page-objects/catalog-channel.po.js'),
    EventCardPO = require('./../../page-objects/event-card.po.js'),
    VenueMapPO = require('./../../page-objects/venue-map.po.js'),
    VenueNoMapPO = require('./../../page-objects/venue-no-map.po.js'),
    AppPO = require('./../../page-objects/app.po.js');

var genericData = require('./../generic-data.json'),
    qaData = require('./suite-data.' + browser.params.env + '.json').firstEventInfo;

describe('QA-2409 Comprobar que el carrito no aparece en un canal Monoevento - Desktop + Mobile', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + genericData.channels.genericMono);
    });

    it('Accedemos a la cartelera y verificamos que no aparece el site-cart en la barra de navegación', function() {
        if(browser.params.device === 'mobile'){
            expect(SiteCartPO.getMobileShoppingCart().isDisplayed()).toBe(false);
        }else{
            expect(SiteCartPO.getShoppingCartInfo().isDisplayed()).toBe(false);
        }
    });

    it('Accedemos a un evento y verificamos que no aparece el site-cart en la barra de navegación', function() {
        if(browser.params.device === 'mobile'){
            AppPO.browserScrollTo(0, 2500);
            browser.driver.sleep(2000);
            CatalogChannelPO.goToEvent(qaData.eventId, 0);
        }else{
            AppPO.browserScrollTo(0, 2500);
            CatalogChannelPO.goToEvent(qaData.eventId);            
        }

        expect(SiteCartPO.getShoppingCartInfo().isDisplayed()).toBe(false);
    });

    it('Accedemos a una sessión de ese evento y verificamos que no aparece el site-cart en la barra de navegación', function() {
        EventCardPO.boxSessionTime(qaData.sessionId);
        expect(SiteCartPO.getShoppingCartInfo().isDisplayed()).toBe(false);
    });

    it('Seleccionamos una localidad de esa sesión y verificamos que no aparece el site-cart en la barra de navegación', function() {
        if(browser.params.device === 'mobile'){
            VenueNoMapPO.selectNoGraphicSeats(qaData.noGraphicZone, 1);
        }else{
            VenueMapPO.selectZone(qaData.graphicNumberedZone);
            VenueMapPO.selectNumberedSeats(1);
        }
        expect(SiteCartPO.getShoppingCartInfo().isDisplayed()).toBe(false);
    });
});