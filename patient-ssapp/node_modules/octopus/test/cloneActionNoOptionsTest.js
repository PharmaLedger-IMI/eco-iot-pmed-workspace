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
var dependencyTarget = path.join(testWorkspaceDir, "js");

var dependencyName = "double-check";

var f = $$.flow.describe("cloneActionNoOptionsTest", {
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
                    "src": "https://github.com/PrivateSky/double-check",
                    "actions": [{
                        "type": "clone",
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

    callback:function(error, result) {
        assert.notNull(result, "Result should not be null!");
        assert.isNull(error, "Should not be any errors!");
        let dependencyPath = fsExt.resolvePath(dependencyTarget + "/" + dependencyName);
        assert.true(fs.existsSync(dependencyPath), `[FAIL] Dependency "${dependencyPath}" does not exist!`);
        this.end();
    }
})();
assert.callback("cloneActionNoOptionsTest", function(end) {
    setTimeout(function(){
        console.log("Forcing clean");
        f.clean();
    }, 5500);
    f.start(end);
},5000);

