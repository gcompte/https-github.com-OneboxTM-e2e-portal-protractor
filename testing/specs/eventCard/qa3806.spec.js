var EventCardPO = require('./../../page-objects/event-card.po.js');

var env = browser.params.env,
    qaData = require('./suite-data.' + env + '.json').qa3806;

describe('QA-3806 Verificar que desde la cartelera de eventos se navega directamente a la selección de localidades cuando el evento tiene una única sesión (NO SUPRA EVENTO)', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.firstEventUrl);
    });

    it('Accedemos a un evento que solo tiene publicada una sesión y verificamos que nos redirige a la selección de localidades de dicha sesión y que se muestra la descripción del evento', function() {
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + qaData.firstSessionUrl);
    	expect(EventCardPO.getEventDescription().isPresent()).toBe(true);
    });

    it('Accedemos a un evento que tiene una única sesión publicada pero con la venta futura, y verificamos que NO nos redirige a la selección de localidades', function() {
        browser.get(browser.baseUrl + qaData.secondEventUrl);
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + qaData.secondEventUrl);
    });

    it('Accedemos a un evento con varias sesiones, verificamos que la descripción del evento está en la ficha del evento y no en la selección de localidades de las sesiones.', function(){
    	browser.get(browser.baseUrl + qaData.thirdEventUrl);
    	expect(EventCardPO.getEventDescription().isPresent()).toBe(true);
        EventCardPO.boxSessionTime(qaData.thirdSessionId);
    	expect(EventCardPO.getEventDescription().isPresent()).toBe(false);
    });
});