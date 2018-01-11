function getOrderCode(){
    browser.driver.sleep(2000);
    return element(by.id('refNumber-box')).getText();
};

function getSessionSeatsBoughtInfo(sessionId, column){
    if(column){
        return element(by.id('session-' + sessionId)).all(by.repeater('ticket in sessionData.tickets').column(column));
    }else{
        return element(by.id('session-' + sessionId)).all(by.repeater('ticket in sessionData.tickets'));
    }
};

function getSeatsBoughtVisibility(seatSelected, visibilityType){
    return seatSelected.element(by.css('.fi-visibility-' + visibilityType)).isDisplayed();
};

function getFinalPrice(){
    return element(by.binding('purchaseInfo.totalPrice | formatCurrency')).getText();
};

function getFees(){
    return element.all(by.repeater('fee in (purchaseInfo.fees)')).all(by.tagName('strong')).getText();
};

module.exports = {
    'getOrderCode' : getOrderCode,
    'getSessionSeatsBoughtInfo' : getSessionSeatsBoughtInfo,
    'getSeatsBoughtVisibility' : getSeatsBoughtVisibility,
    'getFinalPrice' : getFinalPrice,
    'getFees' : getFees
}