var B2bPO = require('./../../page-objects/b2b.po.js'),
    SessionCardPO = require('./../../page-objects/session-card.po.js'),
    AppPO = require('./../../page-objects/app.po.js');

var genericData = require('./../generic-data.json'),
    noDeleteBookings = require('./suite-data.' + browser.params.env + '.json').noDeleteBookings;

describe ('Eliminar reservas', function (){
    var bookingOrders = [],
        sessionInfo;

    it('Acceder a un canal B2B y obtener un listado de todas las reservas', function(){
        browser.get(browser.baseUrl + genericData.channels.b2b + genericData.channels.states.login);
        B2bPO.loginUser(genericData.b2bUsersData[0].user, genericData.b2bUsersData[0].password);
        browser.driver.sleep(3000);
        B2bPO.openSideMenu();
        B2bPO.selectBookingsInMenu();
        B2bPO.getBookingsList('orderCode').getText().then(function(bookingsList){
            for(var i = 0; i < bookingsList.length; i++){
                if(noDeleteBookings.indexOf(bookingsList[i]) < 0){
                    B2bPO.goToBooking(bookingsList[i]);
                    B2bPO.cancelAllBooking();
                }
            }
        });   
    });
});