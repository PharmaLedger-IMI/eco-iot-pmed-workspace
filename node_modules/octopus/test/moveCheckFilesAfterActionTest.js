require("../../../psknode/bundles/pskruntime"); 
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
var srcChecksum;

var f = $$.flow.describe("moveCheckFilesAfterAction", {
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
        srcChecksum = fsExt.checksum(`${dummySrcDir}`);
    },

    act:function() {
        deployer.run(this.configObject, this.callback);
    },

    clean:function(){
        console.log("restoring");
        fileStateManager.restoreState();
    },

    callback:function (error, result) {
        // TODO here maybe we can check all source files to match the ones from the destination files
        assert.notNull(result, "Result should not be null!");
        assert.isNull(error, "Should not be any errors!");
        let targetChecksum = fsExt.checksum(dummyTargetDirBase);
        assert.true(srcChecksum === targetChecksum, `[FAIL] Files were moved incorrect.Original checksum was ${srcChecksum} checksum after move is ${targetChecksum}`);
        this.end();
    }
})();
assert.callback("moveCheckFilesAfterAction", function(end) {
    setTimeout(function(){
        console.log("Forcing clean");
        f.clean();
    }, 5000);
    f.start(end);
},3000);


