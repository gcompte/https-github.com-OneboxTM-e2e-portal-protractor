var EventCardPO = require('./../../page-objects/event-card.po.js'),
    AppPO = require('./../../page-objects/app.po.js');

var env = browser.params.env,
    qaData = require('./suite-data.' + env + '.json').qa879;

describe('QA-879 Verificar vista minicalendario en evento con mas de 4 sesiones por dia', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.eventUrl);
    });

    it('Accedemos a la ficha de un evento y verificamos que tiene disponibles la vista multisesión y la vista minicalendario, esta última es la que está activa', function() {
        AppPO.closeCookiesPolicy();
        expect(EventCardPO.getSessionsView('#calendar-view-tab-button[ng-click="::changeView(\'minicalendar-view\')"]').isDisplayed()).toBe(true);
        expect(EventCardPO.getSessionsView('#calendar-view-tab-button[ng-click="::changeView(\'calendar-view\')"]').isDisplayed()).toBe(false);
        expect(EventCardPO.getSessionsView('#list-view-tab-button[ng-click="::changeView(\'sessions-list\')"]').isDisplayed()).toBe(false);
        expect(EventCardPO.getSessionsView('#list-view-tab-button[ng-click="::changeView(\'multisession-view\')"]').isDisplayed()).toBe(true);
        expect(EventCardPO.getSessionsView('#calendar-view-tab-button[ng-click="::changeView(\'minicalendar-view\')"]').getAttribute('class')).toMatch('active');
        expect(EventCardPO.getSessionsView('#list-view-tab-button[ng-click="::changeView(\'multisession-view\')"]').getAttribute('class')).not.toMatch('active');
    });

    it('Verificamos que se muestran las sesiones correctamente en el minicalendario', function(){
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

    it('Seleccionamos la vista multisesión y verificamos que se muestran las sesiones correctamente', function(){
        EventCardPO.changeSessionsView('multisession-view');

        expect(EventCardPO.getSessionsView('#calendar-view-tab-button[ng-click="::changeView(\'minicalendar-view\')"]').getAttribute('class')).not.toMatch('active');
        expect(EventCardPO.getSessionsView('#list-view-tab-button[ng-click="::changeView(\'multisession-view\')"]').getAttribute('class')).toMatch('active');
        expect(element(by.css('#sessions-list[ui-view="multisessionListView"]')).isPresent()).toBe(true);

        EventCardPO.getAllMultisessions().then(function(multisessions){
            expect(multisessions.length).toBe(qaData.multisessions.length);

            for(var i = 0; i < multisessions.length; i++){
                expect(multisessions[i].element(by.css('.month')).getText()).toEqual(qaData.multisessions[i].month);
                expect(multisessions[i].element(by.css('.day')).getText()).toEqual(qaData.multisessions[i].day);
                expect(multisessions[i].element(by.css('.weekday')).getText()).toEqual(qaData.multisessions[i].weekDay);
                expect(multisessions[i].all(by.repeater('session in value')).count()).toEqual(qaData.multisessions[i].timeSessions.length);
                expect(multisessions[i].all(by.repeater('session in value')).getText()).toEqual(qaData.multisessions[i].timeSessions);
            }
        });
    });
});

