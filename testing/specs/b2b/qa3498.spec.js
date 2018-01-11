var B2bPO = require('./../../page-objects/b2b.po.js'),
    VenueNoMapPO = require('./../../page-objects/venue-no-map.po.js'),
    SiteCartPO = require('./../../page-objects/site-cart.po.js'),
    ValidateCartPO = require('./../../page-objects/validate-cart.po.js'),
    SessionCardPO = require('./../../page-objects/session-card.po.js'),
    AppPO = require('./../../page-objects/app.po.js');

var genericData = require('./../generic-data.json'),
    qaData = require('./suite-data.' + browser.params.env + '.json').qa3498;

describe ('QA-3498 Verificar que se puede convertir reserva (parcial) a compra desde canal portal B2B', function (){
    var bookingOrder = [];

    beforeAll(function() {
        browser.get(browser.baseUrl + genericData.channels.b2b + genericData.channels.states.login);
    });

    it('Acceder a un canal B2B y realizar una reserva', function(){
        B2bPO.loginUser(genericData.b2bUsersData[0].user, genericData.b2bUsersData[0].password);
 
        B2bPO.goToEvent(qaData.eventId);
        B2bPO.goToSession(qaData.firstSessionId);

        VenueNoMapPO.selectNoGraphicSeats(qaData.firstNoGraphicZone, qaData.seatsToSelect[0]);
        VenueNoMapPO.selectNoGraphicSeats(qaData.secondNoGraphicZone, qaData.seatsToSelect[1]);

        expect(SiteCartPO.getB2BSessionLocationsAmount(qaData.firstSessionId)).toEqual(qaData.seatsSelected[0]);
        expect(SiteCartPO.getFinalPrice()).toEqual(qaData.totalPrice[0]);

        SiteCartPO.b2bValidateCart();
        ValidateCartPO.setBooking();

        B2bPO.nextStep();
        B2bPO.getOrderCode().then(function(orderCodeTxt){
            expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + genericData.channels.b2b + genericData.channels.states.bookingConfirm + orderCodeTxt);
            bookingOrder.unshift(orderCodeTxt);
        });
    });

    it('Accedemos a la reserva creada', function(){
        B2bPO.openSideMenu();
        browser.driver.sleep(2000);
        B2bPO.selectBookingsInMenu();
        B2bPO.goToBooking(bookingOrder);

        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + genericData.channels.b2b + genericData.channels.states.bookingDetail + bookingOrder);

        expect(B2bPO.getBookingDetails(7)).toEqual(qaData.seatsSelected[0]);
        expect(SessionCardPO.getAllTicketsSelected(qaData.firstSessionId).count()).toEqual(parseInt(qaData.seatsSelected[0]));
    });

    it('Convertimos reserva a compra de manera parcial', function(){
        B2bPO.sellParcialBooking(qaData.ticketsToSell);
        B2bPO.nextStep();
        B2bPO.openSideMenu();
        browser.driver.sleep(2000);
        B2bPO.selectBookingsInMenu();
        /*B2bPO.goToBooking(bookingOrder);

        expect(B2bPO.getBookingDetails(7)).toEqual(qaData.seatsSelected[0]);
        expect(SessionCardPO.getAllTicketsSelected(qaData.firstSessionId).count()).toEqual(parseInt(qaData.seatsSelected[0]));*/
    });
});