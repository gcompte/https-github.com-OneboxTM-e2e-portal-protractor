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
    qaData = require('./suite-data.' + browser.params.env + '.json').qa3920;

describe('QA-3920 Evento con restricción de otro evento -- Compra en dos sesiones distintas, las dos con restricción', function() {
    it('Seleccionamos localidades de las dos sesiones y verificamos que al avanzar nos aparece el modal para seleccionar localidades del evento padre', function() {
        browser.get(browser.baseUrl + qaData.firstChildEvent.url);

        AppPO.closeCookiesPolicy();
        EventCardPO.boxSessionTime(qaData.firstChildEvent.restrictedSessionId);
        VenueNoMapPO.selectNoGraphicSeats(qaData.firstChildEvent.noGraphicZone, 2);

        browser.get(browser.baseUrl + qaData.secondChildEvent.url);
        VenueNoMapPO.selectNoGraphicSeats(qaData.secondChildEvent.noGraphicZone, 1);

        AppPO.browserScrollTo(0, 500);
        AppPO.goToNextStepSales();
        AppPO.goToNextStep();

        expect(ValidateCartPO.getModalText()).toEqual(qaData.firstChildEvent.restrictionMessage);
    });

    it('Clicamos en "Sí, añadir entradas ahora", y seleccionamos localidades del evento padre, para la primera de las sesiones del evento hijo. Avanzamos y verificamos que sigue apareciendo el modal, ya que no tenemos localidades para la segunda sesión del evento hijo', function() {
        ValidateCartPO.buyTicketsOfAnotherEvent(true);
        VenueNoMapPO.selectNoGraphicSeats(qaData.mainEvent.noGraphicZone, 2);

        browser.driver.sleep(2000);
        AppPO.goToNextStepSales();
        AppPO.goToNextStep();

        expect(ValidateCartPO.getModalText()).toEqual(qaData.secondChildEvent.restrictionMessage);
    });

    it('Añadimos localidades para la segunda sesión del evento hijo y terminamos la compra', function(){
        ValidateCartPO.buyTicketsOfAnotherEvent(false);
        browser.driver.sleep(3000);
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
