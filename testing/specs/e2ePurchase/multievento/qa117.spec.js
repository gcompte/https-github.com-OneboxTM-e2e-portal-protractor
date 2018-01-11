var EventCardPO = require('./../../../page-objects/event-card.po.js'),
    UserDataPO = require('./../../../page-objects/user-data.po.js'),
    VenueNoMapPO = require('./../../../page-objects/venue-no-map.po.js'),
    VenueMapPO = require('./../../../page-objects/venue-map.po.js'),
    SummaryPO = require('./../../../page-objects/summary.po.js'),
    PaymentDetailsPO = require('./../../../page-objects/payment-details.po.js'),
    PurchaseConfirmPO = require('./../../../page-objects/purchase-confirm.po.js'),
    SelectLocationsPO = require('./../../../page-objects/select-locations.po.js'),
    AppPO = require('./../../../page-objects/app.po.js');

var genericData = require('./../../generic-data.json'),
    qaData = require('./suite-data.' + browser.params.env + '.json').qa117;

describe('QA-117 Compra en portal 3 multievento y sesión aforo No gráfico', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.firstEventUrl);
    });

    it('Abrimos la ficha del evento', function() {
        AppPO.closeCookiesPolicy();
        expect(EventCardPO.getEventTitle()).toEqual(qaData.firstEventTitle);
    });

    it('Accedemos a la selección de localidades de una sesión en concreto y seleccionamos butacas', function() {
        if(browser.params.device === 'mobile'){
            EventCardPO.sessionsListViewBuyTicketsMobile(qaData.firstSessionId);
        }else{
            EventCardPO.changeSessionsView('calendar-view');
            EventCardPO.boxSessionTime(qaData.firstSessionId);
        };

        browser.driver.sleep(3000);
        VenueNoMapPO.selectNoGraphicSeats(qaData.noGraphicZone, qaData.firstSeatsToSelect);

        SummaryPO.getSummaryBreakdown().then(function(summaryBreakdown){
            for(var i = 0; i < summaryBreakdown.length; i++){
                expect(summaryBreakdown[i].getText()).toEqual(qaData.breakdownPrice01[i]);
            }
        });

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.breakdownPrice01[qaData.breakdownPrice01.length-1]);
    });

    it('Volvemos a la cartelera, seleccionamos otro evento y localidades de este', function() {
        browser.get(browser.baseUrl + qaData.secondEventUrl);
        expect(EventCardPO.getEventTitle()).toEqual(qaData.secondEventTitle);
        
        EventCardPO.changeSessionsView('calendar-view');
        browser.driver.sleep(2000);
        EventCardPO.boxSessionTime(qaData.secondSessionId);

        if(browser.params.device === 'mobile'){
            SelectLocationsPO.changeSelectedMode();
            AppPO.browserScrollTo(0, 600);
        };

        VenueMapPO.selectZone(qaData.graphicNumberedZone);
        VenueMapPO.selectNumberedSeats(qaData.secondSeatsToSelect, true);
        
        SummaryPO.getSummaryBreakdown().then(function(summaryBreakdown){
            for(var i = 0; i < summaryBreakdown.length; i++){
                expect(summaryBreakdown[i].getText()).toEqual(qaData.breakdownPrice02[i]);
            }
        });

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.breakdownPrice02[qaData.breakdownPrice02.length-1]);
    });

    it('Avanzamos hasta la pantalla de datos personales, seleccionamos método de pago y terminamos la compra', function() {
        AppPO.goToNextStepSales().then(function(){
            AppPO.goToNextStep();

            UserDataPO.setUserData(genericData.userData.name, genericData.userData.surname, genericData.userData.email);
            AppPO.browserScrollTo(0, 600);
            UserDataPO.selectPaymentMethod(qaData.paymentMethodPosition);

            if(browser.params.device === 'mobile'){
                AppPO.goToNextStep();
            }else{
                UserDataPO.continueToPay();
            }

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
});
