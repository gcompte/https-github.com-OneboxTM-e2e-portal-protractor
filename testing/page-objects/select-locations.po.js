var promotionsButton = element(by.css('.continue-promotion')),
    priceZoneSlider = element(by.css('.price-zone-slider'));

function seeAllSessions(){
    return element(by.css('.arrow-left')).click();
};

function havePromotion(){
    return element(by.id('sales-module')).isDisplayed();
};

function getMandatorySalesText(){
    return element(by.css('.blocking-promo-info'));
};

//Prices info elements
function getPriceZoneSlider(sliderElement){
    return priceZoneSlider;
};

function getMinMaxSliderPrices(){
    return priceZoneSlider.all(by.css('.jslider-label'));
};

function getMinMaxSliderPricesSelected(){
    return priceZoneSlider.all(by.css('.jslider-value'));
};

function getDropdownPrices(dropdownPricesElement){
    if(dropdownPricesElement){
        return element(by.css('.dropdown-prices')).all(by.css(dropdownPricesElement));
    }else{
        return element(by.css('.dropdown-prices'));
    }
};

function getDropdownPriceZoneInfo(dropdownPricesElement){
    return element(by.css('.dropdown-prices')).all(by.css('.price-zone-info'));
};

function getAllDropdownPricesZonesByAvailability(available){
    var availableClass = available ? '.available' : '.no-available';

    return element(by.css('.dropdown-prices')).all(by.css('.price-zone' + availableClass + ' .price-number-line'));
};

function getAllDropdownPricesZonesByStatus(active, accessible){
    var activeClass = active ? '.active' : '.no-active',
        accessibleClass = accessible ? '.accessible' : '.no-accessible';

    return element(by.css('.dropdown-prices')).all(by.css('.price-zone' + activeClass + accessibleClass + ' .price-number-line'));
};

function getSessionTitle(){
    return element(by.css('.session-info-block .item-title')).getText();
};

function getPricesBox(){
    return element(by.css('.prices-box'));
};

function changeSelectedMode(){
    return element(by.css('.selected-mode-switch')).click();
};

function keepBuyingButton(){
    return element(by.id('keep-buying-btn'));
};

//Esta función solo se utilizárá para dispositivos móviles, para verificar que en la parte inferior de la pantalla, junto al botón de acción aparece el precio total de la compra.
function getFinalPriceAmount(){
    return element(by.css('.finalPrice-amount')).getText();
};

function moveSliderPrices(pointer, xPosition){
    if(pointer === 'min'){
        return browser.actions().dragAndDrop(element(by.css('.jslider-pointer')), {x: xPosition, y: 0}).perform();
    }else if(pointer === 'max'){
        return browser.actions().dragAndDrop(element(by.css('.jslider-pointer-to')), {x: xPosition, y: 0}).perform();
    }
};

function getTransactionFeeInfo(){
    return element(by.css('div[ng-show="sessionInfo.fees"]'));
};

module.exports = {
    'seeAllSessions' : seeAllSessions,
    'havePromotion' : havePromotion,
    'getMandatorySalesText' : getMandatorySalesText,
    'getPriceZoneSlider' : getPriceZoneSlider,
    'getMinMaxSliderPrices' : getMinMaxSliderPrices,
    'getMinMaxSliderPricesSelected' : getMinMaxSliderPricesSelected,
    'getDropdownPrices' : getDropdownPrices,
    'getDropdownPriceZoneInfo' : getDropdownPriceZoneInfo,
    'getAllDropdownPricesZonesByAvailability' : getAllDropdownPricesZonesByAvailability,
    'getAllDropdownPricesZonesByStatus' : getAllDropdownPricesZonesByStatus,
    'getSessionTitle' : getSessionTitle,
    'getPricesBox' : getPricesBox,
    'changeSelectedMode' : changeSelectedMode,
    'keepBuyingButton' : keepBuyingButton,
    'getFinalPriceAmount' : getFinalPriceAmount,
    'moveSliderPrices' : moveSliderPrices,
    'getTransactionFeeInfo' : getTransactionFeeInfo
}