var SelectLocationsPO = require('./../../page-objects/select-locations.po.js'),
    VenueMapPO = require('./../../page-objects/venue-map.po.js'),
    VenueNavPO = require('./../../page-objects/venue-nav.po.js'),
    AppPO = require('./../../page-objects/app.po.js');

var env = browser.params.env,
    qaData = require('./suite-data.' + env + '.json').qa272;

describe('QA-272 Verificar el funcionamiento del Slider de Precios y el Price Box (Caja de Precios)', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.url);
    });

    it('Accedemos a una sesión y verificamos la visualización de la selección de localidades', function() {
        browser.driver.sleep(5000);    
        AppPO.browserScrollTo(0, 0);

        if(browser.params.device === 'mobile'){
            SelectLocationsPO.changeSelectedMode();
        };

        for(var i = 0; i < qaData.graphicAvailableZones.length; i++){
            expect(element(by.id(qaData.graphicAvailableZones[i].zoneId)).getAttribute('style')).toMatch(qaData.graphicAvailableZones[i].opacity);
        }
        for(var j = 0; j < qaData.graphicUnavailableZones.length; j++){
            expect(element(by.id(qaData.graphicUnavailableZones[j].zoneId)).getAttribute('style')).toMatch(qaData.graphicUnavailableZones[j].opacity);
        }

        expect(SelectLocationsPO.getMinMaxSliderPrices().getText()).toEqual(qaData.minMaxPrice);

        SelectLocationsPO.getDropdownPrices().click();
        expect(SelectLocationsPO.getAllDropdownPricesZonesByAvailability(true).getText()).toEqual(qaData.pricesZones);
        expect(SelectLocationsPO.getAllDropdownPricesZonesByAvailability(false).count()).toEqual(0);
    });

    it('Entramos en las diferentes vistas y verificamos los precios del slider y el dropdown', function() {
        for(var i = 0; i < qaData.graphicAvailableZones.length; i++){
            VenueMapPO.selectZone(qaData.graphicAvailableZones[i].zoneSelector);

            expect(SelectLocationsPO.getMinMaxSliderPricesSelected().getText()).toEqual(qaData.graphicAvailableZones[i].minMaxPrice);

            SelectLocationsPO.getDropdownPrices().click();
            expect(SelectLocationsPO.getAllDropdownPricesZonesByStatus(true, false).getText()).toEqual(qaData.graphicAvailableZones[i].activePrices);
            expect(SelectLocationsPO.getAllDropdownPricesZonesByStatus(false, false).getText()).toEqual(qaData.graphicAvailableZones[i].inactivePrices);

            SelectLocationsPO.getDropdownPrices().click();
            VenueNavPO.mapGoBack();
        }

        SelectLocationsPO.getDropdownPrices().click();
        expect(SelectLocationsPO.getAllDropdownPricesZonesByAvailability(true).getText()).toEqual(qaData.pricesZones);
        expect(SelectLocationsPO.getAllDropdownPricesZonesByAvailability(false).count()).toEqual(0);
    });

    it('Movemos el slider de precio y verificamos que se activan y desactivan las zonas del recinto gráfico', function(){
        VenueNavPO.mapGoBack();

        expect(element(by.id(qaData.graphicAvailableZones[1].zoneId)).getAttribute('style')).toMatch('opacity: 1;');

        SelectLocationsPO.moveSliderPrices('max', qaData.sliderPricesMove[0]);
        expect(SelectLocationsPO.getMinMaxSliderPricesSelected().getText()).toEqual(qaData.maxPriceFiltered);
        expect(element(by.id(qaData.graphicAvailableZones[1].zoneId)).getAttribute('style')).toMatch('opacity: 0.3;');

        SelectLocationsPO.moveSliderPrices('max', qaData.sliderPricesMove[1]);
        SelectLocationsPO.moveSliderPrices('min', qaData.sliderPricesMove[1]);
        expect(SelectLocationsPO.getMinMaxSliderPricesSelected().getText()).toEqual(qaData.minPriceFiltered);
        expect(element(by.id(qaData.graphicAvailableZones[1].zoneId)).getAttribute('style')).toMatch('opacity: 0.3;');
    });
});