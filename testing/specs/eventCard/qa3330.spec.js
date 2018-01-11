var EventCardPO = require('./../../page-objects/event-card.po.js'),
    AppPO = require('./../../page-objects/app.po.js');

var env = browser.params.env,
    qaData = require('./suite-data.' + env + '.json').qa3330;

describe('QA-3330 Al visualizar un evento entrada regalo siempre debe aparecer la vista lista ', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.giftEventUrlChannelMono);
    });

    it('Accedemos a un evento "entrada regalo" en un canal con vista calendario por defecto y verificamos que solo se muestra la vista lista, sin opción a cambiar a la vista calendario', function() {
        expect(EventCardPO.getChangeSessionsViewTabs().isPresent()).toBe(false);
    });

    it('Accedemos a un evento "entrada regalo" en un canal con vista lista por defecto y verificamos que solo se muestra dicha lista, sin opción a cambiar a la vista calendario', function() {
        browser.get(browser.baseUrl + qaData.giftEventUrlChannelMulti);

        expect(EventCardPO.getChangeSessionsViewTabs().isPresent()).toBe(false);
    });

    it('Accedemos a un evento normal en un canal con vista lista por defecto y verificamos que sí tenemos la opción de cambiar a vista calendario', function() {
        browser.get(browser.baseUrl + qaData.normalEventUrlChannelMulti);

        expect(EventCardPO.getChangeSessionsViewTabs().isPresent()).toBe(true);
        expect(EventCardPO.getSessionsView('#calendar-view-tab-button[ng-click="::changeView(\'minicalendar-view\')"]').isDisplayed()).toBe(false);
        expect(EventCardPO.getSessionsView('#calendar-view-tab-button[ng-click="::changeView(\'calendar-view\')"]').isDisplayed()).toBe(true);
        expect(EventCardPO.getSessionsView('#list-view-tab-button[ng-click="::changeView(\'sessions-list\')"]').isDisplayed()).toBe(true);
        expect(EventCardPO.getSessionsView('#list-view-tab-button[ng-click="::changeView(\'multisession-view\')"]').isDisplayed()).toBe(false);
        expect(EventCardPO.getSessionsView('#list-view-tab-button[ng-click="::changeView(\'sessions-list\')"]').getAttribute('class')).toMatch('active');
        expect(EventCardPO.getSessionsView('#calendar-view-tab-button[ng-click="::changeView(\'calendar-view\')"]').getAttribute('class')).not.toMatch('active');
    });
});