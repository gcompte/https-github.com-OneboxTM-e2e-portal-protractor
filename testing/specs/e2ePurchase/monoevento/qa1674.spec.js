var VenueMapPO = require('./../../../page-objects/venue-map.po.js'),
    VenueNavPO = require('./../../../page-objects/venue-nav.po.js'),
    SummaryPO = require('./../../../page-objects/summary.po.js'),
    SelectLocationsPO = require('./../../../page-objects/select-locations.po.js'),
    AppPO = require('./../../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa1674;

describe('QA-1674 [Portal 3.0] [Monoevento] Selección de localidades en recinto gráfico con ZNN', function() {
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
    
        //En móvil no tenemos tooltip  
        if(browser.params.device !== 'mobile'){
            expect(VenueMapPO.getTooltipInfo()[0].basePrice.getText()).toEqual(qaData.selectedNumberedSeats[1].basePrice);
            expect(VenueMapPO.getTooltipInfo()[0].pricePromoAuto.getText()).toEqual(qaData.selectedNumberedSeats[1].pricePromoAuto);
            expect(VenueMapPO.getTooltipInfo()[0].charges.getText()).toEqual('+ Cargos ' + qaData.selectedNumberedSeats[1].charges);
            expect(VenueMapPO.getTooltipInfo()[0].finalPrice.getText()).toEqual('Precio final: ' + qaData.selectedNumberedSeats[1].finalPrice);            
        }

        expect(AppPO.getNextStepButtonAttribute('class')).not.toMatch('disabled');
        
        expect(SummaryPO.getTicketsInfo(qaData.sessionId, 0)).toEqual(qaData.selectedNumberedSeats[1].sectorName);
        expect(SummaryPO.getFinalPrice()).toEqual(qaData.selectedNumberedSeats[1].finalPrice);
    });

    it('Deseleccionamos la localidad anterior y verificamos que no tenemos sesiones en el "selection-summary"', function() {
        VenueMapPO.selectUnselectSeat(seatsSelected[0], 'unselect');
        seatsSelected.pop(seatsSelected[0]);

        expect(SummaryPO.getAllSessionsInfo().count()).toEqual(0);
    });

    it('Accedemos a una zona no numerada, seleccionamos una localidad y verificamos el precio en el summary', function() {
        VenueNavPO.mapGoBack();

        VenueMapPO.selectZone(qaData.secondGraphicNumberedZone);
        VenueMapPO.selectZone(qaData.graphicNoNumberedZone);

        //En móvil no tenemos tooltip  
        if(browser.params.device !== 'mobile'){
            expect(VenueMapPO.getTooltipInfo()[0].basePrice.getText()).toEqual(qaData.selectedNoNumberedSeats[0].basePrice);
            expect(VenueMapPO.getTooltipInfo()[0].pricePromoAuto.getText()).toEqual(qaData.selectedNoNumberedSeats[0].pricePromoAuto);
            expect(VenueMapPO.getTooltipInfo()[0].charges.getText()).toEqual('Cargos ' + qaData.selectedNoNumberedSeats[0].charges);
        }

        VenueMapPO.selectNoNumberedSeats(1);

        expect(SummaryPO.getTicketsInfo(qaData.sessionId)).toEqual(qaData.selectedNoNumberedSeats[0].ticketInfo);
        expect(SummaryPO.getFinalPrice()).toEqual(qaData.selectedNoNumberedSeats[0].finalPrice);

        if(browser.params.device === 'mobile'){
            AppPO.browserScrollTo(0, 1000);
        }
        SummaryPO.deleteSeatBySessionAndPosition(qaData.sessionId, 0, 'delete');
        expect(SummaryPO.getAllSessionsInfo().count()).toEqual(0);
    });

    it('Seleccionamos localidades de varias zonas de precio y verificamos que los precios son correctos', function(){
        if(browser.params.device === 'mobile'){
            AppPO.browserScrollTo(0, 500);
        }

        VenueMapPO.selectNumberedSeats(1, true);
        VenueNavPO.mapGoBack();

        VenueMapPO.selectZone(qaData.firstGraphicNumberedZone);
        VenueMapPO.selectNumberedSeats(2, true); //firstSeat, numberOfSeats, adjacentSeats

        VenueNavPO.mapGoBack();
        VenueMapPO.selectZone(qaData.thirdGraphicNumberedZone);

        if(browser.params.device !== 'mobile'){
            VenueNavPO.mapTransform(qaData.mapTransform);
        }

        VenueMapPO.selectNumberedSeats(1, true); //firstSeat, numberOfSeats, adjacentSeats

        SummaryPO.getTicketsInfo(qaData.sessionId).then(function(ticketsInfo){
            for(var i = 0; i < ticketsInfo.length; i++){
                expect(ticketsInfo[i]).toEqual(qaData.selectedNumberedSeats[i].sectorName);
            }
        });

        SummaryPO.getTicketBasePrice(qaData.sessionId).getText().then(function(ticketsBasePrice){
            for(var i = 0; i < ticketsBasePrice.length; i++){
                expect(ticketsBasePrice[i]).toEqual(qaData.selectedNumberedSeats[i].basePrice);
            }
        });

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.finalPrice);
    });
});