require("../../../psknode/bundles/pskruntime"); 
const fsExt = require('../../../libraries/utils/FSExtension').fsExt
const assert = require("privatesky/modules/deployer/test/double-check").assert;

const path = require("path");
const os = require("os");
var testWorkspaceDir = path.join(os.tmpdir(),fsExt.guid());
var dummyTargetDir = path.join(testWorkspaceDir, "./checksum-dummy");
var dummyTargetFile = `${dummyTargetDir}/file1.js`;

var f = $$.flow.describe("checksumCaseTest", {
    start:function(end) {
        this.end = end;
        this.beforeExecution();
        this.test();
    },
    beforeExecution:function() {
        fsExt.createDir(dummyTargetDir);
        fsExt.createFile(`${dummyTargetDir}/file1.js`, "alert('test1')!");
    },
    clean:function(){
        console.log("Cleaning folder", dummyTargetDir);
        fsExt.rmDir(testWorkspaceDir);
    },
    test:function(){
        let expectedChecksum1 = '403d91e9d3a8b6ce17435995882a4dba';
        let checksum1 = fsExt.checksum(dummyTargetFile);
        assert.true(expectedChecksum1 === checksum1, `[FAIL] Checksum was not calculated correctly(case sensitive)! The result was ${checksum1} and it should have been ${expectedChecksum1}`);
        this.end();
    }

})();
assert.callback("checksumCaseTest", function(end) {
    setTimeout(function(){
        console.log("Forcing clean");
        f.clean();
    }, 1500);
    f.start(end);
});