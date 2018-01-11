var eventInfoBox = element(by.id('event-info-box')),
    eventSidebar = element(by.id('event-sidebar'));

function getEventTitle(){
    if(browser.params.device === 'mobile'){
        return element.all(by.binding('::eventInfo.title')).get(0).getText();
    }else{
        return element.all(by.binding('::eventInfo.title')).get(1).getText();
    }
};

function getEventSubtitle(){
    return element.all(by.binding('::eventInfo.subtitle')).get(1).getText();
};

function getEventDate(){
    return eventSidebar.element(by.binding('::[eventInfo.dateRange.firstDate, eventInfo.dateRange.lastDate] | rangeDate : eventInfo.dateRange.type')).getText();
};

function getEventTime(){
    return eventSidebar.element(by.css('.session-time')).getText();
};

function getEventMinPrice(){
    return eventSidebar.element(by.binding('eventInfo.minPrice | formatCurrency')).getText();
};

function getSidebarCallToAction(){
    return eventSidebar.element(by.css('.button'));
};

function goToBuyTicketsAnchor() {
    eventSidebar.element(by.css('.button')).click();
};

function getChangeSessionsViewTabs() {
    return element(by.css('.tabs.item-tab'));
};

function changeSessionsView(newView) {
    element(by.css('[ng-click="::changeView(\'' + newView + '\')"]')).click();
};

function getSessionsView(viewCss){
    return element(by.css(viewCss));
};

function seeAllEvents(){
    return element(by.css('.arrow-left')).click();
};

function getViewFilters(){
    return element(by.id('view-filters'));
};

function getEventDescription(){
    return element(by.id('descriptionTab'));
};

function getSessionById(sessionId){
    return element(by.css('.sessionId-' + sessionId));
};

//SUPRAEVENT GALLERY/LIST VIEW
function getAllSupraeventSessions(view){
    var idView = view === 'gallery' ? 'items-gallery' : 'supraevent-list';

    return element(by.id(idView)).all(by.repeater('item in items'));
};
//END SUPRAEVENT GALLERY/LIST VIEW

//LIST VIEW
function getAllListSessions(attribute){
    if(attribute === 'time'){
        return element.all(by.repeater('item in $vs_collection').column('item.date | formatDate : \'shortTime\': \'UTC\''));
    }else{
        return element.all(by.repeater('item in $vs_collection'));
    }
};

function getSessionDate(sessionId){
    return element(by.css('.sessionId-' + sessionId)).element(by.css('.session-date')).getText();
};

function getSessionTitle(sessionId){
    return element(by.css('.sessionId-' + sessionId)).element(by.css('.session-title')).getText();
};

function getSessionTime(sessionId){
    return element(by.css('.sessionId-' + sessionId)).all(by.css('.session-time')).get(0).getText();
};

function getSessionPlace(sessionId){
    return element(by.css('.sessionId-' + sessionId)).element(by.css('.place')).getText();
};

function getSessionMinPrice(sessionId, attribute){
//Attribute puede ser "container" o "number", el primero devolverá todo el p del precio "Desde 0,00 €" y el segundo solo el precio "0,00 €"
    return element(by.css('.sessionId-' + sessionId)).element(by.css('.price-' + attribute)).getText();
};

function getSessionDiscountBox(sessionId){
    return element(by.css('.sessionId-' + sessionId)).element(by.css('.discount-box')).getText();
};

function getDistinctSessionsDays(actualMonthText){
    //Obtenemos el número total de sesiones que pertenecen al mes indicado
    return element.all(by.cssContainingText('.month', actualMonthText)).then(function(sessionsActualMonthList){
        //Obtenemos todos los días a los que pertenecen dichas sesiones, y creamos una lista con los días sin repeticiones
        return element.all(by.repeater('item in $vs_collection').column('::[item.date] | locale : \'getDayFromTimestamp\'')).getText().then(function(sessionsDaysList){
            var dayAct = '';
            var distinctSessionsDays = [];

            for(var i = 0; i < sessionsActualMonthList.length; i++){
                if(dayAct !== sessionsDaysList[i]){
                    distinctSessionsDays.push(sessionsDaysList[i]);
                }
                dayAct = sessionsDaysList[i];
            };
            return distinctSessionsDays;
        });
    });
};

