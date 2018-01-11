var moment = require('moment');

var inputCard = element(by.css('input[name=Sis_Numero_Tarjeta]')),
    inputExpirationMonth = element(by.css('input[name=Sis_Caducidad_Tarjeta_Mes]')),
    inputExpirationYear = element(by.css('input[name=Sis_Caducidad_Tarjeta_Anno]')),
    inputSecurityCode = element(by.css('input[name=Sis_Tarjeta_CVV2]')),
    inputCipCode = element(by.css('input[name=pin]')),
    inputAmount = element(by.id('CASH_AMOUNT')),
    acceptPaymentButton = element(by.css('input[value=Aceptar]')),
    endPaymentButton = element(by.css('img[alt=Aceptar]')),
    continueToPurchaseButton = element(by.css('img[name=continuar]')),
    endCashPaymentButton = element(by.css('.button.forward')),
    validExpirationDate = new Date(),
    actualMonth = moment().format('MM'),
    nextYear = validExpirationDate.getFullYear()+1;

//Redsys
function setCard(cardNumber){
    inputCard.sendKeys(cardNumber);
    return inputCard.getAttribute('value');
};

function setExpirationMonth(expirationMonth){
    inputExpirationMonth.sendKeys(expirationMonth);
    return inputExpirationMonth.getAttribute('value');
};

function setExpirationYear(expirationYear){
    inputExpirationYear.sendKeys(expirationYear);
    return inputExpirationYear.getAttribute('value');
};

function setSecurityCode(securityCode){
    inputSecurityCode.sendKeys(securityCode);
    return inputSecurityCode.getAttribute('value');
};

function setCipCode(cipCode){
    browser.driver.sleep(3000);
    inputCipCode.sendKeys(cipCode);
    return inputCipCode.getAttribute('value');
};

function acceptPayment(){
    acceptPaymentButton.click();
};

function endPayment(){
    endPaymentButton.click();
};

function continueToPurchase(){
    continueToPurchaseButton.click();
};

function paymentRedsys(card, securityCode){
    inputCard.sendKeys(card);
    inputExpirationMonth.sendKeys(actualMonth);
    inputExpirationYear.sendKeys(nextYear);
    inputSecurityCode.sendKeys(securityCode);

    acceptPaymentButton.click();
};
//End Redsys

//Cash
function setAmount(amount){
    inputAmount.sendKeys(amount);
    return inputAmount.getAttribute('value');
};

function endCashPayment(){
    endCashPaymentButton.click();
};

function paymentCash(amount){
    inputAmount.sendKeys(amount);
    return endCashPaymentButton.click();
};
//End Cash

//PayPal
function loginPaypal(email, password){
    element(by.id('email')).sendKeys(email);
    element(by.id('password')).sendKeys(password);
    return element(by.id('btnLogin')).click();
};

function finishPayPalPayment(){
    return element(by.id('confirmButtonTop')).click();
};
//End PayPal

//Redsys XML
function paymentRedsysXML(cardNumber, securityCode){
    element(by.id('DS_MERCHANT_PAN')).sendKeys(cardNumber);
    element(by.id('DS_MERCHANT_EXPIRY_MONTH')).sendKeys(actualMonth.toString());
    element(by.id('DS_MERCHANT_EXPIRY_YEAR')).sendKeys(nextYear);
    element(by.id('DS_MERCHANT_CVV2')).sendKeys(securityCode);

    if(browser.params.device === 'mobile'){
        element(by.css('.lower-navigation button')).click();
    }else{
        element(by.css('.paymentBtn-container')).click();
    }
};
//End Redsys XML

//Santander
function paymentSantander(cardNumber, securityCode, username){
    element(by.id('pas_ccnum')).sendKeys(cardNumber);
    element(by.id('pas_ccmonth')).sendKeys(actualMonth);
    element(by.id('pas_ccyear')).sendKeys(nextYear);
    element(by.id('pas_cccvc')).sendKeys(securityCode);
    element(by.id('pas_ccname')).sendKeys(username);

    element(by.id('rxp-primary-btn')).click();
};
//End Santander

//ConnexFlow
function paymentConnexFlow(cardNumber, securityCode){
    element(by.id('ctl00_ContentPlaceHolder1_txtTarjeta')).sendKeys(cardNumber);
    element(by.id('ctl00_ContentPlaceHolder1_lstMeses')).sendKeys(actualMonth);
    element(by.id('ctl00_ContentPlaceHolder1_lstYears')).sendKeys(nextYear);
    element(by.id('ctl00_ContentPlaceHolder1_txtCodSeguridad')).sendKeys(securityCode);
    
    return element(by.id('ctl00_ButtonEnviar1')).click();
};

function continuePaymentConnexFlow(passphrase){
    browser.driver.sleep(2000);
    element(by.css('input[name=passphrase]')).sendKeys(passphrase);
    return element(by.id('button2')).click();
};

function getErrorCFModal(){
    return element(by.id('dvAlert'));
};

function closeAlertCFModal (){
    return element(by.id('ButtonAlertYES')).click();
};
//End ConnexFlow

//Credomatic
function paymentCredomatic(username, cardNumber, securityCode){
    element(by.id('ccname')).sendKeys(username);
    element(by.id('ccnumber')).sendKeys(cardNumber);
    element(by.id('ccyear')).sendKeys(nextYear);
    element(by.id('ccaccept')).click();
    
    return element(by.css('#BotonesPagoTarjeta input[type=submit]')).click();
};

function continuePaymentCredomatic(){
    return element(by.css('input[type=submit]')).click();
};
//End ConnexFlow

module.exports = {
    'setCard' : setCard,
    'setExpirationMonth' : setExpirationMonth,
    'setExpirationYear' : setExpirationYear,
    'setSecurityCode' : setSecurityCode,
    'setCipCode' : setCipCode,
    'acceptPayment' : acceptPayment,
    'endPayment' : endPayment,
    'continueToPurchase' : continueToPurchase,
    'paymentRedsys' : paymentRedsys,
    'setAmount' : setAmount,
    'endCashPayment' : endCashPayment,
    'paymentCash' : paymentCash,
    'loginPaypal' : loginPaypal,
    'finishPayPalPayment' : finishPayPalPayment,
    'paymentRedsysXML' : paymentRedsysXML,
    'paymentSantander' : paymentSantander,
    'paymentConnexFlow' : paymentConnexFlow,
    'continuePaymentConnexFlow' : continuePaymentConnexFlow,
    'getErrorCFModal' : getErrorCFModal,
    'closeAlertCFModal' : closeAlertCFModal,
    'paymentCredomatic' : paymentCredomatic,
    'continuePaymentCredomatic' : continuePaymentCredomatic
}