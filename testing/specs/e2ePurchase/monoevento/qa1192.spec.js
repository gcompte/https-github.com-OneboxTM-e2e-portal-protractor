var EventCardPO = require('./../../../page-objects/event-card.po.js'),
    VenueMapPO = require('./../../../page-objects/venue-map.po.js'),
    UserDataPO = require('./../../../page-objects/user-data.po.js'),
    PaymentDetailsPO = require('./../../../page-objects/payment-details.po.js'),
    PurchaseConfirmPO = require('./../../../page-objects/purchase-confirm.po.js'),
    SummaryPO = require('./../../../page-objects/summary.po.js'),
    SelectLocationsPO = require('./../../../page-objects/select-locations.po.js'),
    AppPO = require('./../../../page-objects/app.po.js');

var genericData = require('./../../generic-data.json'),
    qaData = require('./suite-data.' + browser.params.env + '.json').qa1192;

describe('QA-1192 [nominales] Venta ok 1 entrada en Portal 3', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.url);
    });

    it('Accedemos a una sesión de un evento nominal y seleccionamos localidades', function() {
        EventCardPO.boxSessionTime(qaData.sessionId);

        if(browser.params.device === 'mobile'){
            AppPO.browserScrollTo(0, 500);
        };

        browser.driver.sleep(3000);
        VenueMapPO.selectZone(qaData.graphicNumberedZone);
        VenueMapPO.selectNumberedSeats(qaData.seatsToSelect, true);

        SummaryPO.getSummaryBreakdown().then(function(summaryBreakdown){
            for(var i = 0; i < summaryBreakdown.length; i++){
                expect(summaryBreakdown[i].getText()).toEqual(qaData.breakdownPrice[i]);
            }
        });

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.breakdownPrice[qaData.breakdownPrice.length-1]);
    });

    it('Accedemos a la pantalla de datos personales, seleccionamos método de pago y terminamos la compra', function() {
        AppPO.goToNextStepSales();

        UserDataPO.setUserData(genericData.userData.name, genericData.userData.surname, genericData.userData.email);
        UserDataPO.setNominalTicketData(genericData.attendants, qaData.seatsToSelect);
        AppPO.browserScrollTo(0, 600);
        UserDataPO.selectPaymentMethod(qaData.paymentMethodPosition);
        if(browser.params.device === 'mobile'){
            AppPO.goToNextStep();
        }else{
            UserDataPO.continueToPay();
        }
    });

    it('Rellenamos los datos de la tarjeta de crédito, y verificamos el pago correcto', function(){
        browser.driver.sleep(5000);
        browser.ignoreSynchronization = true;
        AppPO.switchContext('pasarelaIframe');
        browser.driver.sleep(2000);

        PaymentDetailsPO.paymentRedsys(genericData.paymentData.card, genericData.paymentData.securityCode);
        PaymentDetailsPO.setCipCode(genericData.paymentData.cipCode);
        PaymentDetailsPO.endPayment();

        AppPO.switchContext('default');
        browser.ignoreSynchronization = false;

        expect(PurchaseConfirmPO.getOrderCode().isPresent()).toBe(true);
    });
});
