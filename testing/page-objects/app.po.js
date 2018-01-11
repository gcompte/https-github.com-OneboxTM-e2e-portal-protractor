var nextStepSalesButton = element(by.id('next-sales')),
    nextStepButton = element(by.css('.lower-navigation a.forward')),
    backButton = element(by.css('a.go-back'));

function resizeWindow(width, height){
    browser.driver.manage().window().setSize(width, height);
};  

function goToNextStep(){
    if(browser.params.device === 'mobile'){
        return element(by.css('a.forward')).click();
    }else{
        return nextStepButton.click();        
    }
};

function goToNextStepSales(){
    if(browser.params.device === 'mobile'){
        return element(by.css('a.forward')).click();
    }else{
        return nextStepSalesButton.click();
    }
};

function goBack(){
    backButton.click();
};

function goBackButtonIsPresent(){
    return backButton.isPresent();
};

function getNextStepButtonAttribute(attribute){
    return nextStepButton.getAttribute(attribute);
};

function getNextStepSalesButtonAttribute(attribute){
    return nextStepSalesButton.getAttribute(attribute);
};

//Con esta función podremos cambiar el contexto donde protractor buscará los elementos (p.ej. entrar/salir de un iframe)
function switchContext(contextId) {
    if(contextId == 'default'){
        browser.switchTo().defaultContent();
    }else{
        browser.driver.switchTo().frame(browser.driver.findElement(by.id(contextId)));
    }
};

function switchContextByName(contextName) {
    if(contextName == 'default'){
        browser.switchTo().defaultContent();
    }else{
        browser.driver.switchTo().frame(browser.driver.findElement(by.name(contextName)));
    }
};

//Obtenemos el mensaje o mensajes de localidades no contiguas o en zonas de precio diferentes
function getAdjacentWarnings(component){
    if(component == 'session'){
        return element.all(by.repeater('literalKey in summary.getItemWarnings(sessionData)'));
    }else if(component == 'selectlocations'){
        return element.all(by.repeater('literalKey in selectlocations.adjacentWarnings'));
    }
};

function closeRevealModal(){
    element(by.css('.close-reveal-modal a')).click();
};

function browserScrollTo(x, y){
    return browser.executeScript('window.scrollTo('+ x +', '+ y +');');
};

//Cargamos la cartelera hasta el final para tener todos los eventos disponibles
function loadAllScroll(scrollSteps){
    for(var i = 0; i < scrollSteps.length; i++){
        browserScrollTo(0, scrollSteps[i]);
        browser.driver.sleep(1000);
    }
};

function convertToNumber(text){
    return roundedNumber(Number(text.replace(/[a-z\A-Z\€]/g, "").replace(',', '.').trim()));
};

function roundedNumber(value){
    return Math.round(value+'e2'+'e-2');
};

function getCurrentPage(){
    return browser.getCurrentUrl().then(function(currentUrl){
        if(currentUrl.indexOf('/session/') > 0){
            return 'session';
        }else if(currentUrl.indexOf('/evento/') > 0){
            return 'evento';            
        }
    });
};

function closeCookiesPolicy(){
    element(by.css('.close-policy')).isDisplayed().then(function(cookiesPresent){
        if(cookiesPresent){
            element(by.css('.close-policy')).click();
        }
    });
};

module.exports = {
    'resizeWindow' : resizeWindow,
    'goToNextStep' : goToNextStep,
    'goToNextStepSales' : goToNextStepSales,
    'goBack' : goBack,
    'goBackButtonIsPresent' : goBackButtonIsPresent,
    'getNextStepButtonAttribute' : getNextStepButtonAttribute,
    'getNextStepSalesButtonAttribute' : getNextStepSalesButtonAttribute,
    'switchContext' : switchContext,
    'switchContextByName' : switchContextByName,
    'getAdjacentWarnings' : getAdjacentWarnings,
    'closeRevealModal' : closeRevealModal,
    'browserScrollTo' : browserScrollTo,
    'loadAllScroll' : loadAllScroll,
    'convertToNumber' : convertToNumber,
    'roundedNumber' : roundedNumber,
    'getCurrentPage' : getCurrentPage,
    'closeCookiesPolicy' : closeCookiesPolicy
}