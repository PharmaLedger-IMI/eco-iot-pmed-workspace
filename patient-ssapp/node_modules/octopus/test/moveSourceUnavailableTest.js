require("../../../psknode/bundles/pskruntime");
const assert = require("privatesky/modules/deployer/test/double-check").assert;
const fsExt = require('../../../libraries/utils/FSExtension').fsExt;
var fsm = require("../../../libraries/utils/FileStateManager.js");
var fileStateManager = fsm.getFileStateManager();

var deployer  = require( __dirname + "/../../../test/Deployer.js");

const path = require("path");
const os = require("os");
var testWorkspaceDir = path.join(os.tmpdir(), fsExt.guid());
var dummySrcDir = path.join(testWorkspaceDir, "./move-source");
var dummyTargetDirBase = path.join(testWorkspaceDir, "./move-destination");
var dummyTargetDir = `${dummyTargetDirBase}/dummy-dependency`;
var dependencyName = "dummy-dependency";

var f = $$.flow.describe("moveSourceUnavailable", {
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
                    "src": "npm",
                    "actions": [{
                        "type": "move",
                        "src": `${dummySrcDir}/dummy-dependency`,
                        "target": dummyTargetDir
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

    callback:function (error,result) {
        assert.notNull(error,"Should fail with source not avalalble!");
        assert.isNull(result, "Should not be any errors!");
        this.end();
    }
})();
assert.callback("moveSourceUnavailable", function(end) {
    setTimeout(function(){
        console.log("Forcing clean");
        f.clean();
    }, 1500);
    f.start(end);
});

