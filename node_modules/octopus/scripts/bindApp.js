function populateActions(actions, solution, app) {
	let appNameWithoutPrototype = app.replace("-prototype", "");
	actions.push({
		"type": "copy",
		"src": `./${app}/seed`,
		"target": `./apihub-root/${solution}/apps-patch/${appNameWithoutPrototype}/seed`,
		"options": {
			overwrite: true
		}
	});
	actions.push({
		"type": "execute",
		"cmd": `echo Use this folder template in order to customize the application instance by adding configuration, pages etc. > ./apihub-root/${solution}/apps-patch/${appNameWithoutPrototype}/readme`
	});
}

module.exports = {populateActions};
