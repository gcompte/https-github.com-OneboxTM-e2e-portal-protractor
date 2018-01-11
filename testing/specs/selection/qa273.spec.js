var SelectLocationsPO = require('./../../page-objects/select-locations.po.js'),
    VenueMapPO = require('./../../page-objects/venue-map.po.js'),
    VenueNavPO = require('./../../page-objects/venue-nav.po.js'),
    SummaryPO = require('./../../page-objects/summary.po.js'),
    ValidateCartPO = require('./../../page-objects/validate-cart.po.js'),
    UserDataPO = require('./../../page-objects/user-data.po.js'),
    PaymentDetailsPO = require('./../../page-objects/payment-details.po.js'),
    PurchaseConfirmPO = require('./../../page-objects/purchase-confirm.po.js'),
    AppPO = require('./../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa273;

describe('QA-273 Comprobar que se indican las localidades con Visibilidad Nula o Reducida en recinto gráfico', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.url);
    });

    //Las verificaciones sobre tooltips solo las tendremos en cuenta cuando ejecutemos las pruebas en desktop
    if(browser.params.device === 'desktop'){
        it('Accedemos a una sesión y verificamos que el tooltip de una zona no numerada con visibilidad nula es correcto', function() {
            VenueMapPO.selectZone(qaData.firstGraphicNumberedZone);
            VenueMapPO.getTooltipSectionInfo(qaData.firstGraphicNoNumberedZone).then(function(tooltipSectionInfo){
                expect(tooltipSectionInfo.length).toBe(6);
                expect(tooltipSectionInfo[0]).toBe(qaData.zeroVisibility.basePrice);
                expect(tooltipSectionInfo[2]).toBe(qaData.zeroVisibility.finalPrice);
                expect(tooltipSectionInfo[3]).toBe(qaData.zeroVisibility.visibility);
                expect(tooltipSectionInfo[4]).toMatch(qaData.zeroVisibility.availability);
            });

            VenueMapPO.selectZone(qaData.firstGraphicNoNumberedZone);
            VenueMapPO.selectNoNumberedSeats(1);
        });

        it('Verificamos que el tooltip para una butaca con visibilidad buena es correcto', function() {
            VenueMapPO.getFreeSeats().then(function(freeSeatsElements){
                VenueMapPO.getTooltipSectionInfo(freeSeatsElements[0]).then(function(tooltipSectionInfo){
                    expect(tooltipSectionInfo.length).toBe(4);
                    expect(tooltipSectionInfo[0]).toBe(qaData.goodVisibility.basePrice);
                    expect(tooltipSectionInfo[2]).toBe(qaData.goodVisibility.finalPrice);
                });
            });

            VenueMapPO.selectNumberedSeats(1, true);
        });

        it('Accedemos a una zona que contenga localidades con butacas con visibilidad reducida, y verificamos que el tooltip es correcto', function() {
            VenueNavPO.mapGoBack();
            VenueMapPO.selectZone(qaData.secondGraphicNumberedZone);

            VenueMapPO.getFreeSeats().then(function(freeSeatsElements){
                VenueMapPO.getTooltipSectionInfo(freeSeatsElements[0]).then(function(tooltipSectionInfo){
                    expect(tooltipSectionInfo.length).toBe(4);
                    expect(tooltipSectionInfo[0]).toBe(qaData.reducedVisibility.basePrice);
                    expect(tooltipSectionInfo[2]).toBe(qaData.reducedVisibility.finalPrice);
                    expect(tooltipSectionInfo[3]).toBe(qaData.reducedVisibility.visibility);
                });
            });

            VenueMapPO.selectNumberedSeats(1, true);
        });
    } else {
        it('Seleccionamos localidades con visibilidad nula y visibilidad reducida', function(){
            browser.driver.sleep(4000);
            AppPO.browserScrollTo(0, 0).then(function(){
                SelectLocationsPO.changeSelectedMode().then(function(){
                    AppPO.browserScrollTo(0, 400);
                    VenueMapPO.selectZone(qaData.firstGraphicNumberedZone);
                    VenueMapPO.selectNumberedSeats(1, true);
                    VenueMapPO.selectZone(qaData.firstGraphicNoNumberedZone);
                    VenueMapPO.selectNoNumberedSeats(1);

                    /*VenueNavPO.mapGoBack();
                    VenueMapPO.selectZone(qaData.secondGraphicNumberedZone);
                    VenueMapPO.selectNumberedSeats(1, true);*/
                });
            });
        });
    }

    it('Verificamos que en el summary se muestra correctamente la información de la visibilidad', function() {
        SummaryPO.getAllTickets().then(function(ticketsList){
            for(var i = 0; i < ticketsList.length; i++){
                expect(SummaryPO.getTicketVisibility(ticketsList[i], 'NULL').getText()).toEqual(qaData.ticketsVisibilityNull[i]);
                expect(SummaryPO.getTicketVisibility(ticketsList[i],   'REDUCED').getText()).toEqual(qaData.ticketsVisibilityReduced[i]);
            };
        });
    });

    it('Accedemos a la pantalla de validar carrito y verificamos que se muestra correctamente la información de visibilidad de las localidades', function() {
        AppPO.goToNextStep();

        ValidateCartPO.getSessionSeatsSelectedInfo(qaData.sessionId).then(function(seatsSelected){
            expect(seatsSelected[0].getText()).toMatch(qaData.zeroVisibility.visibility);
            expect(ValidateCartPO.getSeatsSelectedVisibility(seatsSelected[0], 'zero')).toBe(true);
            expect(seatsSelected[1].getText()).not.toMatch(qaData.zeroVisibility.visibility);
            expect(seatsSelected[1].getText()).not.toMatch(qaData.reducedVisibility.visibility);
            expect(ValidateCartPO.getSeatsSelectedVisibility(seatsSelected[1], 'zero')).toBe(false);
            expect(ValidateCartPO.getSeatsSelectedVisibility(seatsSelected[1], 'reduced')).toBe(false);
            expect(seatsSelected[2].getText()).toMatch(qaData.reducedVisibility.visibility);
            expect(ValidateCartPO.getSeatsSelectedVisibility(seatsSelected[2], 'reduced')).toBe(true);
        });
    });

    it('Accedemos a la pantalla de datos personales, seleccionamos método de pago y terminamos la compra', function(){
        AppPO.goToNextStep();
        
        UserDataPO.setUserData(genericData.userData.name, genericData.userData.surname, genericData.userData.email);

        AppPO.goToNextStep();
        browser.driver.sleep(5000);
        browser.ignoreSynchronization = true;
        AppPO.switchContext('pasarelaIframe');
        browser.driver.sleep(4000);

        expect(PaymentDetailsPO.setCard(genericData.paymentData.card)).toEqual(genericData.paymentData.card);
        expect(PaymentDetailsPO.setExpirationMonth(genericData.paymentData.month)).toEqual(genericData.paymentData.month);
        expect(PaymentDetailsPO.setExpirationYear(genericData.paymentData.year)).toEqual(genericData.paymentData.year);
        expect(PaymentDetailsPO.setSecurityCode(genericData.paymentData.securityCode)).toEqual(genericData.paymentData.securityCode);

        PaymentDetailsPO.acceptPayment();

        browser.driver.sleep(4000);
        expect(PaymentDetailsPO.setCipCode(genericData.paymentData.cipCode)).toEqual(genericData.paymentData.cipCode);

        PaymentDetailsPO.endPayment();
    });

    it('Verificamos que llegamos a la pantalla de confirmación de la compra, y que aparece el mensaje de localidades no contiguas', function(){
        AppPO.switchContext('default');
        browser.ignoreSynchronization = false;

        expect(PurchaseConfirmPO.getOrderCode().isPresent()).toBe(true);

        PurchaseConfirmPO.getSessionSeatsBoughtInfo(qaData.sessionId).then(function(seatsSelected){
            expect(seatsSelected[0].getText()).toMatch(qaData.zeroVisibility.visibility);
            expect(PurchaseConfirmPO.getSeatsBoughtVisibility(seatsSelected[0], 'zero')).toBe(true);
            expect(seatsSelected[1].getText()).not.toMatch(qaData.zeroVisibility.visibility);
            expect(seatsSelected[1].getText()).not.toMatch(qaData.reducedVisibility.visibility);
            expect(PurchaseConfirmPO.getSeatsBoughtVisibility(seatsSelected[1], 'zero')).toBe(false);
            expect(PurchaseConfirmPO.getSeatsBoughtVisibility(seatsSelected[1], 'reduced')).toBe(false);
            expect(seatsSelected[2].getText()).toMatch(qaData.reducedVisibility.visibility);
            expect(PurchaseConfirmPO.getSeatsBoughtVisibility(seatsSelected[2], 'reduced')).toBe(true);
        });
    });
});