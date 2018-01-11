var VenueMapPO = require('./../../page-objects/venue-map.po.js'),
    SummaryPO = require('./../../page-objects/summary.po.js'),
    SiteCartPO = require('./../../page-objects/site-cart.po.js'),
    ValidateCartPO = require('./../../page-objects/validate-cart.po.js'),
    SelectLocationsPO = require('./../../page-objects/select-locations.po.js'),
    UserDataPO = require('./../../page-objects/user-data.po.js'),
    PurchaseConfirmPO = require('./../../page-objects/purchase-confirm.po.js'),
    PaymentDetailsPO = require('./../../page-objects/payment-details.po.js'),
    AppPO = require('./../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa3820;

describe('QA-3820 Verifiy that "Transaction Fee" is the same by selecting one or more seats, and that this is shown in all steps of buying process', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.sessionUrl);
    });

    it('Verificamos que se visualiza y aplica el transaction fee, y que este es igual si seleccionamos una localidad como si seleccionamos dos', function() {
        expect(SelectLocationsPO.getTransactionFeeInfo().getText()).toEqual(qaData.transactionFeeInfo);

        VenueMapPO.selectZone(qaData.graphicNumberedZone);
        VenueMapPO.selectNumberedSeats(1, true);
        SiteCartPO.expandCollapseSiteCart();
        expect(SiteCartPO.getFinalPrice()).toEqual(qaData.priceWithTransactionFee[0]);

        VenueMapPO.selectNumberedSeats(1, true);
        expect(SiteCartPO.getFinalPrice()).toEqual(qaData.priceWithTransactionFee[1]);

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.priceWithoutTransactionFee);
    });

    it('Verificamos que se visualiza la información del transaction fee en la pantalla de validate-cart', function(){
        AppPO.goToNextStepSales();
        ValidateCartPO.getFees().then(function(feesInfo){
            expect(feesInfo[0]).toEqual(qaData.feesInfo.name);
            expect(feesInfo[1]).toEqual(qaData.feesInfo.price);
        });
        expect(ValidateCartPO.getTotalPrice()).toEqual(qaData.priceWithTransactionFee[1]);
    });

    it('Verificamos que se visualiza la información del transaction fee en la pantalla de user-data', function(){
        AppPO.goToNextStep();
        UserDataPO.getFees().then(function(feesInfo){
            expect(feesInfo[0]).toEqual(qaData.feesInfo.name);
            expect(feesInfo[1]).toEqual(qaData.feesInfo.price);
        });
        expect(ValidateCartPO.getTotalPrice()).toEqual(qaData.priceWithTransactionFee[1]);
    });

    it('Verificamos que se visualiza la información del transaction fee en la pantalla de purchase-confirm', function(){
        UserDataPO.setUserData(genericData.userData.name, genericData.userData.surname, genericData.userData.email);
        AppPO.goToNextStep();
        browser.driver.sleep(3000);

        PaymentDetailsPO.paymentCash(qaData.paymentCash).then(function(){
            expect(PurchaseConfirmPO.getOrderCode().isPresent()).toBe(true);
            PurchaseConfirmPO.getFees().then(function(feesInfo){
                expect(feesInfo[0]).toEqual(qaData.feesInfo.name);
                expect(feesInfo[1]).toEqual(qaData.feesInfo.price);
            });

            expect(PurchaseConfirmPO.getFinalPrice()).toEqual(qaData.priceWithTransactionFee[1]);
        });
    });
});