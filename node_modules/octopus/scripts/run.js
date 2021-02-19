/**Called by npm (using the package.json configuration) from
 *  "postinstall" hook - default (no parameters)
 * 	"build-all" hook (parameter: build)
 *  "server" hook (param start)
 *	etc,
 * */
const octopus = require("./index");
const args = process.argv;
args.splice(0, 2);

let tasksListSelector;
if (args.length >= 1) {
  tasksListSelector = args[0];
}

if (args.length === 2 && args[1] === "devmode"){
  process.env.DEV = true;
}

octopus.runConfig(octopus.readConfig(), tasksListSelector, function (err, res) {
  if (err) {
    throw err;
  }
  console.log(res);
});
