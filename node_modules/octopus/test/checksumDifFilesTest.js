require("../../../psknode/bundles/pskruntime"); 
const fsExt = require('../../../libraries/utils/FSExtension').fsExt;
const assert = require("privatesky/modules/deployer/test/double-check").assert;

const path = require("path");
const os = require("os");
var testWorkspaceDir = path.join(os.tmpdir(),fsExt.guid());
var dummyTargetDir = path.join(testWorkspaceDir, "./checksum-dummy");
var dummyTargetDir2 = path.join(testWorkspaceDir, "./checksum-dummy2");
var dummyTargetFile = `${dummyTargetDir}/file1.js`;
var dummyTargetFile2 = `${dummyTargetDir2}/file2.js`;

var f = $$.flow.describe("checksumDifFiles", {
    start:function(end) {
        this.end = end;
        this.beforeExecution();
        this.test();

    },

    beforeExecution:function() {
        fsExt.createDir(dummyTargetDir);
        fsExt.createDir(dummyTargetDir2);
        fsExt.createFile(`${dummyTargetDir}/file1.js`, "alert('test1')!");
        fsExt.createFile(`${dummyTargetDir2}/file2.js`, "alert('test2')!");
    },

    clean:function(){
        console.log("Cleaning folder", dummyTargetDir,dummyTargetDir2);
        fsExt.rmDir(testWorkspaceDir);
    },

    test:function (){
        let expectedChecksum1 = '403d91e9d3a8b6ce17435995882a4dba';
        let expectedChecksum2 = "49a4bb4842f611f72cc6c4e52b16ef57";
        let checksum1 = fsExt.checksum(dummyTargetFile);
        let checksum2 = fsExt.checksum(dummyTargetFile2);
        assert.true(expectedChecksum1 === checksum1,   `[FAIL] Checksum was not calculated correctly! The result was ${checksum1} and it should have been ${expectedChecksum1}`);
        assert.true(expectedChecksum2 === checksum2,    `[FAIL] Checksum was not calculated correctly! The result was ${checksum2} and it should have been ${expectedChecksum2}`);
        assert.true(checksum1 != checksum2, `[FAIL] Checksum was not calculated correctly! The checksum for the first file is ${checksum1} the checksum for the second file is ${checksum2}!`);
        this.end();
    }
})();
assert.callback("checksumDifFiles", function(end) {
    setTimeout(function(){
        console.log("Forcing clean");
        f.clean();
    }, 1500);
    f.start(end);
});
