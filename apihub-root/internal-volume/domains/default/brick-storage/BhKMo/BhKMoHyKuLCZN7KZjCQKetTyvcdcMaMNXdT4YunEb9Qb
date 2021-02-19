import ModalController from "../../cardinal/controllers/base-controllers/ModalController.js";

export default class SignOutController extends ModalController {
    constructor(element, history) {
        super(element, history);

        this._initListeners();
    }

    _initListeners = () => {
        this.on("sign-out-confirm", this._confirmExitHandler);

        this.model.onChange(
            "checkboxDeleteSeed.value",
            this._checkboxDeleteSeedToggle
        );
    };

    _checkboxDeleteSeedToggle = () => {
        let isCheckboxChecked =
            this.model.getChainValue("checkboxDeleteSeed.value") === "checked";
        this.model.setChainValue("buttons.confirmButton.disabled", !isCheckboxChecked);
    };

    _confirmExitHandler = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        let deleteSeed = event.data === 'delete-seed';
        this.responseCallback(undefined, {
            deleteSeed: deleteSeed
        });
    };
}