var EventCardPO = require('./../../page-objects/event-card.po.js');

var env = browser.params.env,
    qaData = require('./suite-data.' + env + '.json').qa884;

describe('QA-884 Verificar que para un evento publicado en dos canales se muestra la vista correcta en cada canal', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.eventUrlChannelMulti);
    });

    it('Accedemos al evento en un canal con "Vista Listado" seleccionada por defecto, y verificamos que las vistas disponibles son las correctas', function() {
        expect(EventCardPO.getSessionsView('#calendar-view-tab-button[ng-click="::changeView(\'minicalendar-view\')"]').isDisplayed()).toBe(false);
        expect(EventCardPO.getSessionsView('#calendar-view-tab-button[ng-click="::changeView(\'calendar-view\')"]').isDisplayed()).toBe(true);
        expect(EventCardPO.getSessionsView('#list-view-tab-button[ng-click="::changeView(\'sessions-list\')"]').isDisplayed()).toBe(true);
        expect(EventCardPO.getSessionsView('#list-view-tab-button[ng-click="::changeView(\'multisession-view\')"]').isDisplayed()).toBe(false);
        expect(EventCardPO.getSessionsView('#calendar-view-tab-button[ng-click="::changeView(\'calendar-view\')"]').getAttribute('class')).not.toMatch('active');
        expect(EventCardPO.getSessionsView('#list-view-tab-button[ng-click="::changeView(\'sessions-list\')"]').getAttribute('class')).toMatch('active');
    });

    it('Verificamos que, por defecto, las sesiones se muestran en formato listado', function() {
        expect(element(by.css('#sessions-list[ui-view="sessionsListView"]')).isPresent()).toBe(true);

        EventCardPO.getAllListSessions().then(function(sessions){
            for(var i = 0; i < sessions.length; i++){
                expect(sessions[i].element(by.css('.calendar-date')).isPresent()).toBe(true);
                expect(sessions[i].element(by.css('.session-title-time-place')).isPresent()).toBe(true);
                expect(sessions[i].element(by.css('.price-container')).isPresent()).toBe(true);
            }
        });
    });

    it('Accedemos al mismo evento en un canal con "Vista Calendario" seleccionada por defecto, y verificamos que las vistas disponibles son las correctas', function() {
        browser.get(browser.baseUrl + qaData.eventUrlChannelMono);

        expect(EventCardPO.getSessionsView('#calendar-view-tab-button[ng-click="::changeView(\'minicalendar-view\')"]').isDisplayed()).toBe(false);
        expect(EventCardPO.getSessionsView('#calendar-view-tab-button[ng-click="::changeView(\'calendar-view\')"]').isDisplayed()).toBe(true);
        expect(EventCardPO.getSessionsView('#list-view-tab-button[ng-click="::changeView(\'sessions-list\')"]').isDisplayed()).toBe(true);
        expect(EventCardPO.getSessionsView('#list-view-tab-button[ng-click="::changeView(\'multisession-view\')"]').isDisplayed()).toBe(false);
        expect(EventCardPO.getSessionsView('#calendar-view-tab-button[ng-click="::changeView(\'calendar-view\')"]').getAttribute('class')).toMatch('active');
        expect(EventCardPO.getSessionsView('#list-view-tab-button[ng-click="::changeView(\'sessions-list\')"]').getAttribute('class')).not.toMatch('active');
    });

    it('Verificamos que, por defecto, las sesiones se muestran en formato calendario', function() {
        expect(element(by.id('viewCalendarSessions')).isPresent()).toBe(true);
        expect(element(by.css('.current-month')).isPresent()).toBe(true);
        expect(element(by.css('.month-table')).isPresent()).toBe(true);
        expect(EventCardPO.getAllCalendarSessions().count()).toBeGreaterThan(0);
    });
});