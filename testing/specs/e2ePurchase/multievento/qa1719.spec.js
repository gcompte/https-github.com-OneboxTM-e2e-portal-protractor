var VenueMapPO = require('./../../../page-objects/venue-map.po.js'),
    VenueNavPO = require('./../../../page-objects/venue-nav.po.js'),
    SiteCartPO = require('./../../../page-objects/site-cart.po.js'),
    SummaryPO = require('./../../../page-objects/summary.po.js'),
    SelectLocationsPO = require('./../../../page-objects/select-locations.po.js'),
    AppPO = require('./../../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa1719;

describe('QA-1719 [Portal 3.0] [Multievento] Selección de localidades en recinto gráfico con ZNN', function() {
    var seatsSelected = browser.params.seatsSelected;

    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.url);
    });

    it('Accedemos a la selección de localidades de una sesión con recinto gráfico, seleccionamos una localidad de una zona numerada y verificamos el tooltip y el precio en el summary', function() {
        expect(AppPO.getNextStepButtonAttribute('class')).toMatch('disabled');

        if(browser.params.device === 'mobile'){
            SelectLocationsPO.changeSelectedMode();
            AppPO.browserScrollTo(0, 500);
        };

        VenueMapPO.selectZone(qaData.firstGraphicNumberedZone, 'numbered');

        VenueMapPO.selectNumberedSeats(1, true); //firstSeat, numberOfSeats, adjacentSeats
        if(browser.params.device !== 'mobile'){
            expect(VenueMapPO.getTooltipInfo()[0].basePrice.getText()).toEqual(qaData.selectedSeats[0].basePrice);
            expect(VenueMapPO.getTooltipInfo()[0].pricePromoAuto.getText()).toEqual(qaData.selectedSeats[0].pricePromoAuto);
            expect(VenueMapPO.getTooltipInfo()[0].charges.getText()).toEqual('+ Cargos ' + qaData.selectedSeats[0].charges);
            expect(VenueMapPO.getTooltipInfo()[0].finalPrice.getText()).toEqual('Precio final: ' + qaData.selectedSeats[0].finalPrice);
        }

        expect(AppPO.getNextStepButtonAttribute('class')).not.toMatch('disabled');

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.finalPrice[0]);
    });

    it('Verificamos que la localidad aparece correctamente en el carro de la compra', function(){
        browser.driver.sleep(2000);
        expect(SiteCartPO.getShoppingCartAttribute('class')).not.toMatch('shopping-cart-disabled');
        expect(SiteCartPO.getLocationsAmount()).toBe('1');

        if(browser.params.device === 'mobile'){
            SiteCartPO.expandMobileSiteCart();
        }else{
            SiteCartPO.expandCollapseSiteCart();
        }

        expect(SiteCartPO.getEventTitle(qaData.sessionSelected.sessionId)).toEqual(qaData.sessionSelected.eventTitle);
        expect(SiteCartPO.getEventDate(qaData.sessionSelected.sessionId)).toEqual(qaData.sessionSelected.eventDate);
        expect(SiteCartPO.getAllSessionsSelected().count()).toBe(1);
        expect(SiteCartPO.getSessionLocationsAmount(qaData.sessionSelected.sessionId)).toEqual('1');
        expect(SiteCartPO.getSessionSelectionBasePrice(qaData.sessionSelected.sessionId)).toEqual(qaData.selectedSeats[0].basePrice);
        expect(SiteCartPO.getSessionChargesOrPromos(qaData.sessionSelected.sessionId, 'sessionData.automaticPromotionName', 2)).toEqual(qaData.selectedSeats[0].promos);
        expect(SiteCartPO.getSessionChargesOrPromos(qaData.sessionSelected.sessionId, 'sessionData.showCharges', 2)).toEqual('+' + qaData.selectedSeats[0].charges);

        expect(SiteCartPO.getFinalPrice()).toEqual(qaData.selectedSeats[0].finalPrice);
    });

    it('Deseleccionamos la localidad anterior y verificamos que no tenemos tickets en el summary', function() {
        if(browser.params.device === 'mobile'){
            SiteCartPO.collapseMobileSiteCart();
        }else{
            SiteCartPO.expandCollapseSiteCart();
        }
        browser.driver.sleep(2000);
        AppPO.browserScrollTo(0, 500);
        VenueMapPO.selectUnselectSeat(seatsSelected[0], 'unselect');
        seatsSelected.pop(seatsSelected[0]);

        expect(SummaryPO.getAllSessionsInfo().count()).toEqual(0);
        expect(SiteCartPO.getLocationsAmount()).toBe('0');

        if(browser.params.device !== 'mobile'){
            expect(SiteCartPO.getShoppingCartAttribute('class')).toMatch('shopping-cart-disabled');
        }
    });

    it('Accedemos a una zona no numerada, seleccionamos una localidad y verificamos el precio en el summary', function() {
        AppPO.browserScrollTo(0, 200);
        VenueNavPO.mapGoBack();
        VenueMapPO.selectZone(qaData.secondGraphicNumberedZone);
        VenueMapPO.selectZone(qaData.graphicNoNumberedZone);

        if(browser.params.device !== 'mobile'){
            expect(VenueMapPO.getTooltipInfo()[0].basePrice.getText()).toEqual(qaData.selectedSeats[2].basePrice);
            expect(VenueMapPO.getTooltipInfo()[0].pricePromoAuto.getText()).toEqual(qaData.selectedSeats[2].pricePromoAuto);
            expect(VenueMapPO.getTooltipInfo()[0].charges.getText()).toEqual('Cargos ' + qaData.selectedSeats[2].charges);
        }

        VenueMapPO.selectNoNumberedSeats(1);

        if(browser.params.device === 'mobile'){
            AppPO.browserScrollTo(0, 1000);
        }

        SummaryPO.deleteSeatBySessionAndPosition(qaData.sessionId, 0, 'cancel');
        expect(SummaryPO.getFinalPrice()).toEqual(qaData.selectedSeats[2].finalPrice);

        SummaryPO.deleteSeatBySessionAndPosition(qaData.sessionId, 0, 'delete');
        expect(SummaryPO.getAllSessionsInfo().count()).toEqual(0);

        expect(SiteCartPO.getLocationsAmount()).toBe('0');
        if(browser.params.device !== 'mobile'){
            expect(SiteCartPO.getShoppingCartAttribute('class')).toMatch('shopping-cart-disabled');
        }
    });

    it('Seleccionamos localidades de varias zonas de precio y verificamos que los precios son correctos', function(){
        AppPO.browserScrollTo(0, 300);
        VenueNavPO.mapGoBack();

        VenueMapPO.selectZone(qaData.firstGraphicNumberedZone);
        VenueMapPO.selectNumberedSeats(2, true); //firstSeat, numberOfSeats, adjacentSeats
        VenueNavPO.mapGoBack();

        VenueMapPO.selectZone(qaData.secondGraphicNumberedZone);
        VenueMapPO.selectNumberedSeats(1, true);

        VenueNavPO.mapGoBack();
        VenueMapPO.selectZone(qaData.thirdGraphicNumberedZone);
        VenueNavPO.mapTransform(qaData.mapTransform);
        VenueMapPO.selectNumberedSeats(1, true); //firstSeat, numberOfSeats, adjacentSeats

        SummaryPO.getTicketsInfo(qaData.sessionId).then(function(sectorSeats){
            for(var i = 0; i < sectorSeats.length; i++){
                expect(sectorSeats[i]).toEqual(qaData.selectedSeats[i].sectorName);
            }
        });

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.finalPrice[1]);
    });
});