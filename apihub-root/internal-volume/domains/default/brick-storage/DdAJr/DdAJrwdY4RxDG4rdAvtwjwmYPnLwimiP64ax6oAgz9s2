import ModalController from "../../../cardinal/controllers/base-controllers/ModalController.js";
import {
    getDossierServiceInstance
} from "../../service/DossierExplorerService.js";
import FeedbackController from "../FeedbackController.js";
import Constants from "../Constants.js";

export default class NewFolderController extends ModalController {
    constructor(element, history) {
        super(element, history);

        this.feedbackController = new FeedbackController(this.model);
        this.dossierService = getDossierServiceInstance();

        this._initListeners();
    }

    _initListeners() {
        this.on('new-folder-create', this._createNewFolder);
        this.on('new-folder-cancel', () => {
            this.responseCallback(undefined);
        });

        this.model.onChange("folderNameInput.value", this._validateInput);
    }

    _createNewFolder = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        let wDir = this.model.currentPath || '/';
        if (wDir == '/') {
            wDir = '';
        }

        const folderName = this.model.folderNameInput.value;
        this.feedbackController.setLoadingState(true);
        this.dossierService.readDirDetailed(wDir, (err, { folders }) => {
            if (err) {
                this.feedbackController.setLoadingState();
                this.feedbackController.updateDisplayedMessage(Constants.ERROR, err);
            } else {
                if (folders.find((el) => el === folderName)) {
                    this.feedbackController.setLoadingState();
                    this.feedbackController.updateDisplayedMessage(Constants.ERROR, this.model.error.labels.entryExists);
                } else {
                    // If the name is not used, create the folder
                    this._createFolder(wDir, folderName);
                }
            }
        });
    }

    _createFolder = (path, folderName) => {
        const folderPath = `${path}/${folderName}`;
        const tempFilePath = `${folderPath}/temp.txt`;
        this.DSUStorage.setItem(tempFilePath, 'temporary text', (err) => {
            this.feedbackController.setLoadingState();
            if (err) {
                console.error(err);
                return this.feedbackController.updateDisplayedMessage(Constants.ERROR, err);
            }

            this.dossierService.deleteFileFolder(tempFilePath, (err) => {
                if (err) {
                    console.error(err);
                    return this.feedbackController.updateDisplayedMessage(Constants.ERROR, err);
                }

                this.responseCallback(undefined, {
                    path: folderPath,
                    name: folderName
                });
            });
        });
    }

    _validateInput = () => {
        this.feedbackController.updateDisplayedMessage(Constants.ERROR);

        const value = this.model.folderNameInput.value;
        const isEmptyName = value.trim().length === 0;
        this.model.setChainValue('buttons.createFolderButton.disabled', isEmptyName);

        if (isEmptyName) {
            this.feedbackController.updateDisplayedMessage(Constants.ERROR, this.model.error.labels.nameNotValid);
            return false;
        }

        return true;
    };

}