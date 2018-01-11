var EventCardPO = require('./../../page-objects/event-card.po.js'),
    AppPO = require('./../../page-objects/app.po.js');

var env = browser.params.env,
    qaData = require('./suite-data.' + env + '.json').qa863;

describe('QA-863 [Desktop] Vista en eventos con varios recintos, 1 a 4 ses/día y +1 ses/recinto = Lista Simple y Calendario', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.eventUrl);
    });

    it('Accedemos a la ficha de un evento y verificamos que tiene disponibles la vista lista simple y la vista calendario, esta última es la que está activa', function() {
        AppPO.closeCookiesPolicy();
        expect(EventCardPO.getSessionsView('#calendar-view-tab-button[ng-click="::changeView(\'minicalendar-view\')"]').isDisplayed()).toBe(false);
        expect(EventCardPO.getSessionsView('#calendar-view-tab-button[ng-click="::changeView(\'calendar-view\')"]').isDisplayed()).toBe(true);
        expect(EventCardPO.getSessionsView('#list-view-tab-button[ng-click="::changeView(\'sessions-list\')"]').isDisplayed()).toBe(true);
        expect(EventCardPO.getSessionsView('#list-view-tab-button[ng-click="::changeView(\'multisession-view\')"]').isDisplayed()).toBe(false);
        expect(EventCardPO.getSessionsView('#calendar-view-tab-button[ng-click="::changeView(\'calendar-view\')"]').getAttribute('class')).toMatch('active');
    });

    it('Seleccionamos la vista lista simple y verificamos que se muestran las sesiones en el formato listado, sin imagen y con la información correspondiente', function(){
        EventCardPO.changeSessionsView('sessions-list');

        expect(EventCardPO.getSessionsView('#calendar-view-tab-button[ng-click="::changeView(\'calendar-view\')"]').getAttribute('class')).not.toMatch('active');
        expect(EventCardPO.getSessionsView('#list-view-tab-button[ng-click="::changeView(\'sessions-list\')"]').getAttribute('class')).toMatch('active');

        expect(element(by.css('#sessions-list[ui-view="sessionsListView"]')).isPresent()).toBe(true);

        EventCardPO.getAllListSessions().then(function(sessions){
            for(var i = 0; i < sessions.length; i++){
                expect(sessions[i].element(by.css('.calendar-date')).isPresent()).toBe(true);
                expect(sessions[i].element(by.css('.session-title-time-place')).isPresent()).toBe(true);
                expect(sessions[i].element(by.css('.price-container')).isPresent()).toBe(true);
            }
        });
    });

    it('Seleccionamos la vista calendario y verificamos que se muestran las sesiones dentro de un calendario', function(){
        EventCardPO.changeSessionsView('calendar-view');

        expect(EventCardPO.getSessionsView('#list-view-tab-button[ng-click="::changeView(\'sessions-list\')"]').getAttribute('class')).not.toMatch('active');
        expect(EventCardPO.getSessionsView('#calendar-view-tab-button[ng-click="::changeView(\'calendar-view\')"]').getAttribute('class')).toMatch('active');

        expect(element(by.id('viewCalendarSessions')).isPresent()).toBe(true);
        expect(element(by.css('.current-month')).isPresent()).toBe(true);
        expect(element(by.css('.month-table')).isPresent()).toBe(true);
        expect(EventCardPO.getAllCalendarSessions().count()).toBeGreaterThan(0);
    });
});

