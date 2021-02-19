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
var dummySrcFile1 = path.join(dummyTargetDir, "acl-magic.zip");

var f = $$.flow.describe("extractSourceUnavailable", {
    start:function(end) {
        this.end = end;
        this.beforeExecution();
        this.act();
    },

    beforeExecution:function() {
        this.configObject = {
            "dependencies": [
                {
                    "name": "dummy",
                    "actions": [{
                        "type": "extract",
                        "src": dummySrcFile1,
                        "target": dummyTargetDir
                    }]
                }]
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
        assert.notNull(error, "Should have errors!");
        assert.isNull(result, "Result should be null!");
        this.end();
    }
})();
assert.callback("extractSourceUnavailable", function(end) {
    setTimeout(function(){
        console.log("Forcing clean");
        f.clean();
    }, 7000);
    f.start(end);
},5000);