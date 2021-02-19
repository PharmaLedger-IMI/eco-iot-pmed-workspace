const actionsRegistry = require("./ActionsRegistry");
const path = require("path");
let TAG = "[Octopus]";

function Runner() {

    let self = {};

    self.setTag = function(tagName){
        TAG = tagName;
    };

	/**
	 * runBasicConfig
	 * Creates from minimal configObject a normal configuration to be run by Deployer
	 * Needs source folder to be specified and targetFolder is taken from process.cwd();
	 *
	 * @param sourceFolder
	 * @param configFileOrObject
	 * @param callback
	 */
    self.runBasicConfig = function(sourceFolder, configFileOrObject, callback){
		__minimalDepsConversion(configFileOrObject, function(err, deps){
        	let config = {
				"workDir": sourceFolder || "." ,
				"dependencies": deps
        	};
			self.run(config, callback);
        });
    };

    function __minimalDepsConversion(configFileOrObject, callback){

		function createCopyDep(type, dependecyName){
			let sourceFolder = path.join(type, dependecyName);
			let targetFolder = path.join(process.cwd(), type, dependecyName);

			return {
				"name": dependecyName,
				"actions": [
					{
						"type": "remove",
						"target": targetFolder
					},
					{
						"type": "copy",
						"src": sourceFolder,
						"target": targetFolder,
						"options": {
							"overwrite": true
						}
					}
				]
			};
		}


		let config = __basicConfigTest(configFileOrObject);
		let newConfig = [];
		let err;
		if(config){
			function iterateOverDeps(type){
			    if(Array.isArray(config[type])) {
                    for(let i=0; i < config[type].length; i++){
                        newConfig.push(createCopyDep(type, config[type][i]));
                    }
                }
			}

			iterateOverDeps("modules");
			iterateOverDeps("libraries");
        }
		callback(err, newConfig);
	}

    /**
     * run
     *
     * @param configFileOrObject
     * @param callback
     */
    self.run = function (configFileOrObject, configTarget, callback) {
    	if(typeof configTarget === "function"){
    		callback = configTarget;
    		configTarget = "dependencies";
		}

        if (typeof callback !== "function") {
            throw "Callback provided is not a function!";
        }

        this.callback = callback;
        try {
            __init(configFileOrObject, configTarget);
            console.info(TAG, `Start checking ${configTarget}...`);
            console.info(TAG, `Found ${self.tasks.length} ${configTarget}...`);
            if (self.tasks.length > 0) {
                __runDependency(0);
            } else {
                let response = `No ${configFileOrObject} to process!`;
                if (self.callback) {
                    self.callback(null, response);
                }
            }
        } catch (error) {
            if (self.callback){
                self.callback(error, null);
            }
        }
    };

    function __init(configFileOrObject, depsType) {
        self.actionsRegistry = actionsRegistry.getRegistry();
        self.configJson = {};
        self.tasks = [];

        let config = __checkConfig(configFileOrObject, depsType);
        if (config) {
            self.configJson = config;
            self.tasks = config[depsType];
        }

        if (self.configJson.workDir) {
            self.actionsRegistry.setWorkDir(self.configJson.workDir);
        }
    }


	function __basicConfigTest(configFileOrObject){
		if (!configFileOrObject) {
			throw "Config file path or config object not provided!";
		}

		let config = {};
		switch (typeof configFileOrObject){
            case "object":
                config = configFileOrObject;
                break;
            case "string":
                config = __readConfig(configFileOrObject);
                break;
            default:
                throw "Wrong type of config provided!";
		}

		return config;
	}

    /**
     *__checkConfig
     *    CheckConfig takes {Object/File path}configFileOrObject as a parameter ,if it
     *    is a file it reads the .JSON file, creates and validates an Object containing an Array of dependencies.
     *    Object.dependencies should be an Array anything else is rejected
     *
     * @param {Object|File}configFileOrObject
     * @returns {{}} config
     *@private__checkConfig
     */
    function __checkConfig(configFileOrObject, targetConfig) {

        let config = __basicConfigTest(configFileOrObject);
		let tasks = config[targetConfig];
        if (typeof tasks === "undefined") {
            throw `No tasks found! [${targetConfig}]`;
        }

        if (!Array.isArray(tasks)) {
            throw `${targetConfig} prop is not Array!`;
        }

        for (let i = 0, len = tasks.length; i < len; i++) {
            let dep = tasks[i];
            if (!dep.actions || !Array.isArray(dep.actions) || dep.actions.length === 0) {
				require("./lib/utils/ConfigurationDefaults").setDefaultActions(dep);
            }
        }
        return config;
    }

    /**
     *  __readConfig
     *  ReadConfig function that takes a .JSON file path, creates and  returns an Object.
     *
     * @param {File path}configFilePath
     * @returns {*}
     *@private __readConfig
     */
    function __readConfig(configFilePath) {
        return require(configFilePath);
    }

    /**
     *__runDependency
     *
     * RunDependency checks if all the dependencies have been deployed, if not it deploys the next dependency
	 * @param {String} type
     * @param {Number}index
     *@private __runDependency
     */
    function __runDependency(index) {

        // done with all dependencies
        if (index >= self.tasks.length) {
            let response = `Finishing checking tasks...`;
            if (self.callback) {
                self.callback(null, response);
            }
            return;
        }

        // deploying dependency
        let dep = self.tasks[index];
        console.info(TAG, `Running tasks for: [${index}] ${dep.name}`);
        __runAction(index, 0);
    }

    /**
     * __runAction
     *
	 * @param {String} depType
     * @param {Number}depIndex
     * @param {Number}actionIndex
     * @private__runAction
     */
    function __runAction(depIndex, actionIndex) {

        //let self = this;

        function next(error, result) {
            if (error) {
                if (self.callback) {
                    self.callback(error, null);
                    return;
                }
            } else {
                if (result) {
                    console.log("taskIndex:", depIndex, "actionIndex:", actionIndex, "result:", JSON.stringify(result));
                }
                actionIndex++;
                if (actionIndex < dep.actions.length) {
                    __runAction(depIndex, actionIndex);
                } else {
                    if (depIndex < self.tasks.length) {
                        __runDependency(++depIndex);
                    }
                }
            }
        }

        let dep = self.tasks[depIndex];
        let action = dep.actions[actionIndex];
        let actionName = typeof action === "object" ? action.type : action;
        let handler = self.actionsRegistry.getActionHandler(actionName, true);

        if (handler) {
            handler(action, dep, next);
        } else {
            next("No handler");
        }
    }

    return self;
}

module.exports = new Runner();