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
    qaData = require('./suite-data.' + browser.params.env + '.json').qa3912;

describe('QA-3912 Evento con restricción de otro evento -- Compra en un evento con restricción de una sesión con restricción y una sesión sin restricción', function() {
    it('Seleccionamos localidades de una sesión con restricción, avanzamos y verificamos que nos aparece el popup para añadir localidades del evento padre', function() {
        browser.get(browser.baseUrl + qaData.firstChildEvent.url);

        AppPO.closeCookiesPolicy();
        EventCardPO.boxSessionTime(qaData.firstChildEvent.restrictedSessionId);
        VenueNoMapPO.selectNoGraphicSeats(qaData.firstChildEvent.noGraphicZone, 1);

        AppPO.goToNextStepSales();
        AppPO.goToNextStep();

        expect(ValidateCartPO.getModalText()).toEqual(qaData.firstChildEvent.restrictionMessage);
    });

    it('Clicamos en el botón "No, ya tengo las entradas de ...", y verificamos que accedemos a la pantalla de datos de usuario', function() {
        ValidateCartPO.buyTicketsOfAnotherEvent(false);

        expect(browser.getCurrentUrl()).toMatch(genericData.channels.states.userData);
    });

    it('Volvemos para atrás y ahora clicamos en "Sí, añadir entradas ahora", y verificamos que accedemos a la ficha de la sesión del evento padre que coincide con la fecha de la sesión seleccionada', function() {
        AppPO.goBack();
        AppPO.goToNextStep();

        expect(ValidateCartPO.getModalText()).toEqual(qaData.firstChildEvent.restrictionMessage);

        ValidateCartPO.buyTicketsOfAnotherEvent(true);

        expect(browser.getCurrentUrl()).toMatch(qaData.mainEvent.firstChildRestrictedSessionUrl);
    });

    it('Añadimos una localidad del evento padre y verificamos que no aparece el modal y nos lleva a la pantalla de datos de usuario directamente', function(){
        VenueNoMapPO.selectNoGraphicSeats(qaData.mainEvent.noGraphicZone, 1);
        AppPO.goToNextStep();
        AppPO.goToNextStep();

        expect(browser.getCurrentUrl()).toMatch(genericData.channels.states.userData);
    });

    it('Añadimos una localidad de una sesión del evento hijo que no tenga restricción y terminamos la compra', function(){
        browser.get(browser.baseUrl + qaData.firstChildEvent.url);
        EventCardPO.boxSessionTime(qaData.firstChildEvent.noRestrictedSessionId);
        VenueNoMapPO.selectNoGraphicSeats(qaData.firstChildEvent.noGraphicZone, 1);
        AppPO.goToNextStep();
        AppPO.goToNextStep();

        UserDataPO.setUserData(genericData.userData.name, genericData.userData.surname, genericData.userData.email);
        AppPO.goToNextStep();
        browser.driver.sleep(5000);

        PaymentDetailsPO.paymentCash(qaData.amount).then(function(){
            expect(PurchaseConfirmPO.getOrderCode().isPresent()).toBe(true);
        });
    });

    it('Seleccionamos localidades de una sesión que pertenezca a un evento con restricción, pero sin coincidencia con otra sesión del evento padre, avanzamos y verificamos que NO nos aparece el popup para añadir localidades del evento padre', function() {
        browser.get(browser.baseUrl + qaData.firstChildEvent.url);

        AppPO.closeCookiesPolicy();
        EventCardPO.boxSessionTime(qaData.firstChildEvent.noRestrictedSessionId);
        VenueNoMapPO.selectNoGraphicSeats(qaData.firstChildEvent.noGraphicZone, 1);

        AppPO.goToNextStepSales();
        AppPO.goToNextStep();

        expect(browser.getCurrentUrl()).toMatch(genericData.channels.states.userData);
    });
});
