exports.config = {
    framework: 'jasmine2',
    //seleniumAddress: 'https://selenium-hub.oneboxtickets.net/wd/hub',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    baseUrl: 'https://app-portal-qa-bran.oneboxdev.net',
    suites: {
        regression : [  'testing/specs/promotions/combined/*.spec.js' ]
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
        env : 'qa-bran',
        seatsSelected : [],
        dalCouchUrl : '',
        device : 'desktop'
    },
    allScriptsTimeout: 70000,
    getPageTimeout: 70000,
    onPrepare: function() {
        var jasmineReporters        = require('jasmine-reporters');
        var SpecReporter            = require('jasmine-spec-reporter');

        var folderName = new Date().toISOString().slice(0,10).replace(/-/g, '') + '_' + new Date().getTime();

        if(browser.params.device === 'mobile'){
            browser.driver.manage().window().setSize(360, 640);
        }

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
        // Reports XML y HTML
        //
        /*var AllureReporter = require('jasmine-allure-reporter');
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
        jasmine.getEnv().addReporter(junitReporter);*/
    },
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 70000,
        print: function() {}
    }
};
