import ModalController from "../../../cardinal/controllers/base-controllers/ModalController.js";
import FeedbackController from "../FeedbackController.js";
import {
    getDossierServiceInstance
} from "../../service/DossierExplorerService.js";
import Constants from "../Constants.js";

export default class ReceiveDossierController extends ModalController {
    constructor(element, history) {
        super(element, history);

        this.dossierService = getDossierServiceInstance();
        this.feedbackController = new FeedbackController(this.model);

        this._initListeners();
    }

    _initListeners = () => {
        this.on('receive-dossier-name', this._setNameForImportedDossier);
        this.on('receive-dossier-seed', this._importDossierFromSeed);

        this.model.onChange("dossierNameInput.value", this._validateInput);
        this.model.onChange("dossierSeedInput.value", () => {
            this._validateSEED(this.model.dossierSeedInput.value);
        });
        this.model.onChange("qrCode.data", () => {
            this._validateSEED(this.model.qrCode.data);
        });
    };

    _setNameForImportedDossier = (event) => {
        event.stopImmediatePropagation();

        this.feedbackController.updateDisplayedMessage(Constants.ERROR);

        if (!this._validateInput()) {
            return;
        }

        this.dossierName = this.model.dossierNameInput.value;
        this.wDir = this.model.currentPath || '/';
        if (this.wDir == '/') {
            this.wDir = '';
        }

        this.feedbackController.setLoadingState(true);
        this.dossierService.readDir(this.wDir, (err, dirContent) => {
            this.feedbackController.setLoadingState();
            if (err) {
                this.feedbackController.updateDisplayedMessage(Constants.ERROR, err);
            } else {
                if (dirContent.find((el) => el.path === this.dossierName)) {
                    this.feedbackController.updateDisplayedMessage(Constants.ERROR, this.model.error.labels.entryExists);
                } else {
                    // Go to the next step, where the user provides the SEED for the dossier
                    const nextStep = event.data;
                    const scanQrCode = nextStep === 'qr-code';
                    const enterSeed = !scanQrCode;

                    this.model.conditionalExpressions.isDossierNameStep = false;
                    this.model.conditionalExpressions.isDossierSeedStep = enterSeed;
                    this.model.conditionalExpressions.isScanQrCodeStep = scanQrCode;
                }
            }
        });
    };

    _importDossierFromSeed = (event) => {
        event.stopImmediatePropagation();

        this.feedbackController.setLoadingState(true);
        this.dossierService.importDossier(this.wDir, this.dossierName, this.SEED, (err) => {
            this.feedbackController.setLoadingState();
            if (err) {
                console.log(err);
                this.feedbackController.updateDisplayedMessage(Constants.ERROR, err);
            } else {
                this.responseCallback(undefined, {
                    name: this.dossierName,
                    path: `${this.wDir}/${this.dossierName}`
                });
            }
        });
    };

    _validateInput = () => {
        this.feedbackController.updateDisplayedMessage(Constants.ERROR);

        const value = this.model.dossierNameInput.value;
        const isEmptyName = value.trim().length === 0;
        const hasWhiteSpaces = value.replace(/\s/g, '') !== value;
        const disabledButton = isEmptyName || hasWhiteSpaces;
        this.model.setChainValue('buttons.scanQrCodeButton.disabled', disabledButton);
        this.model.setChainValue('buttons.enterSeedButton.disabled', disabledButton);

        if (disabledButton) {
            this.feedbackController.updateDisplayedMessage(Constants.ERROR, this.model.error.labels.nameNotValid);
            return false;
        }

        return true;
    };

    _validateSEED = (SEED) => {
        this.feedbackController.updateDisplayedMessage(Constants.ERROR);
        let isEmptySeed = SEED.trim().length === 0;

        this.model.setChainValue('buttons.finishButton.disabled', isEmptySeed);

        if (isEmptySeed) {
            this.feedbackController.updateDisplayedMessage(Constants.ERROR, this.model.error.labels.seedNotEmpty);
        } else {
            this.SEED = SEED;
        }
    }
}