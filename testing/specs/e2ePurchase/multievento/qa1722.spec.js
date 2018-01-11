var VenueNoMapPO = require('./../../../page-objects/venue-no-map.po.js'),
    VenueMapPO = require('./../../../page-objects/venue-map.po.js'),
    VenueNavPO = require('./../../../page-objects/venue-nav.po.js'),
    EventCardPO = require('./../../../page-objects/event-card.po.js'),
    SelectLocationsPO = require('./../../../page-objects/select-locations.po.js'),
    SummaryPO = require('./../../../page-objects/summary.po.js'),
    CatalogChannelPO = require('./../../../page-objects/catalog-channel.po.js'),
    SiteCartPO = require('./../../../page-objects/site-cart.po.js'),
    AppPO = require('./../../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa1722;

describe('QA-1722 [Portal 3.0] [Multievento] Compra número máximo de localidades', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.url);
    });

    it('Accedemos a una sesión con recinto no gráfico y seleccionamos el máximos de localidades permitido por el canal por cada operación', function() {
        expect(SiteCartPO.getShoppingCartAttribute('class')).toMatch('shopping-cart-disabled');

        VenueNoMapPO.selectNoGraphicSeats(qaData.sessionsSelected[0].noGraphicZone, 10);

        expect(AppPO.getNextStepButtonAttribute('class')).not.toMatch('disabled');
    });

    it('Verificamos que en el summary y en el carrito se ha añadido el total de localidades', function(){
        expect(SummaryPO.getTicketsInfo(qaData.sessionId, 0)).toEqual(qaData.ticketsInfo[0]);

        expect(SiteCartPO.getShoppingCartAttribute('class')).not.toMatch('shopping-cart-disabled');
        expect(SiteCartPO.getLocationsAmount()).toBe(qaData.maxSeatsChannel.toString());
    });

    it('Retrocedemos hasta la cartelera del canal, accedemos a otro evento y sesión e intentamos seleccionar otra localidad', function(){
        AppPO.browserScrollTo(0, 0);

        SelectLocationsPO.seeAllSessions();
        EventCardPO.seeAllEvents();
        browser.driver.sleep(1500);
        AppPO.browserScrollTo(0, 3000).then(function(){
            CatalogChannelPO.goToEvent(qaData.sessionsSelected[1].eventId);
        });
        EventCardPO.sessionsListViewBuyTickets(qaData.sessionsSelected[1].sessionId);

        expect(AppPO.getNextStepButtonAttribute('class')).not.toMatch('disabled');

        VenueMapPO.selectZone(qaData.sessionsSelected[1].firstGraphicNumberedZone);
        VenueMapPO.selectNumberedSeats(1, true);

        expect(SiteCartPO.getLocationsAmount()).toBe(qaData.maxSeatsChannel.toString());
    });

    it('Seleccionamos otra sesión del mismo evento y verificamos que tampoco nos deja seleccionar otra localidad', function(){
        VenueNavPO.mapGoBack();
        VenueMapPO.selectZone(qaData.sessionsSelected[1].secondGraphicNumberedZone);
        VenueMapPO.selectZone(qaData.sessionsSelected[1].graphicNoNumberedZone);

        expect(VenueMapPO.selectNoNumberedSeats(1)).toBe(false);
        expect(SiteCartPO.getLocationsAmount()).toBe(qaData.maxSeatsChannel.toString());
    });
});