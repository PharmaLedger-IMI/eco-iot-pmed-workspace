require("../../../psknode/bundles/pskruntime"); 
const assert = require("privatesky/modules/deployer/test/double-check").assert;
const fsExt = require('../../../libraries/utils/FSExtension').fsExt;
var fsm = require("../../../libraries/utils/FileStateManager.js");
var fileStateManager = fsm.getFileStateManager();

var deployer  = require( __dirname + "/../../../test/Deployer.js");

const path = require("path");
const os = require("os");
var testWorkspaceDir = path.join(os.tmpdir(), fsExt.guid());
var dummyTargetDir = path.join(testWorkspaceDir, "./modules");
var dependencyName = "nothing.zip";

var f = $$.flow.describe("downloadDependencyUnavailable", {
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
                    "src": "//github.com/PrivateSky/",
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

    callback: function(error, result) {
        console.log(JSON.stringify(error));
        assert.notNull(error, "Error should not be null!");
        assert.isNull(result, "Result should be null!");
        this.end();
    }
})();
assert.callback("downloadDependencyUnavailable", function(end) {
    setTimeout(function(){
        console.log("Forcing clean");
        f.clean();
    }, 7000);
    f.start(end);
},5000);

