var EventCardPO = require('./../../page-objects/event-card.po.js'),
    CatalogChannelPO = require('./../../page-objects/catalog-channel.po.js'),
    AppPO = require('./../../page-objects/app.po.js');

var env = browser.params.env,
    qaData = require('./suite-data.' + env + '.json').qa868;

describe('QA-868 [Desktop] El call to action me indica "Regalar" en sesiones de la ficha evento', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.channelUrl);
    });

    it('Accedemos a la cartelera del canal y verificamos que el call-to-action del evento entrada regalo es correcto', function() {
        browser.driver.sleep(2000);
        AppPO.browserScrollTo(0, 3000);
        browser.driver.sleep(2000);
        AppPO.browserScrollTo(0, 5000);

        var eventBoxInfo = CatalogChannelPO.getEventBoxInfo(qaData.eventInfo.id);
        browser.driver.sleep(1000);

        expect(eventBoxInfo.title.getText()).toEqual(qaData.eventInfo.title);
        expect(eventBoxInfo.subtitle.getText()).toEqual(qaData.eventInfo.subtitle);
        expect(eventBoxInfo.place.getText()).toEqual(qaData.eventInfo.place);
        expect(eventBoxInfo.date.isPresent()).toBe(false);
        expect(eventBoxInfo.callToAction.getText()).toMatch(qaData.eventInfo.callToAction);
    });

    it('Accedemos a la ficha del evento y verificamos que la información mostrada es correcta', function(){
        CatalogChannelPO.goToGiftEvent(qaData.eventInfo.id);

        expect(EventCardPO.getSidebarCallToAction().getText()).toEqual(qaData.eventInfo.callToAction);

        EventCardPO.getAllListSessions().then(function(sessions){
            for(var i = 0; i < sessions.length; i++){
                expect(sessions[i].element(by.css('.buy-btn-container')).getText()).toEqual(qaData.eventInfo.callToAction);
                expect(sessions[i].element(by.css('.calendar-date')).isPresent()).toBe(false);
                expect(sessions[i].element(by.css('.session-gift')).isDisplayed()).toBe(true);
            }
        });

        expect(EventCardPO.getViewFilters().isDisplayed()).toBe(false);
    });
});