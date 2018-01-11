var VenueMapPO = require('./../../../page-objects/venue-map.po.js'),
    EventCardPO = require('./../../../page-objects/event-card.po.js'),
    SelectLocationsPO = require('./../../../page-objects/select-locations.po.js'),
    SummaryPO = require('./../../../page-objects/summary.po.js'),
    SiteCartPO = require('./../../../page-objects/site-cart.po.js'),
    AppPO = require('./../../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa1724;

describe('QA-1724 [Portal 3.0] [Multievento] Verificar que se aplica el limite maximo por canal si es mas restrictivo que el limite por compra', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.url);
    });

    it('Accedemos a una sesión sin límite de entradas por compra configurado y seleccionamos una localidad más del máximo de entradas permitidas por el canal', function() {
        expect(SiteCartPO.getShoppingCartAttribute('class')).toMatch('shopping-cart-disabled');

        VenueMapPO.selectZone(qaData.sessionsSelected[0].graphicNumberedZone);
        VenueMapPO.selectNumberedSeats(11, true);

        expect(AppPO.getNextStepButtonAttribute('class')).not.toMatch('disabled');
    });

    it('Verificamos que en el summary y el siteCart solo se han añadido tantas localidades como el máximo permitido por el canal', function(){
        expect(SummaryPO.getAllTickets().count()).toEqual(qaData.maxSeatsChannel);

        expect(SiteCartPO.getShoppingCartAttribute('class')).not.toMatch('shopping-cart-disabled');
        expect(SiteCartPO.getLocationsAmount()).toBe(qaData.maxSeatsChannel.toString());
    });

    it('Retrocedemos hasta la ficha del evento y accedemos a una sesión con límite de entradas definido a un número superior del límite del canal', function(){
        AppPO.browserScrollTo(0, 0);

        SelectLocationsPO.seeAllSessions();
        EventCardPO.sessionsListViewBuyTickets(qaData.sessionsSelected[1].sessionId);

        expect(AppPO.getNextStepButtonAttribute('class')).not.toMatch('disabled');

        VenueMapPO.selectZone(qaData.sessionsSelected[1].graphicNumberedZone);
        VenueMapPO.selectNumberedSeats(1, true);

        expect(SiteCartPO.getLocationsAmount()).toBe(qaData.maxSeatsChannel.toString());
    });

    it('Eliminar todas las localidades desde el sitecart e intentar añadir nuevamente tantas localidades como el máximo permitido por la sesión', function(){
        SiteCartPO.expandCollapseSiteCart().then(function(){
            SiteCartPO.removeSessionTickets(qaData.sessionsSelected[0].sessionId, 'delete');
        });
        VenueMapPO.selectNumberedSeats(11, true);
        expect(SiteCartPO.getLocationsAmount()).toBe(qaData.maxSeatsChannel.toString());
    });
});