var EventCardPO = require('./../../../page-objects/event-card.po.js'),
    UserDataPO = require('./../../../page-objects/user-data.po.js'),
    VenueNoMapPO = require('./../../../page-objects/venue-no-map.po.js'),
    VenueMapPO = require('./../../../page-objects/venue-map.po.js'),
    SummaryPO = require('./../../../page-objects/summary.po.js'),
    PaymentDetailsPO = require('./../../../page-objects/payment-details.po.js'),
    PurchaseConfirmPO = require('./../../../page-objects/purchase-confirm.po.js'),
    SelectLocationsPO = require('./../../../page-objects/select-locations.po.js'),
    ValidateCartPO = require('./../../../page-objects/validate-cart.po.js'),
    AppPO = require('./../../../page-objects/app.po.js');

var genericData = require('./../../generic-data.json'),
    qaData = require('./suite-data.' + browser.params.env + '.json').qa3913;

describe('QA-3913 Evento con restricción de otro evento -- Compra en dos sesiones distintas, una con restricción y otra sin restricción', function() {
    it('Seleccionamos localidades de las dos sesiones y verificamos que al avanzar nos aparece el modal para seleccionar localidades del evento padre', function() {
        browser.get(browser.baseUrl + qaData.firstChildEvent.url);

        AppPO.closeCookiesPolicy();
        EventCardPO.boxSessionTime(qaData.firstChildEvent.restrictedSessionId);
        VenueNoMapPO.selectNoGraphicSeats(qaData.firstChildEvent.noGraphicZone, 3);

        browser.get(browser.baseUrl + qaData.noRestrictedEvent.url);
        EventCardPO.boxSessionTime(qaData.noRestrictedEvent.sessionId);
        VenueNoMapPO.selectNoGraphicSeats(qaData.noRestrictedEvent.noGraphicZone, 1);

        AppPO.browserScrollTo(0, 500);
        AppPO.goToNextStepSales();
        AppPO.goToNextStep();

        expect(ValidateCartPO.getModalText()).toEqual(qaData.firstChildEvent.restrictionMessage);
    });

    it('Clicamos en el botón "No, ya tengo las entradas de ...", y verificamos que accedemos a la pantalla de datos de usuario, seleccionamos localidades de una sesión del padre que no sea la coincidente con el evento hijo', function() {
        ValidateCartPO.buyTicketsOfAnotherEvent(false);
        expect(browser.getCurrentUrl()).toMatch(genericData.channels.states.userData);

        browser.get(browser.baseUrl + qaData.mainEvent.firstChildNoRestrictedSessionUrl);
        VenueNoMapPO.selectNoGraphicSeats(qaData.mainEvent.noGraphicZone, 1);
       
        AppPO.goToNextStepSales();
        AppPO.goToNextStep();

        expect(ValidateCartPO.getModalText()).toEqual(qaData.firstChildEvent.restrictionMessage);
    });

    it('Clicamos en "Sí, añadir entradas ahora", y seleccionamos localidades del evento padre, de la sesión coincidente con el evento hijo, pero menos de las seleccionadas en el hijo', function() {
        expect(ValidateCartPO.getModalText()).toEqual(qaData.firstChildEvent.restrictionMessage);

        ValidateCartPO.buyTicketsOfAnotherEvent(true);
        VenueNoMapPO.selectNoGraphicSeats(qaData.mainEvent.noGraphicZone, 1);

        AppPO.goToNextStepSales();
        AppPO.goToNextStep();

        expect(ValidateCartPO.getModalText()).toEqual(qaData.firstChildEvent.restrictionMessage);
    });

    it('Añadimos tantas localidades del evento padre como tenemos en el evento hijo y terminamos la compra', function(){
        ValidateCartPO.buyTicketsOfAnotherEvent(true);
        VenueNoMapPO.selectNoGraphicSeats(qaData.mainEvent.noGraphicZone, 3);
        AppPO.goToNextStep();
        AppPO.goToNextStep();

        UserDataPO.setUserData(genericData.userData.name, genericData.userData.surname, genericData.userData.email);
        AppPO.goToNextStep();
        browser.driver.sleep(5000);

        PaymentDetailsPO.paymentCash(qaData.amount).then(function(){
            expect(PurchaseConfirmPO.getOrderCode().isPresent()).toBe(true);
        });
    });
});
