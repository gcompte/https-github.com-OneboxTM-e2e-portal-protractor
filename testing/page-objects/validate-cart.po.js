//!!!Necesitamos modificar esta pantalla y añadir en el cuadro de cada selección el "ID de la SESIÓN",
//así podré eliminar el "position" y sustiturlo por "sessionId" de:
// getSessionDate
// deleteAllSessionTickets
// deleteOneTicket

var sessionsSelected = element.all(by.repeater('(sessionId, sessionData) in summary.sessions')),
    actionButtons = element.all(by.css('.reveal-modal a.button'));

function getTotalSessionsSelected(){
    return sessionsSelected.count();
};

function getTotalPrice(){
    return element(by.css('#finalPrice-box .end p')).getText();
};

//Session selected data
function getEventTitle(eventId, position, length){
    return element.all(by.css('.eventId-' + eventId)).get(position).element(by.binding('sessionData.eventName')).getText().then(function(title){
        return title.substring(0, length);
    });
};

function getSessionDate(sessionId){
    return element(by.css('#session-' + sessionId + ' .session-date')).getText();
};

function getSessionTime(eventId, position){
    return element.all(by.css('.eventId-' + eventId)).get(position).element(by.binding('sessionData.date | formatDate: \'shortTime\': \'UTC\'')).getText();
};

function getSessionPlace(eventId, position){
    return element.all(by.css('.eventId-' + eventId)).get(position).element(by.binding('sessionData.place.name')).getText();
};

function getNumberSessionTicketsSelected(sessionId){
    return element(by.css('#session-' + sessionId)).element(by.binding('sessionData.tickets.length')).getText();
};

function getSessionAddress(eventId, position){
    return element.all(by.css('.eventId-' + eventId)).get(position).element(by.binding('sessionData.place.location')).getText();
};

function getSessionSeatsSelected(eventId, position){
    return element.all(by.css('.eventId-' + eventId)).get(position).element(by.binding('sessionData.tickets.length')).getText();
};

function getSessionSeatsSelectedInfo(sessionId, column){
    if(column){
        return element(by.id('session-' + sessionId)).all(by.repeater('ticket in sessionData.tickets').column(column));
    }else{
        return element(by.id('session-' + sessionId)).all(by.repeater('ticket in sessionData.tickets'));
    }
};

function getSeatsSelectedVisibility(seatSelected, visibilityType){
    return seatSelected.element(by.css('.fi-visibility-' + visibilityType)).isDisplayed();
};

function getSessionTotalPrice(sessionId){
    return element(by.css('#session-' + sessionId + ' .section-block:last-child .end p')).getText();
};

//Eliminar todas las localidades seleccionadas de una sesión en concreto desde "Cancelar reserva"
function deleteAllSessionTickets(sessionId, action){
    var removeElement = browser.params.device === 'mobile' ? 'p.remove-ticket' : 'a.remove-ticket';

    element(by.css('#session-' + sessionId + ' ' + removeElement)).click().then(function(){
        confirmCancelDelete(action);
    });
};

//Seat selected data
function getSeatZone(eventId, position, seatPosition){
    return element.all(by.css('.eventId-' + eventId)).get(position).all(by.repeater('ticket in sessionData.tickets')).get(seatPosition).element(by.binding('ticket.sectorName || ticket.priceZoneName')).getText();
};

function getSeatBasePrice(eventId, position, seatPosition) {
    return element.all(by.css('.eventId-' + eventId)).get(position).all(by.repeater('ticket in sessionData.tickets')).get(seatPosition).element(by.binding('ticket.price.basePrice | formatCurrency')).getText();
};

function getSeatCharges(eventId, position, seatPosition){
    return element.all(by.css('.eventId-' + eventId)).get(position).all(by.repeater('ticket in sessionData.tickets')).get(seatPosition).element(by.binding('ticket.price.charges | formatCurrency')).getText();
};

function getSeatTotalPrice(eventId, position, seatPosition){
    return element.all(by.css('.eventId-' + eventId)).get(position).all(by.repeater('ticket in sessionData.tickets')).get(seatPosition).element(by.binding('ticket.price.finalPrice | formatCurrency')).getText();
};

//Eliminar una localidad en concreto desde la "x" al lado del precio
function deleteOneTicket(eventId, position, seatPosition, action){
    sessionsSelected.all(by.css('.eventId-' + eventId)).get(position).all(by.repeater('ticket in sessionData.tickets')).get(seatPosition).element(by.css('p span:nth-child(2)')).click().then(function(){
        confirmCancelDelete(action);
    });
};

function confirmCancelDelete(action){
    if(action == 'delete'){
        actionButtons.get(1).click();
    }else if(action == 'cancel'){
        actionButtons.get(0).click();
    }
}

//B2B Validate Cart
function validateCart(){
    return element.all(by.css('.bottom-bar .button')).get(0).click();
};

function setBooking(){
    return element.all(by.css('.bottom-bar .button')).get(1).click();
};

//Restricción modal -- Comprar entradas de otro evento
function getModalText(){
    return element(by.css('.reveal-modal p')).getText();
};

function buyTicketsOfAnotherEvent(action){
    if(action){
        return element(by.css('.button[ng-click="ok()"]')).click();
    }else{
        return element(by.css('.button[ng-click="cancel()"]')).click();
    }
};

function getFees(){
    return element.all(by.repeater('fee in (summary.fees)')).all(by.tagName('strong')).getText();
};

module.exports = {
    'getTotalSessionsSelected' : getTotalSessionsSelected,
    'getTotalPrice' : getTotalPrice,
    'getEventTitle' : getEventTitle,
    'getSessionDate' : getSessionDate,
    'getSessionTime' : getSessionTime,
    'getSessionPlace' : getSessionPlace,
    'getNumberSessionTicketsSelected' : getNumberSessionTicketsSelected,
    'getSessionAddress' : getSessionAddress,
    'getSessionSeatsSelected' : getSessionSeatsSelected,
    'getSessionSeatsSelectedInfo' : getSessionSeatsSelectedInfo,
    'getSeatsSelectedVisibility' : getSeatsSelectedVisibility,
    'getSessionTotalPrice' : getSessionTotalPrice,
    'deleteAllSessionTickets' : deleteAllSessionTickets,
    'getSeatZone' : getSeatZone,
    'getSeatBasePrice' : getSeatBasePrice,
    'getSeatCharges' : getSeatCharges,
    'getSeatTotalPrice' : getSeatTotalPrice,
    'deleteOneTicket' : deleteOneTicket,
    'validateCart' : validateCart,
    'setBooking' : setBooking,
    'getModalText' : getModalText,
    'buyTicketsOfAnotherEvent' : buyTicketsOfAnotherEvent,
    'getFees' : getFees
}