const octopus = require("./index");
const args = process.argv;
args.splice(0, 2);

let oldUrl;
let newUrl;
let tasksListSelector;
if (args.length < 2 || args.length >3) {
	octopus.handleError("Expected to receive at least 2 params: <oldUrl> and <newUrl>. Optional: third argument can be <taskListName> in which to restric the search.");
}

oldUrl = args[0];
newUrl = args[1];
if(args.length === 3){
	tasksListSelector = args[2];
}

console.log(oldUrl, newUrl);

let config = octopus.readConfig();
let configRoot = config;
if(typeof tasksListSelector!== "undefined"){
	configRoot = config[tasksListSelector];
}

let atLeastOneReplace = false;
function recursiveUpdate(root, search, replace){
	for(let prop in root){
		switch(typeof root[prop]){
			case "undefined":
				continue;
			case "object":
				recursiveUpdate(root[prop], search, replace);
				break;
			case "string":
				if(root[prop]===search){
					root[prop] = replace;
					atLeastOneReplace = true;
				}
				break;
			default:
				console.log("Ignoring")
				//for other types we don't need to do anything...
		}
	}
}

recursiveUpdate(configRoot, oldUrl, newUrl);
if(!atLeastOneReplace){
	octopus.handleError(`Not able to find any match for <${oldUrl}> in order to update. `);
}

console.log(`Finish replacing <${oldUrl}> with <${newUrl}>.`);

octopus.runConfig(configRoot, tasksListSelector, function (err, res) {
	if (err) {
		throw err;
	}
	console.log(`Finish running the updated config.`);
	octopus.updateConfig(config, function(err, res) {
		if (err) {
			throw err;
		}
		console.log(`Config updated`);
	});
});