require("../../../psknode/bundles/pskruntime");
const assert = require("privatesky/modules/deployer/test/double-check").assert;

var deployer = require(__dirname + "/../../../test/Deployer.js");

var configObject = [[], {}, true, undefined, null, function(){}];
var errors = [];

assert.callback("configObjectAcceptedTypeTest", function(cb) {
    for(var i = 0; i < configObject.length; i++ ) {
        deployer.run(configObject[i], callback);
    }

    function callback(error, result) {
        var testFailed = false;
        var message = "";
        if(error) {
            errors.push(error);
            message = "[Caught-Expected-Error] " + JSON.stringify(error);
        } else {
            console.log(JSON.stringify(result));
        }
        let logger = testFailed ? console.error : console.log;
        logger(message);
    };

    setTimeout(function(){
        assert.true(errors.length == configObject.length, "Not all negative scenarios of config object has passed!");
        cb();
    }, 2000);
}, 2500);
