var moment = require('moment');

var inputUser = element(by.id('j_username')),
    inputPassword = element(by.id('j_password')),
    submitLogin = element(by.css('.taquilla-button .button')),
    leftColumn = element(by.id('boxoffice-sidebar')),
    inputSearchTitle = element(by.id('bob-search')),
    selectedMonth = moment().format('MM'),
    selectedYear = moment().format('YYYY');

//Login
function loginUser(user, password){
    inputUser.sendKeys(user);
    inputPassword.sendKeys(password);
    return submitLogin.click();
};

function logoutUser(){
    return element(by.id('bob-logout')).click();
};

function userIsLogged(){
    return element(by.css('body.boxoffice')).isPresent();
};
//End Login

//Top Menu
function getTaquillaButton(){
    return element(by.id('bob-bar-toggle'));
};

function getBuyTiquetsButton(){
    return element(by.id('bob-compra'));
};

function getOperationsButton(){
    return element(by.id('bob-operaciones'));
};

function getLoggedUser(){
    return element(by.id('bob-user'));
};

function getLogOutButton(){
    return element(by.id('bob-logout'));
};
//End Top Menu

//Left Column (events column)
function getLeftColumn(){
    return leftColumn;
};

function expandCollapseLeftColumn(){
    return leftColumn.click();
};

function getEventsList(){
    return element.all(by.css('.bob-events li'));
};

function getSessionsList(eventId){
    return element.all(by.css('li#bob-event-' + eventId + ' ul.bob-sessions li'));
};

function getSessionById(eventId, sessionId){
    return element(by.css('li#bob-event-' + eventId + ' ul.bob-sessions li#bob-session-' + sessionId));
}

function searchEventByTitle(titleKeyword){
    inputSearchTitle.sendKeys(titleKeyword);
    return inputSearchTitle.getAttribute('value');
};

function selectEvent(eventId){
    return element(by.css('#bob-event-' + eventId + ' > a')).click();
};

function selectSession(sessionId){
    return element(by.css('#bob-session-' + sessionId + ' > a')).click();
};
//End Left Column

//Operations List
function getOperationsList(){
    return element.all(by.css('#operations-list .operation-info'));
};

function previousMonth(){
    var monthYearPrev = element(by.css('.datepicker-days .prev'));
    return monthYearPrev.click();
};

function selectDate(dateToSelect, dateType){
    var calendarPosition = dateType === 'init' ? 0 : 1;

    element(by.id('date-' + dateType)).click();

    var previousMonth = (selectedMonth-moment(dateToSelect, 'DD/MM/YYYY').format('MM')) + (12*(selectedYear-moment(dateToSelect, 'DD/MM/YYYY').format('YYYY')));

    for(var i = 0; i < previousMonth; i++){
        element.all(by.css('.datepicker-days .prev')).get(calendarPosition).click();
    }

    var datePickerDays = element.all(by.css('.datepicker-days')).get(0).all(by.css('tbody td'));

    datePickerDays.getAttribute('class').then(function(classDay){
        var oldDaysCount = 0;
        for(var i = 0; i < classDay.length; i++){
            if(classDay[i].indexOf('old') > 0){
                oldDaysCount++;
            }
        }
        var dayToSelect = parseInt(oldDaysCount) + parseInt(moment(dateToSelect, 'DD/MM/YYYY').format('DD'));
        element.all(by.css('.datepicker-days')).get(calendarPosition).all(by.css('tbody td')).get(dayToSelect-1).click();
    });

    return element(by.id('date-' + dateType)).getAttribute('value');
};

function filterByPaymentMethod(paymentMethod){
    var paymentMethodSelect = element(by.id('payment-method-select')),
        paymentMethodNumber = paymentMethod === 'efectivo' ? 2 : 1;

    paymentMethodSelect.click();
    element(by.css('#payment-method-select option[value="' + paymentMethodNumber + '"]')).click();

    return paymentMethodSelect.getAttribute('value');
};

function searchOperation(searchKey){
    return element(by.id('search-filter')).sendKeys(searchKey);
};

function operationsInDates(operationsList, initDate, endDate){
    var operationsInDates = true,
        actDate = '';

    return element.all(by.css('#operations-list .operation-info .operation-purchasedate')).getText().then(function(operationsListDates){
        for(var i = 0; i < operationsListDates.length; i++){
            actDate = new Date(moment(operationsListDates[i], 'DD/MM/YYYY HH:mm'));

            operationsInDates = operationsInDates && actDate > initDate && actDate < endDate;
        }
        return operationsInDates;
    });
};
//End Operations List

module.exports = {
    'loginUser' : loginUser,
    'logoutUser' : logoutUser,
    'userIsLogged' : userIsLogged,
    'getTaquillaButton' : getTaquillaButton,
    'getBuyTiquetsButton' : getBuyTiquetsButton,
    'getOperationsButton' : getOperationsButton,
    'getLoggedUser' : getLoggedUser,
    'getLogOutButton' : getLogOutButton,
    'getLeftColumn' : getLeftColumn,
    'expandCollapseLeftColumn' : expandCollapseLeftColumn,
    'getEventsList' : getEventsList,
    'getSessionsList' : getSessionsList,
    'searchEventByTitle' : searchEventByTitle,
    'selectEvent' : selectEvent,
    'selectSession' : selectSession,
    'getOperationsList' : getOperationsList,
    'previousMonth' : previousMonth,
    'selectDate' : selectDate,
    'filterByPaymentMethod' : filterByPaymentMethod,
    'searchOperation' : searchOperation,
    'operationsInDates' : operationsInDates,
    'getSessionById' : getSessionById
}