function changeEventsView(newView) {
    element(by.css('[ng-click="::changeView(\'items-' + newView + '\')"]')).click();
};

function goToEvent(eventId, position) {
    if(position !== undefined){
        return element.all(by.css('.sessionId-' + eventId + ' .button')).get(position).click();
    }else{
        return element.all(by.css('.sessionId-' + eventId + ' .button')).get(2).click();
    }
};

function getEventById(eventId){
    return element(by.css('.sessionId-' + eventId));
};

function goToGiftEvent(eventId) {
    return element.all(by.css('.sessionId-' + eventId + ' .button')).get(1).click();
};

function getAllEvents(column){
    if(column !== undefined){
        return element.all(by.repeater('item in items').column(column));
    }else{
        return element.all(by.repeater('item in items'));
    }
};

function getEventsFilteredInfo(){
    var filterInfo = [];

    return element.all(by.css('.item-title')).getText().then(function(itemsTitle){
        return element.all(by.css('.item-subtitle')).getText().then(function(itemsSubtitle){
            return element.all(by.css('.place')).getText().then(function(itemsPlaceTemp){
                var itemsPlace = [];

                for(var i = 0; i < itemsPlaceTemp.length; i++){
                    if(itemsPlaceTemp[i] !== ''){
                        itemsPlace.push(itemsPlaceTemp[i]);
                    }
                }
                for(var j = 0; j < itemsTitle.length; j++){
                    filterInfo.push(itemsTitle[j].toUpperCase() + ' - ' + itemsSubtitle[j].toUpperCase() + ' - ' + itemsPlace[j].toUpperCase());
                }

                return filterInfo;
            });
        });
    });
};

function getEventBoxInfo(eventId){
    return {
        'title' : element(by.css('.event-box.sessionId-' + eventId + ' .item-title')),
        'subtitle' : element(by.css('.event-box.sessionId-' + eventId + ' .item-subtitle')),
        'imageSrc' : element.all(by.css('.event-box.sessionId-' + eventId + ' img')).get(1),
        'place' : element.all(by.css('.event-box.sessionId-' + eventId + ' .place')).get(1),
        'date' : element.all(by.css('.event-box.sessionId-' + eventId + ' .date-time')).get(1),
        'price' : element.all(by.css('.event-box.sessionId-' + eventId + ' .price-container')).get(1),
        'callToAction' : element.all(by.css('.event-box.sessionId-' + eventId + ' .floating-footer')).get(1),
        'soldOut' : element.all(by.css('.event-box.sessionId-' + eventId + ' .soldout')).get(1),
        'titleLink' : element.all(by.css('.event-box.sessionId-' + eventId + ' a')).get(0).getAttribute('ng-href'), //Enlace del título del evento a la ficha de este
        'eventBoxClass' : element(by.css('.event-box.sessionId-' + eventId)).getAttribute('class')
    };
};

function getSupraeventBoxInfo(eventId){
    return {
        'title' : element(by.css('.supraevent-box.eventId-' + eventId + ' .item-title')),
        'subtitle' : element(by.css('.supraevent-box.eventId-' + eventId + ' .item-subtitle')),
        'imageSrc' : element.all(by.css('.supraevent-box.eventId-' + eventId + ' img')).get(0),
        'description' : element.all(by.css('.supraevent-box.eventId-' + eventId + ' .description')).get(0),
        'place' : element.all(by.css('.supraevent-box.eventId-' + eventId + ' .place')).get(0),
        'date' : element.all(by.css('.supraevent-box.eventId-' + eventId + ' .date-time')).get(0),
        'price' : element.all(by.css('.supraevent-box.eventId-' + eventId + ' .price-container')).get(0),
        'callToAction' : element.all(by.css('.supraevent-box.eventId-' + eventId + ' .floating-footer')).get(0),
        'soldOut' : element.all(by.css('.supraevent-box.eventId-' + eventId + ' .soldout')).get(0),
        'titleLink' : element.all(by.css('.supraevent-box.eventId-' + eventId + ' a')).get(0).getAttribute('ng-href'), //Enlace del título del evento a la ficha de este
        'eventBoxClass' : element(by.css('.supraevent-box.eventId-' + eventId)).getAttribute('class')
    };
};

function setEventsFilter(key){
    return element(by.id('events-filter-input')).sendKeys(key);
};

function getEventsFilter(){
    return element(by.id('events-filter-input'));
};

function clearEventsFilter(){
    return element(by.id('events-filter-input')).clear();
};

function getNoEventsFilteredMessage(){
    return element(by.css('div[ng-show="!(items | filter:searchText).length"]'));
};

module.exports = {
    'goToEvent' : goToEvent,
    'getEventById' : getEventById,
    'goToGiftEvent' : goToGiftEvent,
    'getAllEvents' : getAllEvents,
    'getEventBoxInfo' : getEventBoxInfo,
    'getSupraeventBoxInfo' : getSupraeventBoxInfo,
    'setEventsFilter' : setEventsFilter,
    'getEventsFilter' : getEventsFilter,
    'changeEventsView' : changeEventsView,
    'clearEventsFilter' : clearEventsFilter,
    'getEventsFilteredInfo' : getEventsFilteredInfo,
    'getNoEventsFilteredMessage' : getNoEventsFilteredMessage
}