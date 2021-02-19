/**
 * Called by npm (using the package.json configuration) from
 *  "freeze" hook
 * npm -> package.json -> [scripts]/freeze.js
 * */

const args = process.argv;
args.splice(0, 2);

const octopus = require("./index");
let targets = ["dependencies"];

if(args.length > 0){
    targets = args;
}

const path = require("path");
const fs = require("fs");
const child_process = require('child_process');

// Ensure that we are switched to DEV configuration
//Switch to stable octopus
octopus.setConfigFileToMode(true);

let notFoundFolders = [];

/**Performs a freeze on current configuration loaded from file (octopus.json or octopus-dev.json) */
function freezeConfig(config){

    function updateSmartCloneAction(task, action){
        /**
         * If the action has the commit no - ignore it
         * Else take current commit no (current head) from git
         */
        // if(typeof action.commit == "undefined"){
            let targetFolder = path.resolve(path.join(config.workDir, task.name));
            if (action.target) {
                targetFolder = path.resolve(path.join(action.target, task.name));
            }
            console.log(`Trying to locate target ${targetFolder} in order to save it's state.`);
            basicProcOptions = {cwd: targetFolder};

            if (fs.existsSync(targetFolder) && fs.readdirSync(targetFolder).length > 0 ) {
                //Get commit number
                try {
                    let out = child_process.execSync("git rev-parse HEAD", basicProcOptions).toString().trim();
                    if(out.length == 40){
                        action.commit = out;
                    }
                    console.log(`Saved the state of ${targetFolder} at revision ${out}`);
                } catch (err) {
                    octopus.handleError(`Not able to perform the saving state process for target ${targetFolder}. Reason:`, err);
                }
            }
            else{
                notFoundFolders.push(targetFolder);
            }
        // }
    }

    console.log(`The scanning process will be performed for the following task lists `, targets);
    targets.forEach(target=>{
        let tasks = config[target];
        if(typeof tasks === "undefined"){
            return octopus.handleError(`Unable to find the task list called <${target}> in current config.`);
        }
        for (let i=0; i<tasks.length; i++){
            let task = tasks[i];
            if(!task.actions || !Array.isArray(task.actions) || task.actions.length === 0){
                require("./../lib/utils/ConfigurationDefaults").setDefaultActions(task);
            }
            for(let j=0; j<task.actions.length; j++){
                let action = task.actions[j];
                if(action.type == 'smartClone'){
                    updateSmartCloneAction(task, action);
                }
            }
        }
    });
}

let config =  octopus.readConfig();
freezeConfig(config);

if(notFoundFolders.length > 0){
    console.log(`\n===============\nOctopus was not able to locate the following paths:\n`);
    notFoundFolders.forEach( folder => console.log(folder));
    console.log(`\nIf neccessary, check the situations and run again the script.\n===============`);
}

//Switch to stable octopus
octopus.setConfigFileToMode(false);

//Save it
octopus.updateConfig(config, (err) => {
    if(err){
        throw err;
    }

    console.log("Configuration file  " + octopus.getConfigFile() +  " updated.");
});

