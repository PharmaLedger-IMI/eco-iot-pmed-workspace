const args = process.argv;
args.splice(0, 2);

const octopus = require("./index.js");
if (args.length !== 1) {
	octopus.handleError(`Expected to receive one param: <name> of dependency that needs to be removed.`)
}

let depName = args[0];
const config = octopus.readConfig(true);

let found = false;
for (let i = 0; i < config.dependencies.length; i++) {
	let dep = config.dependencies[i];
	if (dep.name === depName) {
		found = true;
		config.dependencies.splice(i, 1);
		break;
	}
}
if(!found){
	octopus.handleError(`Dependency ${depName} was not found.`);
}

console.log(`Dependency <${depName}> was identified. Proceeding with the removal.`);

const removeDepConfig = {
	"name": "removeDep",
	"actions": [{
		"type": "remove",
		"target": depName
	}]
};

octopus.runConfig(octopus.createBasicConfig(removeDepConfig), function(err){
	if(err){
		throw err;
	}
	console.log(`Dependency <${depName}> removed.`);
	octopus.updateConfig(config, function (err) {
		if (err) {
			throw err;
		}
		console.log("Configuration updated!");
	});
});