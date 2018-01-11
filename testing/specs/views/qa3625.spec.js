var CatalogChannelPO = require('./../../page-objects/catalog-channel.po.js'),
    AppPO = require('./../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa3625;

describe('QA-3625 Visualización eventos y supraeventos en la cartelera', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + genericData.channels.genericMono);
    });

    it('Accedemos a la cartelera del canal', function() {
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + genericData.channels.genericMono + '/es_ES/tickets');
        AppPO.loadAllScroll(qaData.scrollSteps);
    });

    it('Verificamos los datos de un evento activo o en venta futura (próximamente) ya que los datos serán los mismos', function(){
        var eventBoxInfo = CatalogChannelPO.getEventBoxInfo(qaData.eventInfo[0].id); 

        expect(eventBoxInfo.title.getText()).toEqual(qaData.eventInfo[0].title);
        expect(eventBoxInfo.subtitle.getText()).toEqual(qaData.eventInfo[0].subtitle);
        expect(eventBoxInfo.imageSrc.isDisplayed()).toBe(true);
        expect(eventBoxInfo.imageSrc.getAttribute('src')).toEqual(qaData.eventInfo[0].imageSrc);
        expect(eventBoxInfo.place.getText()).toEqual(qaData.eventInfo[0].place);

        expect(eventBoxInfo.price.getText()).toBe(qaData.eventInfo[0].price);
        expect(eventBoxInfo.titleLink).toEqual(qaData.eventUrl + qaData.eventInfo[0].id);
        expect(eventBoxInfo.eventBoxClass).not.toMatch(qaData.sectionBoxDisabledClass);

        expect(eventBoxInfo.callToAction.getText()).toMatch(qaData.callToActionBuy);
        expect(eventBoxInfo.callToAction.getText()).not.toMatch(qaData.callToActionGift);
        expect(eventBoxInfo.soldOut.isPresent()).toBe(false);

        expect(eventBoxInfo.date.getText()).toEqual(qaData.eventInfo[0].date);
        
        //Verificar la descripción corta
    });

    it('Verificamos los datos de un evento activo o en venta futura (próximamente) que tenga al menos una sesión con la fecha oculta', function(){
        var eventBoxInfo = CatalogChannelPO.getEventBoxInfo(qaData.eventInfo[1].id); 

        expect(eventBoxInfo.title.getText()).toEqual(qaData.eventInfo[1].title);
        expect(eventBoxInfo.subtitle.getText()).toEqual(qaData.eventInfo[1].subtitle);
        expect(eventBoxInfo.imageSrc.isDisplayed()).toBe(true);
        expect(eventBoxInfo.imageSrc.getAttribute('src')).toEqual(qaData.eventInfo[1].imageSrc);
        expect(eventBoxInfo.place.getText()).toEqual(qaData.eventInfo[1].place);

        expect(eventBoxInfo.price.getText()).toBe(qaData.eventInfo[1].price);
        expect(eventBoxInfo.titleLink).toEqual(qaData.eventUrl + qaData.eventInfo[1].id);
        expect(eventBoxInfo.eventBoxClass).not.toMatch(qaData.sectionBoxDisabledClass);
        
        expect(eventBoxInfo.callToAction.getText()).toMatch(qaData.callToActionBuy);
        expect(eventBoxInfo.callToAction.getText()).not.toMatch(qaData.callToActionGift);
        expect(eventBoxInfo.soldOut.isPresent()).toBe(false);

        expect(eventBoxInfo.date.isPresent()).toBe(false);
    });

    it('Verificamos los datos de un evento agotado', function(){
        var eventBoxInfo = CatalogChannelPO.getEventBoxInfo(qaData.eventInfo[2].id); 

        expect(eventBoxInfo.title.getText()).toEqual(qaData.eventInfo[2].title);
        expect(eventBoxInfo.subtitle.getText()).toEqual(qaData.eventInfo[2].subtitle);
        expect(eventBoxInfo.imageSrc.isDisplayed()).toBe(true);
        expect(eventBoxInfo.imageSrc.getAttribute('src')).toEqual(qaData.eventInfo[2].imageSrc);
        expect(eventBoxInfo.place.getText()).toEqual(qaData.eventInfo[2].place);

        expect(eventBoxInfo.price.isDisplayed()).toBe(false);
        expect(eventBoxInfo.titleLink).toEqual('');
        expect(eventBoxInfo.eventBoxClass).toMatch(qaData.sectionBoxDisabledClass);
        
        expect(eventBoxInfo.callToAction.isDisplayed()).toBe(false);
        expect(eventBoxInfo.soldOut.getText()).toEqual(qaData.soldOutText);

        expect(eventBoxInfo.date.getText()).toEqual(qaData.eventInfo[2].date);
    });

    it('Verificamos los datos de un evento agotado que tenga al menos una sesión con la fecha oculta', function(){
        var eventBoxInfo = CatalogChannelPO.getEventBoxInfo(qaData.eventInfo[3].id); 

        expect(eventBoxInfo.title.getText()).toEqual(qaData.eventInfo[3].title);
        expect(eventBoxInfo.subtitle.getText()).toEqual(qaData.eventInfo[3].subtitle);
        expect(eventBoxInfo.imageSrc.isDisplayed()).toBe(true);
        expect(eventBoxInfo.imageSrc.getAttribute('src')).toEqual(qaData.eventInfo[3].imageSrc);
        expect(eventBoxInfo.place.getText()).toEqual(qaData.eventInfo[3].place);

        expect(eventBoxInfo.price.isDisplayed()).toBe(false);
        expect(eventBoxInfo.titleLink).toEqual('');
        expect(eventBoxInfo.eventBoxClass).toMatch(qaData.sectionBoxDisabledClass);

        expect(eventBoxInfo.callToAction.isDisplayed()).toBe(false);
        expect(eventBoxInfo.soldOut.getText()).toEqual(qaData.soldOutText);

        expect(eventBoxInfo.date.isPresent()).toBe(false);
    });

    it('Verificamos los datos de un evento entrada regalo activo', function(){
        var eventBoxInfo = CatalogChannelPO.getEventBoxInfo(qaData.eventInfo[4].id); 

        expect(eventBoxInfo.title.getText()).toEqual(qaData.eventInfo[4].title);
        expect(eventBoxInfo.subtitle.getText()).toEqual(qaData.eventInfo[4].subtitle);
        expect(eventBoxInfo.imageSrc.isDisplayed()).toBe(true);
        expect(eventBoxInfo.imageSrc.getAttribute('src')).toEqual(qaData.eventInfo[4].imageSrc);
        expect(eventBoxInfo.place.getText()).toEqual(qaData.eventInfo[4].place);

        expect(eventBoxInfo.price.getText()).toBe(qaData.eventInfo[4].price);
        expect(eventBoxInfo.titleLink).toEqual(qaData.eventUrl + qaData.eventInfo[4].id);
        expect(eventBoxInfo.eventBoxClass).not.toMatch(qaData.sectionBoxDisabledClass);
        
        expect(eventBoxInfo.callToAction.getText()).not.toMatch(qaData.callToActionBuy);
        expect(eventBoxInfo.callToAction.getText()).toMatch(qaData.callToActionGift);
        expect(eventBoxInfo.soldOut.isPresent()).toBe(false);

        expect(eventBoxInfo.date.isPresent()).toBe(false);
    });

    it('Verificamos los datos de un evento entrada regalo activo que tenga al menos una sesión con la fecha oculta', function(){
        var eventBoxInfo = CatalogChannelPO.getEventBoxInfo(qaData.eventInfo[5].id); 

        expect(eventBoxInfo.title.getText()).toEqual(qaData.eventInfo[5].title);
        expect(eventBoxInfo.subtitle.getText()).toEqual(qaData.eventInfo[5].subtitle);
        expect(eventBoxInfo.imageSrc.isDisplayed()).toBe(true);
        expect(eventBoxInfo.imageSrc.getAttribute('src')).toEqual(qaData.eventInfo[5].imageSrc);
        expect(eventBoxInfo.place.getText()).toEqual(qaData.eventInfo[5].place);

        expect(eventBoxInfo.price.getText()).toBe(qaData.eventInfo[5].price);
        expect(eventBoxInfo.titleLink).toEqual(qaData.eventUrl + qaData.eventInfo[5].id);
        expect(eventBoxInfo.eventBoxClass).not.toMatch(qaData.sectionBoxDisabledClass);
        
        expect(eventBoxInfo.callToAction.getText()).not.toMatch(qaData.callToActionBuy);
        expect(eventBoxInfo.callToAction.getText()).toMatch(qaData.callToActionGift);
        expect(eventBoxInfo.soldOut.isPresent()).toBe(false);

        expect(eventBoxInfo.date.isPresent()).toBe(false);
    });

    it('Verificamos los datos de un supraevento activo o en venta futura (próximamente) ya que los datos serán los mismos', function(){
        var supraeventBoxInfo = CatalogChannelPO.getSupraeventBoxInfo(qaData.eventInfo[6].id); 

        expect(supraeventBoxInfo.title.getText()).toEqual(qaData.eventInfo[6].title);
        expect(supraeventBoxInfo.subtitle.getText()).toEqual(qaData.eventInfo[6].subtitle);
        expect(supraeventBoxInfo.imageSrc.isDisplayed()).toBe(true);
        expect(supraeventBoxInfo.imageSrc.getAttribute('src')).toEqual(qaData.eventInfo[6].imageSrc);
        expect(supraeventBoxInfo.place.getText()).toEqual(qaData.eventInfo[6].place);
        expect(supraeventBoxInfo.description.getText()).toEqual(qaData.eventInfo[6].description);

        expect(supraeventBoxInfo.price.getText()).toBe(qaData.eventInfo[6].price);
        expect(supraeventBoxInfo.titleLink).toEqual(qaData.eventUrl + qaData.eventInfo[6].id);
        expect(supraeventBoxInfo.eventBoxClass).not.toMatch(qaData.sectionBoxDisabledClass);
        
        expect(supraeventBoxInfo.callToAction.getText()).toMatch(qaData.callToActionSeeEvents);
        expect(supraeventBoxInfo.callToAction.getText()).not.toMatch(qaData.callToActionGift);
        expect(supraeventBoxInfo.soldOut.isPresent()).toBe(false);

        expect(supraeventBoxInfo.date.getText()).toEqual(qaData.eventInfo[6].date);
    });

    it('Verificamos los datos de un supraevento activo que tenga al menos una sesión con la fecha oculta', function(){
        var supraeventBoxInfo = CatalogChannelPO.getSupraeventBoxInfo(qaData.eventInfo[7].id); 

        expect(supraeventBoxInfo.title.getText()).toEqual(qaData.eventInfo[7].title);
        expect(supraeventBoxInfo.subtitle.getText()).toEqual(qaData.eventInfo[7].subtitle);
        expect(supraeventBoxInfo.imageSrc.isDisplayed()).toBe(true);
        expect(supraeventBoxInfo.imageSrc.getAttribute('src')).toEqual(qaData.eventInfo[7].imageSrc);
        expect(supraeventBoxInfo.place.getText()).toEqual(qaData.eventInfo[7].place);
        expect(supraeventBoxInfo.description.getText()).toEqual(qaData.eventInfo[7].description);

        expect(supraeventBoxInfo.price.getText()).toBe(qaData.eventInfo[7].price);
        expect(supraeventBoxInfo.titleLink).toEqual(qaData.eventUrl + qaData.eventInfo[7].id);
        expect(supraeventBoxInfo.eventBoxClass).not.toMatch(qaData.sectionBoxDisabledClass);
        
        expect(supraeventBoxInfo.callToAction.getText()).toMatch(qaData.callToActionSeeEvents);
        expect(supraeventBoxInfo.callToAction.getText()).not.toMatch(qaData.callToActionGift);
        expect(supraeventBoxInfo.soldOut.isPresent()).toBe(false);

        expect(supraeventBoxInfo.date.isPresent()).toBe(false);
    });

    it('Verificamos los datos de un supraevento agotado', function(){
        var supraeventBoxInfo = CatalogChannelPO.getSupraeventBoxInfo(qaData.eventInfo[8].id); 

        expect(supraeventBoxInfo.title.getText()).toEqual(qaData.eventInfo[8].title);
        expect(supraeventBoxInfo.subtitle.getText()).toEqual(qaData.eventInfo[8].subtitle);
        expect(supraeventBoxInfo.imageSrc.isDisplayed()).toBe(true);
        expect(supraeventBoxInfo.imageSrc.getAttribute('src')).toEqual(qaData.eventInfo[8].imageSrc);
        expect(supraeventBoxInfo.place.getText()).toEqual(qaData.eventInfo[8].place);
        expect(supraeventBoxInfo.description.getText()).toEqual(qaData.eventInfo[8].description);

        expect(supraeventBoxInfo.price.isDisplayed()).toBe(false);
        expect(supraeventBoxInfo.titleLink).toEqual('');
        expect(supraeventBoxInfo.eventBoxClass).toMatch(qaData.sectionBoxDisabledClass);
        
        expect(supraeventBoxInfo.callToAction.isDisplayed()).toBe(false);
        expect(supraeventBoxInfo.soldOut.getText()).toEqual(qaData.soldOutText);

        expect(supraeventBoxInfo.date.getText()).toEqual(qaData.eventInfo[8].date);
    });

    it('Verificamos los datos de un supraevento agotado que tenga al menos una sesión con la fecha oculta', function(){
        var supraeventBoxInfo = CatalogChannelPO.getSupraeventBoxInfo(qaData.eventInfo[9].id); 

        expect(supraeventBoxInfo.title.getText()).toEqual(qaData.eventInfo[9].title);
        expect(supraeventBoxInfo.subtitle.getText()).toEqual(qaData.eventInfo[9].subtitle);
        expect(supraeventBoxInfo.imageSrc.isDisplayed()).toBe(true);
        expect(supraeventBoxInfo.imageSrc.getAttribute('src')).toEqual(qaData.eventInfo[9].imageSrc);
        expect(supraeventBoxInfo.place.getText()).toEqual(qaData.eventInfo[9].place);
        expect(supraeventBoxInfo.description.getText()).toEqual(qaData.eventInfo[9].description);

        expect(supraeventBoxInfo.price.isDisplayed()).toBe(false);
        expect(supraeventBoxInfo.titleLink).toEqual('');
        expect(supraeventBoxInfo.eventBoxClass).toMatch(qaData.sectionBoxDisabledClass);
        
        expect(supraeventBoxInfo.callToAction.isDisplayed()).toBe(false);
        expect(supraeventBoxInfo.soldOut.getText()).toEqual(qaData.soldOutText);

        expect(supraeventBoxInfo.date.isPresent()).toBe(false);
    });
});