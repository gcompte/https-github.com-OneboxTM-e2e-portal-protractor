var B2bPO = require('./../../page-objects/b2b.po.js'),
    VenueNoMapPO = require('./../../page-objects/venue-no-map.po.js'),
    SiteCartPO = require('./../../page-objects/site-cart.po.js'),
    ValidateCartPO = require('./../../page-objects/validate-cart.po.js'),
    AppPO = require('./../../page-objects/app.po.js');

var genericData = require('./../generic-data.json'),
    qaData = require('./suite-data.' + browser.params.env + '.json').qa3488;

describe ('QA-3488 Verificar que se puede hacer una reserva en un canal portal B2B', function (){
    var bookingOrders = [];

    beforeAll(function() {
        browser.get(browser.baseUrl + genericData.channels.b2b + genericData.channels.states.login);
    });

    it('Acceder a un canal B2B, seleccionar un evento, una sesión y localidades de esa sesión y validamos el carrito', function(){
        B2bPO.loginUser(genericData.b2bUsersData[0].user, genericData.b2bUsersData[0].password);
 
        B2bPO.goToEvent(qaData.eventId);
        B2bPO.goToSession(qaData.firstSessionId);

        VenueNoMapPO.selectNoGraphicSeats(qaData.firstNoGraphicZone, qaData.seatsToSelect[0]);
        VenueNoMapPO.selectNoGraphicSeats(qaData.secondNoGraphicZone, qaData.seatsToSelect[1]);

        expect(SiteCartPO.getB2BSessionLocationsAmount(qaData.firstSessionId)).toEqual(qaData.seatsSelected[0]);
        expect(SiteCartPO.getFinalPrice()).toEqual(qaData.totalPrice[0]);
    });

    it('Avanzamos en el proceso y hacemos la reserva insertando un valor en el campo "Notas"', function(){
        SiteCartPO.b2bValidateCart();
        ValidateCartPO.setBooking();

        B2bPO.setBookingNotes(qaData.bookingNotes);
        B2bPO.nextStep();
        B2bPO.getOrderCode().then(function(orderCodeTxt){
            expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + genericData.channels.b2b + genericData.channels.states.bookingConfirm + orderCodeTxt);
            bookingOrders.unshift(orderCodeTxt);
        });
    });

    it('Accedemos de nuevo al evento y realizamos otra reserva', function(){
        B2bPO.nextStep();
        B2bPO.goToEvent(qaData.eventId);
        B2bPO.goToSession(qaData.secondSessionId);
        VenueNoMapPO.selectNoGraphicSeats(qaData.thirdNoGraphicZone, qaData.seatsToSelect[2]);

        expect(SiteCartPO.getB2BSessionLocationsAmount(qaData.secondSessionId)).toEqual(qaData.seatsSelected[1]);
        expect(SiteCartPO.getFinalPrice()).toEqual(qaData.totalPrice[1]);

        SiteCartPO.b2bValidateCart();
        ValidateCartPO.setBooking();

        B2bPO.nextStep();
        B2bPO.getOrderCode().then(function(orderCodeTxt){
            expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + genericData.channels.b2b + genericData.channels.states.bookingConfirm + orderCodeTxt);
            bookingOrders.unshift(orderCodeTxt);
        });
    });

    it('Verificamos que las dos reservas aparecen en el listado de reservas del canal', function(){
        B2bPO.nextStep();
        B2bPO.openSideMenu();
        B2bPO.selectBookingsInMenu();
        B2bPO.getBookingsList('orderCode').getText().then(function(bookingsList){
            for(var i = 0; i < 2; i++){
                expect(bookingOrders[i]).toEqual(bookingsList[i]);
            };
        });
    });

    it('Accedemos a la primera reserva realizada y verificamos que el campo "Notas" se ha guardado correctamente', function(){
        B2bPO.goToBooking(bookingOrders[bookingOrders.length-1]);
        expect(B2bPO.getBookingNotes()).toEqual(qaData.bookingNotes);
    });
});