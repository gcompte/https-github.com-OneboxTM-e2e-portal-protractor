var EventCardPO = require('./../../page-objects/event-card.po.js'),
    SelectLocationsPO = require('./../../page-objects/select-locations.po.js'),
    AppPO = require('./../../page-objects/app.po.js');

var env = browser.params.env,
    qaData = require('./suite-data.' + env + '.json').qa859;

describe('QA-859 [Desktop] Vista en eventos con 1 recinto y entre 3 y 4 sesiones por día = Lista Multisesión y Calendario', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.eventUrl);
    });

    it('Accedemos a la ficha de un evento y verificamos que tiene disponibles la vista lista simple y la vista calendario, esta última es la que está activa', function() {
        AppPO.closeCookiesPolicy();
        expect(EventCardPO.getSessionsView('#calendar-view-tab-button[ng-click="::changeView(\'minicalendar-view\')"]').isDisplayed()).toBe(false);
        expect(EventCardPO.getSessionsView('#calendar-view-tab-button[ng-click="::changeView(\'calendar-view\')"]').isDisplayed()).toBe(true);
        expect(EventCardPO.getSessionsView('#list-view-tab-button[ng-click="::changeView(\'sessions-list\')"]').isDisplayed()).toBe(false);
        expect(EventCardPO.getSessionsView('#list-view-tab-button[ng-click="::changeView(\'multisession-view\')"]').isDisplayed()).toBe(true);
        expect(EventCardPO.getSessionsView('#calendar-view-tab-button[ng-click="::changeView(\'calendar-view\')"]').getAttribute('class')).toMatch('active');
        expect(EventCardPO.getSessionsView('#list-view-tab-button[ng-click="::changeView(\'multisession-view\')"]').getAttribute('class')).not.toMatch('active');
    });

    it('Seleccionamos la vista multisesión y verificamos que se muestran las sesiones correctamente', function(){
        EventCardPO.changeSessionsView('multisession-view');

        expect(EventCardPO.getSessionsView('#calendar-view-tab-button[ng-click="::changeView(\'calendar-view\')"]').getAttribute('class')).not.toMatch('active');
        expect(EventCardPO.getSessionsView('#list-view-tab-button[ng-click="::changeView(\'multisession-view\')"]').getAttribute('class')).toMatch('active');
        expect(element(by.css('#sessions-list[ui-view="multisessionListView"]')).isPresent()).toBe(true);

        EventCardPO.getAllMultisessions().then(function(multisessions){
            expect(multisessions.length).toBe(qaData.multisessionsTotal);

            for(var i = 0; i < multisessions.length; i++){
                expect(multisessions[i].element(by.css('.month')).getText()).toEqual(qaData.multisessions[i].month);
                expect(multisessions[i].element(by.css('.day')).getText()).toEqual(qaData.multisessions[i].day);
                expect(multisessions[i].element(by.css('.weekday')).getText()).toEqual(qaData.multisessions[i].weekDay);
                expect(multisessions[i].all(by.repeater('session in value')).count()).toEqual(qaData.multisessions[i].timeSessions.length);
                expect(multisessions[i].all(by.repeater('session in value')).getText()).toEqual(qaData.multisessions[i].timeSessions);
            }
        });
    });

    it('Seleccionamos la vista calendario y verificamos que se muestran las sesiones dentro de un calendario', function(){
        EventCardPO.changeSessionsView('calendar-view');

        expect(EventCardPO.getSessionsView('#list-view-tab-button[ng-click="::changeView(\'multisession-view\')"]').getAttribute('class')).not.toMatch('active');
        expect(EventCardPO.getSessionsView('#calendar-view-tab-button[ng-click="::changeView(\'calendar-view\')"]').getAttribute('class')).toMatch('active');
        expect(element(by.id('viewCalendarSessions')).isPresent()).toBe(true);
        expect(element(by.css('.current-month')).isPresent()).toBe(true);
        expect(element(by.css('.month-table')).isPresent()).toBe(true);
        expect(EventCardPO.getAllCalendarSessions().count()).toBeGreaterThan(0);
    });

    it('Verificamos que se puede acceder correctamente a las sesiones desde ambas vistas', function(){
        EventCardPO.boxSessionTime(qaData.sessionId);
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + qaData.sessionUrl);

        browser.driver.sleep(2000);
        AppPO.browserScrollTo(0, 0);

        SelectLocationsPO.seeAllSessions();
        EventCardPO.changeSessionsView('multisession-view');
        EventCardPO.boxSessionTime(qaData.sessionId);

        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + qaData.sessionUrl);
    });
});

