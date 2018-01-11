var VenueMapPO = require('./../../../page-objects/venue-map.po.js'),
    VenueNoMapPO = require('./../../../page-objects/venue-no-map.po.js'),
    EventCardPO = require('./../../../page-objects/event-card.po.js'),
    SummaryPO = require('./../../../page-objects/summary.po.js'),
    CatalogChannelPO = require('./../../../page-objects/catalog-channel.po.js'),
    SiteCartPO = require('./../../../page-objects/site-cart.po.js'),
    ValidateCartPO = require('./../../../page-objects/validate-cart.po.js'),
    SelectLocationsPO = require('./../../../page-objects/select-locations.po.js'),
    AppPO = require('./../../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa1718;

describe('QA-1718 [Portal 3.0] [Multievento] Cancelar reserva total: Recinto gráfico con ZNN', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.url);
    });

    it('Accedemos a un evento, seleccionamos una sesión con recinto gráfico no numerado y seleccionamos una localidad', function() {
        if(browser.params.device === 'mobile'){
            expect(SiteCartPO.getMobileShoppingCart().isDisplayed()).toBe(true);
            expect(SiteCartPO.getMobileShoppingCart().getText()).toBe('0');

            SelectLocationsPO.changeSelectedMode();
            AppPO.browserScrollTo(0, 500);
        }else{
            expect(SiteCartPO.getShoppingCartAttribute('class')).toMatch('shopping-cart-disabled');
        };
        expect(AppPO.getNextStepButtonAttribute('class')).toMatch('disabled');

        VenueMapPO.selectZone(qaData.sessionsSelected[0].graphicNumberedZone);
        VenueMapPO.selectZone(qaData.sessionsSelected[0].graphicNoNumberedZone);
        VenueMapPO.selectNoNumberedSeats(1);

        expect(AppPO.getNextStepButtonAttribute('class')).not.toMatch('disabled');
        expect(AppPO.goBackButtonIsPresent()).toBe(true);
    });

    it('Accedemos a la cartelera desde el botón "Continuar comprando" y seleccionamos una localidad de otro evento', function(){
        if(browser.params.device !== 'mobile'){
            AppPO.browserScrollTo(0, 3000);
        } 
        AppPO.goBack();
        browser.driver.sleep(3000);

        AppPO.browserScrollTo(0, 3000).then(function(){
            if(browser.params.device === 'mobile'){
                CatalogChannelPO.goToEvent(qaData.sessionsSelected[1].eventId, 0)
            }else{
                CatalogChannelPO.goToEvent(qaData.sessionsSelected[1].eventId);
            }
        });
        
        EventCardPO.sessionsListViewBuyTickets(qaData.sessionsSelected[1].sessionId);

        expect(AppPO.getNextStepButtonAttribute('class')).not.toMatch('disabled');

        VenueNoMapPO.selectNoGraphicSeats(qaData.sessionsSelected[1].noGraphicZone, 1);

        expect(SummaryPO.getTicketsInfo(qaData.sessionsSelected[1].sessionId)).toEqual(qaData.ticketsInfo);
        expect(SummaryPO.getFinalPrice()).toEqual(qaData.sessionsSelected[1].totalPrice);
    });

    it('Accedemos a la pantalla de validate cart y verificamos que los datos son correctos', function(){
        SiteCartPO.expandCollapseSiteCart();
        SiteCartPO.validateCart();

        expect(ValidateCartPO.getTotalSessionsSelected()).toBe(2);

        for(var i = 0; i < qaData.sessionsSelected.length; i++){
            expect(ValidateCartPO.getEventTitle(qaData.sessionsSelected[i].eventId, 0, qaData.sessionsSelected[i].eventTitle.length)).toEqual(qaData.sessionsSelected[i].eventTitle);
            expect(ValidateCartPO.getSessionDate(qaData.sessionsSelected[i].sessionId, 0)).toEqual(qaData.sessionsSelected[i].eventDate);
            expect(ValidateCartPO.getNumberSessionTicketsSelected(qaData.sessionsSelected[i].sessionId)).toEqual('1 Entrada');
            expect(ValidateCartPO.getSessionTotalPrice(qaData.sessionsSelected[i].sessionId, 0)).toEqual(qaData.sessionsSelected[i].totalPrice);
        }
        expect(ValidateCartPO.getTotalPrice()).toEqual(qaData.finalPrice);
    });

    it('Eliminar todas las localidades seleccionadas y verificar que se eliminan correctamente', function(){
        for(var i = 0; i < qaData.sessionsSelected.length; i++){
            expect(ValidateCartPO.getTotalSessionsSelected()).toBe(qaData.sessionsSelected.length - i);
            ValidateCartPO.deleteAllSessionTickets(qaData.sessionsSelected[i].sessionId, 'delete');
        }

        expect(SiteCartPO.getLocationsAmount()).toEqual('0');

        if(browser.params.device !== 'mobile'){
            expect(SiteCartPO.getShoppingCartAttribute('class')).toMatch('shopping-cart-disabled');
        };
    });
});