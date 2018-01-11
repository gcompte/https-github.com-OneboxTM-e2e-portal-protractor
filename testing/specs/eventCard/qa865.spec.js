var EventCardPO = require('./../../page-objects/event-card.po.js'),
    AppPO = require('./../../page-objects/app.po.js');

var env = browser.params.env,
    qaData = require('./suite-data.' + env + '.json').qa865;

describe('QA-865 [Desktop] Vista en eventos con varios recintos, mínimo 5 sesiones/día y más de una sesión/recinto = Lista Simple y Minicalendario', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.eventUrl);
    });

    it('Accedemos a la ficha de un evento y verificamos que tiene disponibles la vista lista simple y la vista minicalendario, esta última es la que está activa', function() {
        AppPO.closeCookiesPolicy();
        expect(EventCardPO.getSessionsView('#calendar-view-tab-button[ng-click="::changeView(\'minicalendar-view\')"]').isDisplayed()).toBe(true);
        expect(EventCardPO.getSessionsView('#calendar-view-tab-button[ng-click="::changeView(\'calendar-view\')"]').isDisplayed()).toBe(false);
        expect(EventCardPO.getSessionsView('#list-view-tab-button[ng-click="::changeView(\'sessions-list\')"]').isDisplayed()).toBe(true);
        expect(EventCardPO.getSessionsView('#list-view-tab-button[ng-click="::changeView(\'multisession-view\')"]').isDisplayed()).toBe(false);
        expect(EventCardPO.getSessionsView('#calendar-view-tab-button[ng-click="::changeView(\'minicalendar-view\')"]').getAttribute('class')).toMatch('active');
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

    it('Seleccionamos la vista minicalendario y verificamos que se muestran las sesiones correctamente', function(){
        expect(element(by.css('div[ui-view="minicalendarView"')).isPresent()).toBe(false);

        EventCardPO.changeSessionsView('minicalendar-view');

        expect(EventCardPO.getSessionsView('#list-view-tab-button[ng-click="::changeView(\'multisession-view\')"]').getAttribute('class')).not.toMatch('active');
        expect(EventCardPO.getSessionsView('#calendar-view-tab-button[ng-click="::changeView(\'minicalendar-view\')"]').getAttribute('class')).toMatch('active');
        expect(element(by.css('div[ui-view="minicalendarView"')).isPresent()).toBe(true);
        expect(EventCardPO.getSelectedMonthMinicalendarMultisessions().count()).toBe(qaData.multisessions.length);
        expect(EventCardPO.getSelectedDaySessions().count()).toBe(qaData.multisessions[0].timeSessions.length);

        //Verificamos que las fechas seleccionadas, tanto en el calendario como en la columna de la derecha, son correctas y coinciden con nuestros datos
        EventCardPO.getDateTextSelected().getText().then(function(dateSelectedText){
            expect(dateSelectedText).toEqual(qaData.dateSelectedText);
        });

        EventCardPO.getSelectedDate().then(function(dateSelectedCalendar){
            expect(dateSelectedCalendar).toEqual(qaData.dateSelectedCalendar);
        });
    });
});

