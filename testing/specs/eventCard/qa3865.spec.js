var EventCardPO = require('./../../page-objects/event-card.po.js'),
    B2bPO = require('./../../page-objects/b2b.po.js'),
    TaquillaWebPO = require('./../../page-objects/taquilla-web.po.js'),
    CatalogChannelPO = require('./../../page-objects/catalog-channel.po.js'),
    AppPO = require('./../../page-objects/app.po.js');

var genericData = require('./../generic-data.json'),
    qaData = require('./suite-data.' + browser.params.env + '.json').qa3865;

describe('QA-3865 Verificar que una sesión en estado "Pendiente publicación" no es visible en la cartelera ni en la ficha de evento en un canal Portal, Taquilla Web o B2B', function() {
    it('Verificamos que la sesión en estado "Pendiente de Publicación" no aparece en ninguna de las vistas de la ficha de evento en Portal', function() {
        browser.get(browser.baseUrl + qaData.portalEventUrl);
        AppPO.closeCookiesPolicy();
        //Vista calendario
        expect(EventCardPO.getSessionById(qaData.portalSessionId).isPresent()).toBe(false);

        //Vista lista simple
        EventCardPO.changeSessionsView('sessions-list');
        expect(EventCardPO.getSessionById(qaData.portalSessionId).isPresent()).toBe(false);
    });

    it('Verificamos que la sesión en estado "Pendiente de Publicación" no aparece en ninguna de las vistas de la ficha de evento en un canal B2B', function() {
        browser.get(browser.baseUrl + genericData.channels.b2b + genericData.channels.states.login);
        B2bPO.loginUser(genericData.b2bUsersData[0].user, genericData.b2bUsersData[0].password);
        B2bPO.goToEvent(qaData.b2bEventId);

        expect(EventCardPO.getSessionById(qaData.b2bPreviewSessionId).isPresent()).toBe(false);
        expect(EventCardPO.getSessionById(qaData.b2bPreparedSessionId).isPresent()).toBe(true);
    });

    it('Verificamos que la sesión en estado "Pendiente de Publicación" no aparece en ninguna de las vistas de la ficha de evento en Taquilla Web', function() {
        browser.ignoreSynchronization = true;
        browser.get(genericData.channels.taquillaWebMono);
        TaquillaWebPO.loginUser(genericData.taquillaWebUsersData.users[0].email, genericData.taquillaWebUsersData.password);
        TaquillaWebPO.selectEvent(qaData.portalEventId);

        expect(TaquillaWebPO.getSessionById(qaData.portalEventId, qaData.portalSessionId).isPresent()).toBe(false);
    });

    it('Verificamos que un evento con una única sesión, el estado de la cual sea "Pendiente de Publicación", no es accesible y no debe mostrarse en la cartelera del canal', function() {
        browser.get(browser.baseUrl + qaData.previewEventUrl);
        AppPO.loadAllScroll(qaData.scrollSteps);

        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + genericData.channels.genericMono + genericData.channels.states.billboard);
        expect(CatalogChannelPO.getEventById(qaData.eventId).isPresent()).toBe(false);
        expect(CatalogChannelPO.getEventById(qaData.portalEventId).isPresent()).toBe(true);
    });
});