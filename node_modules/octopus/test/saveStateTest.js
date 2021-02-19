require("../../../psknode/bundles/pskruntime"); 
var fs = require("fs");
const fsExt = require('../../../libraries/utils/FSExtension').fsExt;
const assert = require("privatesky/modules/deployer/test/double-check").assert;
var fsm = require("../../../libraries/utils/FileStateManager.js");
var fileStateManager = fsm.getFileStateManager();

const path = require("path");
const os = require("os");
var testWorkspaceDir = path.join(os.tmpdir(), fsExt.guid());
var dummyTargetDir = path.join(testWorkspaceDir, "./save-state-dummy");

var f = $$.flow.describe("saveState", {
    start: function (end) {
        this.end = end;
        this.beforeExecution();
        this.act();
        this.assert();
    },

    beforeExecution: function () {
        fsExt.createDir(dummyTargetDir);
        fsExt.createFile(`${dummyTargetDir}/file1.js`, "alert('test1')!");
        fsExt.createDir(`${dummyTargetDir}/sub-dir`);
        fsExt.createFile(`${dummyTargetDir}/sub-dir/file2.js`, "alert('test2')!");
    },

    act: function () {
        fileStateManager.saveState([testWorkspaceDir]);
      /*  fsExt.rmDir(dummyTargetDir);
        fileStateManager.restoreState();*/
    },

    clean:function(){
        console.log("restoring");
      //  fsExt.rmDir(testWorkspaceDir);
    },

    assert: function () {
        let dirPath = fsExt.resolvePath(dummyTargetDir);
        assert.true(fs.existsSync(dirPath), `[FAIL] Dir "${dirPath}" does not exist after restore!`);
        this.end();
    }
})();

assert.callback("saveState", function(end) {
    setTimeout(function(){
        console.log("Forcing clean");
        f.clean();
    }, 1500);
    f.start(end);
});



