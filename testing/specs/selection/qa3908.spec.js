var VenueNoMapPO = require('./../../page-objects/venue-no-map.po.js'),
    TaquillaWebPO = require('./../../page-objects/taquilla-web.po.js'),
    WidgetPO = require('./../../page-objects/widget.po.js'),
    AppPO = require('./../../page-objects/app.po.js');

var genericData = require('./../generic-data.json'),
    qaData = require('./suite-data.' + browser.params.env + '.json').qa3908;

describe('QA-3908 Verificar la ordenación de zonas de precio en selección automática', function() {
    it('Accedemos, desde Portal, a la selección de localidades de una sesión que tenga varias zonas de precio, con precios diferentes y algunas con las entradas agotadas, y verificamos el orden', function() {
        browser.get(browser.baseUrl + qaData.sessionUrl);
        expect(VenueNoMapPO.getPriceZonesName()).toEqual(qaData.pricesZonesName);
    });

    it('Accedemos, desde Taquilla Web, a la selección de localidades de una sesión que tenga varias zonas de precio, con precios diferentes y algunas con las entradas agotadas, y verificamos el orden', function() {
        browser.ignoreSynchronization = true;
        browser.get(browser.baseUrl + genericData.channels.taquillaWebMono);
        TaquillaWebPO.loginUser(genericData.taquillaWebUsersData.users[0].email, genericData.taquillaWebUsersData.password);

        TaquillaWebPO.selectEvent(qaData.eventId);
        TaquillaWebPO.selectSession(qaData.sessionId);

        browser.ignoreSynchronization = false;
        AppPO.switchContext('boxoffice-view');

        expect(VenueNoMapPO.getPriceZonesName()).toEqual(qaData.pricesZonesName);
    });

    it('Accedemos, desde Widget, a la selección de localidades de una sesión que tenga varias zonas de precio, con precios diferentes y algunas con las entradas agotadas, y verificamos el orden', function() {
        browser.ignoreSynchronization = true;
        browser.get(genericData.htmlWidgetTest);

        WidgetPO.setRequiredFields(browser.params.env, qaData.channelUrl, qaData.eventId, qaData.sessionId);
        WidgetPO.loadWidget();
        browser.driver.sleep(3000);
        AppPO.switchContext('widget-container-container');
        browser.ignoreSynchronization = false;

        expect(VenueNoMapPO.getPriceZonesName()).toEqual(qaData.pricesZonesName);
    });
});