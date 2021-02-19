require("../../../psknode/bundles/pskruntime");
var fs = require("fs");
const fsExt = require('../../../libraries/utils/FSExtension').fsExt;
const assert = require("privatesky/modules/deployer/test/double-check").assert;
var fsm = require("../../../libraries/utils/FileStateManager.js");
var fileStateManager = fsm.getFileStateManager();

var deployer  = require( __dirname + "/../../../test/Deployer.js");

const path = require("path");
const os = require("os");
var testWorkspaceDir = path.join(os.tmpdir(), fsExt.guid());
var dummyTargetDir = path.join(testWorkspaceDir, "./modules");
var dependencyJs = "acl.js";
var dependencyZip = "acl-magic.zip";

var f = $$.flow.describe("downloadMultipleFilesDependencyAvailable", {
    start:function(end) {
        this.end = end;
        this.beforeExecution();
        this.act();
    },

    beforeExecution:function() {
        this.configObject = {
            "dependencies": [
                {
                    "name": dependencyJs,
                    "src": "https://raw.githubusercontent.com/PrivateSky/acl-magic/master/lib/acl.js",
                    "actions": [{
                        "type": "download",
                        "target": dummyTargetDir
                    }]
                },
                {
                    "name": dependencyZip,
                    "src": "https://github.com/PrivateSky/acl-magic/archive/master.zip",
                    "actions": [{
                        "type": "download",
                        "target": dummyTargetDir
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
        let targetPathJS = fsExt.resolvePath(dummyTargetDir + "/" + dependencyJs);
        let targetPathZip = fsExt.resolvePath(dummyTargetDir + "/" + dependencyZip);
        assert.true(fs.existsSync(targetPathJS) && fs.existsSync(targetPathZip), `[FAIL] Dependency "${targetPathJS}" and "${targetPathZip}" does not exist!`);
        this.end();
    }
})();
assert.callback("downloadMultipleFilesDependencyAvailable", function(end) {
    setTimeout(function(){
        console.log("Forcing clean");
        f.clean();
    }, 7000);
    f.start(end);
},5000);
