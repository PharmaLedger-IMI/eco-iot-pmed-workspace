import LoaderCommunication from "./LoaderCommunication.js";
class AccountService {

	signOut(preferences) {
		LoaderCommunication.sendMessage({status:"sign-out", deleteSeed:preferences.deleteSeed});
	}
}

let accountService = new AccountService();
let getAccountServiceInstance = function () {
	return accountService;
};

export {
	getAccountServiceInstance
};