//CALENDAR VIEW
function getAllCalendarSessions(){
    return element.all(by.css('.event-hour'));
};

//MULTISESSION VIEW
function getAllMultisessions(){
    return element.all(by.repeater('value in $vs_collection'));
};

function getSessionsInMultisession(position){
    return element.all(by.repeater('(data, value) in mapSessions')).get(position);
};

//MINICALENDAR VIEW
function getSelectedMonthMinicalendarMultisessions(){
    return element.all(by.css('.day-number.active'));
};

function getSelectedDaySessions(){
    return element.all(by.repeater('session in selectedDate.dateEvents'));
};

function getDateTextSelected(){
    return element(by.css('.calendar-day-container'));
};

function getSelectedDate(){
    var selectedDate = '';

    return element(by.css('.day-number.active.selected')).getText().then(function(day){
        selectedDate = day;

        return element(by.binding('selectedMonth')).getText().then(function(month){
            selectedDate = selectedDate + ' ' + month;

            return element(by.binding('selectedYear')).getText().then(function(year){
                selectedDate = selectedDate + ' ' + year;

                return selectedDate;
            });
        });
    });
};

//SELECT SESSION
//LIST VIEW
function sessionsListViewBuyTickets(sessionId){
    if(browser.params.device === 'mobile'){
        return element(by.css('.sessionId-' + sessionId + ' .button')).click();
    }else{
        return element(by.css('.sessionId-' + sessionId + ' .buy-btn-container')).click();
    }
};

function sessionsListViewBuyTicketsMobile(sessionId){
    return element(by.css('.sessionId-' + sessionId + ' .button')).click();
};

//MULTISESSION && CALENDAR VIEWS
function boxSessionTime(sessionId){
    return element(by.css('.sessionId-' + sessionId)).click();
};

//MINICALENDAR
function getSessionsByDay(day){
    return element(by.cssContainingText('.day-number', day)).click();
};

//SUPRAEVENT GALLERY
function supraeventGallerySessionBuyTickets(sessionId){
    return element(by.css('.sessionId-' + sessionId)).click();
};

module.exports = {
    'getEventTitle' : getEventTitle,
    'getEventSubtitle' : getEventSubtitle,
    'getEventDate' : getEventDate,
    'getEventTime' : getEventTime,
    'getEventMinPrice' : getEventMinPrice,
    'getSidebarCallToAction' : getSidebarCallToAction,
    'goToBuyTicketsAnchor' : goToBuyTicketsAnchor,
    'changeSessionsView' : changeSessionsView,
    'getSessionsView' : getSessionsView,
    'seeAllEvents' : seeAllEvents,
    'getEventDescription' : getEventDescription,
    'getViewFilters' : getViewFilters,
    'getAllSupraeventSessions' : getAllSupraeventSessions,
    'getAllListSessions' : getAllListSessions,
    'getSessionDate' : getSessionDate,
    'getSessionTitle' : getSessionTitle,
    'getSessionTime' : getSessionTime,
    'getSessionPlace' : getSessionPlace,
    'getSessionMinPrice' : getSessionMinPrice,
    'getSessionDiscountBox' : getSessionDiscountBox,
    'getAllCalendarSessions' : getAllCalendarSessions,
    'getAllMultisessions' : getAllMultisessions,
    'getSessionsInMultisession' : getSessionsInMultisession,
    'getSelectedMonthMinicalendarMultisessions' : getSelectedMonthMinicalendarMultisessions,
    'getSelectedDaySessions' : getSelectedDaySessions,
    'getDateTextSelected' : getDateTextSelected,
    'getSelectedDate' : getSelectedDate,
    'sessionsListViewBuyTickets' : sessionsListViewBuyTickets,
    'sessionsListViewBuyTicketsMobile' : sessionsListViewBuyTicketsMobile,
    'boxSessionTime' : boxSessionTime,
    'getSessionsByDay' : getSessionsByDay,
    'getChangeSessionsViewTabs' : getChangeSessionsViewTabs,
    'getDistinctSessionsDays' : getDistinctSessionsDays,
    'supraeventGallerySessionBuyTickets' : supraeventGallerySessionBuyTickets,
    'getSessionById' : getSessionById
}