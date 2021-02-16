require("../../../psknode/bundles/pskruntime"); 
var fs = require("fs");
var fsm = require("../../../libraries/utils/FileStateManager.js");
const fsExt = require('../../../libraries/utils/FSExtension').fsExt;
const assert = require("privatesky/modules/deployer/test/double-check").assert;
var fileStateManager = fsm.getFileStateManager();

var deployer  = require( __dirname + "/../../../test/Deployer.js");

const path = require("path");
const os = require("os");
var testWorkspaceDir = path.join(os.tmpdir(), fsExt.guid());
var dummyTargetWorkDir = fsExt.resolvePath(testWorkspaceDir);
var dummyTargetDir = path.join(testWorkspaceDir, "./node_modules");

var dependencyName = "transrest";

var f = $$.flow.describe("installAvailableNpmDependency", {
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
                    "workDir": dummyTargetWorkDir,
                    "actions": ["install"]
                }
            ]
        };
        fileStateManager.saveState([testWorkspaceDir]);
        fsExt.createDir(dummyTargetDir);
    },

    act:function() {
        deployer.run(this.configObject, this.callback);
    },

    clean:function(){
        console.log("restoring");
        fileStateManager.restoreState();
    },

    callback:function (error, result) {
        assert.notNull(result, "Result should not be null!");
        assert.isNull(error, "Should not be any errors!");
        let targetPath = fsExt.resolvePath(dummyTargetDir + "/" + dependencyName);
        assert.true(fs.existsSync(targetPath), `[FAIL] Dependency "${dependencyName}" does not exist in ${dummyTargetDir}`);
        this.end();
    }
})();
assert.callback("installAvailableNpmDependency", function(end) {
    setTimeout(function(){
        console.log("Forcing clean");
        f.clean();
    }, 7000);
    f.start(end);
},5000);



