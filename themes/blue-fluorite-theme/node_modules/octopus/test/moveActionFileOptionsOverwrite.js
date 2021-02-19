process.env.DEPLOYER_DEBUG = true;
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
var dummySrcDir = path.join(testWorkspaceDir, "./move-source");
var dummyTargetDir = path.join(testWorkspaceDir, "./move-destination");
var dependencyName = "dummy-dependency";

var f = $$.flow.describe("moveActionOverwriteTest", {
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
                        "src": `${dummySrcDir}`,
                        "target": `${dummyTargetDir}`,
                        "options": {
                            "overwrite": true
                        }
                    }]
                }
            ]
        };
        fileStateManager.saveState([testWorkspaceDir]);
        fsExt.createDir(`${dummySrcDir}`);
        fsExt.createFile(`${dummySrcDir}/file1.js`, "alert('test1')!");
        fsExt.createDir(`${dummyTargetDir}`);
        fsExt.createFile(`${dummyTargetDir}/file1.js`, "alert('test2')!");

        this.sourceChecksum = fsExt.checksum(dummySrcDir);
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
        let targetPath = fsExt.resolvePath(dummyTargetDir);
        destinationChecksum = fsExt.checksum(`${dummyTargetDir}`);
        assert.true(destinationChecksum == this.sourceChecksum , `[FAIL] Dependency "${targetPath}" was not overwritten!`);
        this.end();

    }
})();

assert.callback("moveActionOverwriteTest", function(end) {
    setTimeout(function(){
        console.log("Forcing clean");
        f.clean();
    }, 1500);
    f.start(end);
});