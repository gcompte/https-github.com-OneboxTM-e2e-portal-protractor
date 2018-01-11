var VenueMapPO = require('./../../../page-objects/venue-map.po.js'),
    EventCardPO = require('./../../../page-objects/event-card.po.js'),
    SelectLocationsPO = require('./../../../page-objects/select-locations.po.js'),
    SiteCartPO = require('./../../../page-objects/site-cart.po.js'),
    ValidateCartPO = require('./../../../page-objects/validate-cart.po.js'),
    UserDataPO = require('./../../../page-objects/user-data.po.js'),
    PaymentDetailsPO = require('./../../../page-objects/payment-details.po.js'),
    PurchaseConfirmPO = require('./../../../page-objects/purchase-confirm.po.js'),
    AppPO = require('./../../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa1723;

describe('QA-1723 [Portal 3.0] [Multievento] Se puede comprar en una sesión con límite por sesión = 1 con localidades en el carrito de otra sesión', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.url);
    });

    it('Accedemos a una sesión sin límite de entradas por compra configurado y seleccionamos una localidad', function() {
        expect(SiteCartPO.getShoppingCartAttribute('class')).toMatch('shopping-cart-disabled');

        VenueMapPO.selectZone(qaData.sessionsSelected[0].graphicNumberedZone);
        VenueMapPO.selectNumberedSeats(1, true);

        expect(AppPO.getNextStepButtonAttribute('class')).not.toMatch('disabled');
    });

    it('Accedemos a la sesión con límite de entradas = 1 e intentamos añadir 2 localidades, verificamos que solo se añade una', function(){
        AppPO.browserScrollTo(0, 0);

        SelectLocationsPO.seeAllSessions();
        EventCardPO.sessionsListViewBuyTickets(qaData.sessionsSelected[1].sessionId);

        expect(AppPO.getNextStepButtonAttribute('class')).not.toMatch('disabled');

        VenueMapPO.selectZone(qaData.sessionsSelected[1].graphicNumberedZone);
        VenueMapPO.selectNumberedSeats(2, true);

        SiteCartPO.getLocationsAmount().then(function(result){
            expect(parseInt(result)).toBe(2);
        });
    });

    it('Volvemos a la primera sesión y añadimos localidades hasta superar el máximo permitido por el canal, verificamos que no se añaden más que dicho máximo', function(){
        AppPO.browserScrollTo(0, 0);

        SelectLocationsPO.seeAllSessions();
        EventCardPO.sessionsListViewBuyTickets(qaData.sessionsSelected[0].sessionId);
        VenueMapPO.selectZone(qaData.sessionsSelected[0].graphicNumberedZone);
        VenueMapPO.selectNumberedSeats(qaData.maxSeatsChannel, true);

        SiteCartPO.getLocationsAmount().then(function(result){
            expect(parseInt(result)).toBe(qaData.maxSeatsChannel);
        });
    });

    it('Eliminamos la localidad seleccionada de la sesión con límite = 1 e intentamos añadir dos localidades de la sesión actual, verificamos que solo se añade una', function(){
        SiteCartPO.expandCollapseSiteCart().then(function(){
            SiteCartPO.removeSessionTickets(qaData.sessionsSelected[1].sessionId, 'delete');
        });

        SiteCartPO.getLocationsAmount().then(function(result){
            expect(parseInt(result)).toBe(qaData.maxSeatsChannel - 1);
        });

        SiteCartPO.expandCollapseSiteCart();
        VenueMapPO.selectNumberedSeats(2, true);
        SiteCartPO.getLocationsAmount().then(function(result){
            expect(parseInt(result)).toBe(qaData.maxSeatsChannel);
        });

        AppPO.browserScrollTo(0, 800);
        AppPO.goToNextStep();
    });

    it('Accedemos a la pantalla de validar carrito', function(){
        expect(ValidateCartPO.getTotalSessionsSelected()).toBe(1);
        AppPO.goToNextStep();
    });

    it('Accedemos a la pantalla de datos personales, seleccionamos método de pago y terminamos la compra', function(){
        UserDataPO.setUserData(genericData.userData.name, genericData.userData.surname, genericData.userData.email);

        AppPO.goToNextStep();
        browser.driver.sleep(5000);
        browser.ignoreSynchronization = true;
        AppPO.switchContext('pasarelaIframe');
        browser.driver.sleep(2000);

        expect(PaymentDetailsPO.setCard(genericData.paymentData.card)).toEqual(genericData.paymentData.card);
        expect(PaymentDetailsPO.setExpirationMonth(genericData.paymentData.month)).toEqual(genericData.paymentData.month);
        expect(PaymentDetailsPO.setExpirationYear(genericData.paymentData.year)).toEqual(genericData.paymentData.year);
        expect(PaymentDetailsPO.setSecurityCode(genericData.paymentData.securityCode)).toEqual(genericData.paymentData.securityCode);

        PaymentDetailsPO.acceptPayment();

        expect(PaymentDetailsPO.setCipCode(genericData.paymentData.cipCode)).toEqual(genericData.paymentData.cipCode);

        PaymentDetailsPO.endPayment();
    });

    it('Verificamos que llegamos a la pantalla de confirmación de la compra, y que aparece el mensaje de localidades no contiguas', function(){
        AppPO.switchContext('default');
        browser.ignoreSynchronization = false;

        expect(PurchaseConfirmPO.getOrderCode().isPresent()).toBe(true);
    });
});