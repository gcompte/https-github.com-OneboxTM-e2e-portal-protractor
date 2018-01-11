var EventCardPO = require('./../../../page-objects/event-card.po.js'),
    VenueNoMapPO = require('./../../../page-objects/venue-no-map.po.js'),
    UserDataPO = require('./../../../page-objects/user-data.po.js'),
    PaymentDetailsPO = require('./../../../page-objects/payment-details.po.js'),
    PurchaseConfirmPO = require('./../../../page-objects/purchase-confirm.po.js'),
    SummaryPO = require('./../../../page-objects/summary.po.js'),
    AppPO = require('./../../../page-objects/app.po.js');

var genericData = require('./../../generic-data.json'),
    qaData = require('./suite-data.' + browser.params.env + '.json').qa2994;

describe('QA-2994 Seleccionar un método de entrega y retroceder para seleccionar una entrada más y terminar compra OK', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.eventUrl);
    });

    it('Abrimos la ficha del evento', function() {
        AppPO.closeCookiesPolicy();
        expect(EventCardPO.getEventTitle()).toEqual(qaData.eventTitle);
    });

    it('Accedemos a la selección de localidades de una sesión en concreto y seleccionamos localidades, verificamos que el precio final es correcto', function() {
        browser.driver.sleep(3000);
        EventCardPO.boxSessionTime(qaData.sessionId);
        browser.driver.sleep(3000);
        VenueNoMapPO.selectNoGraphicSeats(qaData.noGraphicZone, 1);

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.finalPrice[0]);
    });

    it('Accedemos a la pantalla de datos personales, seleccionamos un método de entrega con coste añadido y verificamos el precio final, y que en el summary se muestra la información del método de entrega', function() {
        AppPO.goToNextStepSales();
        UserDataPO.deliveryMethodsAction(qaData.deliveryMethodPosition, 'select');

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.finalPrice[1]);

        UserDataPO.getAdditionalCosts().then(function(additionalCosts){
            console.log('additionalCosts', additionalCosts.length);
            expect(additionalCosts[0].concept).toEqual(qaData.deliveryMethod.name);
            expect(additionalCosts[0].price).toBe(qaData.deliveryMethod.cost[0]);
        });
    });

    it('Volvemos a la selección de localidades y seleccionamos una butaca más', function(){
        AppPO.goBack();
        VenueNoMapPO.selectNoGraphicSeats(qaData.noGraphicZone, 2);

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.finalPrice[2]);
    });

    it('Accedemos a la pantalla de datos personales de nuevo, verificamos el método de entrega y el summary, y continuamos la compra', function() {
        browser.driver.sleep(2000);
        AppPO.goToNextStepSales();

        expect(UserDataPO.deliveryMethodsAction(qaData.deliveryMethodPosition, 'status')).toMatch('checked');
        expect(SummaryPO.getFinalPrice()).toEqual(qaData.finalPrice[3]);

        UserDataPO.setUserData(genericData.userData.name, genericData.userData.surname, genericData.userData.email);
        UserDataPO.selectPaymentMethod(qaData.paymentMethodPosition);

        UserDataPO.continueToPay();
    });

    it('Rellenamos los datos de la tarjeta de crédito, y verificamos el pago correcto', function(){
        browser.driver.sleep(5000);
        browser.ignoreSynchronization = true;
        AppPO.switchContext('pasarelaIframe');
        browser.driver.sleep(2000);

        PaymentDetailsPO.paymentRedsys(genericData.paymentData.card, genericData.paymentData.securityCode);
        PaymentDetailsPO.setCipCode(genericData.paymentData.cipCode);
        PaymentDetailsPO.endPayment();

        AppPO.switchContext('default');
        browser.ignoreSynchronization = false;

        expect(PurchaseConfirmPO.getOrderCode().isPresent()).toBe(true);
    });
});
