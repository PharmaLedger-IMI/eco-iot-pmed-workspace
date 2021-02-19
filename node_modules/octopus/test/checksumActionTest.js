require("../../../psknode/bundles/pskruntime");
const fsExt = require('../../../libraries/utils/FSExtension').fsExt;
const assert = require("privatesky/modules/deployer/test/double-check").assert;

var deployer  = require( __dirname + "/../../../test/Deployer.js");

const path = require("path");
const os = require("os");
var testWorkspaceDir = path.join(os.tmpdir(),fsExt.guid());
var dummyTargetDir = path.join(testWorkspaceDir, "./checksum-dummy");
var dummyTargetFile = `${dummyTargetDir}/file1.js`;


var f = $$.flow.describe("checksumActionTest", {
    start:function(end) {
        this.end = end;
        this.beforeExecution();
        this.act();
    },
    beforeExecution:function() {
        this.configObject = {
            "dependencies": [
                {
                    "name": "file1.js",
                    "actions": [{
                        "type": "checksum",
                        "src": dummyTargetFile,
                        "expectedChecksum": "403d91e9d3a8b6ce17435995882a4dba",
                        "algorithm": "md5",
                        "encoding": "hex"
                    }]
                }
            ]
        };

        fsExt.createDir(dummyTargetDir);
        fsExt.createFile(dummyTargetFile, "alert('test1')!");
    },
    act: function() {
        deployer.run(this.configObject, this.check);
    },
    clean:function(){
        console.log("Cleaning folder", testWorkspaceDir);
        fsExt.rmDir(testWorkspaceDir);
    },
    check: function(error, result) {
        assert.notNull(result, "Checksum did not match!");
        assert.isNull(error, "Should not be any errors!");
        this.end();
    }

})();
assert.callback("checksumActionTest", function(end) {
    setTimeout(function(){
        console.log("Forcing clean");
        f.clean();
    }, 1500);
    f.start(end);
});