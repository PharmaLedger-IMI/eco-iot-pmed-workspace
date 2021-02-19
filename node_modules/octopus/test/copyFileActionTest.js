require("../../../psknode/bundles/pskruntime"); 
var fs = require("fs");
const fsExt = require('../../../libraries/utils/FSExtension').fsExt;
var fsm = require("../../../libraries/utils/FileStateManager.js");
var fileStateManager = fsm.getFileStateManager();
const assert = require("privatesky/modules/deployer/test/double-check").assert;

var deployer  = require( __dirname + "/../../../test/Deployer.js");

const path = require("path");
const os = require("os");
var testWorkspaceDir = path.join(os.tmpdir(), fsExt.guid());
var dummySrcDir = path.join(testWorkspaceDir, "./copy-source");
var dummyTargetDir = path.join(testWorkspaceDir, "./copy-destination");
var dependencyName = "file1.js";


var f = $$.flow.describe("copyFileActionTest", {
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
                    "src": dummySrcDir,
                    "actions": [{
                        "type": "copy",
                        "target": dummyTargetDir
                    }]
                }
            ]
        };

        fileStateManager.saveState([testWorkspaceDir]);
        fsExt.createDir(dummySrcDir);
        fsExt.createFile(`${dummySrcDir}/file1.js`, "alert('test')!");
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
        assert.true(fs.existsSync(targetPath), `[FAIL] Dependency "${dependencyName}" does not exist in ${targetPath}`);
        this.end();
    }
})();
assert.callback("copyFileActionTest", function(end) {
    setTimeout(function(){
        console.log("Forcing clean");
        f.clean();
    }, 1500);
    f.start(end);
});


