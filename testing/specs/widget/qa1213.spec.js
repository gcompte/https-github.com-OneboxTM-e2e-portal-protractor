var AppPO = require('./../../page-objects/app.po.js'),
    VenueMapPO = require('./../../page-objects/venue-map.po.js'),
    VenueNoMapPO = require('./../../page-objects/venue-no-map.po.js'),
    PromotionsPO = require('./../../page-objects/promotions.po.js'),
    WidgetPO = require('./../../page-objects/widget.po.js');

var genericData = require('./../generic-data.json'),
    qaData = require('./suite-data.' + browser.params.env + '.json').qa1213;

describe('QA-1213 Verificar que un canal portal 3 puede usarse como widget', function() {
    it('Abrimos el html de test del widget', function() {
        browser.ignoreSynchronization = true;
        browser.get(genericData.htmlWidgetTest);

        WidgetPO.setRequiredFields(browser.params.env, qaData.channelUrl, qaData.eventId, qaData.sessionId);
        WidgetPO.loadWidget();

        browser.driver.sleep(3000);
        AppPO.switchContext('widget-container-container');
        browser.ignoreSynchronization = false;
        expect(WidgetPO.getMaxTicketsInfo().isDisplayed()).toBe(true);
        expect(WidgetPO.getDropdownPrices().isDisplayed()).toBe(true);
        expect(WidgetPO.getSliderPrices().isDisplayed()).toBe(true);
    });

    it('Verificamos que se ha cargado el widget y seleccionamos butacas', function() {
        if(browser.params.device === 'mobile'){
            VenueNoMapPO.selectNoGraphicSeats(qaData.noGraphicNumberedZone, qaData.seatsToSelect[0]);
        }else{
            expect(WidgetPO.existsVenue()).toBe(true);

            VenueMapPO.selectZone(qaData.graphicNumberedZone);
            VenueMapPO.selectNumberedSeats(qaData.seatsToSelect[0], true);
        }

        browser.driver.sleep(4000);
        expect(WidgetPO.getNumberSeatsSelected()).toBe(qaData.seatsToSelect[0]);

        expect(PromotionsPO.isApplicablePromotion(0)).toBe(false);
        expect(PromotionsPO.getValidatePromotionalCodeButton().getAttribute('class')).toMatch('disabled');

        PromotionsPO.setPromotionalCode(genericData.promotions.promotionalCodeOK).then(function(promotionalCodeInputTxt){
            expect(PromotionsPO.getValidatePromotionalCodeButton().getAttribute('class')).not.toMatch('disabled');

            PromotionsPO.getValidatePromotionalCodeButton().click().then(function(){
                expect(PromotionsPO.getSeatToApplyPromotion('promotionalCode').count()).toBe(parseInt(qaData.seatsToSelect[0]));
                PromotionsPO.applyPromotionalCodeSeats(0, 1);
            });
        });

        VenueMapPO.unselectSelectedSeats();
        expect(WidgetPO.getNumberSeatsSelected().isPresent()).toBe(false);
    });

    it('Volvemos a cargar el widget ocultando el máximo de localidades, el slider, el dropdown de precios y el bloque de promociones', function() {
        browser.ignoreSynchronization = true;
        browser.get(genericData.htmlWidgetTest);

        WidgetPO.setRequiredFields(browser.params.env, qaData.channelUrl, qaData.eventId, qaData.sessionId);
        //setOptionalFields(hidePriceInfo, hidePricesBox, activateSales, hideMaxTickets, widgetForceView, releaseCart, token)
        WidgetPO.setOptionalFields("true", "false", "false", "true", "0", "false", "");
        WidgetPO.loadWidget();

        browser.driver.sleep(3000);
        AppPO.switchContext('widget-container-container');
        browser.ignoreSynchronization = false;
        expect(WidgetPO.getMaxTicketsInfo().isDisplayed()).toBe(false);
        expect(WidgetPO.getDropdownPrices().isDisplayed()).toBe(false);
        expect(WidgetPO.getSliderPrices().isDisplayed()).toBe(false);
        expect(WidgetPO.getSliderPrices().getAttribute('class')).toMatch('medium-6');
        expect(WidgetPO.getPromotionsBlock().isPresent()).toBe(false);
    });

    it('Volvemos a cargar el widget ocultando el máximo de localidades y el slider', function() {
        browser.ignoreSynchronization = true;
        browser.get(genericData.htmlWidgetTest);

        WidgetPO.setRequiredFields(browser.params.env, qaData.channelUrl, qaData.eventId, qaData.sessionId);
        //setOptionalFields(hidePriceInfo, hidePricesBox, activateSales, hideMaxTickets, widgetForceView, releaseCart, token)
        WidgetPO.setOptionalFields("false", "true", "true", "true", "0", "false", "");
        WidgetPO.loadWidget();

        browser.driver.sleep(3000);
        AppPO.switchContext('widget-container-container');
        browser.ignoreSynchronization = false;
        expect(WidgetPO.getMaxTicketsInfo().isDisplayed()).toBe(false);
        expect(WidgetPO.getDropdownPrices().isPresent()).toBe(false);
        expect(WidgetPO.getSliderPrices().isDisplayed()).toBe(true);
        expect(WidgetPO.getSliderPrices().getAttribute('class')).not.toMatch('medium-6');
    });

    it('Cargamos el widget forzando a que la vista sea en versión móvil (recinto no gráfico)', function() {
        browser.ignoreSynchronization = true;
        browser.get(genericData.htmlWidgetTest);

        WidgetPO.setRequiredFields(browser.params.env, qaData.channelUrl, qaData.eventId, qaData.sessionId);
        //setOptionalFields(hidePriceInfo, hidePricesBox, activateSales, hideMaxTickets, widgetForceView, releaseCart, token)
        WidgetPO.setOptionalFields("false", "false", "true", "false", "2", "false", "");
        WidgetPO.loadWidget();

        browser.driver.sleep(3000);
        AppPO.switchContext('widget-container-container');
        browser.ignoreSynchronization = false;

        expect(VenueNoMapPO.getPriceZoneAvailabilitySelect(qaData.noGraphicNumberedZone)).toBe(qaData.channelLimitSeats);

        VenueNoMapPO.selectNoGraphicSeats(qaData.noGraphicNumberedZone, qaData.seatsToSelect[0]);
        expect(WidgetPO.getNumberSeatsSelected()).toBe(qaData.seatsToSelect[0]);

        expect(VenueNoMapPO.getPriceZoneAvailabilitySelect(qaData.noGraphicNumberedZone)).toBe(qaData.channelLimitSeats);
        expect(VenueNoMapPO.getPriceZoneAvailabilitySelect(qaData.secondNoGraphicNumberedZone)).toBe(qaData.channelLimitSeats - parseInt(qaData.seatsToSelect[0]));

        VenueNoMapPO.selectNoGraphicSeats(qaData.noGraphicNumberedZone, qaData.seatsToSelect[1]);
        expect(WidgetPO.getNumberSeatsSelected()).toBe(qaData.seatsToSelect[1]);

        VenueNoMapPO.selectNoGraphicSeats(qaData.noGraphicNumberedZone, qaData.seatsToSelect[2]);
        expect(WidgetPO.getNumberSeatsSelected().isPresent()).toBe(false);

        expect(WidgetPO.getMaxTicketsInfo().isDisplayed()).toBe(true);
        expect(WidgetPO.getDropdownPrices().isPresent()).toBe(false);
        expect(WidgetPO.getSliderPrices().isPresent()).toBe(false);
    });
});