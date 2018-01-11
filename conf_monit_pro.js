exports.config = {
    framework: 'jasmine2',
    //seleniumAddress: 'http://selenium.onebox.tk:31999/wd/hub',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['testing/smokeTest-postGoLive/tests/postGoLive/**/*.spec.js'],
    suites: {
        monitclientspro : ['testing/specs/monitclientspro/*.spec.js']
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
        env : 'pre',
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

        //
        // UPDATE JIRA ISSUES
        //
        var executionPassed = true,
            stepDescription = '';

        var myReporter = {
            specDone: function(result) {
                if(result.failedExpectations.length > 0){
                    executionPassed = false;
                    stepDescription = stepDescription === '' ? result.description : stepDescription;
                }
            },
            suiteDone: function(result) {
                var actualIssue = result.description.substring(0, result.description.indexOf(' ')),
                    issueToChange = actualIssue,
                    request = require('superagent'),
                    defer = protractor.promise.defer();

                //21: To_Resolved
                //91: To_InProgress
                var transitionId = executionPassed ? '21' : '91';

                request
                    .post('http://jira.oneboxtickets.com/rest/api/2/issue/'+ issueToChange + '/transitions?expand=transitions.fields')
                    .send('{"transition": { "id" : '+ transitionId +' }}')
                    .set('Content-Type', 'application/json')
                    .set('Content-Length', '48')
                    .set('Host', 'jira.oneboxtickets.com')
                    .set('Connection', 'Keep-Alive')
                    .set('User-Agent', 'Apache-HttpClient/4.1.1 (java 1.5)')
                    .set('Authorization', 'Basic c3JvbWV1OnNtMDkwMzIwMDc=')
                    .end(function(err, res){
                        defer.reject("Error: " + err);
                    });
                
                request
                    .post('http://jira.oneboxtickets.com/rest/api/2/issue/'+ issueToChange + '/comment')
                    .send('{"body": "' + stepDescription + ' \n "}')
                    .set('Content-Type', 'application/json')
                    .set('Content-Length', '48')
                    .set('Host', 'jira.oneboxtickets.com')
                    .set('Connection', 'Keep-Alive')
                    .set('User-Agent', 'Apache-HttpClient/4.1.1 (java 1.5)')
                    .set('Authorization', 'Basic c3JvbWV1OnNtMDkwMzIwMDc=')
                    .end(function(err, res){
                        defer.reject("Error: " + err);
                    });

                if(!executionPassed){
                    request
                        .get('http://10.1.2.173:30002/jacaranda/1.0/sendMessage')
                        .set('Authorization', 'Bear 1736cc7f-7c60-4576-b851-b7b3630cfeab')
                        .set('Host', '10.1.2.173:30002')
                        .set('Connection', 'Keep-Alive')
                        .set('User-Agent', 'Apache-HttpClient/4.1.1 (java 1.5)')
                        .query({ text: 'Error tests Protractor: ' + result.description + ': ' + stepDescription })
                        .query({ chat_id: '-199625812' })
                        .end(function(err, res){
                        });
                }

                return defer.promise;
            }
        };

        jasmine.getEnv().addReporter(myReporter);
    },
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 70000,
        print: function() {}
    }
};
