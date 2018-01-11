var B2bPO = require('./../../page-objects/b2b.po.js'),
    VenueNoMapPO = require('./../../page-objects/venue-no-map.po.js'),
    SiteCartPO = require('./../../page-objects/site-cart.po.js'),
    ValidateCartPO = require('./../../page-objects/validate-cart.po.js'),
    AppPO = require('./../../page-objects/app.po.js');

var genericData = require('./../generic-data.json'),
    qaData = require('./suite-data.' + browser.params.env + '.json').qa2867;

describe ('QA-2867 Compra en un canal B2B seleccionando "Pago contra saldo" y "envío al mail".', function (){
    beforeAll(function() {
        browser.get(browser.baseUrl + genericData.channels.b2b + genericData.channels.states.login);
    });

    it('Acceder a un canal B2B, seleccionar un evento, una sesión y localidades de esa sesión y validamos el carrito', function(){
        B2bPO.loginUser(genericData.b2bUsersData[0].user, genericData.b2bUsersData[0].password);
        B2bPO.goToEvent(qaData.eventId);
        B2bPO.goToSession(qaData.sessionId);

        VenueNoMapPO.selectNoGraphicSeats(qaData.firstNoGraphicZone, qaData.seatsToSelect[0]);
        VenueNoMapPO.selectNoGraphicSeats(qaData.secondNoGraphicZone, qaData.seatsToSelect[1]);

        expect(SiteCartPO.getB2BSessionLocationsAmount(qaData.sessionId)).toEqual(qaData.seatsSelected);
        expect(SiteCartPO.getFinalPrice()).toEqual(qaData.totalPrice);
    });

    it('Avanzamos en el proceso y terminamos la compra', function(){
        SiteCartPO.b2bValidateCart();
        ValidateCartPO.validateCart();

        B2bPO.getPaymentMethodBalance().then(function(paymentMethodBalance){
            initBalance = AppPO.convertToNumber(paymentMethodBalance);
        });

        B2bPO.nextStep();
        B2bPO.getOrderCode().then(function(orderCodeTxt){
            expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + genericData.channels.b2b + genericData.channels.states.purchaseConfirm + orderCodeTxt);
        });
    });

    it('Verificamos que se ha descontado el precio de las entradas del saldo inicial', function(){
        B2bPO.nextStep();
        B2bPO.goToEvent(qaData.eventId);
        B2bPO.goToSession(qaData.sessionId);
        VenueNoMapPO.selectNoGraphicSeats(qaData.secondNoGraphicZone, qaData.seatsToSelect[1]);
        SiteCartPO.b2bValidateCart();
        ValidateCartPO.validateCart();

        B2bPO.getPaymentMethodBalance().then(function(actualBalancetxt){
            var initialMinusCost = AppPO.roundedNumber(initBalance-qaData.totalFinalAmount);

            expect(AppPO.convertToNumber(actualBalancetxt)).toEqual(initialMinusCost);
        });
    });
});