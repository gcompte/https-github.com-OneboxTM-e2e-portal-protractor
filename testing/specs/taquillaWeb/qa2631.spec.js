var TaquillaWebPO = require('./../../page-objects/taquilla-web.po.js');

var env = browser.params.env,
    genericData = require('./../generic-data.json');

describe('QA-2631 Verificar que se visualizan todos los eventos y sesiones correctamente en un canal Taquilla Web 3.0', function() {
    beforeAll(function() {
        browser.ignoreSynchronization = true;
        browser.get(browser.baseUrl + genericData.channels.taquillaWebMono);
    });

    it('Accedemos al canal taquilla mono y nos logueamos con un usuario, verificamos que se loguea correctamente', function() {
        expect(TaquillaWebPO.userIsLogged()).toBe(false);
        TaquillaWebPO.loginUser(genericData.taquillaWebUsersData.users[0].email, genericData.taquillaWebUsersData.password);
        expect(TaquillaWebPO.userIsLogged()).toBe(true);
    });

    it('Verificamos que a la izquierda se muestra una columna con los eventos publicados', function(){
        expect(TaquillaWebPO.getLeftColumn().isDisplayed()).toBe(true);

        TaquillaWebPO.getEventsList().then(function(eventsList){
            expect(eventsList.length).toBeGreaterThan(0);

            expect(eventsList[0].getAttribute('class')).not.toMatch('active');
            expect(eventsList[0].element(by.css('.bob-sessions')).isDisplayed()).toBe(false);
            eventsList[0].click().then(function(){
                expect(eventsList[0].getAttribute('class')).toMatch('active');
                expect(eventsList[0].element(by.css('.bob-sessions')).isDisplayed()).toBe(true);

                eventsList[0].getAttribute('id').then(function(eventAttributeId){
                    var eventId = eventAttributeId.replace('bob-event-', '');
                    expect(TaquillaWebPO.getSessionsList(eventId).count()).toBeGreaterThan(0);
                });
            });
        });
    });
});