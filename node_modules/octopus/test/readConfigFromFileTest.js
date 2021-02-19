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
var dummyTargetDir = path.join(testWorkspaceDir, "./dummy-config-file-dir");
var dummyConfigFile = fsExt.resolvePath(`${dummyTargetDir}/config.json`);

var dummyDownloadDir = path.normalize(testWorkspaceDir + "/dummy-download-dir");
if(os.platform()=='win32'){
	dummyDownloadDir = dummyDownloadDir.replace(/\\/g, "\\\\");
}

var dependencyName = "acl.js";

var f = $$.flow.describe("readConfigFromTestFile", {
    start:function(end) {
        this.beforeExecution();
        this.act();
        this.end = end;
    },

    beforeExecution:function() {
        fileStateManager.saveState([testWorkspaceDir]);
        fsExt.createDir(dummyTargetDir);
        fsExt.createFile(dummyConfigFile, `
        {
            "dependencies": [
                {
                    "name": "${dependencyName}",
                    "src": "https://raw.githubusercontent.com/PrivateSky/acl-magic/master/lib/acl.js",
                    "actions": [{
                        "type": "download",
                        "target": "${dummyDownloadDir}"
                    }]
                }
            ]
        }`);
    },

    act: function() {
        deployer.run(dummyConfigFile, this.callback);
    },

    clean:function(){
        console.log("restoring");
        fileStateManager.restoreState();
    },

    callback: function(error, result) {
        assert.notNull(result, "[FAIL] Reading config from file does not work !");
        assert.isNull(error, "Should not be any errors!");
        let targetPath = fsExt.resolvePath(dummyDownloadDir + "/" +dependencyName );
        assert.true(fs.existsSync(targetPath), `[FAIL] Dependency "${targetPath}" does not exist!`);
        this.end();
    }
})();
assert.callback("readConfigFromTestFile", function(end) {
    setTimeout(function(){
        console.log("Forcing clean");
        f.clean();
    }, 1500);
    f.start(end);
});


