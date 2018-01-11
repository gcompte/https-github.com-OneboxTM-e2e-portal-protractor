function getEventTitle(sessionId){
    return element(by.css('#session-' + sessionId + ' .item-title' )).getText();
};

function getSessionTitle(sessionId){
    return element(by.css('#session-' + sessionId + ' .item-subtitle' )).getText();
};

function getSessionDate(sessionId){
    return element(by.css('#session-' + sessionId + ' .session-date' )).getText();
};

function getSessionPriceZoneName(sessionId){
    return element(by.id('session-' + sessionId)).element(by.binding('{{ticketBreakdown.sectorName || ticketBreakdown.priceZoneName}}')).getText();
};

function getTicketsInfo(sessionId, position){
    var ticketsInfo = element(by.id('session-' + sessionId)).all(by.css('.ticket-info-block div[ng-class="(ticket.row && ticket.seat) ? \'medium-6\': \'medium-12\'"]'));

    return ticketsInfo.getText().then(function(ticketsInfoList){
        return position !== undefined ? ticketsInfoList[position] : ticketsInfoList;
    });
};

function getTicketVisibility(ticket, visibilityType){
    return ticket.element(by.css('.ticket-info-block p[ng-show="ticket.visibility === \''+ visibilityType +'\'"]'));
};

function getTicketBasePrice(sessionId){
    return element(by.id('session-' + sessionId)).all(by.binding('ticket.groupedBasePrice | formatCurrency'));
};

function getFinalPrice(){
    return element(by.binding('selectionSummary.getTotal() | formatCurrency')).getText();
};

function getAllSessionsInfo(){
    return element.all(by.repeater('(sessionId, data) in selectionSummary.showSession(selectionSummary.cartInfo.sessions)'));
};

function getAllTickets(sessionId){
    return element.all(by.repeater('ticket in sessionData.ticketsGroup track by $index'));
};

function getSelectionSummary(){
    return element(by.tagName('selection-summary'));
};

function deleteSeatBySessionAndPosition(sessionId, position, action){
    if(browser.params.device === 'mobile'){
        return element.all(by.css('#session-' + sessionId + ' .show-for-small-only a.remove-ticket')).get(position).click().then(function(){
            confirmCancelDelete(action);
        });
    }else{
        return element.all(by.css('#session-' + sessionId + ' .show-for-medium-up a.remove-ticket')).get(position).click().then(function(){
            confirmCancelDelete(action);
        });        
    }
};

function getSummaryBreakdownConcepts(sessionId){
    return element.all(by.repeater('breakdown in data.breakdown | orderByConcepts')).all(by.css('.hide-for-small-only .locations-amount'));
};

function getSummaryBreakdownPrices(sessionId){
    return element.all(by.repeater('breakdown in data.breakdown | orderByConcepts')).all(by.css('.iteminfo-price.light'));
};

function getSummaryBreakdown(){
    if(browser.params.device === 'mobile'){
        var breakdownConcepts =  element.all(by.repeater('breakdown in sessionData.breakdown | orderByConcepts')).all(by.css('.show-for-small-only .locations-amount'));
    }else{
        var breakdownConcepts =  element.all(by.repeater('breakdown in sessionData.breakdown | orderByConcepts')).all(by.css('.hide-for-small-only .locations-amount'));
    }

    var breakdownPrices = element.all(by.repeater('breakdown in sessionData.breakdown | orderByConcepts')).all(by.css('.iteminfo-price.light')),
        breakdown = [];

    return breakdownConcepts.then(function(concepts){
        for(var i = 0; i < concepts.length; i++){
            breakdown.push(concepts[i]);
            breakdown.push(breakdownPrices.get(i));
        }
        return breakdown;
    });
};

function getTicketsBasePrice(position){
    var ticketsBasePrice = element.all(by.repeater('ticket in sessionData.ticketsGroup track by $index').column('ticket.groupedBasePrice | formatCurrency'));

    return ticketsBasePrice.getText().then(function(ticketsBasePriceList){
        return position !== undefined ? ticketsBasePriceList[position] : ticketsBasePriceList;
    });
};

function confirmCancelDelete(action){
    var actionButtons = element.all(by.css('.reveal-modal a.button'));

    if(action == 'delete'){
        actionButtons.get(1).click();
    }else if(action == 'cancel'){
        actionButtons.get(0).click();
    }
}

module.exports = {
    'getEventTitle' : getEventTitle,
    'getSessionTitle' : getSessionTitle,
    'getSessionDate' : getSessionDate,
    'getSessionPriceZoneName' : getSessionPriceZoneName,
    'getTicketsInfo' : getTicketsInfo,
    'getTicketVisibility' : getTicketVisibility,
    'getTicketBasePrice' : getTicketBasePrice,
    'getFinalPrice' : getFinalPrice,
    'getAllSessionsInfo' : getAllSessionsInfo,
    'getAllTickets' : getAllTickets,
    'getSelectionSummary' : getSelectionSummary,
    'deleteSeatBySessionAndPosition' : deleteSeatBySessionAndPosition,
    'getSummaryBreakdownConcepts' : getSummaryBreakdownConcepts,
    'getSummaryBreakdownPrices' : getSummaryBreakdownPrices,
    'getSummaryBreakdown' : getSummaryBreakdown,
    'getTicketsBasePrice' : getTicketsBasePrice
}