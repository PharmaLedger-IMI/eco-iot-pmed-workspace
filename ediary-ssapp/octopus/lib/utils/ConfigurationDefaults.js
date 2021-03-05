/**
 * setDefaultActions
 *    Set default actions for deps/tasks that don't have any action set
 *
 * @param {Object}dep
 * @returns
 */
function setDefaultActions(dep){
	const action = {
		"type": "smartClone",
		"target": "modules"
	};
	const defaultActions = [action];
	console.log(`Setting a default action "${action.type}" on "${dep.name}" task/dependency`);
	if(!dep.actions){
		dep.actions = defaultActions;
	}else{
		dep.actions.concat(defaultActions);
	}
}

module.exports = {
	setDefaultActions
}