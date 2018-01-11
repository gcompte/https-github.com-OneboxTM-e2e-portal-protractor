exports.config = {
    framework: 'jasmine2',
    seleniumAddress: 'https://selenium-hub.oneboxtickets.net/wd/hub',
	//seleniumAddress: 'http://selenium-hub.onebox.services/wd/hub', //Jenkins
    baseUrl: 'http://localhost:4444/wd/hub',
    //baseUrl: 'https://portal-pro.oneboxtickets.net',
    specs: ['specs/**/*.js'],
    suites: {
        smoketest : ['testing/specs/**/qa116.spec.js', 'testing/specs/**/qa117.spec.js', 'testing/specs/**/qa1213.spec.js', 'testing/specs/**/qa123.spec.js', 'testing/specs/**/qa186.spec.js', 'testing/specs/**/qa520.spec.js', 'testing/specs/**/qa2172.spec.js', 'testing/specs/**/qa3543.spec.js', 'testing/specs/**/qa1890.spec.js'],
        postgolive : ['testing/specs/**/qa116.spec.js', 'testing/specs/**/qa117.spec.js', 'testing/specs/**/qa1213.spec.js', 'testing/specs/**/qa1890.spec.js', 'testing/specs/**/qa3811.spec.js'],
        regression : ['testing/specs/**/*.spec.js'],
        adjacentseats : ['testing/specs/adjacentSeats/**/*.spec.js'],
        e2epurchase : ['testing/specs/e2ePurchase/**/*.spec.js'],
        eventcard : ['testing/specs/eventcard/**/*.spec.js'],
        payments : ['testing/specs/payments/**/*.spec.js'],
        promotions : ['testing/specs/promotions/**/*.spec.js'],
        selection : ['testing/specs/selection/**/*.spec.js'],
        taquillaweb : ['testing/specs/taquillaWeb/**/*.spec.js'],
        b2b : ['testing/specs/b2b/**/*.spec.js']
    },
    multiCapabilities: [
        {
            'browserName'   : 'chrome',
            'shardTestFiles': true,
            'maxInstances'  : 1,
            'chromeOptions' : {
                args: [
                    '--window-size=1400,1080'
                ]
            }
        }
    ],
    params: {
        env : 'pro',
        seatsSelected : [],
        dalCouchUrl : ''
    },
    allScriptsTimeout: 70000,
    getPageTimeout: 70000,
    onPrepare: function() {
        var jasmineReporters        = require('jasmine-reporters');
        var SpecReporter            = require('jasmine-spec-reporter');

        var folderName = new Date().toISOString().slice(0,10).replace(/-/g, '') + '_' + new Date().getTime();

        //browser.driver.manage().window().setSize(1400, 1080);

        //
        // CONSOLE REPORTER
        //
        jasmine.getEnv().addReporter(new SpecReporter({
            displayStacktrace: 'none',    // display stacktrace for each failed assertion, values: (all|specs|summary|none)
            displayFailuresSummary: true, // display summary of all failures after execution
            displayPendingSummary: true,  // display summary of all pending specs after execution
            displaySuccessfulSpec: true,  // display each successful spec
            displayFailedSpec: true,      // display each failed spec
            displayPendingSpec: false,    // display each pending spec
            displaySpecDuration: false,   // display each spec duration
            displaySuiteNumber: false    // display each suite number (hierarchical)
        }));

        //
        // XML REPORTER
        //

        var AllureReporter = require('jasmine-allure-reporter');
        jasmine.getEnv().addReporter(new AllureReporter({
            resultsDir: 'reports/reportsAllure'
        }));
        jasmine.getEnv().afterEach(function(done){
            browser.takeScreenshot().then(function (png) {
                allure.createAttachment('Screenshot', function () {
                    return new Buffer(png, 'base64');
                }, 'image/png')();
                done();
            });
        });

        var junitReporter = new jasmineReporters.JUnitXmlReporter({
            savePath: 'reports/junit/' + folderName + '/',
            consolidateAll: true
        });
        jasmine.getEnv().addReporter(junitReporter);
    },
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 70000,
        print: function() {}
    }
};
