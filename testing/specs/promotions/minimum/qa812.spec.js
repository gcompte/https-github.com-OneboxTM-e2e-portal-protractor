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
    qaData = require('./suite-data.' + env + '.json').qa812;

describe('QA-812 Aplicar Promoción y Descuento ambos con restricción Mínimo de entradas para poder aplicarlos a la totalidad de la compra con incentivo fijo y porcentual', function() {
    var discountPosition = 0,
        promotionPosition = 1;

    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.sessionUrl);
    });

    it('Accedemos a una sesión y seleccionamos una localidad', function() {
        expect(AppPO.getNextStepButtonAttribute('class')).toMatch('disabled');

        VenueNoMapPO.selectNoGraphicSeats(qaData.noGraphicZone, 1);

        expect(AppPO.getNextStepButtonAttribute('class')).not.toMatch('disabled');
    });

    it('Verificamos que no se puede aplicar ninguna de las promociones por no cumplir el mínimo', function(){
        browser.driver.sleep(2000);
        expect(PromotionsPO.isApplicablePromotion(discountPosition)).toBe(false);

        //Seleccionamos la promoción tipo Promoción
        if(browser.params.device !== 'mobile'){
            PromotionsPO.selectPromotionByPosition(promotionPosition);
        }
        expect(PromotionsPO.isApplicablePromotion(promotionPosition)).toBe(false);
    });

    it('Seleccionamos otra localidad y verificamos que ahora sí podemos aplicar la promoción tipo promoción', function(){
        AppPO.browserScrollTo(0, 0);
        VenueNoMapPO.selectNoGraphicSeats(qaData.noGraphicZone, 2);
        
        browser.driver.sleep(2000);
        expect(PromotionsPO.isApplicablePromotion(promotionPosition)).toBe(true);

        //La promoción tipo promoción ya se puede aplicar porque ya hemos alcanzado el mínimo de entradas
        PromotionsPO.isApplicablePromotion(promotionPosition).then(function(isApplicablePromotion){
            if(isApplicablePromotion){
                if(browser.params.device === 'mobile'){
                    AppPO.browserScrollTo(0, 1300);
                    PromotionsPO.selectPromotionByPosition(1);
                }else{
                    AppPO.browserScrollTo(0, 600);
                }
                PromotionsPO.applyMinPromotion(1);
            }else{
                expect(isApplicablePromotion).toBe(true);
            }
        });

        //La promoción tipo descuento todavía no se puede aplicar
        if(browser.params.device === 'mobile'){
            PromotionsPO.seeAllPromotions(promotionPosition);
        }
        PromotionsPO.selectPromotionByPosition(discountPosition);
        expect(PromotionsPO.isApplicablePromotion(discountPosition)).toBe(false);
    });

    it('Verificamos que el precio con la promoción tipo promoción aplicada es correcto', function() {
        SummaryPO.getSummaryBreakdown().then(function(summaryBreakdown){
            for(var i = 0; i < summaryBreakdown.length; i++){
                expect(summaryBreakdown[i].getText()).toEqual(qaData.priceWithPromo[0].breakdown[i]);
            }
        });

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.priceWithPromo[0].breakdown[qaData.priceWithPromo[0].breakdown.length-1]);
        expect(SummaryPO.getTicketsBasePrice()).toEqual(qaData.priceWithPromo[0].basePrice);

        if(browser.params.device === 'mobile'){
            expect(SelectLocationsPO.getFinalPriceAmount()).toEqual(qaData.priceWithPromo[0].breakdown[qaData.priceWithPromo[0].breakdown.length-1]);
        }
    });

    it('Seleccionamos otra localidad, verificamos que directamente se le aplica la promoción antes aplicada, y verificamos que ahora sí podemos aplicar la promoción tipo descuento', function(){
        AppPO.browserScrollTo(0, 0);
        VenueNoMapPO.selectNoGraphicSeats(qaData.noGraphicZone, 3);

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.priceWithPromo[1].breakdown[qaData.priceWithPromo[1].breakdown.length-1]);

        browser.driver.sleep(2000);
        PromotionsPO.isApplicablePromotion(discountPosition).then(function(isApplicablePromotion){
            if(isApplicablePromotion){
                if(browser.params.device === 'mobile'){
                    AppPO.browserScrollTo(0, 1300);
                }else{
                    AppPO.browserScrollTo(0, 600);
                }
                PromotionsPO.applyMinPromotion(0);
            }else{
                expect(isApplicablePromotion).toBe(true);
            }
        });
    });

    it('Verificamos que el precio con las dos promociones (promoción y descuento) aplicadas es correcto', function() {
        SummaryPO.getSummaryBreakdown().then(function(summaryBreakdown){
            for(var i = 0; i < summaryBreakdown.length; i++){
                expect(summaryBreakdown[i].getText()).toEqual(qaData.priceWithPromoDesc.breakdown[i]);
            }
        });

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.priceWithPromoDesc.breakdown[qaData.priceWithPromoDesc.breakdown.length-1]);
        expect(SummaryPO.getTicketsBasePrice()).toEqual(qaData.priceWithPromoDesc.basePrice);

        if(browser.params.device === 'mobile'){
            expect(SelectLocationsPO.getFinalPriceAmount()).toEqual(qaData.priceWithPromoDesc.breakdown[qaData.priceWithPromoDesc.breakdown.length-1]);
        }
    });

    it('Des-aplicamos la promociones y las volvemos a aplicar en el orden inverso, para comprobar que el precio resultante es el mismo', function(){
        if(browser.params.device === 'mobile'){
            PromotionsPO.applyMinPromotion(discountPosition); //Desaplicamos descuento
            PromotionsPO.seeAllPromotions(discountPosition);
            PromotionsPO.selectPromotionByPosition(promotionPosition); //Seleccionamos promoción
            PromotionsPO.applyMinPromotion(promotionPosition); //Desaplicamos promoción

            //Aplicamos de nuevo
            PromotionsPO.seeAllPromotions(promotionPosition);
            PromotionsPO.selectPromotionByPosition(discountPosition); //Seleccionamos descuento
            PromotionsPO.applyMinPromotion(discountPosition); //Aplicamos descuento
            PromotionsPO.seeAllPromotions(discountPosition);
            PromotionsPO.selectPromotionByPosition(promotionPosition); //Seleccionamos promoción
            PromotionsPO.applyMinPromotion(promotionPosition); //Aplicamos promoción
        }else{
            PromotionsPO.applyMinPromotion(discountPosition); //Desaplicamos descuento
            PromotionsPO.selectPromotionByPosition(promotionPosition); //Seleccionamos promoción
            PromotionsPO.applyMinPromotion(promotionPosition); //Desaplicamos promoción

            //Aplicamos de nuevo
            PromotionsPO.selectPromotionByPosition(discountPosition); //Seleccionamos descuento
            PromotionsPO.applyMinPromotion(discountPosition); //Aplicamos descuento
            PromotionsPO.selectPromotionByPosition(promotionPosition); //Seleccionamos promoción
            PromotionsPO.applyMinPromotion(promotionPosition); //Aplicamos promoción            
        }

        SummaryPO.getSummaryBreakdown().then(function(summaryBreakdown){
            for(var i = 0; i < summaryBreakdown.length; i++){
                expect(summaryBreakdown[i].getText()).toEqual(qaData.priceWithPromoDesc.breakdown[i]);
            }
        });

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.priceWithPromoDesc.breakdown[qaData.priceWithPromoDesc.breakdown.length-1]);
        expect(SummaryPO.getTicketsBasePrice()).toEqual(qaData.priceWithPromoDesc.basePrice);

        if(browser.params.device === 'mobile'){
            expect(SelectLocationsPO.getFinalPriceAmount()).toEqual(qaData.priceWithPromoDesc.breakdown[qaData.priceWithPromoDesc.breakdown.length-1]);
        }
    });

    //Acabar la compra
    it('Accedemos a la pantalla de validate-cart y verificamos que el precio de las localidades es correcto', function(){
        AppPO.goToNextStep();

        expect(ValidateCartPO.getSessionSeatsSelectedInfo(qaData.sessionId, 'ticket.price.finalPrice').getText()).toEqual(qaData.seatsSelectedPricesDescPromo);
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
        expect(PurchaseConfirmPO.getSessionSeatsBoughtInfo(qaData.sessionId, 'ticket.price.finalPrice').getText()).toEqual(qaData.seatsSelectedPricesDescPromo);
    });
});