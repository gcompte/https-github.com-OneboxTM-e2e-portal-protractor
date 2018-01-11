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
    qaData = require('./suite-data.' + env + '.json').qa811;

describe('QA-811 Aplicar Descuento con restricción de Número mínimo de entradas para aplicar a la totalidad de la compra con incentivo porcentual', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.sessionUrl);
    });

    it('Accedemos a una sesión y seleccionamos tres localidades', function() {
        expect(AppPO.getNextStepButtonAttribute('class')).toMatch('disabled');

        VenueNoMapPO.selectNoGraphicSeats(qaData.noGraphicZone, 3);

        expect(AppPO.getNextStepButtonAttribute('class')).not.toMatch('disabled');
    });

    it('Desplegamos el acordeón de promociones, y verificamos que no se puede aplicar la promoción por no cumplir el mínimo', function(){
        browser.driver.sleep(2000);
        expect(PromotionsPO.isApplicablePromotion(0)).toBe(false);
    });

    it('Seleccionamos otra localidad y verificamos que ahora sí podemos aplicar la promoción', function(){
        VenueNoMapPO.selectNoGraphicSeats(qaData.noGraphicZone, 4);
        
        browser.driver.sleep(2000);
        PromotionsPO.isApplicablePromotion(0).then(function(isApplicablePromotion){
            if(isApplicablePromotion){
                if(browser.params.device === 'mobile'){
                    AppPO.browserScrollTo(0, 3000);
                    PromotionsPO.selectPromotionByPosition(0);
                }
                PromotionsPO.applyMinPromotion(0);
            }else{
                expect(PromotionsPO.isApplicablePromotion(0)).toBe(true);
            }
        });
    });

    it('Verificamos que el precio con la promoción aplicada es correcto', function() {
        SummaryPO.getSummaryBreakdown().then(function(summaryBreakdown){
            for(var i = 0; i < summaryBreakdown.length; i++){
                expect(summaryBreakdown[i].getText()).toEqual(qaData.breakdownPrice[i]);
            }
        });

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.breakdownPrice[qaData.breakdownPrice.length-1]);
        expect(SummaryPO.getTicketsBasePrice()).toEqual(qaData.basePrice);
        
        if(browser.params.device === 'mobile'){
            expect(SelectLocationsPO.getFinalPriceAmount()).toEqual(qaData.breakdownPrice[qaData.breakdownPrice.length-1]);
        }
    });

    //Acabar la compra
    it('Accedemos a la pantalla de validate-cart y verificamos que el precio de las localidades es correcto', function(){
        AppPO.goToNextStep();

        expect(ValidateCartPO.getSessionSeatsSelectedInfo(qaData.sessionId, 'ticket.price.finalPrice').getText()).toEqual(qaData.seatsSelectedPrices);
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
        expect(PurchaseConfirmPO.getSessionSeatsBoughtInfo(qaData.sessionId, 'ticket.price.finalPrice').getText()).toEqual(qaData.seatsSelectedPrices);
    });
});