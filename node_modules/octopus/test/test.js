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
var dummyTargetDirBase = path.join(testWorkspaceDir, "./move-destination");
var dummyTargetDir = `${dummyTargetDirBase}/dummy-dependency`;
var dependencyName = "dummy-dependency";
var callback = "adsfv"


var f = $$.flow.describe("moveActionTest", {
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
        fsExt.createDir(`${dummySrcDir}`);
        fsExt.createDir(`${dummySrcDir}/dummy-dependency`);
        fsExt.createDir(`${dummySrcDir}/dummy-dependency/sub-dir`);
        fsExt.createFile(`${dummySrcDir}/dummy-dependency/file1.js`, "alert('test1')!");
    },

    act:function() {

        assert.fail("Invoke test with callback that is not a function", function() {
            deployer.run(this.configObject, callback);
        });

        this.end();
    },

    clean:function(){
        console.log("restoring");
        fileStateManager.restoreState();
    }
})();
assert.callback("cleanup", function(end) {
    setTimeout(function(){
        console.log("Forcing clean");
        f.clean();
    }, 1500);
    f.start(end);
});