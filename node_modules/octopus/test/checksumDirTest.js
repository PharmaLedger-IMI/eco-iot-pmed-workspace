require("../../../psknode/bundles/pskruntime"); 
const fsExt = require('../../../libraries/utils/FSExtension').fsExt;
const assert = require("privatesky/modules/deployer/test/double-check").assert;

const path = require("path");
const os = require("os");
var testWorkspaceDir = path.join(os.tmpdir(), fsExt.guid());
var dummyTargetDir = path.join(testWorkspaceDir, "./checksum-dummy");

var f = $$.flow.describe("dirChecksum", {
    start:function(end) {
        this.end = end;
        this.beforeExecution();
        this.assert();
    },

    beforeExecution:function() {
        fsExt.createDir(dummyTargetDir);
        fsExt.createFile(`${dummyTargetDir}/file1.js`, "alert('test1')!");
        fsExt.createDir(`${dummyTargetDir}/sub-dir`);
        fsExt.createFile(`${dummyTargetDir}/sub-dir/file2.js`, "alert('test2')!");
    },

    clean:function(){
        console.log("Cleaning folder", dummyTargetDir);
        fsExt.rmDir(testWorkspaceDir);
    },

    assert: function() {
        let expectedChecksum = "00b9bf7a422e20bff93b14169e1a0842";
        let checksum = fsExt.checksum(dummyTargetDir);
        assert.true(expectedChecksum === checksum, `[FAIL] Checksum was not calculated correctly! The result was ${checksum} and it should have been ${expectedChecksum}!`);
        this.end();
    }
})();

assert.callback("dirChecksum", function(end) {
    setTimeout(function(){
        console.log("Forcing clean");
        f.clean();
    }, 1500);
    f.start(end);
});

