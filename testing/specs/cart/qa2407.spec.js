var CookiesPolicyPO = require('./../../page-objects/cookies-policy.po.js'),
    SiteCartPO = require('./../../page-objects/site-cart.po.js'),
    CatalogChannelPO = require('./../../page-objects/catalog-channel.po.js'),
    SelectLocationsPO = require('./../../page-objects/select-locations.po.js'),
    EventCardPO = require('./../../page-objects/event-card.po.js'),
    VenueNavPO = require('./../../page-objects/venue-nav.po.js'),
    VenueMapPO = require('./../../page-objects/venue-map.po.js'),
    VenueNoMapPO = require('./../../page-objects/venue-no-map.po.js'),
    AppPO = require('./../../page-objects/app.po.js');

var genericData = require('./../generic-data.json'),
    qaData = require('./suite-data.' + browser.params.env + '.json');

describe('QA-2407 Comprobar comportamiento normal del carrito - Desktop y Móvil', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + genericData.channels.genericMulti);
    });

    it('Accedemos a la cartelera y verificamos que aparece el icono del carrito en la barra de navegación, y que está deshabilitado', function() {
        CookiesPolicyPO.closeCookiesPolicy();

        if(browser.params.device === 'mobile'){
            expect(SiteCartPO.getMobileShoppingCart().isDisplayed()).toBe(true);
            expect(SiteCartPO.getMobileShoppingCart().getText()).toBe('0');
        }else{
            expect(SiteCartPO.getShoppingCartInfo().isDisplayed()).toBe(true);
            expect(SiteCartPO.getShoppingCartInfo().getText()).toEqual("Tu carrito 0");
            expect(SiteCartPO.getShoppingCartInfo().getAttribute('class')).toMatch("shopping-cart-disabled");
        }
    });

    it('Clicamos en el icono del carrito y verificamos que no se abre, ya que está vacío', function(){
        if(browser.params.device === 'mobile'){
            //En móvil no clicamos porque no se puede
            expect(SiteCartPO.getOffCanvasShoppingCart().isDisplayed()).toBe(false);
        }else{
            expect(SiteCartPO.getShoppingCartContainer().isDisplayed()).toBe(false);
            SiteCartPO.expandCollapseSiteCart().then(function(){
                expect(SiteCartPO.getShoppingCartContainer().isDisplayed()).toBe(false);
            });
        }
    });

    it('Accedemos a un evento y verificamos que aparece el site-cart en la barra de navegación', function() {
        if(browser.params.device === 'mobile'){
            AppPO.browserScrollTo(0, 2500);
            browser.driver.sleep(2000);
            CatalogChannelPO.goToEvent(qaData.firstEventInfo.eventId, 0);
            expect(SiteCartPO.getMobileShoppingCart().isDisplayed()).toBe(true);
        }else{
            AppPO.browserScrollTo(0, 2500);
            CatalogChannelPO.goToEvent(qaData.firstEventInfo.eventId);  
            expect(SiteCartPO.getShoppingCartInfo().isDisplayed()).toBe(true);          
        }
    });

    it('Accedemos a una sessión de ese evento y verificamos que sigue apareciendo el site-cart en la barra de navegación', function() {
        if(browser.params.device === 'mobile'){
            EventCardPO.sessionsListViewBuyTicketsMobile(qaData.firstEventInfo.sessionId);
            expect(SiteCartPO.getMobileShoppingCart().isDisplayed()).toBe(true);
        }else{
            EventCardPO.sessionsListViewBuyTickets(qaData.firstEventInfo.sessionId);
            expect(SiteCartPO.getShoppingCartInfo().isDisplayed()).toBe(true);          
        }
    });

    it('Seleccionamos localidades de esa sesión y verificamos que en la barra de navegación el número de localidades es correcto', function() {
        if(browser.params.device === 'mobile'){
            VenueNavPO.mapTransform('down');
            VenueNavPO.mapTransform('down');
            VenueNoMapPO.selectNoGraphicSeats(qaData.firstEventInfo.noGraphicZone, 6);
            expect(SiteCartPO.getMobileShoppingCart().isDisplayed()).toBe(true);
            expect(SiteCartPO.getMobileShoppingCart().getText()).toBe('6');
        }else{
            VenueMapPO.selectZone(qaData.firstEventInfo.graphicNumberedZone);
            VenueNavPO.mapTransform('down');
            VenueNavPO.mapTransform('down');
            VenueMapPO.selectNumberedSeats(6);
            expect(SiteCartPO.getLocationsAmount()).toEqual('6');
            expect(SiteCartPO.getShoppingCartInfo().isDisplayed()).toBe(true);
        }
    });

    it('Abrimos el carrito y verificamos que la información mostrada es correcta', function() {
        if(browser.params.device === 'mobile'){
            SiteCartPO.expandMobileSiteCart();
            expect(SiteCartPO.getOffCanvasShoppingCart().isDisplayed()).toBe(true);
        }else{
            SiteCartPO.expandCollapseSiteCart();
            expect(SiteCartPO.getShoppingCartContainer().isDisplayed()).toBe(true);
        }
        expect(SiteCartPO.getEventTitle(qaData.firstEventInfo.sessionId)).toEqual(qaData.firstEventInfo.eventTitle);
        expect(SiteCartPO.getEventDate(qaData.firstEventInfo.sessionId)).toEqual(qaData.firstEventInfo.eventDate);
        expect(SiteCartPO.getSessionLocationsAmount(qaData.firstEventInfo.sessionId)).toEqual('6');
        expect(SiteCartPO.getFinalPrice(qaData.firstEventInfo.sessionId)).toEqual(qaData.firstEventInfo.finalPrice);
    });

    it('Cerramos el carrito y verificamos que se cierra correctamente', function() {
        if(browser.params.device === 'mobile'){
            expect(SiteCartPO.getOffCanvasShoppingCart().isDisplayed()).toBe(true);
            SiteCartPO.collapseMobileSiteCart().then(function(){
                browser.driver.sleep(2000);
                expect(SiteCartPO.getOffCanvasShoppingCart().isDisplayed()).toBe(false);
            });
        }else{
            expect(SiteCartPO.getShoppingCartContainer().isDisplayed()).toBe(true);
            SiteCartPO.expandCollapseSiteCart().then(function(){
                expect(SiteCartPO.getShoppingCartContainer().isDisplayed()).toBe(false);
            });
        }
    });

    it('Seleccionamos localidades de otro evento y verificamos que la información del carrito es correcta', function(){
        if(browser.params.device === 'mobile'){
            SelectLocationsPO.seeAllSessions();
            EventCardPO.seeAllEvents();
            
            browser.driver.sleep(3000);
            AppPO.browserScrollTo(0, 3000).then(function(){
                CatalogChannelPO.goToEvent(qaData.secondEventInfo.eventId, 0);
                EventCardPO.sessionsListViewBuyTicketsMobile(qaData.secondEventInfo.sessionId);
                VenueNoMapPO.selectNoGraphicSeats(qaData.secondEventInfo.noGraphicZone, 4);
                SiteCartPO.expandMobileSiteCart().then(function(){
                    expect(SiteCartPO.getOffCanvasShoppingCart().isDisplayed()).toBe(true);
                    expect(SiteCartPO.getEventTitle(qaData.secondEventInfo.sessionId)).toEqual(qaData.secondEventInfo.eventTitle);
                    expect(SiteCartPO.getEventDate(qaData.secondEventInfo.sessionId)).toEqual(qaData.secondEventInfo.eventDate);
                    expect(SiteCartPO.getSessionLocationsAmount(qaData.secondEventInfo.sessionId)).toEqual('4');
                    expect(SiteCartPO.getFinalPrice(qaData.secondEventInfo.sessionId)).toEqual(qaData.secondEventInfo.finalPrice);
                });
            });
        }else{
            AppPO.browserScrollTo(0, 0);
            SelectLocationsPO.seeAllSessions();
            EventCardPO.seeAllEvents();

            browser.driver.sleep(3000);
            AppPO.browserScrollTo(0, 3000).then(function(){
                CatalogChannelPO.goToEvent(qaData.secondEventInfo.eventId);
                EventCardPO.sessionsListViewBuyTickets(qaData.secondEventInfo.sessionId);
                VenueNoMapPO.selectNoGraphicSeats(qaData.secondEventInfo.noGraphicZone, 4);
                SiteCartPO.expandCollapseSiteCart().then(function(){
                    expect(SiteCartPO.getShoppingCartContainer().isDisplayed()).toBe(true);
                    expect(SiteCartPO.getEventTitle(qaData.secondEventInfo.sessionId)).toEqual(qaData.secondEventInfo.eventTitle);
                    expect(SiteCartPO.getEventDate(qaData.secondEventInfo.sessionId)).toEqual(qaData.secondEventInfo.eventDate);
                    expect(SiteCartPO.getSessionLocationsAmount(qaData.secondEventInfo.sessionId)).toEqual('4');
                    expect(SiteCartPO.getFinalPrice(qaData.secondEventInfo.sessionId)).toEqual(qaData.secondEventInfo.finalPrice);
                });
            });
        }
    });

    it('Eliminamos las localidades de uno de los eventos desde el propio carrito y verificamos que el total de localidades en el carrito es correcto', function(){
        if(browser.params.device === 'mobile'){
            SiteCartPO.removeSessionTickets(qaData.firstEventInfo.sessionId, 'delete').then(function(){
                expect(SiteCartPO.getMobileShoppingCart().getText()).toBe('4');
            });
        }else{
            SiteCartPO.removeSessionTickets(qaData.firstEventInfo.sessionId, 'delete').then(function(){
                expect(SiteCartPO.getLocationsAmount()).toEqual('4');
            });
        }
    });

    it('Abrimos el carrito, clicamos en "Validar carrito" y verificamos que accedemos al resumen de compra y que desaparece el carrito de la barra de navegaciónº', function() {
        if(browser.params.device === 'mobile'){
            SiteCartPO.expandMobileSiteCart();
            SiteCartPO.validateCartMobile().then(function(){
                expect(SiteCartPO.getMobileShoppingCart().isDisplayed()).toBe(false);
                expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + genericData.channels.genericMulti + '/es_ES/buying-process/validate-cart');
            });
        }else{
            SiteCartPO.validateCart().then(function(){
                expect(SiteCartPO.getShoppingCartInfo().isDisplayed()).toBe(false);
                expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + genericData.channels.genericMulti + '/es_ES/buying-process/validate-cart');
            });
        }
    });
});