function loginUser(username, password) {
    element(by.id('usernameField')).sendKeys(username);
    element(by.id('passwordField')).sendKeys(password);

    return element(by.id('login-button')).click().then(function(){
        return browser.getCurrentUrl();
    });
};

function openSideMenu() {
    return element(by.id('side-menu-button')).click();
};

function selectPurchasesInMenu() {
    return element(by.cssContainingText('.chevron', 'Ventas')).click();
};

function selectBookingsInMenu() {
    return element(by.cssContainingText('.chevron', 'Reservas')).click();
};

function setSearchField(operation) {
    var field = element(by.css('.operation-term-filter'));
    field.clear();
    return field.sendKeys(operation);
};

function sendSearch() {
    return element(by.css('.operation-term-action')).click();
};

function getPurchaseList(column) {
    if(column === 'orderCode'){
        return element.all(by.repeater('operation in operationsListCtrl.operationList').column('operation.orderCode'));
    }else{
        return element.all(by.repeater('operation in operationsListCtrl.operationList'));
    }
};

function getBookingsList(column) {
    if(column === 'orderCode'){
        return element.all(by.repeater('booking in bookingsListCtrl.bookingsList').column('booking.orderCode'));
    }else{
        return element.all(by.repeater('booking in bookingsListCtrl.bookingsList'));
    }
};

function getBookingById(bookingId) {
    return element.all(by.css('#booking-' + bookingId + ' p')).getText();
};

function getSideMenu() {
    return element(by.css('#navbar .side-menu'));
};

function getOperationsListLength() {
    return element(by.binding('operationsListCtrl.operationList.length')).getText();
};

function goToEvent(eventId) {
    return element(by.css('.eventId-' + eventId)).click();
};

function goToSession(sessionId) {
    return element(by.css('.sessionId-' + sessionId)).click();
};

/*function getPaymentMethodBalance(){
    return element(by.binding('opt.info.currentBalance')).getText();
};*/

function getPaymentMethodBalance() {
    //return element(by.binding('opt.info.currentBalance')).getText();

    return element(by.binding('opt.info.currentBalance')).getText().then(function(paymentMethodBalance){
        return paymentMethodBalance.replace(/[a-z\A-Z\€]/g, "").replace(',', '.').trim();
    });
};

function nextStep() {
    return element(by.css('.lower-navigation .button')).click();
};

function getOrderCode() {
    return element(by.css('.order-code')).getText();
};

function setBookingNotes(notes) {
    return element(by.css('textarea[name="notes"]')).sendKeys(notes);
};

function getBookingNotes() {
    return element(by.css('.notes span:nth-child(2)')).getText();
};

function goToBooking(bookingId) {
    return element(by.id('booking-' + bookingId)).click();
};

function getBookingDetails(position) {
    if(position !== undefined){
        return element.all(by.css('#booking-info p span:nth-child(2)')).get(position).getText();
    }else{
        return element.all(by.css('#booking-info p span:nth-child(2)')).getText();
    }
};

function cancelAllBooking() {
    element(by.css('a[ng-click="bookingDetails.refundBooking()"]')).click();
                    
    element.all(by.repeater('ticket in sessionData.tickets')).then(function(ticketsBooked){
        for(var i = 0; i < ticketsBooked.length; i++){
            ticketsBooked[i].click();
            browser.executeScript('window.scrollTo(0, ' + 100*i + ');');
        };
    });

    element.all(by.css('.bottom-button')).get(1).click();
};

function sellParcialBooking(ticketsToSell) {
    element(by.css('a[ng-click="bookingDetails.convertToPurchase()"]')).click();

    element.all(by.repeater('ticket in sessionData.tickets')).then(function(ticketsBooked){
        for(var i = 0; i < ticketsToSell; i++){
            ticketsBooked[i].click();
            browser.executeScript('window.scrollTo(0, ' + 100*i + ');');
        };
    });

    element.all(by.css('.bottom-button')).get(1).click();
};

function goBack() {
    return element(by.css('.arrow-left')).click();
};

function getBookingChannelType(bookingId, type) {
    return element(by.css('#booking-' + bookingId + ' .booking-channel-type.channel-type-' + type));
};

function getSessionData(sessionId) {
    return element.all(by.css('#session-' + sessionId + ' .time-place span')).getText();
};

//Obtenemos los botones de acción de la ficha de una reserva
function getActionButtons() {
    return element.all(by.css('#op-buttons a'));
};

module.exports = {
    'loginUser' : loginUser,
    'openSideMenu' : openSideMenu,
    'selectPurchasesInMenu' : selectPurchasesInMenu,
    'selectBookingsInMenu' : selectBookingsInMenu,
    'setSearchField' : setSearchField,
    'sendSearch' : sendSearch,
    'getPurchaseList' : getPurchaseList,
    'getBookingsList' : getBookingsList,
    'getBookingById' : getBookingById,
    'getSideMenu' : getSideMenu,
    'getOperationsListLength' : getOperationsListLength,
    'goToEvent' : goToEvent,
    'goToSession' : goToSession,
    'getPaymentMethodBalance' : getPaymentMethodBalance,
    'nextStep' : nextStep,
    'getOrderCode' : getOrderCode,
    'setBookingNotes' : setBookingNotes,
    'getBookingNotes' : getBookingNotes,
    'goToBooking' : goToBooking,
    'goBack' : goBack,
    'getBookingDetails' : getBookingDetails,
    'cancelAllBooking' : cancelAllBooking,
    'getBookingChannelType' : getBookingChannelType,
    'getSessionData' : getSessionData,
    'getActionButtons' : getActionButtons,
    'sellParcialBooking' : sellParcialBooking
}