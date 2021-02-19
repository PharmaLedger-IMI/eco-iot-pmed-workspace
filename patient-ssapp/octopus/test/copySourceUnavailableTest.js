require("../../../psknode/bundles/pskruntime"); 
var fs = require("fs");
const assert = require("privatesky/modules/deployer/test/double-check").assert;
const fsExt = require('../../../libraries/utils/FSExtension').fsExt;
var fsm = require("../../../libraries/utils/FileStateManager.js");
var fileStateManager = fsm.getFileStateManager();

var deployer  = require( __dirname + "/../../../test/Deployer.js");

const path = require("path");
const os = require("os");
var testWorkspaceDir = path.join(os.tmpdir(), fsExt.guid());
var dummySrcDir = path.join(testWorkspaceDir, "./copy-source");
var dummyTargetDir = path.join(testWorkspaceDir, "./copy-destination");
var dependencyName = "file.js";

var f = $$.flow.describe("copySourceUnavailableTest", {
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
                    "src": dummySrcDir,
                    "actions": [{
                        "type": "copy",
                        "target": dummyTargetDir
                    }]
                }
            ]
        };
        fileStateManager.saveState([testWorkspaceDir]);
        fsExt.createDir(dummyTargetDir);
    },

    act:function() {
        deployer.run(this.configObject, this.callback);
    },

    clean:function(){
        console.log("restoring");
        fileStateManager.restoreState();
    },

    callback:function (error, result) {
        assert.notNull(error, "Error should be not null!");
        assert.isNull(result, "Result should be null!");
        let targetPath = fsExt.resolvePath(dummyTargetDir + "/" + dependencyName);
        assert.true(!fs.existsSync(targetPath), `[FAIL] Copy action Failed, path `,targetPath);
        this.end();

    }
})();
assert.callback("copySourceUnavailableTest", function(end) {
    setTimeout(function(){
        console.log("Forcing clean");
        f.clean();
    }, 1500);
    f.start(end);
});


