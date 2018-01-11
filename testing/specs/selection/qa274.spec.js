var VenueNoMapPO = require('./../../page-objects/venue-no-map.po.js'),
    SummaryPO = require('./../../page-objects/summary.po.js'),
    ValidateCartPO = require('./../../page-objects/validate-cart.po.js'),
    UserDataPO = require('./../../page-objects/user-data.po.js'),
    PaymentDetailsPO = require('./../../page-objects/payment-details.po.js'),
    PurchaseConfirmPO = require('./../../page-objects/purchase-confirm.po.js'),
    AppPO = require('./../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa274;

describe('QA-274 Comprobar que se indican las localidades con Visibilidad Nula o Reducida en recinto no grafico', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.url);
    });

    it('Accedemos a una sesión y seleccionamos tres localidades, una con visibilidad buena, otra con visibilidad reducida, y otra con visibilidad nula.', function() {
        VenueNoMapPO.selectNoGraphicSeats(qaData.goodVisibilityZoneId, 1);
        VenueNoMapPO.selectNoGraphicSeats(qaData.reducedVisibilityZoneId, 1);
        VenueNoMapPO.selectNoGraphicSeats(qaData.zeroVisibilityZoneId, 1);
    });

    //En la versión CANARY-FLOW no aparece el mensaje de visibilidad reducida o nula en el summary-selection, se está validando la solución
    it('Verificamos que en el summary se muestra correctamente la información de la visibilidad', function() {
        SummaryPO.getAllTickets().then(function(ticketsList){
            for(var i = 0; i < ticketsList.length; i++){
                expect(SummaryPO.getTicketVisibility(ticketsList[i], 'NULL').getText()).toEqual(qaData.ticketsVisibilityNull[i]);
                expect(SummaryPO.getTicketVisibility(ticketsList[i],   'REDUCED').getText()).toEqual(qaData.ticketsVisibilityReduced[i]);
            };
        });
    });

    it('Accedemos a la pantalla de validar carrito y verificamos que se muestra correctamente la información de visibilidad de las localidades', function() {
        AppPO.browserScrollTo(0, 200);
        AppPO.goToNextStep();

        ValidateCartPO.getSessionSeatsSelectedInfo(qaData.sessionId).then(function(seatsSelected){
            expect(seatsSelected[2].getText()).toMatch(qaData.zeroVisibilityText);
            expect(ValidateCartPO.getSeatsSelectedVisibility(seatsSelected[2], 'zero')).toBe(true);
            expect(seatsSelected[0].getText()).not.toMatch(qaData.zeroVisibilityText);
            expect(seatsSelected[0].getText()).not.toMatch(qaData.reducedVisibilityText);
            expect(ValidateCartPO.getSeatsSelectedVisibility(seatsSelected[0], 'zero')).toBe(false);
            expect(ValidateCartPO.getSeatsSelectedVisibility(seatsSelected[0], 'reduced')).toBe(false);
            expect(seatsSelected[1].getText()).toMatch(qaData.reducedVisibilityText);
            expect(ValidateCartPO.getSeatsSelectedVisibility(seatsSelected[1], 'reduced')).toBe(true);
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
            expect(seatsSelected[2].getText()).toMatch(qaData.zeroVisibilityText);
            expect(PurchaseConfirmPO.getSeatsBoughtVisibility(seatsSelected[2], 'zero')).toBe(true);
            expect(seatsSelected[0].getText()).not.toMatch(qaData.zeroVisibilityText);
            expect(seatsSelected[0].getText()).not.toMatch(qaData.reducedVisibilityText);
            expect(PurchaseConfirmPO.getSeatsBoughtVisibility(seatsSelected[0], 'zero')).toBe(false);
            expect(PurchaseConfirmPO.getSeatsBoughtVisibility(seatsSelected[0], 'reduced')).toBe(false);
            expect(seatsSelected[1].getText()).toMatch(qaData.reducedVisibilityText);
            expect(PurchaseConfirmPO.getSeatsBoughtVisibility(seatsSelected[1], 'reduced')).toBe(true);
        });
    });
});