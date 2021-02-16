import ModalController from '../../cardinal/controllers/base-controllers/ModalController.js';

export default class ImportQRCodeController extends ModalController {
    constructor(element, history) {
        super(element, history);

        this.inputChangeHandler();
        this.importOnClick();
    }

    inputChangeHandler() {
        this.model.onChange("marketplaceSSI", () => {
            this.model.setChainValue('importIsDisabled', false);
        });
    }

    importOnClick() {
        this.on('import-on-click', this._handleImport);
    }

    _handleImport = (event) => {
        event.stopImmediatePropagation();

        if (!this._validateImportMarketplace()) {
            return;
        }

        const responseData = {
            marketplaceSSI: this.model.marketplaceSSI
        };

        this.responseCallback(undefined, responseData);
    };

    _validateImportMarketplace() {
        const hasSSI = this.model.marketplaceSSI.replace(/\s/g, "").length > 0;

        this.model.setChainValue('importIsDisabled', !hasSSI);
        return hasSSI;
    }
}
