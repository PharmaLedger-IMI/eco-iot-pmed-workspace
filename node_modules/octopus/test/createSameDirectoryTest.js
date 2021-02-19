require("../../../psknode/bundles/pskruntime");
const fsExt = require('../../../libraries/utils/FSExtension').fsExt
const assert = require("privatesky/modules/deployer/test/double-check").assert;

const path = require("path");
const os = require("os");
var testWorkspaceDir = path.join(os.tmpdir(), fsExt.guid());
var dummyTargetDir = path.join(testWorkspaceDir, "checksum-dummy");


var f = $$.flow.describe("Using create directory multiple times on the same path", {
    start:function() {
        this.beforeExecution();
        this.afterExecution();
    },

    beforeExecution:function() {
       assert.pass("createSameDirectory", this.act);
    },
    act: function() {
        fsExt.createDir(dummyTargetDir);
        fsExt.createFile(`${dummyTargetDir}/file1.js`, "alert('test1')!");
        fsExt.createDir(`${dummyTargetDir}/sub-dir`);
        fsExt.createFile(`${dummyTargetDir}/sub-dir/file2.js`, "alert('test2')!");
        fsExt.createDir(dummyTargetDir);
        fsExt.createFile(`${dummyTargetDir}/file1.js`, "alert('test1')!");
        fsExt.createDir(`${dummyTargetDir}/sub-dir`);
        fsExt.createFile(`${dummyTargetDir}/sub-dir/file2.js`, "alert('test2')!");
    },
    afterExecution: function() {
        fsExt.rmDir(testWorkspaceDir);
    }
})();
f.start();

