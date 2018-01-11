var VenueMapPO = require('./../../../page-objects/venue-map.po.js'),
    //SelectLocationsPO = require('./../../../page-objects/select-locations.po.js'),
    PromotionsPO = require('./../../../page-objects/promotions.po.js'),
    SummaryPO = require('./../../../page-objects/summary.po.js'),
    AppPO = require('./../../../page-objects/app.po.js');

var env = browser.params.env,
    genericData = require('./../../generic-data.json'),
    qaData = require('./suite-data.' + env + '.json').qa3898;

describe('QA-3898 Verificar aplicación de promoción autogestionable', function() {
    beforeAll(function() {
        browser.get(browser.baseUrl + qaData.sessionUrl);
    });

    it('Accedemos a una sesión, validamos un socio y seleccionamos una localidad que tenga disponible una promoción de socio, verificamos el precio', function() {
        browser.driver.sleep(3000);

        expect(AppPO.getNextStepButtonAttribute('class')).toMatch('disabled');

        PromotionsPO.applyMemberPromotion(qaData.memberData.user, qaData.memberData.pwd);

        AppPO.browserScrollTo(0, 400);
        VenueMapPO.selectZone(qaData.firstGraphicNumberedZone);
        VenueMapPO.selectNumberedSeats(qaData.seatsToSelect, true);
        
        SummaryPO.getSummaryBreakdown().then(function(summaryBreakdown){
            for(var i = 0; i < summaryBreakdown.length; i++){
                expect(summaryBreakdown[i].getText()).toEqual(qaData.breakdownPrice01[i]);
            }
        });

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.finalPrice[0]);
        expect(SummaryPO.getTicketsBasePrice()).toEqual(qaData.basePrice);
    });

    it('Seleccionamos dos localidades más, y verificamos que a la segunda también se le aplica la promoción pero a la tercera no', function() {
        VenueMapPO.selectNumberedSeats(qaData.secondSeatsToSelect, true);
        
        SummaryPO.getSummaryBreakdown().then(function(summaryBreakdown){
            for(var i = 0; i < summaryBreakdown.length; i++){
                expect(summaryBreakdown[i].getText()).toEqual(qaData.breakdownPrice02[i]);
            }
        });

        expect(SummaryPO.getFinalPrice()).toEqual(qaData.finalPrice[1]);

        for(var i = 0; i < qaData.seatsToSelect + qaData.secondSeatsToSelect; i++){
            SummaryPO.deleteSeatBySessionAndPosition(qaData.sessionId, 0, 'delete');            
        }
    });
});