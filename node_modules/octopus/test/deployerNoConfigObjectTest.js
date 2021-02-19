require("../../../psknode/bundles/pskruntime"); 

var deployer  = require( __dirname + "/../../../test/Deployer.js");

const assert = require("privatesky/modules/deployer/test/double-check").assert;

var f = $$.flow.describe("deployerNoConfigObject", {
    start:function() {
        this.act();
    },
    act: function() {

        deployer.run(null, this.check);
    },
    check: function(error) {
        assert.pass("deployerNoConfigObject", function() {
            assert.notNull(error, "Should not be errors!");
        })
    }
})();
f.start();

