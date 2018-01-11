var VenueNoMapPO = require('./../../../page-objects/venue-no-map.po.js'),
    SummaryPO = require('./../../../page-objects/summary.po.js'),
    PromotionsPO = require('./../../../page-objects/promotions.po.js'),
    ValidateCartPO = require('./../../../page-objects/validate-cart.po.js'),
    UserDataPO = require('./../../../page-objects/user-data.po.js'),
    PaymentDetailsPO = require('./../../../page-objects/payment-details.po.js'),
    PurchaseConfirmPO = require('./../../../page-objects/purchase-confirm.po.js'),
    SelectLocationsPO = require('./../../../page-objects/select-locations.po.js'),
    AppPO = require('./../../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa820;

describe('QA-820 Aplicar Descuento con restricción Mínimo de entradas para poder aplicarla a la totalidad de la compra y Máximo de entradas por sesión con incentivo porcentual', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.sessionUrl);
    });

    it('Accedemos a una sesión y seleccionamos localidades', function() {
        expect(AppPO.getNextStepButtonAttribute('class')).toMatch('disabled');

        VenueNoMapPO.selectNoGraphicSeats(qaData.noGraphicZone, 2);

        expect(AppPO.getNextStepButtonAttribute('class')).not.toMatch('disabled');
    });

    it('Aplicamos la promoción, y verificamos que se aplica a todas las localidades', function(){
        browser.driver.sleep(2000);
        PromotionsPO.isApplicablePromotion(0).then(function(isApplicablePromotion){
            if(isApplicablePromotion){
                if(browser.params.device === 'mobile'){
                    AppPO.browserScrollTo(0, 1300);
                    PromotionsPO.selectPromotionByPosition(0);
                }else{
                    AppPO.browserScrollTo(0, 600);
                }
                browser.driver.sleep(1000);
                PromotionsPO.applyMinPromotion(0);
            }else{
                expect(PromotionsPO.isApplicablePromotion(0)).toBe(true);
            }
        });

        SummaryPO.getSummaryBreakdown().then(function(summaryBreakdown){
            for(var i = 0; i < summaryBreakdown.length; i++){
                expect(summaryBreakdown[i].getText()).toEqual(qaData.summarySelection[0].breakdown[i]);
            }
        });

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.summarySelection[0].breakdown[qaData.summarySelection[0].breakdown.length-1]);
        expect(SummaryPO.getTicketsBasePrice()).toEqual(qaData.summarySelection[0].basePrice);

        if(browser.params.device === 'mobile'){
            expect(SelectLocationsPO.getFinalPriceAmount()).toEqual(qaData.summarySelection[0].breakdown[qaData.summarySelection[0].breakdown.length-1]);
        }
    });

    //Acabar la compra
    it('Accedemos a la pantalla de validate-cart y verificamos que el precio de las localidades es correcto', function(){
        AppPO.goToNextStep();

        ValidateCartPO.getSessionSeatsSelectedInfo(qaData.sessionId, 'ticket.price.finalPrice').getText().then(function(sessionSeatsSelectedPrice){
            expect(sessionSeatsSelectedPrice.length).toEqual(2);
            for(var i = 0; i < sessionSeatsSelectedPrice.length; i++){
                expect(sessionSeatsSelectedPrice[i]).toEqual(qaData.seatSelectedPricePromo);
            }
        });
    });

    it('Accedemos a la pantalla de datos personales, seleccionamos método de pago y terminamos la compra', function(){
        AppPO.goToNextStep();
        UserDataPO.setUserData(genericData.userData.name, genericData.userData.surname, genericData.userData.email);

        AppPO.goToNextStep();
        browser.driver.sleep(5000);
        browser.ignoreSynchronization = true;
        AppPO.switchContext('pasarelaIframe');
        browser.driver.sleep(2000);

        PaymentDetailsPO.paymentRedsys(genericData.paymentData.card, genericData.paymentData.securityCode);
        PaymentDetailsPO.setCipCode(genericData.paymentData.cipCode);
        PaymentDetailsPO.endPayment();
    });

    it('Verificamos que llegamos a la pantalla de confirmación de la compra, y que el precio de las localidades es correcto', function(){
        AppPO.switchContext('default');
        browser.ignoreSynchronization = false;

        expect(PurchaseConfirmPO.getOrderCode().isPresent()).toBe(true);

        PurchaseConfirmPO.getSessionSeatsBoughtInfo(qaData.sessionId, 'ticket.price.finalPrice').getText().then(function(sessionSeatsBoughtPrice){
            expect(sessionSeatsBoughtPrice.length).toEqual(2);

            for(var i = 0; i < sessionSeatsBoughtPrice.length; i++){
                expect(sessionSeatsBoughtPrice[i]).toEqual(qaData.seatSelectedPricePromo);
            }
        });
    });

    it('Volvemos a acceder a la misma sesión y seleccionamos tres localidades, verificamos que no se puede aplicar la promoción', function() {
        browser.get(browser.baseUrl + qaData.sessionUrl);

        VenueNoMapPO.selectNoGraphicSeats(qaData.noGraphicZone, 3);

        browser.driver.sleep(2000);
        PromotionsPO.isApplicablePromotion(0).then(function(isApplicablePromotion){
            if(isApplicablePromotion){
                if(browser.params.device === 'mobile'){
                    AppPO.browserScrollTo(0, 1300);
                    PromotionsPO.selectPromotionByPosition(0);
                }else{
                    AppPO.browserScrollTo(0, 600);
                }
                browser.driver.sleep(1000);
                PromotionsPO.applyMinPromotion(0);
            }else{
                expect(PromotionsPO.isApplicablePromotion(0)).toBe(true);
            }
        });

        SummaryPO.getSummaryBreakdown().then(function(summaryBreakdown){
            for(var i = 0; i < summaryBreakdown.length; i++){
                expect(summaryBreakdown[i].getText()).toEqual(qaData.summarySelection[1].breakdown[i]);
            }
        });

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.summarySelection[1].breakdown[qaData.summarySelection[1].breakdown.length-1]);
        expect(SummaryPO.getTicketsBasePrice()).toEqual(qaData.summarySelection[1].basePrice);

        if(browser.params.device === 'mobile'){
            expect(SelectLocationsPO.getFinalPriceAmount()).toEqual(qaData.summarySelection[1].breakdown[qaData.summarySelection[1].breakdown.length-1]);
        }
    });
});