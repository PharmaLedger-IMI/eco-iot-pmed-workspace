require("../../../psknode/bundles/pskruntime"); 
const fsExt = require('../../../libraries/utils/FSExtension').fsExt;
const assert = require("privatesky/modules/deployer/test/double-check").assert;
var fsm = require("../../../libraries/utils/FileStateManager.js");
var fileStateManager = fsm.getFileStateManager();

var deployer  = require( __dirname + "/../../../test/Deployer.js");

const path = require("path");
const os = require("os");
var testWorkspaceDir = path.join(os.tmpdir(), fsExt.guid());
var dummyTargetDir = path.join(testWorkspaceDir, "./checksum-dummy");
var dummyTargetFile = `${dummyTargetDir}/file1.js`;

var f = $$.flow.describe("missingExpectedChecksum", {
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
                        "expectedChecksum": null,
                        "algorithm": "md5",
                        "encoding": "hex"
                    }]
                }
            ]
        };

        fileStateManager.saveState([testWorkspaceDir]);
        fsExt.createDir(dummyTargetDir);
        fsExt.createFile(dummyTargetFile, "alert('test1')!");
    },

    act: function() {
        deployer.run(this.configObject, this.assert);
    },

    clean:function(){
        console.log("restoring");
        fileStateManager.restoreState();
    },

    assert: function(error, result) {
        assert.notNull(error, "Expected checksum attribute not set!");
        assert.isNull(result, "Should not be any errors!");
        this.end();
    }

})();
assert.callback("missingExpectedChecksum", function(end) {
    setTimeout(function(){
        console.log("Forcing clean");
        f.clean();
    }, 1500);
    f.start(end);
});




