var PaymentDetailsPO = function() {
    var pricesBoxClosed = element(by.css('.prices-arrow')),
        pricesBoxExpanded = element(by.id('content-info-venue-module'));

    this.enableDisablePriceZone = function(zoneId){
        element(by.id('price-zone-' + zoneId)).click();
    };
};

module.exports = PaymentDetailsPO;