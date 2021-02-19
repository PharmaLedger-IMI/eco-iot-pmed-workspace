const child_process = require('child_process');
const os = require("os");
const fs = require("fs");
const path = require("path");
const urlUtil = require('url');
const http = require('http');
const https = require('https');

const fsExt = require('./lib/utils/FSExtension').fsExt;

const changeSet = "latest-change-set.txt";
const mergeChangeSet = "Merge";
const changeSetDefaultSize = 3;

/**
 * Contains default actions
 * @constructor
 */
function ActionsRegistry() {
    let actions = {};

    // default actions
    /**
     *install
     *Install function that installs a dependency from a source(npm or URL package)
     *
     * @param {String} action
     * @param {Object} dependency: has attributes: src that can be either npm or a Git Repository, name of the package,
     * and workDir (optional) where the package will be installed
     * @param {Function} callback
     */
    actions.install = function (action, dependency, callback) {
        if (!dependency || !dependency.src) {
            throw  "No source (src) attribute found on: " + JSON.stringify(dependency);
        }

        let target = dependency.src;
        let src = dependency.src.toLowerCase();
        if (src.indexOf("npm") === 0) {
            target = dependency.name;
        }

        let commandOpts = {stdio: [0, "pipe", "pipe"]};
        if (dependency.workDir) {
            commandOpts.cwd = dependency.workDir;
        }

        let cmd = "npm install " + target + " --no-save --no-package-lock --only=prod";
        console.log(cmd);
        let error = null;
        let response = `Finished install action on dependency ${dependency.name}`;
        try {
            child_process.execSync(cmd, commandOpts);
        } catch (e) {
            error = e;
            response = null
        }

        callback(error, response);
    };

    /**
     *download
     *Download function, downloads from a source dependency.src to a target action.target
     * @param {Object}action
     * @param {Object}dependency
     * @param {Function}callback
     */
    actions.download = function (action, dependency, callback) {

        if (!dependency || !dependency.src) {
            throw "No source (src) attribute found on: " + JSON.stringify(action);
        }

        if (!action || !action.target) {
            throw  "No target attribute found on: " + JSON.stringify(action);
        }

        let src = dependency.src;
        let target = fsExt.resolvePath(path.join(action.target, dependency.name));
        fsExt.createDir(action.target);

        console.info(`Start downloading ${src} to folder ${target}`);
        _downloadAsync(src, target, callback);
    };

    let _downloadAsync = function (url, dest, callback) {

        performRequest(url, dest, callback);

        function performRequest(url, dest, callback) {
            let maxNumRedirects = 5;

            function doRequest(url, callback, redirectCount) {
                if (redirectCount > maxNumRedirects) {
                    throw "Max number of redirects for URL: " + url + " has reached!"
                }

                let protocol = resolveProtocol(url);
                if (typeof protocol === "string" || protocol == null) {
                    throw "URL Protocol " + protocol + " not supported! Supported protocols are http and https!"
                }

                protocol.get(url, function (res) {
                    // check for redirect
                    if (res.statusCode > 300 && res.statusCode < 400 && res.headers.location) {
                        // The location for some (most) redirects will only contain the path, not the hostname;
                        // detect this and add the host to the path.
                        if (urlUtil.parse(res.headers.location).hostname) {
                            console.log(`Redirect(${res.statusCode}): from ${url} to ${res.headers.location}`);
                            doRequest(res.headers.location, callback, redirectCount + 1)
                        } else {
                            // Hostname not included; get host from requested URL (url.parse()) and prepend to location.
                            res.headers.location = urlUtil.parse(url).hostname

                            console.log(`Scenario not tested: ${res.headers.location}`);
                        }

                    } else {
                        // no redirect; capture the response as normal and invoke the success callback
                        let file = fs.createWriteStream(dest);
                        res.pipe(file);
                        file.on('finish', function () {
                            file.close(callback);  // async
                        }).on('error', function (error) {
                            fs.unlink(dest, callback); // async
                        });
                    }
                }).on('error', function (error) {
                    callback(error, null);
                });
            }

            doRequest(url, callback, 0);
        }

        function resolveProtocol(url) {
            const parsedUrl = urlUtil.parse(url);
            switch (parsedUrl.protocol) {
                case "http:":
                    return http;
                case "https:":
                    return https;
                default:
                    console.log(parsedUrl.protocol + " not supported!")
                    return parsedUrl.protocol;
            }
        }
    };

    /**
     * move
     * Moves file or directory from actions.src to action.target
     * @param {Object}action. The available options are:
     * - overwrite <boolean>: overwrite existing file or directory, default is false. Note that the move operation will silently fail if you set this to true and the destination exists.
     * @param {Object}dependency
     * @param {Function}callback
     */
    actions.move = function (action, dependency, callback) {
        if (!action.src) {
            throw "No source (src) attribute found on: " + JSON.stringify(action);
        }

        let target = os.tmpdir();
        if (action.target) {
            target = action.target;
        }

        let options = action.options || {};
        options.overwrite = options.overwrite ? options.overwrite : false;

        console.log(`Start moving ${action.src} to ${target}`);
        fsExt.move(action.src, target, options, callback);
    };

    /**
     * mkdir
     * @param {Object}action.
     * @param {Object}dependency
     * @param {Function}callback
     */
    actions.mkdir = function (action, dependency, callback) {
        if (!action.target) {
            throw "No target attribute found on: " + JSON.stringify(action);
        }

        let target = fsExt.resolvePath(action.target);
        try{
            fsExt.createDir(target);
        }catch(err){
            return callback(err);
        }

        callback(undefined, `Finished folder "${action.target}" creation`);
    };

    /**
     *clone
     * Clone function used to make a git clone of repo dependency.src in a specific location action.target
     * Optional clone options can be specified in {Object}action.options
     * Optional credentials: username and password can be specified in {Object}dependency.credentials
     * @param {Object}action
     * @param {Object}dependency
     * @param {Function}callback
     */
    actions.clone = function (action, dependency, callback) {
        if (!dependency || !dependency.src) {
            throw "No source (src) attribute found on: " + JSON.stringify(dependency);
        }

        let target = os.tmpdir();
        if (action.target) {
            target = fsExt.resolvePath(path.join(action.target, dependency.name));
        }

        // the target if exists, should be empty
        if (fs.existsSync(target) && fs.readdirSync(target).length > 0) {
            throw `Destination path (target) ${target} already exists and is not an empty directory.`;
        }

        let options = {
            "depth": "1",
            "branch": "master"
        };
        if (typeof action.options === "object") {
            options = action.options;
        }

        if(typeof action.collectLog !== "undefined"){
            global.collectLog = action.collectLog;
        }else{
            global.collectLog = true;
        }

        _clone(dependency.src, target, options, dependency.credentials, function (err, res) {
            if (!err) {
                callback(err, `Finished clone action on dependency "${dependency.name}"`);
            } else {
                callback(err);
            }
        });
    };

    actions.smartClone = function (action, dependency, callback) {
        if (!dependency || !dependency.src) {
            throw "No source (src) attribute found on: " + JSON.stringify(dependency);
        }

        let target = os.tmpdir();
        if (action.target) {
            target = fsExt.resolvePath(path.join(action.target, dependency.name));
        }

        // the target if exists and it's a git repo we try update
        if (fs.existsSync(target) && fs.readdirSync(target).length > 0 && fs.existsSync(path.join(target, ".git"))) {

            basicProcOptions = {cwd: path.resolve(target), stdio: [0, "pipe", "pipe"]};

            child_process.exec("git remote -v", basicProcOptions, function (err, stdout, stderr) {
                let next = true;
                if (err) {
                    console.log(err);
                } else {
                    let originFetchRegex = new RegExp('^[origin]*\\s*' + dependency.src + '[.git]*\\s*\\(fetch\\)', 'g');
                    let matchedArr = stdout.match(originFetchRegex)
                    if (!matchedArr) {
                        throw new Error(`Different remotes found on repo ${target}`);
                    }

                    try {
                        //A. Stash it
                        try {
                            child_process.execSync("git stash", basicProcOptions);
                        } catch (err) {
                            console.log(err);
                        }

                        //B. Pull
                        if(typeof action.commit !== "undefined"){ //We have a commit no
                            /**
                             * The pull is nothing that a fetch + checkout
                            */

                            //1 - Fetch
                            let remote = dependency.src;
                            let commitNo = action.commit;
                            //let repoName = dependency.name;

                            let cmdFetch = 'git fetch ' + remote + ' --depth=1 '+ commitNo;                            
                            try {
                                let fetchResultLog = child_process.execSync(cmdFetch, {cwd: path.resolve(target)} /*basicProcOptions*/).toString();                                
                                console.log("Result of fetching of version", changeSet, fetchResultLog);
                            } catch (err) {
                                console.log(err);
                            }

                            //2 - Checkout
                            let cmdCheckout = 'git checkout ' + commitNo;                            
                            try {
                                let checkoutResultLog = child_process.execSync(cmdCheckout, {cwd: path.resolve(target)} /*, basicProcOptions*/).toString();                                
                                console.log("Result of checkout of version", changeSet, checkoutResultLog);
                            } catch (err) {
                                console.log(err);
                            }
                        }
                        else{ //no commit no => classic pull
                            let pullResult = child_process.execSync("git pull", basicProcOptions);
                            pullResult = pullResult.toString();
                            if (pullResult.indexOf("Already up-to-date") === -1) {
                                try {
                                    //console.log("pullResult", pullResult.indexOf("Already up-to-date"));
                                    let log = child_process.execSync("git log --max-count=1", basicProcOptions).toString().split("\n").slice(4).join("\n");
                                    fs.appendFileSync(changeSet, log);
                                } catch (err) {
                                    console.log(err);
                                }
                            }
                        }

                        //C. Apply stash
                        let finalResult = child_process.execSync("git stash apply", basicProcOptions);
                        if (finalResult.indexOf("Unmerged") !== -1) {
                            callback(new Error(`Repo ${target} needs attention! (Merging issues)`), `Finished update action on dependency ${dependency.name}`)
                        }
                    } catch (err) {
                        if (err.message.indexOf("No stash") !== -1) {
                            //ignore
                        } else {
                            console.log("\n\ngit pull process failed! Usualy there is a merge issue. Please resolve conflicts and try again.\n\n");
                            callback(err);
                            return;
                        }
                    }
                    callback(err, `Finished update action on dependency ${dependency.name}`);
                }
            });
            //throw `Destination path (target) ${target} already exists and is not an empty directory.`;
        } else {

            let options = {
                "depth": "1",
                "branch": "master"
            };
            if (typeof action.options === "object") {
                options = action.options;
            }

            if(typeof action.collectLog !== "undefined"){
                global.collectLog = action.collectLog;
            }else{
                global.collectLog = true;
            }

            if(typeof action.commit !== "undefined"){
                //Do a shallow clone (for a specific commit)
                options['commitNo'] = action.commit
                
                _shallow_clone(dependency.src, target, options, dependency.credentials, function (err, res) {
                    let msg;
                    if (!err) {
                        msg = `Finished shallow clone action on dependency ${dependency.name}`;
                    }
                    callback(err, msg);
                });
            }
            else{
                //Do a normal clone
                _clone(dependency.src, target, options, dependency.credentials, function (err, res) {
                    let msg;
                    if (!err) {
                        msg = `Finished clone action on dependency ${dependency.name}`;
                    }
                    callback(err, msg);
                });
            }
        }
    };

    let _clone = function (remote, tmp, options, credentials, callback) {
        let commandExists = _commandExistsSync("git");
        if (!commandExists) {
            throw "git command does not exist! Please install git and run again the program!"
        }

        let optionsCmd = "";
        for (let op in options) {
            optionsCmd += " --" + op + "=" + options[op];
        }

        remote = _parseRemoteHttpUrl(remote, credentials);

        let cmd = "git clone" + optionsCmd + " " + remote + " \"" + tmp + "\"";

        console.log(`Running command ${cmd}`);

        let errorHandlers = {
            "warning: You appear to have cloned an empty repository": function () {
                console.log("Empty repo. Nothing to worry. Continue...");
                return true;
            }
        };

        child_process.exec(cmd, {stdio: [0, "pipe", "pipe"]}, function (err, stdout, stderr) {
            let next = true;
            let handled = false;
            if (err) {
                for (let prop in errorHandlers) {
                    if (stdout && stdout.indexOf(prop) !== -1 || stderr && stderr.indexOf(prop) !== -1) {
                        next = errorHandlers[prop]();
                        if (!next) {
                            handled = true;
                            callback(err, "");
                            break;
                        }
                    }
                }
                if (!handled) {
                    callback(err);
                    return;
                }
            }
            if (next && global.collectLog) {
                cmd = "git log --max-count=1";

                child_process.exec(cmd, {
                    cwd: path.resolve(tmp),
                    stdio: [0, "pipe", "pipe"]
                }, function (err, stdout, stderr) {
                    if (!err) {
                        let index = stdout.indexOf("\n\n");
                        if (index !== -1) {
                            index += 2;
                        }
                        msg = stdout.substring(index);

                        if (msg.indexOf("#") === -1) {
                            fs.appendFileSync(changeSet, msg);
                        }
                    }

                    callback(null, "");
                });
            } else {
                callback(null, "");
            }
        });
    };

    
    let _shallow_clone = function (remote, tmpFolder, options, credentials, callback) {
        let commandExists = _commandExistsSync("git");
        if (!commandExists) {
            throw "git command does not exist! Please install git and run again the program!"
        }

        //TODO: assert commitNo is inside the options
        let commitNo = options['commitNo'];

        let optionsCmd = "";
        for (let op in options) {
            if (op == 'commit') continue;
            optionsCmd += " --" + op + "=" + options[op];
        }
        
        optionsCmd += commitNo;

        remote = _parseRemoteHttpUrl(remote, credentials);


        //1 Make folder and go inside it
        fs.mkdir(tmpFolder, {recursive : true}, (err) => {
            if(err) throw err;

            try{

                //2 Init repo
                let cmdInit = `cd ${tmpFolder} && git init`;
                console.log(cmdInit);                
                try{
                    child_process.execSync(cmdInit);
                } catch(err){
                    console.log(err);
                }
                

                //2.1 Add remote repo
                let cmdAddRemote = `cd ${tmpFolder} && git remote add origin ${remote}`;
                console.log(cmdAddRemote);
                try{
                    child_process.execSync(cmdAddRemote);
                } catch(err){
                    console.log(err);
                }

                //3 Fetch repo at certain commit no
                let cmdFetch = `cd ${tmpFolder} && git fetch ` + remote + ' --depth=1 '+ commitNo;
                console.log(cmdFetch);
                try{
                    child_process.execSync(cmdFetch);
                } catch(err){
                    console.log(err);
                }

                //4 Checkout commit number
                let cmdCheckout = `cd ${tmpFolder} && git checkout ` + commitNo;
                console.log(cmdCheckout);
                try{
                    child_process.execSync(cmdCheckout);
                } catch(err){
                    console.log(err);
                }

            } catch(ex){
                callback(ex);
            }
            callback();
        })        
    };

    let _parseRemoteHttpUrl = function (remote, credentials) {

        // if credentials are given, add them in the URL
        if (credentials && credentials.username && credentials.password) {

            const parsedUrl = urlUtil.parse(remote);
            if (parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") {

                // clean existing username, if any
                let currentUsername = "";
                let endOfUsername = remote.indexOf("@");

                if (endOfUsername !== -1) {
                    currentUsername = remote.slice(parsedUrl.protocol.length + 2, endOfUsername + 1); // + 2 for // and + 1 for @
                }

                let encodedUsername = encodeURIComponent(credentials.username);
                let encodedPassword = encodeURIComponent(credentials.password);

                let urlCredentials = `${parsedUrl.protocol}//${encodedUsername}:${encodedPassword}@`;
                remote = remote.replace(`${parsedUrl.protocol}//${currentUsername}`, urlCredentials);
            }
        }

        return remote;
    };

    /**
     * commit
     * Commit function used to make a git add -A, commit and push into a repo dependency.src in a specific location action.target
     * Optional clone options can be specified in {Object}action.options
     * Optional credentials: username and password can be specified in {Object}dependency.credentials
     * @param {Object}action
     * @param {Object}dependency
     * @param {Function}callback
     */
    actions.commit = function (action, dependency, callback) {
        if (!dependency || !dependency.src) {
            throw "No source (src) attribute found on: " + JSON.stringify(dependency);
        }

        if (!action || !action.target) {
            throw "No target attribute found on: " + JSON.stringify(action);
        }

        if (!action.message) {
            try {
                action.message = fs.readFileSync(changeSet, 'utf8');
                if ((action.message.match(new RegExp("\n", "g")) || []).length > changeSetDefaultSize) {
                    action.message = mergeChangeSet;
                }
            } catch (err) {
                action.message = mergeChangeSet;
            } finally {
                fs.unlink(changeSet, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        }

        let commandExists = _commandExistsSync("git");
        if (!commandExists) {
            throw "git command does not exist! Please install git and run again the program!"
        }

        _commit(dependency.src, action.target, action.message, dependency.credentials, action.options ? action.options.branch : undefined, callback);
    };

    let _commit = function (remote, workDir, message, credentials, branch, callback) {

        let errorHandlers = {
            "nothing to commit, working directory clean": function () {
                console.log("Nothing to commit.");
                return false;
            },
            "push.default is unset": function () {
                console.log("You can define options.branch in order to fix this");
                return true;
            }
        };

        remote = _parseRemoteHttpUrl(remote, credentials);

        let commands = [];

        if (credentials) {
            let username = credentials.username || "unassigned";
            let email = credentials.email || "unassigned";

            commands.push("git config user.username " + username);
            commands.push("git config user.email " + email);
        }

        commands.push("git status");
        commands.push("git add .");
        commands.push(`git commit -m "${message}"`);
        if (!branch) {
            commands.push("git push");
        } else {
            commands.push(`git push origin ${branch}`);
        }

        function executeCommand(cmd) {
            child_process.exec(cmd, {
                cwd: path.resolve(workDir),
                stdio: [0, "pipe", "pipe"]
            }, function (err, stdout, stderr) {
                let next = true;
                if (err) {
                    console.log("Commit command encountered next error", err);
                }
                for (let prop in errorHandlers) {
                    if (stdout && stdout.indexOf(prop) !== -1 || stderr && stderr.indexOf(prop) !== -1) {
                        next = errorHandlers[prop]();
                    }
                }
                if (next) {
                    execute();
                } else {
                    callback(err);
                }
            });
        }

        function execute() {
            if (commands.length > 0) {
                executeCommand(commands.shift());
            } else {
                callback(null, "Commit done.");
            }
        }

        execute();

    };

    let _commandExistsSync = function (commandName) {
        let isWin = (os.platform() === 'win32');

        try {
            let cmd = isWin ?
                'where.exe ' + commandName
                :
                'command -v ' + commandName + ' 2>/dev/null && { echo >&1 \'' + commandName + ' found\'; exit 0; }';

            let stdout = child_process.execSync(cmd);

            return !!stdout;
        } catch (error) {
            return false;
        }
    };

    /**
     * copy
     * Copy a file or a directory, from{String}dependency.src to {String}action.target
     * NOTE: If src is a directory it will copy everything inside of the directory, not the entire directory itself.
     * NOTE: If src is a file, target cannot be a directory.
     * @param {Object} action. The available options are:
     * - overwrite <boolean>: overwrite existing file or directory, default is true. Note that the copy operation will silently fail if you set this to false and the destination exists.
     * @param {Object} dependency.
     * @param {Function}callback
     */
    actions.copy = function (action, dependency, callback) {
        let src = action.src || dependency.src;
        if (!src) {
            throw "No source (src) attribute found on: " + JSON.stringify(dependency);
        }

        if (!action.target) {
            throw "No target attribute found on: " + JSON.stringify(action);
        }

        let options = action.options || {};
        options.overwrite = !!options.overwrite;

        console.log("Start copying " + src + " to folder " + action.target);
        fsExt.copy(src, action.target, options, callback);
    };

    /**
     *remove
     * Remove, remove a file/directory from  a specified path {String}action.target;
     * @param {Object}action
     * @param {Object}dependency
     * @param {Function}callback
     */
    actions.remove = function (action, dependency, callback) {
        if (!action.target) {
            throw "No target attribute found on: " + JSON.stringify(action);
        }

        fsExt.remove(action.target, callback);
    };

    /**
     *extract
     * Extracts a .zip file from a source path {String}action.src to a specific path {String}action.target
     * @param {Object}action
     * @param {Object}dependency
     * @param {Function}callback
     */
    actions.extract = function (action, dependency, callback) {
        if (!action.src || !action.target) {
            throw "No source (src) or target attribute found on: " + JSON.stringify(action);
        }

        let src = fsExt.resolvePath(action.src);
        let target = fsExt.resolvePath(action.target);

        console.info(`Start extracting ${src} to folder ${target}`);
        _extractSync(src, target);
        callback(null, `Finished extract action on dependency ${dependency.name}`);
    };

    let _extractSync = function (src, dest) {
        if (!fs.existsSync(src)) {
            throw `Archive ${src} does not exist!`;
        }

        let isWin = (os.platform() === 'win32');
        let cmdName = isWin ? "powershell" : "unzip";

        let commandExists = _commandExistsSync(cmdName);
        if (!commandExists) {
            throw `Command ${cmdName} does not exist! Please install it, before running again!`;
        }

        let cmd = "";
        if (os.platform() === 'win32') {
            cmd = `${cmdName} Expand-Archive -Path ${src} -DestinationPath ${dest}`;
        } else {
            cmd = `${cmdName} ${src} -d ${dest}`;
        }

        child_process.execSync(cmd);
    };

    /**
     *checksum
     * Checksum, used to calculate the checksum of a specific file/Dir {String}action.src and compare the result with
     * a pre-recorded attribute action.expectedChecksum
     * The checksum can be calculated with specific options {String}action.algorithm, {String}action.encoding
     *
     * @param {Object}action
     * @param {OBject}dependency
     * @param {Function}callback
     */
    actions.checksum = function (action, dependency, callback) {
        if (!action.src) {
            throw "No source (src) attribute found on: " + JSON.stringify(action);
        }

        if (!action.expectedChecksum) {
            throw "No expectedChecksum attribute found on: " + JSON.stringify(action);
        }

        let src = fsExt.resolvePath(action.src);

        let checksum = fsExt.checksum(src, action.algorithm, action.encoding);
        if (checksum !== action.expectedChecksum) {
            throw `Calculated checksum for ${src} was ${checksum} and it was expected ${action.expectedChecksum}`;
        }

        callback(null, `Finished checksum action on dependency ${dependency.name}`);
    };

	actions.execute = function (action, dependency, callback) {
		if (!action.cmd) {
			throw "No command given";
		}
		
		if (!action.os || (action.os && action.os == os.platform()) ){
				
			let child;
			try {
				console.log("Running command:", action.cmd);
				if (typeof action.options !== "undefined") {
					console.log("with opts:", action.options);
				}
				//child_process.execSync(action.cmd, action.options);
				const options = {
					stdio: "inherit",
					shell: true
				};
				Object.assign(options, action.options);
				child = child_process.spawnSync(action.cmd, action.args, options);
			} catch (err) {
				if (callback) {
					callback(err);
				}
			}
        } else {
            console.log("Skipping command [" + action.cmd +  "] because was not meant for your curent OS.")
        }

	/*	let err;
		if (child.status !== 0) {
			err = new Error(`Command finished with exit code ${child.status}. Hint: inspect command configuration, environment variables etc. and try again.`);
		}*/
		if (callback) {
			callback();
		} /*else {
			throw err;
		}*/
	};

    actions.executeAsync = function (action, dependency, callback) {
        if (!action.cmd) {
            throw "No command given";
        }
        console.log("Running command:", action.cmd, "with opts:", action.options);
		if (!action.os || (action.os && action.os == os.platform()) ){
			child_process.exec(action.cmd, action.options, function(err, stdout, stderr){
				if(err){
					return callback(err);
				}
				console.log(stdout);
				console.log(stderr);
				callback(undefined, `Execute command finished.`);

			});
		} else {
            console.log("Skipping command [" + action.cmd +  "] because was not meant for your curent OS.")

			if (callback) {
				callback();
			}
		}
		
    };

    this.registerActionHandler = function (name, handler, overwrite) {
        if (!name) {
            throw "No action name provided!";
        }

        if (!handler) {
            throw "Trying to register an action without any handler!";
        }

        if (actions[name]) {
            if (overwrite) {
                actions[name] = handler;
                console.log("Action " + name + " was overwritten.");
            }
        } else {
            actions[name] = handler;
            console.log("Action " + name + " was registered.");
        }
    };

    this.getActionHandler = function (name, logIfMissing) {
        if (!name) {
            throw "No action name provided!";
        }

        if (logIfMissing && !actions[name]) {
            throw "No handler found for action: " + name;
        }


        // for sync calls/checks, the exceptions by can be caught here
        // for async calls, the callback(error, response) should be used instead
        function wrapper(action, dependency, callback) {
            try {
                actions[name](action, dependency, callback);
            } catch (error) {
                callback(error, null);
            }
        }

        return wrapper;
    };

    this.setWorkDir = function (wd) {
        fsExt.setBasePath(wd);
    }

}

let defaultActionsRegistry = new ActionsRegistry();

exports.getRegistry = function () {
    return defaultActionsRegistry;
};