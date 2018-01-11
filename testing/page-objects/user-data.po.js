var inputName = element(by.css('input[name=name]')),
    inputSurname = element(by.css('input[name=surname]')),
    inputEmail = element(by.css('input[name=email]')),
    inputCheckEmail = element(by.css('input[name=emailCheck]')),
    selectCountry = element(by.css('select[name=country]')),
    inputNif = element(by.css('input[name=idCard]')),
    chekcboxTermsAndConditions = element(by.id('acceptTermsAndConds'));

function setUserData(name, surname, email){
    inputName.sendKeys(name);
    inputSurname.sendKeys(surname);
    inputEmail.sendKeys(email);
    inputCheckEmail.sendKeys(email);

    if(browser.params.device === 'mobile'){
        browser.executeScript('window.scrollTo(0, 400);');
    }

    chekcboxTermsAndConditions.click();
};

function setName(name){
    inputName.sendKeys(name);
    return inputName.getAttribute('value');
};

function setSurname(surname){
    inputSurname.sendKeys(surname);
    return inputSurname.getAttribute('value');
};

function setEmail(email){
    inputEmail.sendKeys(email);
    return inputEmail.getAttribute('value');
};

function setCheckEmail(email){
    inputCheckEmail.sendKeys(email);
    return inputCheckEmail.getAttribute('value');
};

function setCountry(country){
    selectCountry.sendKeys(country);
    return selectCountry.getAttribute('value');
};

function acceptTermsAndConditions(){
    chekcboxTermsAndConditions.click();
    return chekcboxTermsAndConditions.getAttribute('checked');
};

function setNif(nif){
    inputNif.sendKeys(nif);
    return inputNif.getAttribute('value');
};

/* Payment Methods */
function selectPaymentMethod(position){
    return element.all(by.repeater('opt in additionalData.paymentMethods.schema')).get(position).click();
};

function continueToPay(){
    return element(by.css('.lower-navigation a.forward')).click();
};

function deliveryMethodsAction(position, action){
    var deliveryMethodsList = element.all(by.repeater('opt in additionalData.deliveryMethods.schema.options'));

    if(action === 'select'){
        return deliveryMethodsList.get(position).click();
    }else if(action === 'status'){
        return deliveryMethodsList.get(position).element(by.css('.head')).getAttribute('class');
    }
};

function getAdditionalCosts(){
    var additionalCosts = element.all(by.repeater('(type, data) in selectionSummary.filterByCosts(selectionSummary.cartInfo.additionalData)')),
        additionalCostsInfo = [];

    return additionalCosts.then(function(additionalCostsList){
        additionalCosts.all(by.css('.finalPrice-text')).getText().then(function(conceptsList){
            additionalCosts.all(by.css('.iteminfo-price')).getText().then(function(pricesList){
                for(var i = 0; i < additionalCostsList.length; i++){
                    additionalCostsInfo.push({
                        'concept' : conceptsList[i],
                        'price' : pricesList[i]
                    });
                };
                return additionalCostsInfo;
            });
        });
        return additionalCostsInfo;
    });
};

// Nominal Tickets Data
function setNominalTicketData(attendants, numberSeatsSelected){
    for(var i = 0; i < numberSeatsSelected; i++){
        element.all(by.css('input[name="ATTENDANT_NAME"')).get(i).sendKeys(attendants[i].name);
        element.all(by.css('input[name="ATTENDANT_SURNAME"')).get(i).sendKeys(attendants[i].surname);
        element.all(by.css('input[name="ATTENDANT_ID_NUMBER"')).get(i).sendKeys(attendants[i].id);
    }
};

function getFees(){
    return element.all(by.repeater('fee in (selectionSummary.cartInfo.fees)')).all(by.tagName('span')).getText();
};

module.exports = {
    'setUserData' : setUserData,
    'setName' : setName,
    'setSurname' : setSurname,
    'setEmail' : setEmail,
    'setCheckEmail' : setCheckEmail,
    'setCountry' : setCountry,
    'setNif' : setNif,
    'acceptTermsAndConditions' : acceptTermsAndConditions,
    'selectPaymentMethod' : selectPaymentMethod,
    'continueToPay' : continueToPay,
    'deliveryMethodsAction' : deliveryMethodsAction,
    'getAdditionalCosts' : getAdditionalCosts,
    'setNominalTicketData' : setNominalTicketData,
    'getFees' : getFees
}
