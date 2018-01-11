var shoppingCartInfo = browser.params.device === 'mobile' ? element(by.css('.fi-shopping-cart')) : element(by.css('.top-bar-section > ul:nth-child(2) > li:nth-child(1)')),
    actionButtons = element.all(by.css('.reveal-modal a.button'));

function getShoppingCartInfo(){
    return shoppingCartInfo;
};

function getShoppingCartAttribute(attribute){
    return shoppingCartInfo.getAttribute(attribute);
};

function getLocationsAmount(){
    return shoppingCartInfo.element(by.css('.indicator')).getText();
};

function expandCollapseSiteCart(){
    return shoppingCartInfo.click();
};

function getShoppingCartContainer(){
    return element(by.id('shopping-cart-container'));
};

function getEventTitle(sessionId){
    return element(by.css('.session-' + sessionId + ' .item-title')).getText();
};

function getSessionTitle(sessionId){
    return element.all(by.css('.session-' + sessionId + ' .session-title-container .title')).get(1).getText();
};

function getEventDate(sessionId){
    return element(by.css('.session-' + sessionId + ' .section-block p:last-child')).getText();
};

function getAllSessionsSelected(){
    return element.all(by.repeater('(sessionId, sessionData) in cartCtrl.cartInfo.sessions'));
};

function getSessionLocationsAmount(sessionId){
    return element(by.css('.session-' + sessionId + ' .locations-amount span')).getText();
};

function getSessionSelectionBasePrice(sessionId){
    return element(by.css('.session-' + sessionId + ' .item-info-price')).getText();
};

function getSessionSelectionSubtotal(sessionId){
    return element(by.css('.session-' + sessionId)).element(by.binding('sessionData.subtotal | formatCurrency')).getText();
};

function getFinalPrice(){
    //return element(by.binding('summary.getCartInfo().totalPrice | formatCurrency')).getText();
    return element(by.css('.total-price .amount')).getText();
};

//discountPosition - 0: Promo Auto, 1: Promo Discount, 2: Promo Promotion, 3: Charges
//discountSymbol - 2: Promo positive|Charges, 3: Promo negative
function getSessionChargesOrPromos(sessionId, chargeOrPromo, discountSymbol){
    return element(by.css('.session-' + sessionId + ' div[ng-show="' + chargeOrPromo + '"] p:nth-child(' + discountSymbol + ')')).getText();
};

function validateCart(){
    if(browser.params.device === 'mobile'){
        return element(by.css('.bottom-button')).click();
    }else{
        return element.all(by.css('#shopping-cart-container .button')).click();
    }
};

function removeSessionTickets(sessionId, action){
    return element(by.css('.session-' + sessionId + ' .remove-ticket a.alert')).click().then(function(){
        confirmCancelDelete(action);
    });
};

function removeAllSelection(action){
    return element(by.css('.delete-all a.alert')).click().then(function(){
        confirmCancelDelete(action);
    });
};

//Specific mobile functions
function getMobileShoppingCart(){
    return element.all(by.css('nav.tab-bar a')).get(1);
};

function expandMobileSiteCart(){
    return element.all(by.css('nav.tab-bar a')).get(1).click();
};

function collapseMobileSiteCart(){
    return browser.executeScript('arguments[0].click();', element(by.css('.exit-off-canvas')));
};

function validateCartMobile(){
    return element.all(by.css('.right-off-canvas-menu .button')).click();
};

//Off Canvas Shopping Cart
function getOffCanvasShoppingCart(){
    return element(by.css('aside.right-off-canvas-menu'));
};
//End specific mobile functions

//Auxiliar functions
function confirmCancelDelete(action){
    if(action == 'delete'){
        actionButtons.get(1).click();
    }else if(action == 'cancel'){
        actionButtons.get(0).click();
    }
}

//B2B Site Cart
function getSessionData(){
    return element.all(by.binding('sessionData'));
}

function getB2BSessionLocationsAmount(sessionId){
    return element(by.css('.session-' + sessionId + ' .locations-amount span')).getText();
};

function getB2BSessionLocationsAmount(sessionId){
    return element(by.css('.session-' + sessionId + ' .locations-amount span')).getText();
};

function b2bValidateCart(){
    return element(by.css('.bottom-button')).click();
};

module.exports = {
    'getShoppingCartInfo' : getShoppingCartInfo,
    'getShoppingCartAttribute' : getShoppingCartAttribute,
    'getLocationsAmount' : getLocationsAmount,
    'expandCollapseSiteCart' : expandCollapseSiteCart,
    'getShoppingCartContainer' : getShoppingCartContainer,
    'getEventTitle' : getEventTitle,
    'getSessionTitle' : getSessionTitle,
    'getEventDate' : getEventDate,
    'getAllSessionsSelected' : getAllSessionsSelected,
    'getSessionLocationsAmount' : getSessionLocationsAmount,
    'getSessionSelectionBasePrice' : getSessionSelectionBasePrice,
    'getSessionSelectionSubtotal' : getSessionSelectionSubtotal,
    'getFinalPrice' : getFinalPrice,
    'getSessionChargesOrPromos' : getSessionChargesOrPromos,
    'validateCart' : validateCart,
    'removeSessionTickets' : removeSessionTickets,
    'removeAllSelection' : removeAllSelection,
    'getMobileShoppingCart' : getMobileShoppingCart,
    'expandMobileSiteCart' : expandMobileSiteCart,
    'collapseMobileSiteCart' : collapseMobileSiteCart,
    'validateCartMobile' : validateCartMobile,
    'getOffCanvasShoppingCart' : getOffCanvasShoppingCart,
    'getSessionData' : getSessionData,
    'getB2BSessionLocationsAmount' : getB2BSessionLocationsAmount,
    'b2bValidateCart' : b2bValidateCart
}