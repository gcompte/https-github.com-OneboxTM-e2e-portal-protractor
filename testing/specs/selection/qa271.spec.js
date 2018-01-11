var SelectLocationsPO = require('./../../page-objects/select-locations.po.js'),
    VenueNoMapPO = require('./../../page-objects/venue-no-map.po.js'),
    AppPO = require('./../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa271;

describe('QA-271 Verificar la visualización del Slider de Precios y el Price Box (Caja de Precios)', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.firstSession.url);
    });

    it('Accedemos a una sesión con un recinto gráfico que tiene una única zona de precio y un único precio, y verificamos que la información del precio se muestra correctamente', function() {
        if(browser.params.device === 'mobile'){
            browser.driver.sleep(3000);
            AppPO.browserScrollTo(0, 0).then(function(){
                SelectLocationsPO.changeSelectedMode();
            });
        };

        expect(SelectLocationsPO.getPriceZoneSlider().isPresent()).toBe(false);
        expect(SelectLocationsPO.getDropdownPrices().isPresent()).toBe(false);
        expect(SelectLocationsPO.getPricesBox().getText()).toEqual(qaData.firstSession.pricesBoxInfo);
    });

    it('Accedemos a una sesión con un recinto gráfico que tiene varias zonas de precio pero un único precio, y verificamos que la información se muestra correctamente', function() {
        browser.get(browser.baseUrl + qaData.secondSession.url);
        browser.driver.sleep(4000);

        if(browser.params.device === 'mobile'){
            AppPO.browserScrollTo(0, 0).then(function(){
                SelectLocationsPO.changeSelectedMode();
            });
        }else{
            AppPO.browserScrollTo(0, 0);
        };

        expect(SelectLocationsPO.getPriceZoneSlider().isPresent()).toBe(false);
        expect(SelectLocationsPO.getDropdownPrices().isPresent()).toBe(true);
        expect(SelectLocationsPO.getDropdownPrices('.price-zone-info').count()).toBe(qaData.secondSession.pricesZones.length);
        SelectLocationsPO.getDropdownPrices().click().then(function(){
            SelectLocationsPO.getDropdownPrices('.price-zone-info').getText().then(function(dropdownPricesInfo){
                expect(dropdownPricesInfo.length).toBe(qaData.secondSession.pricesZones.length);
                expect(dropdownPricesInfo).toEqual(qaData.secondSession.pricesZones);
            });
        });
    });

    it('Accedemos a una sesión con un recinto gráfico que tiene varias zonas de precio y varios precios, y verificamos que la información se muestra correctamente', function() {
        browser.get(browser.baseUrl + qaData.thirdSession.url);
        browser.driver.sleep(4000);

        if(browser.params.device === 'mobile'){
            AppPO.browserScrollTo(0, 0).then(function(){
                SelectLocationsPO.changeSelectedMode();
            });
        }else{
            browser.driver.sleep(5000);
            AppPO.browserScrollTo(0, 0);
        };

        var priceZoneSlider = SelectLocationsPO.getPriceZoneSlider();

        expect(priceZoneSlider.isPresent()).toBe(true);
        expect(SelectLocationsPO.getMinMaxSliderPrices().getText()).toEqual(qaData.thirdSession.minMaxPrice);
        expect(SelectLocationsPO.getDropdownPrices().isPresent()).toBe(true);
        expect(SelectLocationsPO.getDropdownPrices('.price-zone-info').count()).toBe(qaData.thirdSession.pricesZones.length);
        SelectLocationsPO.getDropdownPrices().click().then(function(){
            SelectLocationsPO.getDropdownPrices('.price-zone-info').getText().then(function(dropdownPricesInfo){
                expect(dropdownPricesInfo.length).toBe(qaData.thirdSession.pricesZones.length);
                expect(dropdownPricesInfo).toEqual(qaData.thirdSession.pricesZones);
            });
        });
    });

    it('Accedemos a una sesión con un recinto no gráfico que tiene varias zonas de precio y varios precios, y verificamos que la información se muestra correctamente', function() {
        browser.get(browser.baseUrl + qaData.fourthSession.url);

        expect(SelectLocationsPO.getPriceZoneSlider().isPresent()).toBe(false);
        expect(SelectLocationsPO.getDropdownPrices().isPresent()).toBe(false);

        VenueNoMapPO.getZoneInfo().getText().then(function(priceZonesText){
            expect(priceZonesText.length).toBe(qaData.fourthSession.pricesZones.length);
            for(var i = 0; i < priceZonesText.length; i++){
                expect(priceZonesText[i]).toEqual(qaData.fourthSession.pricesZones[i]);
            }
        });
        expect(VenueNoMapPO.isSoldOut(qaData.fourthSession.unavailableZone)).toBe(true);
    });
});