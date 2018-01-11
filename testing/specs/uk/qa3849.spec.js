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
    qaData = require('./suite-data.' + env + '.json').qa3849;

describe('QA-3849 Verify that, although the entity has "channelFeesEnabled = 1", the "Transaction Fee" is not shown in the steps of the purchase process because it\'s not informed in cpanel', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.sessionUrl);
    });

    it('Verificamos que no se visualiza la información del "Transaction Fee", ni se aplica, en la pantalla de selection de localidades ni en el site-cart', function() {
        expect(SelectLocationsPO.getTransactionFeeInfo().isDisplayed()).toEqual(false);

        VenueMapPO.selectZone(qaData.graphicNumberedZone);
        VenueMapPO.selectNumberedSeats(2, true);
        SiteCartPO.expandCollapseSiteCart();
        expect(SiteCartPO.getFinalPrice()).toEqual(qaData.priceWithoutTransactionFee);
    });

    it('Verificamos que no se visualiza la información del "Transaction Fee" en la pantalla de validate-cart', function(){
        AppPO.goToNextStepSales();
        expect(ValidateCartPO.getFees().count()).toEqual(0);
    });

    it('Verificamos que se visualiza la información del transaction fee en la pantalla de user-data', function(){
        AppPO.goToNextStep();
        expect(UserDataPO.getFees().count()).toEqual(0);
    });

    it('Verificamos que se visualiza la información del transaction fee en la pantalla de purchase-confirm', function(){
        UserDataPO.setUserData(genericData.userData.name, genericData.userData.surname, genericData.userData.email);
        AppPO.goToNextStep();
        browser.driver.sleep(3000);

        PaymentDetailsPO.paymentCash(qaData.paymentCash).then(function(){
            expect(PurchaseConfirmPO.getOrderCode().isPresent()).toBe(true);
            expect(PurchaseConfirmPO.getFees().count()).toEqual(0);
            expect(PurchaseConfirmPO.getFinalPrice()).toEqual(qaData.priceWithoutTransactionFee);
        });
    });
});