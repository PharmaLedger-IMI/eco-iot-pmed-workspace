require("../../../psknode/bundles/pskruntime");
var fs = require("fs");
var fsm = require("../../../libraries/utils/FileStateManager.js");
var fileStateManager = fsm.getFileStateManager();
const assert = require("privatesky/modules/deployer/test/double-check").assert;
const fsExt = require('../../../libraries/utils/FSExtension').fsExt;

var deployer  = require( __dirname + "/../../../test/Deployer.js");

const path = require("path");
const os = require("os");
var testWorkspaceDir = path.join(os.tmpdir(), fsExt.guid());
var dummyTargetDir = path.join(testWorkspaceDir, "./extract");
var dummyTargetDir2 = path.join(testWorkspaceDir, "./unarchived");
var dummySrcFile1 = path.join(dummyTargetDir, "acl-magic.zip");
var dependencyName = "acl-magic.zip";

var f = $$.flow.describe("extractTargetUnavailable", {
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
                    "src": "https://github.com/PrivateSky/acl-magic/archive/master.zip",
                    "actions": [{
                        "type": "download",
                        "target": dummyTargetDir
                    }, {
                        "type": "extract",
                        "src": dummySrcFile1,
                        "target": dummyTargetDir2
                    }]
                }
            ]
        };
        fileStateManager.saveState([testWorkspaceDir]);
    },

    act:function() {
        deployer.run(this.configObject, this.callback);
    },

    clean:function(){
        console.log("restoring");
        fileStateManager.restoreState();
    },

    callback:function (error, result) {
        assert.notNull(result, "Result should not be null!");
        assert.isNull(error, "Should not be any errors!");
        let targetPath = fsExt.resolvePath(dummyTargetDir2);
        assert.true(fs.existsSync(targetPath), `[FAIL] Dependency does not exist in ${targetPath}`);
        this.end();
    }
})();
assert.callback("extractTargetUnavailable", function(end) {
    setTimeout(function(){
        console.log("Forcing clean");
        f.clean();
    }, 7000);
    f.start(end);
},5000);
