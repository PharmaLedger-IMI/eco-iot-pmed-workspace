require("../../../psknode/bundles/pskruntime");
const fsExt = require('../../../libraries/utils/FSExtension').fsExt;
const assert = require("privatesky/modules/deployer/test/double-check").assert;

const path = require("path");
const os = require("os");
var testWorkspaceDir = path.join(os.tmpdir(),fsExt.guid());//"./" + fsExt.guid();
var dummyTargetDir = path.join(testWorkspaceDir, "./checksum-dummy");
var dummyTargetFile = `${dummyTargetDir}/file1.js`;

var f = $$.flow.describe("fileChecksum", {
    start:function(end) {
        this.end = end;
        this.beforeExecution();
        this.assert();
    },

    beforeExecution:function() {
        fsExt.createDir(dummyTargetDir);
        fsExt.createFile(dummyTargetFile, "alert('test1')!");
    },

    clean:function(){
        console.log("Cleaning folder", dummyTargetDir);
        fsExt.rmDir(testWorkspaceDir);
    },

    assert: function() {
        let expectedChecksum = "403d91e9d3a8b6ce17435995882a4dba";
        let checksum = fsExt.checksum(dummyTargetFile);
        assert.true(expectedChecksum === checksum, `[FAIL] Checksum was not calculated correctly! The result was ${checksum} and it should have been ${expectedChecksum}!`);
        this.end();
    }
})();

assert.callback("fileChecksum", function(end) {
    setTimeout(function(){
        console.log("Forcing clean");
        f.clean();
    }, 1500);
    f.start(end);
});

