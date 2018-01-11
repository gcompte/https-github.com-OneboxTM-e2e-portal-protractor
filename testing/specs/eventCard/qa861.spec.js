var EventCardPO = require('./../../page-objects/event-card.po.js'),
    AppPO = require('./../../page-objects/app.po.js');

var env = browser.params.env,
    qaData = require('./suite-data.' + env + '.json').qa861;

describe('QA-861 [Desktop] Vista en eventos con 1 recinto y 11 o más sesiones por día = Minicalendario', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.eventUrl);
    });

    it('Accedemos a la ficha de un evento y verificamos que solo tiene disponible la vista minicalendario', function() {
        AppPO.closeCookiesPolicy();
        expect(EventCardPO.getChangeSessionsViewTabs().isPresent()).toBe(false);
    });

    it('Verificamos que se muestran las sesiones correctamente', function(){
        var selectedDate = '';

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

    it('Verificamos que se puede acceder correctamente a las sesiones', function(){
        EventCardPO.boxSessionTime(qaData.sessionId);
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + qaData.sessionUrl);
    });
});

