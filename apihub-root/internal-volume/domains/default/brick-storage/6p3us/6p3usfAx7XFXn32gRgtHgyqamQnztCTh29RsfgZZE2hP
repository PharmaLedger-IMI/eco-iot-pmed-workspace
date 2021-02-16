import ModalController from "../../../cardinal/controllers/base-controllers/ModalController.js";
import {
    getDossierServiceInstance
} from "../../service/DossierExplorerService.js";
import FeedbackController from "../FeedbackController.js";
import Constants from "../Constants.js";

export default class ShareDossierController extends ModalController {
    constructor(element, history) {
        super(element, history);

        this.feedbackController = new FeedbackController(this.model);
        this.dossierService = getDossierServiceInstance();
        this._setSeedForInput();
        this._initListeners();
    }

    _initListeners() {
        this.on('copy-clipboard', this._copyToClipboardHandler);
        this.on('close-share', () => {
            this.responseCallback(undefined, {
                success: true
            });
        });
    }

    _setSeedForInput() {
        let wDir = this.model.currentPath || '/';
        let dossierName = this.model.selectedFile;
        this.feedbackController.setLoadingState(true);
        this.dossierService.printDossierSeed(wDir, dossierName, (err, seed) => {
            this.feedbackController.setLoadingState();
            if (err) {
                console.error(err);
                this.feedbackController.updateDisplayedMessage(Constants.ERROR, err);
            } else {
                this.model.setChainValue('dossierSEEDInput.value', seed);
                this.model.setChainValue('qrCode.data', seed);
            }
        });
    }

    _copyToClipboardHandler = (event) => {
        event.stopImmediatePropagation();

        if (!this._isCopySupported()) {
            return console.warn(`Copy to clipboard functionality is not available!`);
        }

        let SEED = event.data || '';
        if (SEED !== this.model.dossierSEEDInput.value) {
            return console.error('SEEDs are not the same!', SEED, this.model.dossierSEEDInput.value);
        }

        navigator.clipboard.writeText(SEED);
        this.model.setChainValue('conditionalExpressions.isSeedCopied', true);
    }

    _isCopySupported() {
        let support = !!document.queryCommandSupported;

        ['copy', 'cut'].forEach((action) => {
            support = support && !!document.queryCommandSupported(action);
        });
        return support;
    }

}