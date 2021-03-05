const path = require("path");
const developmentFileName = "./octopus.json";
const freezeFileName = "./octopus-freeze.json";

function createBasicConfig(...configParts) {
	return {"workDir": ".", "dependencies": [...configParts]};
}

function readConfig(disableInitialization) {
	let config;
	let configFileName = getConfigFile();
	try {
		console.log("Looking for configuration file at path", configFileName);
		config = require(configFileName);
	} catch (err) {
		if (err.code === "MODULE_NOT_FOUND") {
			console.log("Configuration file " + configFileName + " not found. Creating a new config object.");
			config = createBasicConfig();
			let privateSkyRepo;
			console.log("Looking for PRIVATESKY_REPO_NAME as env variable. It can be used to change what PrivateSky repo will be user: psk-release or privatesky.");
			if(typeof process.env.PRIVATESKY_REPO_NAME !== "undefined"){
				privateSkyRepo = process.env.PRIVATESKY_REPO_NAME;
			}else{
				privateSkyRepo = "privatesky";
			}

			if(!disableInitialization){
				// we need a default privatesky instance in order to have access to Brick Storage
				config.dependencies.push(
					{
						"name": "privatesky",
						"src": `http://github.com/privatesky/${privateSkyRepo}.git`,
						"actions": [
							{
								"type": "smartClone",								
								"target": ".",
								"collectLog": false
							},
							{
								"type": "execute",
								"cmd": `cd privatesky && npm install && npm run build`
							}
						]
					});
			}
		} else {
			throw err;
		}
	}
	return config;
}

let CONFIG_FILE_PATH;
function updateConfig(config, callback) {
	const fs = require("fs");
	try {
		fs.writeFile(CONFIG_FILE_PATH, JSON.stringify(config, null, 4), callback);
	} catch (e) {
		callback(e);
	}
}

function runConfig(config, tasksListSelector, callback) {
	if(typeof config === "function"){
		callback = config;
		tasksListSelector = undefined;
		config = readConfig();
	}

	if(typeof tasksListSelector === "function"){
		callback = tasksListSelector;
		tasksListSelector = undefined;
	}

	if(typeof config === "undefined"){
		config = readConfig();
	}

	if(typeof tasksListSelector === "undefined"){
		tasksListSelector = "dependencies";
	}

	const runner = require("../Runner");

	runner.run(config, tasksListSelector, callback);
}

function handleError(...args){
	const exitCode = 1;
	console.log(...args);
	console.log("Exit code:", exitCode);
	process.exit(exitCode);
}

function changeConfigFile(configFilePath){
	CONFIG_FILE_PATH = path.resolve(configFilePath);
}

function setConfigFileToMode(development){
	CONFIG_FILE_PATH = development ? developmentFileName : freezeFileName;
	CONFIG_FILE_PATH = path.resolve(CONFIG_FILE_PATH);
}

/**Returns current configuration file*/
function getConfigFile(){
	if(typeof CONFIG_FILE_PATH === "undefined"){
		setConfigFileToMode(isDevelopment());
	}
	return CONFIG_FILE_PATH;
}

//DEV flag is set inside the env.json file by [script]/setEnv.js file
function isDevelopment(){
	return process.env.DEV === "true";
}

module.exports = {
	createBasicConfig,
	readConfig,
	updateConfig,
	runConfig,
	handleError,
	changeConfigFile,
	setConfigFileToMode,
	getConfigFile,
	isDevelopment
};
