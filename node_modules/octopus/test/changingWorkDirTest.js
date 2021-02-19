require("../../../psknode/bundles/pskruntime"); 
const fs = require("fs");
const fsExt = require('../../../libraries/utils/FSExtension').fsExt;
const assert = require("privatesky/modules/deployer/test/double-check").assert;
var fsm = require("../../../libraries/utils/FileStateManager");
var fileStateManager = fsm.getFileStateManager();

var deployer  = require( __dirname + "/../../../test/Deployer.js");

const path = require("path");
const os = require("os");
var testWorkspaceDir = fsExt.guid();
var dependencyTarget = path.join(testWorkspaceDir, "./git");
var dependencyName = "whys";

var f = $$.flow.describe("changingWorkDirTest", {

    start:function(end) {
        this.end = end;
        this.beforeExecution();
        this.act();
    },

    beforeExecution:function() {
        this.configObject = {
            "workDir": path.join(__dirname, "./"),
            "dependencies": [
                {
                    "name": dependencyName,
                    "src": "https://github.com/PrivateSky/whys.git",
                    "actions": [{
                        "type": "clone",
                        "options": {
                            "depth": "1",
                            "branch": "master"
                        },
                        "target": dependencyTarget
                    }]
                }
            ]
        };

        fileStateManager.saveState([testWorkspaceDir]);
    },

    act: function() {
        deployer.run(this.configObject, this.callback);
    },

    clean: function(){
        console.log("Restoring");
        fileStateManager.restoreState();
    },

    callback: function (error, result) {
        assert.notNull(result, "Result should not be null!");
        assert.isNull(error, "Should not be any errors!");

        // check if the dependency target is in the workDir set in the configuration object

        let dependencyPath = path.join(this.configObject.workDir, dependencyTarget, dependencyName);
        assert.true(fs.existsSync(dependencyPath), `[FAIL]  "${dependencyPath}" is not in ${this.configObject.workDir}!`);
        this.end();
    }
})();

assert.callback("changingWorkDir", function(end) {
    setTimeout(function(){
        console.log("Forcing clean");
        f.clean();
    }, 3500);
    f.start(end);
}, 3000);
