var activePromotions = element(by.css('.slide-menu')).all(by.repeater('saleObj in salesService.getCurrentSales() | removeDuplicated | filter: {sale: {selfManaged: false}} | orderBy : [getSalesOrder, \'sale.promotionComElements.name\']')),
    saleMinItems = element(by.css('.sale-min-items')),
    saleMinTitle = element(by.css('.sale-group .sale-title')),
    saleTitle = element(by.css('.sale-title')),
    promotionalCodeInput = element(by.id('promotionalcode-input')),
    promotionalCodeButton = element(by.id('promotionalcode-submit')),
    http = require('http');

function getPromotions(){
    return activePromotions;
};

function selectPromotionByPosition(position){
    return activePromotions.get(position).click();
};

function getSaleMinTitle(){
    return saleMinTitle.getText();
};

function getSaleTitle(){
    return saleTitle.getText();
};

// numberOfSeats == Número de butacas a las que aplicar la promoción
function applyPromotionSeats(numberOfSeats){
    var listCartItems = element.all(by.css('#sales-container > div[class="ng-scope"]')).all(by.repeater('cartItemId in saleObj.listCartItems'));

    listCartItems.then(function(saleItemsList){
        for(var i = 0; i < numberOfSeats; i++){
            saleItemsList[i].click();
        }
    });

    return listCartItems.count();
};

function getSeatToApplyPromotion(promotionType){
    if(promotionType === 'promotionalCode'){
        return element.all(by.css('#sales-container > div[class="ng-scope"]')).all(by.repeater('cartItemId in promocodeSaleObj.listCartItems'));
    }else{
        return element.all(by.css('#sales-container > div[class="ng-scope"]')).all(by.repeater('cartItemId in saleObj.listCartItems'));
    }
};

function getSeatsWithAppliedPromotion(promotionType){
    if(promotionType === 'promotionalCode'){
        return element.all(by.css('#sales-container > div[class="ng-scope"]')).all(by.repeater('cartItemId in promocodeSaleObj.listCartItems')).all(by.css('div.promo-select-seat.selected'));
    }
};

// firstSeatToSelect == Butaca que seleccionaremos primero, se necesita por si seleccionamos localidades en diferentes pasos
// numberOfSeats == Número de butacas a las que aplicar la promoción
function applyPromotionalCodeSeats(firstSeatToSelect, numberOfSeatsToSelect){
    return element(by.css('#sales-container > div[class="ng-scope"]')).all(by.repeater('cartItemId in promocodeSaleObj.listCartItems')).then(function(saleItemsList){
        for(var i = firstSeatToSelect; i < firstSeatToSelect + numberOfSeatsToSelect; i++){
            saleItemsList[i].click();
        }
    });
};

// Min ítems promotion
function isApplicablePromotion(position){
    return element.all(by.css('div[ng-show="saleObj.active"]')).get(position).element(by.css('.sale-min-items')).isPresent();
};

function applyMinPromotion(position){
    return element.all(by.css('div[ng-show="saleObj.active"]')).get(position).element(by.css('.sale-min-items')).click();
};

//Promotional Code Promotion
function getValidatePromotionalCodeButton(){
    return promotionalCodeButton;
};

function setPromotionalCode(promotionalCodeTxt){
    promotionalCodeInput.clear();
    promotionalCodeInput.sendKeys(promotionalCodeTxt);
    return promotionalCodeInput.getAttribute('value');
};

//Member promotion
function applyMemberPromotion(memberUser, memberPwd){
    var inputMemberUser = element(by.id('memberUser')),
        inputMemberPwd = element(by.id('memberPwd'));

    inputMemberUser.clear();
    inputMemberPwd.clear();
    
    inputMemberUser.sendKeys(memberUser);
    inputMemberPwd.sendKeys(memberPwd);
    element(by.id('sale-member-submit')).click();

    return element(by.id('memberUser')).getAttribute('class');
};

//Obtener el contador de una promoción
function getCounterValue(elementId, idPromotion, promotionLimitType){
    var dalCouchUrl = 'http://dal-couch-' + browser.params.env + '.oneboxtickets.net/',
        defer = protractor.promise.defer();

    http.get(dalCouchUrl + 'counters/promotion/' + idPromotion + '/' + promotionLimitType + '/' + elementId, function(response) {
        var bodyString = '';
        
        response.setEncoding('utf8');
        response.on("data", function(chunk) {
            bodyString += chunk;
        });

        response.on('end', function() {
            var parsed = JSON.parse(bodyString);
            if(promotionLimitType === 'event'){
                defer.fulfill({
                    eventId: parsed.eventId,
                    promotionId: parsed.promotionId,
                    counter: parsed.counter
                });                    
            }else{
                defer.fulfill({
                    sessionId: parsed.sessionId,
                    promotionId: parsed.promotionId,
                    counter: parsed.counter
                });
            }

        });
    }).on('error', function(e) {
        defer.reject("Got http.get error: " + e.message);
    });

    return defer.promise;
};

//Obtener el contador de usos de un código promocional
function getCollectiveCodeCounterValue(idCollective, codeTxt){
    var msCollective = 'http://ms-collective-' + browser.params.env + '.oneboxtickets.net/',
        defer = protractor.promise.defer();

    http.get(msCollective + 'collectives/' + idCollective + '/codes/' + codeTxt, function(response) {
        var bodyString = '';
        
        response.setEncoding('utf8');
        response.on("data", function(chunk) {
            bodyString += chunk;
        });

        response.on('end', function() {
            var parsed = JSON.parse(bodyString);
                defer.fulfill({
                    collectiveId: parsed.collectiveId,
                    code: parsed.code,
                    type: parsed.type,
                    usageLimit : parsed.usageLimit,
                    usages : parsed.usages
                });
        });
    }).on('error', function(e) {
        defer.reject("Got http.get error: " + e.message);
    });

    return defer.promise;
};

function seeAllPromotions(position){
    return element.all(by.css('#sales-container .arrow-left')).get(position).click();
};

module.exports = {
    'getPromotions' : getPromotions,
    'selectPromotionByPosition' : selectPromotionByPosition,
    'getSaleMinTitle' : getSaleMinTitle,
    'getSaleTitle' : getSaleTitle,
    'applyPromotionSeats' : applyPromotionSeats,
    'getSeatToApplyPromotion' : getSeatToApplyPromotion,
    'applyPromotionalCodeSeats' : applyPromotionalCodeSeats,
    'isApplicablePromotion' : isApplicablePromotion,
    'applyMinPromotion' : applyMinPromotion,
    'getValidatePromotionalCodeButton' : getValidatePromotionalCodeButton,
    'setPromotionalCode' : setPromotionalCode,
    'applyMemberPromotion' : applyMemberPromotion,
    'getCounterValue' : getCounterValue,
    'getCollectiveCodeCounterValue' : getCollectiveCodeCounterValue,
    'seeAllPromotions' : seeAllPromotions,
    'getSeatsWithAppliedPromotion' : getSeatsWithAppliedPromotion
}