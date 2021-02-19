import ModalController from "../../../cardinal/controllers/base-controllers/ModalController.js";
import FeedbackController from "../FeedbackController.js";
import {
    getDossierServiceInstance
} from "../../service/DossierExplorerService.js";
import Constants from "../Constants.js";

export default class RenameController extends ModalController {
    constructor(element, history) {
        super(element, history);

        this.dossierService = getDossierServiceInstance();
        this.feedbackController = new FeedbackController(this.model);

        this._initListeners();
    }

    _initListeners = () => {
        this.on('confirm-rename', this._handleRenameFile);
        this.on('cancel-rename', this._handleCancelRename);
    };

    _handleCancelRename = () => {
        this.responseCallback(undefined, {
            cancel: true
        });
    }

    _handleRenameFile = () => {
        const oldFileName = this.model.oldFileName;
        const newFileName = this.model.fileNameInput.value;
        let currentPath = this.model.currentPath;
        if (currentPath === '/') {
            currentPath = '';
        }

        if (!newFileName.trim().length) {
            return this.feedbackController.updateDisplayedMessage(Constants.ERROR, this.model.error.labels.nameNotEmpty);
        }

        if (newFileName.indexOf('/') !== -1) {
            return this.feedbackController.updateDisplayedMessage(Constants.ERROR, this.model.error.labels.specialCharacters);
        }

        const oldPath = `${currentPath}/${oldFileName}`;
        const newPath = `${currentPath}/${newFileName}`;
        this.feedbackController.setLoadingState(true);
        this.dossierService.rename(oldPath, newPath, (err, result) => {
            this.feedbackController.setLoadingState();
            if (err) {
                console.error(err);
                return this.feedbackController.updateDisplayedMessage(Constants.ERROR, err);
            }

            this.responseCallback(undefined, {
                from: oldFileName,
                to: newFileName
            });
        });
    }
}