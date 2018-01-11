var EventCardPO = require('./../../page-objects/event-card.po.js');

var env = browser.params.env,
    qaData = require('./suite-data.' + env + '.json').qa881;

describe('QA-881 Verificar que se muestra vista lista cuando seleccionas "Listado" en formato de sesiones', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.supraeventUrlChannelMulti);
    });

    it('Accedemos a un supraevento en un canal con "Vista Listado" seleccionada por defecto, y verificamos que las vistas disponibles son las correctas', function() {
        expect(EventCardPO.getSessionsView('.list-view-tab-button').isDisplayed()).toBe(true);
        expect(EventCardPO.getSessionsView('.gallery-view-tab-button').isDisplayed()).toBe(true);
        expect(EventCardPO.getSessionsView('#calendar-view-tab-button[ng-click="::changeView(\'minicalendar-view\')"]').isPresent()).toBe(false);
        expect(EventCardPO.getSessionsView('#calendar-view-tab-button[ng-click="::changeView(\'calendar-view\')"]').isPresent()).toBe(false);
        expect(EventCardPO.getSessionsView('#list-view-tab-button[ng-click="::changeView(\'sessions-list\')"]').isPresent()).toBe(false);
        expect(EventCardPO.getSessionsView('#list-view-tab-button[ng-click="::changeView(\'multisession-view\')"]').isPresent()).toBe(false);
    });

    it('Verificamos que, por defecto, las sesiones se muestran en formato galería', function() {
        expect(EventCardPO.getSessionsView('.list-view-tab-button').getAttribute('class')).not.toMatch('active');
        expect(EventCardPO.getSessionsView('.gallery-view-tab-button').getAttribute('class')).toMatch('active');

        expect(element(by.id('supraevent-gallery')).isDisplayed()).toBe(true);
        expect(element(by.id('supraevent-list')).isDisplayed()).toBe(false);
    });

    it('Accedemos al mismo supraevento en un canal con "Vista Calendario" seleccionada por defecto, y verificamos que las vistas disponibles son las correctas', function() {
        browser.get(browser.baseUrl + qaData.supraeventUrlChannelMono);

        expect(EventCardPO.getSessionsView('.list-view-tab-button').isDisplayed()).toBe(true);
        expect(EventCardPO.getSessionsView('.gallery-view-tab-button').isDisplayed()).toBe(true);
        expect(EventCardPO.getSessionsView('#calendar-view-tab-button[ng-click="::changeView(\'minicalendar-view\')"]').isPresent()).toBe(false);
        expect(EventCardPO.getSessionsView('#calendar-view-tab-button[ng-click="::changeView(\'calendar-view\')"]').isPresent()).toBe(false);
        expect(EventCardPO.getSessionsView('#list-view-tab-button[ng-click="::changeView(\'sessions-list\')"]').isPresent()).toBe(false);
        expect(EventCardPO.getSessionsView('#list-view-tab-button[ng-click="::changeView(\'multisession-view\')"]').isPresent()).toBe(false);
    });

    it('Verificamos que, por defecto, las sesiones se muestran en formato galería', function() {
        expect(EventCardPO.getSessionsView('.list-view-tab-button').getAttribute('class')).not.toMatch('active');
        expect(EventCardPO.getSessionsView('.gallery-view-tab-button').getAttribute('class')).toMatch('active');

        expect(element(by.id('supraevent-gallery')).isDisplayed()).toBe(true);
        expect(element(by.id('supraevent-list')).isDisplayed()).toBe(false);
    });
});