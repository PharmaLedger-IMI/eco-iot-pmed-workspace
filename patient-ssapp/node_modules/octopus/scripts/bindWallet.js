function populateActions(actions, solution, walletName) {
	actions.push({
		"type": "copy",
		"src": `./${walletName}/seed`,
		"target": `./apihub-root/${solution}/wallet-patch/seed`,
		"options": {
			overwrite: true
		}
	});
}

module.exports = {populateActions};
