var EventCardPO = require('./../../../page-objects/event-card.po.js'),
    SelectLocationsPO = require('./../../../page-objects/select-locations.po.js'),
    UserDataPO = require('./../../../page-objects/user-data.po.js'),
    VenueNoMapPO = require('./../../../page-objects/venue-no-map.po.js'),
    CatalogChannelPO = require('./../../../page-objects/catalog-channel.po.js'),
    SummaryPO = require('./../../../page-objects/summary.po.js'),
    PaymentDetailsPO = require('./../../../page-objects/payment-details.po.js'),
    PurchaseConfirmPO = require('./../../../page-objects/purchase-confirm.po.js'),
    AppPO = require('./../../../page-objects/app.po.js');

var genericData = require('./../../generic-data.json'),
    qaData = require('./suite-data.' + browser.params.env + '.json').qa1890;

describe('QA-1890 Verificar que se puede comprar entrada de evento tipo actividad y entrada de evento normal en la misma operación', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.firstEventUrl);
    });

    it('Abrimos la ficha del evento', function() {
        AppPO.closeCookiesPolicy();
        expect(EventCardPO.getEventTitle()).toEqual(qaData.firstEventTitle);
    });

    it('Accedemos a la selección de localidades de una sesión en concreto y seleccionamos butacas', function() {
        EventCardPO.changeSessionsView('calendar-view');
        EventCardPO.boxSessionTime(qaData.firstSessionId);

        VenueNoMapPO.selectNoGraphicSeats(qaData.firstNoGraphicZone, qaData.firstSeatsToSelect);

        SummaryPO.getSummaryBreakdown().then(function(summaryBreakdown){
            for(var i = 0; i < summaryBreakdown.length; i++){
                expect(summaryBreakdown[i].getText()).toEqual(qaData.breakdownPrice01[i]);
            }
        });

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.breakdownPrice01[qaData.breakdownPrice01.length-1]);
    });

    it('Volvemos a la cartelera, seleccionamos otro evento y localidades de este', function() {
        AppPO.browserScrollTo(0, 300);
        browser.driver.sleep(2000);

        SelectLocationsPO.keepBuyingButton().click();
        browser.driver.sleep(2000);

        CatalogChannelPO.goToEvent(qaData.secondEventId);

        AppPO.getCurrentPage().then(function(currentPage){
            if(currentPage === 'evento'){
                expect(EventCardPO.getEventTitle()).toEqual(qaData.secondEventTitle);

                EventCardPO.getChangeSessionsViewTabs().isPresent().then(function(viewTabsPresent){
                    if(viewTabsPresent){
                        EventCardPO.changeSessionsView('calendar-view');
                        EventCardPO.boxSessionTime(qaData.secondSessionId);
                    }else{
                        EventCardPO.sessionsListViewBuyTickets(qaData.secondSessionId);
                    }
                });
            }else{
                expect(SelectLocationsPO.getSessionTitle()).toEqual(qaData.secondEventTitle);
            }
        });

        VenueNoMapPO.selectNoGraphicSeats(qaData.secondNoGraphicZone, qaData.secondSeatsToSelect);
        
        SummaryPO.getSummaryBreakdown().then(function(summaryBreakdown){
            for(var i = 0; i < summaryBreakdown.length; i++){
                expect(summaryBreakdown[i].getText()).toEqual(qaData.breakdownPrice02[i]);
            }
        });

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.breakdownPrice02[qaData.breakdownPrice02.length-1]);
    });

    it('Avanzamos hasta la pantalla de datos personales, seleccionamos método de pago y terminamos la compra', function() {
        browser.driver.sleep(2000);
        AppPO.goToNextStepSales().then(function(){
            AppPO.goToNextStep();

            UserDataPO.setUserData(genericData.userData.name, genericData.userData.surname, genericData.userData.email);
            UserDataPO.selectPaymentMethod(qaData.paymentMethodPosition);
            UserDataPO.continueToPay();

            browser.driver.sleep(5000);

            PaymentDetailsPO.paymentCash(qaData.finalPrice);

            expect(PurchaseConfirmPO.getOrderCode().isPresent()).toBe(true);
        });
    });
});
