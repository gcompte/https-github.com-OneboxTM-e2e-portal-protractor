var B2bPO = require('./../../page-objects/b2b.po.js'),
    SessionCardPO = require('./../../page-objects/session-card.po.js'),
    AppPO = require('./../../page-objects/app.po.js');

var genericData = require('./../generic-data.json'),
    qaData = require('./suite-data.' + browser.params.env + '.json').qa3486;

describe ('QA-3486 Verificar que se visualiza un listado de Reservas en canal portal B2B', function (){
    var sessionInfo;

    beforeAll(function() {
        browser.get(browser.baseUrl + genericData.channels.b2b + genericData.channels.states.login);
    });

    it('Acceder a un canal B2B y abrir el listado de reservas', function(){
        B2bPO.loginUser(genericData.b2bUsersData[0].user, genericData.b2bUsersData[0].password);
        browser.driver.sleep(1000);
        B2bPO.openSideMenu();
        B2bPO.selectBookingsInMenu();
        expect(B2bPO.getBookingsList().count()).toBeGreaterThan(0);
    });

    it('Verificar que una reserva con una nota informada se visualiza correctamente', function(){
        expect(B2bPO.getBookingById(qaData.bookings[0][0])).toEqual(qaData.bookings[0]);
        expect(B2bPO.getBookingChannelType(qaData.bookings[0][0], 'portal').isPresent()).toBe(true);

        B2bPO.goToBooking(qaData.bookings[0][0]);
        expect(B2bPO.getBookingDetails()).toEqual(qaData.bookingsExtended[0]);

        B2bPO.getActionButtons().getText().then(function(actionButtons){
            expect(actionButtons.length).toEqual(4);
            expect(actionButtons).toEqual(qaData.bookingActionButtons);
        });

        sessionInfo = SessionCardPO.getSessionInfo(qaData.sessionsBooked[0].id);

        expect(sessionInfo.sessionTitle.getText()).toEqual(qaData.sessionsBooked[0].title);
        expect(sessionInfo.sessionDate.getText()).toEqual(qaData.sessionsBooked[0].date);
        expect(sessionInfo.sessionTime.getText()).toEqual(qaData.sessionsBooked[0].time);
        expect(sessionInfo.sessionLocation.getText()).toEqual(qaData.sessionsBooked[0].location);
        expect(SessionCardPO.getAllTicketsSelected(qaData.sessionsBooked[0].id).count()).toBe(qaData.sessionsBooked[0].count);

        AppPO.browserScrollTo(0, 0);
        B2bPO.goBack();
    });

    it('Verificar que una reserva sin nota informada se visualiza correctamente', function(){
        expect(B2bPO.getBookingById(qaData.bookings[1][0])).toEqual(qaData.bookings[1]);
        expect(B2bPO.getBookingChannelType(qaData.bookings[0][0], 'portal').isPresent()).toBe(true);

        B2bPO.goToBooking(qaData.bookings[1][0]);
        expect(B2bPO.getBookingDetails()).toEqual(qaData.bookingsExtended[1]);

        B2bPO.getActionButtons().getText().then(function(actionButtons){
            expect(actionButtons.length).toEqual(4);
            expect(actionButtons).toEqual(qaData.bookingActionButtons);
        });

        sessionInfo = SessionCardPO.getSessionInfo(qaData.sessionsBooked[1].id);

        expect(sessionInfo.sessionTitle.getText()).toEqual(qaData.sessionsBooked[1].title);
        expect(sessionInfo.sessionDate.getText()).toEqual(qaData.sessionsBooked[1].date);
        expect(sessionInfo.sessionTime.getText()).toEqual(qaData.sessionsBooked[1].time);
        expect(sessionInfo.sessionLocation.getText()).toEqual(qaData.sessionsBooked[1].location);
        expect(SessionCardPO.getAllTicketsSelected(qaData.sessionsBooked[1].id).count()).toBe(qaData.sessionsBooked[1].count);
    });
});