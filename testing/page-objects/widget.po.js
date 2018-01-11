function existsVenue(){
    return element(by.css('#svg-container svg')).isPresent();
};

//Obtenemos el número de localidades seleccionadas
function getNumberSeatsSelected() {
    return element(by.css('.widget-tickets-number')).getText();
};

function setRequiredFields(environment, channelName, eventId, sessionId){
    element(by.id('environment')).sendKeys(environment);
    element(by.id('channelName')).sendKeys(channelName);
    element(by.id('eventId')).sendKeys(eventId);
    element(by.id('sessionId')).sendKeys(sessionId);

    if(browser.params.device === 'mobile'){
        element(by.id('widgetForceView')).sendKeys(2);
    }
};

function setOptionalFields(hidePriceInfo, hidePricesBox, activateSales, hideMaxTickets, widgetForceView, releaseCart, token){
    element(by.id('hidePriceInfo')).sendKeys(hidePriceInfo);
    element(by.id('hidePricesBox')).sendKeys(hidePricesBox);
    element(by.id('activateSales')).sendKeys(activateSales);
    element(by.id('hideMaxTickets')).sendKeys(hideMaxTickets);
    if(browser.params.device === 'mobile'){
        element(by.id('widgetForceView')).sendKeys(2);
    }else{
        element(by.id('widgetForceView')).sendKeys(widgetForceView);
    }
    element(by.id('releaseCart')).sendKeys(releaseCart);
    element(by.id('token')).sendKeys(token);
};

function loadWidget(){
	return element(by.id('loadWidget')).click();
};

function getMaxTicketsInfo(){
    return element(by.id('max-tickets-info-msg'));
};

function getDropdownPrices(){
    return element(by.css('.dropdown-prices'));
};

function getSliderPrices(){
    return element(by.css('.price-zone-slider'));
};

function getPromotionsBlock(){
    return element(by.tagName('sales'));
};

module.exports = {
    'existsVenue' : existsVenue,
    'getNumberSeatsSelected' : getNumberSeatsSelected,
    'setRequiredFields' : setRequiredFields,
    'setOptionalFields' : setOptionalFields,
    'loadWidget' : loadWidget,
    'getMaxTicketsInfo' : getMaxTicketsInfo,
    'getDropdownPrices' : getDropdownPrices,
    'getSliderPrices' : getSliderPrices,
    'getPromotionsBlock' : getPromotionsBlock
}


