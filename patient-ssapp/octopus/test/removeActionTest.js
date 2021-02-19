require("../../../psknode/bundles/pskruntime"); 
var fs = require("fs");
const assert = require("privatesky/modules/deployer/test/double-check").assert;
const fsExt = require('../../../libraries/utils/FSExtension').fsExt;
var fsm = require("../../../libraries/utils/FileStateManager.js");
var fileStateManager = fsm.getFileStateManager();

var deployer  = require( __dirname + "/../../../test/Deployer.js");

const path = require("path");
const os = require("os");
var testWorkspaceDir = path.join(os.tmpdir(), fsExt.guid());
var dummyTargetDir = path.join(testWorkspaceDir, "./remove-source");
var dependencyName = "dummy-dependency";


var f = $$.flow.describe("removeActionTest", {
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
                        "type": "remove",
                        "target": dummyTargetDir
                    }]
                }
            ]
        };
        fileStateManager.saveState([testWorkspaceDir]);
        fsExt.createDir(dummyTargetDir);
        fsExt.createDir(`${dummyTargetDir}/dummy-dependency`);
        fsExt.createDir(`${dummyTargetDir}/dummy-dependency/sub-dir`);
        fsExt.createFile(`${dummyTargetDir}/dummy-dependency/file1.js`, "alert('test1')!");
    },

    act:function() {
        deployer.run(this.configObject, this.callback);
    },

    clean:function(){
        console.log("restoring");
        fileStateManager.restoreState();
    },

    callback:function (error, result) {
        assert.notNull(result, "Should not be null!");
        assert.isNull(error, "Should not be any errors!");
        let targetPath = fsExt.resolvePath(dummyTargetDir);
        assert.true(!fs.existsSync(targetPath), `[FAIL] Dependency ${targetPath} still exists!`);
        this.end();
    }
})();
assert.callback("removeActionTest", function(end) {
    setTimeout(function(){
        console.log("Forcing clean");
        f.clean();
    }, 1500);
    f.start(end);
});




