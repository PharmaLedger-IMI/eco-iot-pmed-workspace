require("../../../psknode/bundles/pskruntime"); 
var fs = require("fs");
const fsExt = require('../../../libraries/utils/FSExtension').fsExt;
const assert = require("privatesky/modules/deployer/test/double-check").assert;

var fsm = require("../../../libraries/utils/FileStateManager.js");
var fileStateManager = fsm.getFileStateManager();

var deployer  = require( __dirname + "/../../../test/Deployer.js");

const path = require("path");
const os = require("os");
var testWorkspaceDir = path.join(os.tmpdir(), fsExt.guid());
var dependencyTarget = path.join(testWorkspaceDir, "./git");
var dependencyName = "whys";

var f = $$.flow.describe("cloneOverExistingFiles", {
    start:function(end) {
        this.end = end;
        this.beforeExecution();
        this.act();
    },

    beforeExecution:function() {
        this.configObject = {
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
                }, {
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

    act:function() {
        deployer.run(this.configObject, this.callback);
    },

    clean:function(){
        console.log("restoring");
        fileStateManager.restoreState();
    },

    callback:function (error, result) {
        console.log(JSON.stringify(error));
        assert.notNull(error, "Should have errors!");
        assert.isNull(result, "Resulr should be null!");
        let dependencyPath = fsExt.resolvePath(dependencyTarget + "/" + dependencyName);
        assert.true(fs.existsSync(dependencyPath), `[FAIL] Dependency "${dependencyPath}" does not exist!`);
        this.end();
    }
})();

assert.callback("cloneOverExistingFiles", function(end) {
    setTimeout(function(){
        console.log("Forcing clean");
        f.clean();
    }, 5500);
    f.start(end);
},5000);
