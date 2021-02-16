import ModalController from "../../../cardinal/controllers/base-controllers/ModalController.js";
import FeedbackController from "../FeedbackController.js";
import ExplorerNavigationController from "../ExplorerNavigationController.js";
import {
    getDossierServiceInstance
} from "../../service/DossierExplorerService.js";
import Constants from "../Constants.js";

export default class MoveController extends ModalController {
    constructor(element, history) {
        super(element, history);

        this.dossierService = getDossierServiceInstance();
        this.feedbackController = new FeedbackController(this.model);
        this.explorerNavigator = new ExplorerNavigationController(element, history, this.model);

        this._initListeners();
    }

    _initListeners = () => {
        this.on('confirm-move', this._handleMoveFile);
        this.on('cancel-move', this._handleCancel);
    };

    _handleMoveFile = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        const selectedEntryName = this.model.selectedEntryName;

        let currentWorkingDirectory = this.model.currentWorkingDirectory || '';
        if (currentWorkingDirectory === '/') {
            currentWorkingDirectory = '';
        }

        let currentPath = this.model.currentPath || '';
        if (currentPath === '/') {
            currentPath = '';
        }

        const selectedItem = this.model.content.find(el => el.selected === 'selected');
        if (selectedItem) {
            currentPath = `${currentPath}/${selectedItem.name}`;
        }

        const oldPath = `${currentWorkingDirectory}/${selectedEntryName}`;
        const newPath = `${currentPath}/${selectedEntryName}`;

        if (oldPath === newPath) {
            return this.feedbackController.updateDisplayedMessage(Constants.ERROR, this.model.error.labels.samePathError);
        }

        this.feedbackController.setLoadingState(true);
        this.dossierService.rename(oldPath, newPath, (err, result) => {
            this.feedbackController.setLoadingState();
            if (err) {
                console.error(err);
                return this.feedbackController.updateDisplayedMessage(Constants.ERROR, err);
            }

            this.responseCallback(undefined, {
                from: oldPath,
                to: newPath,
                name: selectedEntryName
            });
        });
    }

    _handleCancel = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        this.responseCallback(undefined, {
            cancel: true
        });
    }
}