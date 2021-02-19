const args = process.argv;
const TYPE_ARGUMENT = "--type=";
const taskList = "build";
args.splice(0, 2);

let bindType = "app";
if (typeof args[0] !== "undefined" && args[0].indexOf(TYPE_ARGUMENT) !== -1) {
	bindType = args.splice(0, 1);
	bindType = bindType[0].replace(TYPE_ARGUMENT, "");
}

const octopus = require("./index.js");
//const installConfig = octopus.readConfig();
//octopus.changeConfigFile("./bind_octopus.json");
if (args.length !== 2) {
	octopus.handleError("Expected to receive 2 params: <solutionName> and <targetName>.");
}

const solutionName = args[0];
const targetName = args[1];

const config = octopus.readConfig(true);

function buildIdentifier() {
	return `${solutionName}_bind_to_${targetName}`;
}

let loaderConfigIndex;
let walletConfigIndex;
let binDep;
for (let i = 0; i < config.dependencies.length; i++) {
	let dep = config.dependencies[i];
	if (dep.name === solutionName) {
		loaderConfigIndex = i;
	}

	if (dep.name === targetName) {
		walletConfigIndex = i;
	}
}

if(typeof config[taskList] === "undefined"){
	config[taskList] = [];
}

for (let i = 0; i < config[taskList].length; i++) {
	let dep = config[taskList][i];
	if (dep.name === buildIdentifier()) {
		binDep = dep;
		break;
	}
}

/*for now this check should be disabled
if (typeof loaderConfigIndex === "undefined") {
	octopus.handleError(`Unable to find a solution config called "${solutionName}"`)
}*/

/*for now this check should be disabled
if (typeof walletConfigIndex === "undefined") {
	octopus.handleError(`Unable to find a wallet/app config called "${targetName}"`)
}*/

if (typeof binDep === "undefined") {
	binDep = {
		"name": buildIdentifier(),
		"src": "",
		"actions":[
			{
				"type": "execute",
				"cmd": `cd ${targetName} && npm run build`
			}
		]
	};

	switch (bindType) {
		case "wallet":
			require("./bindWallet").populateActions(binDep.actions, solutionName, targetName);
			break;
		case "app":
			require("./bindApp").populateActions(binDep.actions, solutionName, targetName);
			break;
		default:
			throw new Error("Unrecognized type");
	}

	config[taskList].push(binDep);
}

octopus.runConfig(octopus.createBasicConfig(binDep), function (err) {
	if (err) {
		throw err;
	}
	octopus.updateConfig(config, function (err) {
		if (err) {
			throw err;
		}
		console.log("Bind successful and config updated!");
	});
});
