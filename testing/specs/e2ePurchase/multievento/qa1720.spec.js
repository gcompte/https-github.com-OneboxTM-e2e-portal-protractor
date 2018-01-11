var VenueNoMapPO = require('./../../../page-objects/venue-no-map.po.js'),
    EventCardPO = require('./../../../page-objects/event-card.po.js'),
    SelectLocationsPO = require('./../../../page-objects/select-locations.po.js'),
    SummaryPO = require('./../../../page-objects/summary.po.js'),
    CatalogChannelPO = require('./../../../page-objects/catalog-channel.po.js'),
    SiteCartPO = require('./../../../page-objects/site-cart.po.js'),
    AppPO = require('./../../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa1720;

describe('QA-1720 [Portal 3.0] [Multievento] Selección de localidades en recinto no gráfico', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.url);
    });

    it('Accedemos a un evento, seleccionamos una sesión con recinto no gráfico y seleccionamos una localidad', function() {
        if(browser.params.device === 'mobile'){
            expect(SiteCartPO.getMobileShoppingCart().getText()).toBe('0');
        }else{
            expect(SiteCartPO.getShoppingCartAttribute('class')).toMatch('shopping-cart-disabled');
        };

        expect(VenueNoMapPO.getPriceZones().count()).toBe(qaData.sessionsSelected[0].totalPriceZones);
        expect(VenueNoMapPO.getPriceZonePromotion(qaData.sessionsSelected[0].noGraphicZone)).toEqual(qaData.sessionsSelected[0].automaticPromotionName);
        expect(AppPO.getNextStepButtonAttribute('class')).toMatch('disabled');

        VenueNoMapPO.selectNoGraphicSeats(qaData.sessionsSelected[0].noGraphicZone, 1);

        expect(AppPO.getNextStepButtonAttribute('class')).not.toMatch('disabled');
    });

    it('Verificamos que la localidad aparece correctamente en el summary', function(){
        AppPO.browserScrollTo(0, 0);

        expect(SummaryPO.getTicketsInfo(qaData.sessionsSelected[0].sessionId, 0)).toEqual(qaData.ticketsInfo[0]);
        expect(SummaryPO.getFinalPrice()).toEqual(qaData.sessionsSelected[0].subtotal);
    });

    it('Verificamos que la localidad aparece correctamente en el carro de la compra', function(){
        if(browser.params.device !== 'mobile'){
            expect(SiteCartPO.getShoppingCartAttribute('class')).not.toMatch('shopping-cart-disabled');
        };
        expect(SiteCartPO.getLocationsAmount()).toBe('1');
        SiteCartPO.expandCollapseSiteCart();

        expect(SiteCartPO.getEventTitle(qaData.sessionsSelected[0].sessionId)).toEqual(qaData.sessionsSelected[0].eventTitle);
        expect(SiteCartPO.getEventDate(qaData.sessionsSelected[0].sessionId)).toEqual(qaData.sessionsSelected[0].eventDate);

        expect(SiteCartPO.getAllSessionsSelected().count()).toBe(1);
        expect(SiteCartPO.getSessionLocationsAmount(qaData.sessionsSelected[0].sessionId)).toEqual('1');
        expect(SiteCartPO.getSessionSelectionBasePrice(qaData.sessionsSelected[0].sessionId)).toEqual(qaData.sessionsSelected[0].basePrice);
        expect(SiteCartPO.getSessionChargesOrPromos(qaData.sessionsSelected[0].sessionId, 'sessionData.showCharges', 2)).toEqual(qaData.sessionsSelected[0].charges);
        expect(SiteCartPO.getSessionChargesOrPromos(qaData.sessionsSelected[0].sessionId, 'sessionData.automaticPromotionName', 2)).toEqual(qaData.sessionsSelected[0].automaticPromotionAmount);

        expect(SiteCartPO.getFinalPrice()).toEqual(qaData.finalPrice[0]);
    });

    it('Retrocedemos hasta la cartelera del canal, accedemos a otro evento y sesión y seleccionamos una localidad', function(){
        if(browser.params.device === 'mobile'){
            SiteCartPO.collapseMobileSiteCart();
            browser.driver.sleep(2000); 
        }else{
            AppPO.browserScrollTo(0, 0);
        };
        
        SelectLocationsPO.seeAllSessions();
        EventCardPO.seeAllEvents();
        browser.driver.sleep(1500);
        browser.executeScript('window.scrollTo(0, 3000);').then(function(){
            if(browser.params.device === 'mobile'){
                CatalogChannelPO.goToEvent(qaData.sessionsSelected[1].eventId, 0);
            }else{
                CatalogChannelPO.goToEvent(qaData.sessionsSelected[1].eventId);
            }
        });
        EventCardPO.sessionsListViewBuyTickets(qaData.sessionsSelected[1].sessionId);

        expect(AppPO.getNextStepButtonAttribute('class')).not.toMatch('disabled');

        VenueNoMapPO.selectNoGraphicSeats(qaData.sessionsSelected[1].noGraphicZone, 1);

        expect(SummaryPO.getTicketsInfo(qaData.sessionsSelected[1].sessionId, 0)).toEqual(qaData.ticketsInfo[1]);
        expect(SummaryPO.getFinalPrice()).toEqual(qaData.sessionsSelected[1].subtotal);
    });

    it('Verificamos que todas las localidades aparecen correctamente en el carro de la compra', function(){
        expect(SiteCartPO.getShoppingCartAttribute('class')).not.toMatch('shopping-cart-disabled');
        expect(SiteCartPO.getLocationsAmount()).toBe('2');
        browser.executeScript('window.scrollTo(0, 0);');
        SiteCartPO.expandCollapseSiteCart();

        expect(SiteCartPO.getAllSessionsSelected().count()).toBe(2);

        for(var i = 0; i < qaData.sessionsSelected.length; i++){
            expect(SiteCartPO.getEventTitle(qaData.sessionsSelected[i].sessionId)).toEqual(qaData.sessionsSelected[i].eventTitle);
            expect(SiteCartPO.getEventDate(qaData.sessionsSelected[i].sessionId)).toEqual(qaData.sessionsSelected[i].eventDate);
            expect(SiteCartPO.getSessionLocationsAmount(qaData.sessionsSelected[i].sessionId)).toEqual('1');
            expect(SiteCartPO.getSessionSelectionBasePrice(qaData.sessionsSelected[i].sessionId)).toEqual(qaData.sessionsSelected[i].basePrice);
            expect(SiteCartPO.getSessionChargesOrPromos(qaData.sessionsSelected[i].sessionId, 'sessionData.showCharges', 2)).toEqual(qaData.sessionsSelected[i].charges);
            expect(SiteCartPO.getSessionSelectionSubtotal(qaData.sessionsSelected[i].sessionId)).toEqual(qaData.sessionsSelected[i].subtotal);
        }
        expect(SiteCartPO.getSessionChargesOrPromos(qaData.sessionsSelected[0].sessionId, 'sessionData.automaticPromotionName', 2)).toEqual(qaData.sessionsSelected[0].automaticPromotionAmount);
        expect(SiteCartPO.getFinalPrice()).toEqual(qaData.finalPrice[1]);
    });

    it('Eliminar las localidades del carrito', function(){
        for(var i = 0; i < qaData.sessionsSelected.length; i++){
            expect(SiteCartPO.getAllSessionsSelected().count()).toBe(qaData.sessionsSelected.length - i);
            SiteCartPO.removeSessionTickets(qaData.sessionsSelected[i].sessionId, 'delete');
            
        }

        expect(SiteCartPO.getLocationsAmount()).toEqual('0');
    });
});