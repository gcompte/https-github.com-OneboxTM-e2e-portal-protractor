var EventCardPO = require('./../../page-objects/event-card.po.js'),
    DatePickerPO = require('./../../page-objects/date-picker.po.js'),
    AppPO = require('./../../page-objects/app.po.js');

var env = browser.params.env,
    qaData = require('./suite-data.' + env + '.json').qa3658;

describe('QA-3658 Verificar comportamiento del control datepicker cambiando de vistas (lista/calendario) con mas de una sesión en un evento normal', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.eventUrl);
    });

    it('Accedemos a un evento con vista calendario por defecto, verificamos que no aparece el datepicker', function() {
        AppPO.closeCookiesPolicy();
        expect(DatePickerPO.getDatePicker().isPresent()).toBe(false);
    });

    it('Modificamos el tipo de vista y verificamos que ahora sí que aparece el datepicker', function(){
        EventCardPO.changeSessionsView('sessions-list');

        expect(DatePickerPO.getDatePicker().isDisplayed()).toBe(true);
    });
});