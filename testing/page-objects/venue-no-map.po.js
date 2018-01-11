var allPriceZones = element.all(by.repeater('zone in priceZoneInfo.venueAvailability')),
    unavailablePriceZones = element.all(by.css('.sold-out-zone'));

//Obtenemos todas las zonas de precio o, si lo especificamos, todas las zonas de precio agotadas
function getPriceZones(priceZonesType) {
    if(priceZonesType === 'unavailable'){
        return unavailablePriceZones;
    }else{
        return allPriceZones;
    }
};

function getPriceZonesName() {
    return element.all(by.css('.price-zone-info span:nth-child(1)')).getText();
};

//Dada una zona de precio, consultamos si está agotada o no
function isSoldOut(idPriceZone) {
    //return element(by.id('znn-seats-number-' + idPriceZone)).getAttribute('disabled');
    return element(by.css('#price-zone-' + idPriceZone + ' .sold-out-zone')).isPresent();
};

//Obtenemos la información (nombre, precio, entradas agotadas, promoción automática) de todas las zonas o de una en concreto
function getZoneInfo(idPriceZone) {
    if (idPriceZone === undefined){
        return element.all(by.css('.price-zone-info'));
    }else{
        return element(by.css('#price-zone-' + idPriceZone + ' .price-zone-info'));
    }
};

//Dada una zona de precio, seleccionamos las localidades deseadas
function selectNoGraphicSeats(idPriceZone, numberLocalities) {
    return element(by.css('select[id=znn-seats-number-'+ idPriceZone +'] option[value="number:'+ numberLocalities +'"]')).click();
};

function getPriceZonePromotion(priceZoneId){
    return element(by.id('price-zone-' + priceZoneId)).element(by.binding('zone.automaticPromotion.promotionComElements.name')).getText();
};

//Nos devolverá cuántas localidades se pueden seleccionar de una zona de precio concreta
function getPriceZoneAvailabilitySelect(priceZoneId){
    return element.all(by.css('#znn-seats-number-' + priceZoneId + ' option')).then(function(priceZoneSeatsAvailability){
        return priceZoneSeatsAvailability[priceZoneSeatsAvailability.length-1].getText().then(function(aaa){
            return parseInt(aaa);
        });
    });
};

module.exports = {
    'getPriceZones' : getPriceZones,
    'getPriceZonesName' : getPriceZonesName,
    'isSoldOut' : isSoldOut,
    'getZoneInfo' : getZoneInfo,
    'selectNoGraphicSeats' : selectNoGraphicSeats,
    'getPriceZonePromotion' : getPriceZonePromotion,
    'getPriceZoneAvailabilitySelect' : getPriceZoneAvailabilitySelect
}