import ModalController from "../../../cardinal/controllers/base-controllers/ModalController.js";
import {
    getDossierServiceInstance
} from "../../service/DossierExplorerService.js";
import FeedbackController from "../FeedbackController.js";
import Constants from "../Constants.js";

export default class NewFileController extends ModalController {
    constructor(element, history) {
        super(element, history);

        this.feedbackController = new FeedbackController(this.model);
        this.dossierService = getDossierServiceInstance();

        this._initListeners();
    }

    _initListeners() {
        this.on('new-file-create', this._createNewFile);
        this.on('new-file-cancel', () => {
            this.responseCallback(undefined);
        });

        this.model.onChange("fileNameInput.value", this._validateInput);
    }

    _createNewFile = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        let wDir = this.model.currentPath || '/';
        if (wDir == '/') {
            wDir = '';
        }

        const fileName = this.model.fileNameInput.value;
        let fileContent = this.model.fileContentInput.value || '\n';
        if (!fileContent.trim().length) {
            fileContent = '\n';
        }

        this.feedbackController.setLoadingState(true);
        this.dossierService.readDirDetailed(wDir, (err, { files }) => {
            if (err) {
                this.feedbackController.setLoadingState();
                this.feedbackController.updateDisplayedMessage(Constants.ERROR, err);
            } else {
                if (files.find((el) => el === fileName)) {
                    this.feedbackController.setLoadingState();
                    this.feedbackController.updateDisplayedMessage(Constants.ERROR, this.model.error.labels.entryExists);
                } else {
                    // If the name is not used, create the file
                    this._uploadFile(wDir, fileName, fileContent);
                }
            }
        });
    }

    _uploadFile = (wDir, fileName, data) => {
        this.DSUStorage.setItem(`${wDir}/${fileName}`, data, (err, response) => {
            this.feedbackController.setLoadingState();
            if (err) {
                console.error(err);
                this.feedbackController.updateDisplayedMessage(Constants.ERROR, err);
            } else {

                this.responseCallback(undefined, {
                    name: fileName,
                    path: response
                });
            }
        });
    }

    _validateInput = () => {
        this.feedbackController.updateDisplayedMessage(Constants.ERROR);

        const value = this.model.fileNameInput.value;
        const isEmptyName = value.trim().length === 0;
        this.model.setChainValue('buttons.createFileButton.disabled', isEmptyName);

        if (isEmptyName) {
            this.feedbackController.updateDisplayedMessage(Constants.ERROR, this.model.error.labels.nameNotValid);
            return false;
        }

        return true;
    };

}