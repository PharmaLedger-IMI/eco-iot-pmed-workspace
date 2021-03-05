const args = process.argv;
args.splice(0, 2);

const octopus = require("./index.js");
if (args.length < 2 || args.length > 3) {
	octopus.handleError("Expected to receive 2 params: folderName and gitUrl. Optional: <index> where to insert the deps");
}

const folderName = args[0];
const gitUrl = args[1];

let index;
if(args.length === 3){
	index = args[2];
}

const BASIC_CONFIG_ELEMENT = {
	"name": folderName,
	"src": gitUrl,
	"actions": [{
		"type": "smartClone",
		"target": ".",
		"collectLog": false
	}, {
		"type": "execute",
		"cmd": `cd ${folderName} && npm install`
	}]
};

const config = octopus.readConfig();

for (let i = 0; i < config.dependencies.length; i++) {
	let dep = config.dependencies[i];
	if (dep.name === folderName) {
		//console.log("Config found", dep);
		octopus.handleError(`There is a configuration for "${folderName}"`);
	}
}
if(typeof index !== "undefined"){
	config.dependencies.splice(index, 0, BASIC_CONFIG_ELEMENT);
}else{
	config.dependencies.push(BASIC_CONFIG_ELEMENT);
}

octopus.runConfig(octopus.createBasicConfig(BASIC_CONFIG_ELEMENT), function(err){
	if(err){
		throw err;
	}
	octopus.updateConfig(config, function (err) {
		if (err) {
			throw err;
		}
		console.log("Configuration updated!");
	});
});