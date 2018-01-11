var EventCardPO = require('./../../page-objects/event-card.po.js'),
    DatePickerPO = require('./../../page-objects/date-picker.po.js'),
    AppPO = require('./../../page-objects/app.po.js');

var env = browser.params.env,
    qaData = require('./suite-data.' + env + '.json').qa3663;

describe('QA-3663 Verificar que se visualiza en el control datepicker las sesiones publicadas y que se permiten ser seleccionadas (individualmente)', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.eventUrl);
    });

    it('Accedemos a un evento con vista calendario por defecto, verificamos que no aparece el datepicker', function() {
        AppPO.closeCookiesPolicy();
        expect(DatePickerPO.getDatePicker().isPresent()).toBe(false);
    });

    it('Cambiamos la vista a modo lista y verificamos que sí se muestra el datepicker', function(){
        EventCardPO.changeSessionsView('sessions-list');
        expect(DatePickerPO.getDatePicker().isPresent()).toBe(true);
    });

    it('Abrimos el datepicker y verificamos que se abre con el mes en curso, que están marcados los días en los que tenemos sesiones, y que no se muestran días de otros meses', function(){
        DatePickerPO.expandDatePicker();

        expect(DatePickerPO.getActualMonthYear()).toEqual(qaData.monthYearSelected);

        expect(DatePickerPO.getDaysWithSessions().getText()).toEqual(EventCardPO.getDistinctSessionsDays(qaData.monthSelected));
        expect(EventCardPO.getDistinctSessionsDays(qaData.monthSelected)).toEqual(qaData.daysSessions);
    });
});