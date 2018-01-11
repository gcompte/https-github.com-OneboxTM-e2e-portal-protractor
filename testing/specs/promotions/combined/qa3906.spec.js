var VenueMapPO = require('./../../../page-objects/venue-map.po.js'),
    SummaryPO = require('./../../../page-objects/summary.po.js'),
    VenueNoMapPO = require('./../../../page-objects/venue-no-map.po.js'),
    PromotionsPO = require('./../../../page-objects/promotions.po.js'),
    SelectLocationsPO = require('./../../../page-objects/select-locations.po.js'),
    AppPO = require('./../../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa3906;

describe('QA-3906 Validar la aplicación de promociones, con incentivo positivo o negativo, y con valor superior o inferior al precio base', function() {
    it('Verificamos el precio del carrito con una localidad con promoción automática de incentivo negativo superior al precio base más una localidad sin promoción', function() {
        browser.get(browser.baseUrl + qaData.sessionInfo[0].sessionUrl);

        //1 localidad con P. Automática - Incentivo Negativo - > Precio Base
        VenueNoMapPO.selectNoGraphicSeats(qaData.autoZoneId, 1);
        expect(SummaryPO.getFinalPrice()).toEqual(qaData.sessionInfo[0].finalPrice[0]);

        //2 localidades - 1 de ellas con la promoción anterior y la otra sin nada
        VenueNoMapPO.selectNoGraphicSeats(qaData.baseZoneId, 1);
        expect(SummaryPO.getFinalPrice()).toEqual(qaData.sessionInfo[0].finalPrice[1]);

        SummaryPO.deleteSeatBySessionAndPosition(qaData.sessionInfo[0].sessionId, 0, 'delete');
    });

    it('Verificamos el precio del carrito con una localidad con promoción descuento de incentivo negativo superior al precio base más una localidad sin promoción', function() {
        //1 localidad con P. Descuento - Incentivo Negativo - > Precio Base
        PromotionsPO.selectPromotionByPosition(1);
        PromotionsPO.applyPromotionSeats(1);
        expect(SummaryPO.getFinalPrice()).toEqual(qaData.sessionInfo[0].finalPrice[2]);

        //2 localidades - 1 de ellas con la promoción anterior y la otra sin nada
        VenueNoMapPO.selectNoGraphicSeats(qaData.baseZoneId, 2);
        expect(SummaryPO.getFinalPrice()).toEqual(qaData.sessionInfo[0].finalPrice[3]);
    });

    it('Verificamos el precio del carrito anterior si a la localidad con el descuento le aplicamos además una promoción con incentivo positivo inferior al precio base', function() {
        PromotionsPO.selectPromotionByPosition(6);
        PromotionsPO.applyPromotionSeats(1);
        expect(SummaryPO.getFinalPrice()).toEqual(qaData.sessionInfo[0].finalPrice[4]);
        SummaryPO.deleteSeatBySessionAndPosition(qaData.sessionInfo[0].sessionId, 0, 'delete');
    });

    it('Verificamos el precio del carrito con una localidad con promoción promoción de incentivo negativo superior al precio base más una localidad sin promoción', function() {
        //1 localidad con P. Promoción - Incentivo Negativo - > Precio Base
        VenueNoMapPO.selectNoGraphicSeats(qaData.baseZoneId, 1);
        PromotionsPO.selectPromotionByPosition(5);
        PromotionsPO.applyPromotionSeats(1);
        expect(SummaryPO.getFinalPrice()).toEqual(qaData.sessionInfo[0].finalPrice[4]);

        //2 localidades - 1 de ellas con la promoción anterior y la otra sin nada
        VenueNoMapPO.selectNoGraphicSeats(qaData.baseZoneId, 2);
        expect(SummaryPO.getFinalPrice()).toEqual(qaData.sessionInfo[0].finalPrice[5]);

        SummaryPO.deleteSeatBySessionAndPosition(qaData.sessionInfo[0].sessionId, 0, 'delete');
    });

    it('Verificamos el precio del carrito con una localidad con promoción automática de incentivo positivo superior al precio base más una localidad sin promoción', function() {
        //1 localidad con P. Automática - Incentivo Positivo - > Precio Base
        VenueNoMapPO.selectNoGraphicSeats(qaData.autoZoneId, 1);
        expect(SummaryPO.getFinalPrice()).toEqual(qaData.sessionInfo[1].finalPrice[0]);

        //2 localidades - 1 de ellas con la promoción anterior y la otra sin nada
        VenueNoMapPO.selectNoGraphicSeats(qaData.baseZoneId, 1);
        expect(SummaryPO.getFinalPrice()).toEqual(qaData.sessionInfo[1].finalPrice[1]);

        SummaryPO.deleteSeatBySessionAndPosition(qaData.sessionInfo[1].sessionId, 0, 'delete');
    });

    it('Verificamos el precio del carrito añadiendo una promoción con incetivo negativo inferior al precio base a la localidad que ya tiene la promoción automática', function() {
        PromotionsPO.selectPromotionByPosition(4);
        PromotionsPO.applyPromotionSeats(1);
        expect(SummaryPO.getFinalPrice()).toEqual(qaData.sessionInfo[1].finalPrice[2]);
    });
});