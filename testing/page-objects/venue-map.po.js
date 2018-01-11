var params = browser.params,
    tooltipElement = element(by.id('map-tooltip')),
    tooltipAllSeats = [],
    freeSeats = element.all(by.css('.available-seat')),
    free3DSeats = element.all(by.css('circle.seat.available'));

function getFreeSeats(){
    return freeSeats;
};

function selectZone(locatorZone, typeZone, coordenates) {
    if(coordenates !== undefined){
        browser.actions().mouseMove(element(by.css(locatorZone)), {x: coordenates[0], y: coordenates[1]}).click().perform();
    }else{
        element(by.css(locatorZone)).click();
    }

    if(typeZone == 'noNumbered'){
        seatsTooltip();
    }
};

function selectIrregularZone(locatorZone, typeZone) {
    browser.actions().mouseMove(element(by.css(locatorZone))).click().perform();

    if(typeZone == 'noNumbered'){
        seatsTooltip();
    }
};

function selectZoneById(locatorZoneId, typeZone) {
    element(by.id(locatorZoneId)).click();

    if(typeZone == 'noNumbered'){
        seatsTooltip();
    }
};

//Acceder a la primera zona gráfica con disponibilidad
//Lo usaremos cuando no estamos seguros de en qué zona de precio tendremos disponibilidad
function selectFirstGraphicAvailableZone(){
    return element.all(by.css('svg > g.interactive')).getAttribute('style').then(function(zones){
        var haveDispo = false,
            i = 0;
            
        while(!haveDispo && i < zones.length){
            if(zones[i].indexOf('opacity: 1;') !== 0){
                haveDispo = true;
            }
            i++;
        };

        return element.all(by.css('svg > g.interactive')).get(i).click();
    });
};

/*Seleccionamos localidades:
        numberSeats: nos indica cuantas localidades queremos seleccionar (int)
        adjacentSeats: nos indica si queremos que sean contiguas o no dichas butacas (bolean)
*/
function selectNumberedSeats(numberSeats, adjacentSeats) {
    for(var j = 0; j < numberSeats; j++){
        if(adjacentSeats){
            getSeatId(freeSeats.get(0));
            freeSeats.get(0).click();
            seatsTooltip();
        }else{
            getSeatId(freeSeats.get(j));
            freeSeats.get(j).click();
            seatsTooltip();
        }
    }
};

function getSeatId(seat){
    seat.getAttribute('id').then(function(seatId){
        params.seatsSelected.push(seatId);
    });
}

function seatsTooltip(){
    var actualTooltip = {
        'basePrice' : tooltipElement.element(by.css('.price-breakdown span:nth-child(2)')),
        'pricePromoAuto' : tooltipElement.element(by.css('.price-breakdown span:nth-child(3)')),
        'charges' : tooltipElement.element(by.css('.price-breakdown span:nth-child(4)')),
        'finalPrice' : tooltipElement.element(by.binding('params.seatContent.seat.price | formatCurrency'))
    };

    tooltipAllSeats.push(actualTooltip);
}

//Seleccionamos localidades de una zona no numerada dentro de un recinto gráfico
function selectNoNumberedSeats(numberSeats){
    var selectSeatsZNN = element(by.model('returnVal.numSeats'));

    return selectSeatsZNN.isPresent().then(function(modalNoNumberedSeatsPresent){
        if(modalNoNumberedSeatsPresent){
            selectSeatsZNN.sendKeys(numberSeats).then(function(){
                element(by.css('.reveal-modal .button')).click();
            });
            return true;
        }else{
            return false;
        }
    });
};

//Seleccionamos/liberamos una localidad en concreto
function selectUnselectSeat(idSeat) {
    element(by.id(idSeat)).click();
};

function unselectSelectedSeats() {
    element.all(by.css('.selected-seat')).then(function(selectedSeats){
        for(var i = 0; i < selectedSeats.length; i++){
            selectedSeats[i].click();
            browser.driver.sleep(2000);
        }
    });
};

//Tooltip
function getTooltipInfo(){
    return tooltipAllSeats;
};

function getTooltipSectionInfo(elementToAnalyze){
    var tooltipZoneArray = [];

    if(typeof elementToAnalyze === 'object'){
        browser.actions().mouseMove(elementToAnalyze).perform();
    }else{
        browser.actions().mouseMove(browser.findElement(protractor.By.css(elementToAnalyze))).perform();
    }

    return element.all(by.css('#map-tooltip p')).getText().then(function(tooltipElements){
        for(var i = 0; i < tooltipElements.length; i++){
            tooltipZoneArray.push(tooltipElements[i]);
        }

        return tooltipZoneArray;
    });
};

//3D Venue Map
function select3DNumberedSeats(firstSeat, numberSeats, adjacentSeats) {
    var seatsIndex = 1,
        i = firstSeat;

    if(!adjacentSeats){
        seatsIndex = 2;
    }

    while(i < (numberSeats*seatsIndex)+firstSeat){
        getSeatId(free3DSeats.get(i));

        free3DSeats.get(i).click();

        seatsTooltip();

        i = i + seatsIndex;
    }
};

module.exports = {
    'getFreeSeats' : getFreeSeats,
    'selectZone' : selectZone,
    'selectIrregularZone' : selectIrregularZone,
    'selectZoneById' : selectZoneById,
    'selectFirstGraphicAvailableZone' : selectFirstGraphicAvailableZone,
    'selectNumberedSeats' : selectNumberedSeats,
    'selectNoNumberedSeats' : selectNoNumberedSeats,
    'selectUnselectSeat' : selectUnselectSeat,
    'unselectSelectedSeats' : unselectSelectedSeats,
    'getTooltipInfo' : getTooltipInfo,
    'getTooltipSectionInfo' : getTooltipSectionInfo,
    'select3DNumberedSeats' : select3DNumberedSeats
}