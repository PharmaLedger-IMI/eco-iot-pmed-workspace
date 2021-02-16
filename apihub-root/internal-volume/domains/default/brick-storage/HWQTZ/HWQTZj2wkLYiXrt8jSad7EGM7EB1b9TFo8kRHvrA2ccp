import ContainerController from "../../cardinal/controllers/base-controllers/ContainerController.js";
import FileDownloader from "./file-folder-controllers/FileDownloader.js";
import FeedbackController from "./FeedbackController.js";

import {
    getDossierServiceInstance
} from "../service/DossierExplorerService.js";

import rootModel from "../view-models/rootModel.js";

import createDossierViewModel from '../view-models/modals/dossier-modals/createDossierViewModel.js';
import receiveDossierViewModel from '../view-models/modals/dossier-modals/receiveDossierViewModel.js';
import shareDossierViewModel from '../view-models/modals/dossier-modals/shareDossierViewModel.js';

import newFileViewModel from "../view-models/modals/file-folder-modals/newFileViewModel.js";
import newFolderViewModel from "../view-models/modals/file-folder-modals/newFolderViewModel.js";

import deleteViewModel from '../view-models/modals/actions-modals/deleteViewModel.js';
import renameViewModel from '../view-models/modals/actions-modals/renameViewModel.js';
import moveViewModel from '../view-models/modals/actions-modals/moveViewModel.js';

import ExplorerNavigationController from "./ExplorerNavigationController.js";
import Constants from "./Constants.js";

export default class ExplorerController extends ContainerController {
    constructor(element, history) {
        super(element, history);
        this.model = this.setModel(this._getCleanProxyObject(rootModel));
        this.dossierService = getDossierServiceInstance();
        this.feedbackController = new FeedbackController(this.model);
        this.explorerNavigator = new ExplorerNavigationController(element, history, this.model);

        this._initListeners();
        this._checkForLandingApp();
    }

    _initListeners = () => {
        this.on('openFeedback', (evt) => {
            this.feedbackEmitter = evt.detail;
        });

        this.on("switch-layout", this._handleSwitchLayout);
        this.on('open-options-menu', this._handleOptionsMenu);

        this.on('view-file', this._handleViewFile);
        this.on('export-dossier', this._handleDownload);

        this.on('create-dossier', this._createDossierHandler);
        this.on('receive-dossier', this._receiveDossierHandler);
        this.on('share-dossier', this._shareDossierHandler);
        this.on('delete', this._deleteHandler);
        this.on('rename', this._renameHandler);
        this.on('move', this._moveHandler);
        this.on('run-app', this._handleRunApplication);

        this.on('new-file', this._addNewFileHandler);
        this.on('new-folder', this._addNewFolderHandler);
        this.on('add-file-folder', this._handleFileFolderUpload);
    };

    _handleOptionsMenu = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        const selectedItem = event.data;
        let triggeredButton = event.path[0];
        let elementRect = triggeredButton.getBoundingClientRect();
        let itemActionsBtn = this.element.querySelector("#wallet-content-container").shadowRoot.querySelector("#item-actions");

        let containerHeight = selectedItem.optionsContainerHeight;
        let topCorrection = containerHeight / 2 - 15;
        if (window.innerHeight < elementRect.top + containerHeight / 2) {
            topCorrection = topCorrection + (elementRect.top + containerHeight / 2 - window.innerHeight);
        }
        itemActionsBtn.querySelector("psk-grid").style.top = elementRect.top - topCorrection + "px";
        itemActionsBtn.querySelector("psk-grid").style.left = elementRect.left - 220 + "px";

        if (!selectedItem) {
            return console.error(`No item selected!`);
        }

        itemActionsBtn.setAttribute("opened", "");
        this.model.optionsMenu.isApplication = selectedItem.isApplication;
        this.model.optionsMenu.icon = selectedItem.icon;
        this.model.optionsMenu.name = selectedItem.name;
        this.model.optionsMenu.dataType = selectedItem.dataType;
    }
    _checkForLandingApp() {
        this.DSUStorage.getObject("apps/.landingApp", (err, landingApp) => {
            if (!err && landingApp.name) {
                this.showModal("runApp", { name: landingApp.name });
                this.dossierService.deleteFileFolder("apps/.landingApp", (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        })

    }

    _handleRunApplication = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        let applicationName = event.data;
        let fullPath = this.explorerNavigator.getFullPath();

        this.dossierService.printDossierSeed(fullPath, applicationName, (err, keySSI) => {
            if (err) {
                return console.error(err);
            }

            this.showModal("runAppModal", {
                name: applicationName,
                keySSI: keySSI
            }, () => {
                //TODO: what should happen when user closes the app?
            })
        })
    }

    _handleSwitchLayout = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        this.model.isGridLayout = !this.model.isGridLayout;
    };

    _createDossierHandler = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        createDossierViewModel.currentPath = this.model.currentPath;
        this.showModal('createDossierModal', createDossierViewModel, (err, response) => {
            if (err) {
                return this.feedbackEmitter(err, null, Constants.ERROR_FEEDBACK_TYPE);
            }

            const successMessage = this.model[Constants.SUCCESS].dossierCreated
                .replace(Constants.NAME_PLACEHOLDER, response.name)
                .replace(Constants.PATH_PLACEHOLDER, response.path)
            this.feedbackEmitter(successMessage, null, Constants.SUCCESS_FEEDBACK_TYPE);
            this.explorerNavigator.listDossierContent();
        });
    }

    _receiveDossierHandler = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        receiveDossierViewModel.currentPath = this.model.currentPath;
        this.showModal('receiveDossierModal', receiveDossierViewModel, (err, response) => {
            if (err) {
                return this.feedbackEmitter(err, null, Constants.ERROR_FEEDBACK_TYPE);
            }

            const successMessage = this.model[Constants.SUCCESS].dossierImported
                .replace(Constants.NAME_PLACEHOLDER, response.name)
                .replace(Constants.PATH_PLACEHOLDER, response.path)
            this.feedbackEmitter(successMessage, null, Constants.SUCCESS_FEEDBACK_TYPE);
            this.explorerNavigator.listDossierContent();
        });
    }

    _deleteHandler = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        const {
            currentPath,
            selectedItem
        } = this._getSelectedItemAndWorkingDir(event.data);

        const name = selectedItem.name;
        if (name === 'manifest') {
            return this.feedbackEmitter(this.model.error.labels.manifestManipulationError, null, Constants.ERROR_FEEDBACK_TYPE);
        }

        deleteViewModel.path = currentPath;
        deleteViewModel.selectedItemName = selectedItem.name;
        deleteViewModel.selectedItemType = selectedItem.type;

        this.showModal('deleteModal', deleteViewModel, (err, response) => {
            if (err) {
                return this.feedbackEmitter(err, null, Constants.ERROR_FEEDBACK_TYPE);
            }

            const successMessage = this.model[Constants.SUCCESS].delete
                .replace(Constants.NAME_PLACEHOLDER, response.name)
            this.feedbackEmitter(successMessage, null, Constants.SUCCESS_FEEDBACK_TYPE);
            this.explorerNavigator.listDossierContent();
        });
    }

    _renameHandler = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        const {
            currentPath,
            selectedItem
        } = this._getSelectedItemAndWorkingDir(event.data);

        const name = selectedItem.name;
        if (name === 'manifest') {
            return this.feedbackEmitter(this.model.error.labels.manifestManipulationError, null, Constants.ERROR_FEEDBACK_TYPE);
        }

        renameViewModel.fileNameInput.value = name;
        renameViewModel.oldFileName = name;
        renameViewModel.fileType = selectedItem.type;
        renameViewModel.currentPath = currentPath;

        this.showModal('renameModal', renameViewModel, (err, response) => {
            if (err) {
                return this.feedbackEmitter(err, null, Constants.ERROR_FEEDBACK_TYPE);
            }

            if (!response.cancel) {
                const successMessage = this.model[Constants.SUCCESS].rename
                    .replace(Constants.FROM_PLACEHOLDER, response.from)
                    .replace(Constants.TO_PLACEHOLDER, response.to);
                this.feedbackEmitter(successMessage, null, Constants.SUCCESS_FEEDBACK_TYPE);
                this.explorerNavigator.listDossierContent();
            }
        });
    }

    _moveHandler = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        const {
            currentPath,
            selectedItem
        } = this._getSelectedItemAndWorkingDir(event.data);

        if (selectedItem.name === 'manifest') {
            return this.feedbackEmitter(this.model.error.labels.manifestManipulationError, null, Constants.ERROR_FEEDBACK_TYPE);
        }

        moveViewModel.selectedEntryName = selectedItem.name;
        moveViewModel.selectedEntryType = selectedItem.type;
        moveViewModel.currentWorkingDirectory = currentPath;
        moveViewModel.dateFormatOptions = this._getCleanProxyObject(this.model.dateFormatOptions);
        moveViewModel.contentLabels = {
            ...this.model.contentLabels,
            ...moveViewModel.contentLabels,
        };

        this.showModal('moveModal', moveViewModel, (err, response) => {
            if (err) {
                return this.feedbackEmitter(err, null, Constants.ERROR_FEEDBACK_TYPE);
            }

            if (!response.cancel) {
                const successMessage = this.model[Constants.SUCCESS].move
                    .replace(Constants.NAME_PLACEHOLDER, response.name)
                    .replace(Constants.FROM_PLACEHOLDER, response.from)
                    .replace(Constants.TO_PLACEHOLDER, response.to);
                this.feedbackEmitter(successMessage, null, Constants.SUCCESS_FEEDBACK_TYPE);
                this.explorerNavigator.listDossierContent();
            }
        });
    }

    _shareDossierHandler = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        const {
            currentPath,
            selectedItem
        } = this._getSelectedItemAndWorkingDir(event.data);

        shareDossierViewModel.currentPath = currentPath;
        shareDossierViewModel.selectedFile = selectedItem.name;

        this.showModal('shareDossierModal', shareDossierViewModel, (err) => {
            if (err) {
                this.feedbackEmitter(err, null, Constants.ERROR_FEEDBACK_TYPE);
            }
        });
    }

    _addNewFileHandler = (event) => {
        event.stopImmediatePropagation();

        let wDir = this.model.currentPath || '/';
        if (wDir == '/') {
            wDir = '';
        }

        newFileViewModel.currentPath = wDir;
        this.showModal('newFileModal', newFileViewModel, (err, response) => {
            if (err) {
                return this.feedbackEmitter(err, null, Constants.ERROR_FEEDBACK_TYPE);
            }

            const successMessage = this.model[Constants.SUCCESS].fileCreated
                .replace(Constants.NAME_PLACEHOLDER, response.name)
                .replace(Constants.PATH_PLACEHOLDER, response.path);
            this.feedbackEmitter(successMessage, null, Constants.SUCCESS_FEEDBACK_TYPE);
            this.explorerNavigator.listDossierContent();
        });
    }

    _addNewFolderHandler = (event) => {
        event.stopImmediatePropagation();

        let wDir = this.model.currentPath || '/';
        if (wDir == '/') {
            wDir = '';
        }

        newFolderViewModel.currentPath = wDir;
        this.showModal('newFolderModal', newFolderViewModel, (err, response) => {
            if (err) {
                return this.feedbackEmitter(err, null, Constants.ERROR_FEEDBACK_TYPE);
            }

            const successMessage = this.model[Constants.SUCCESS].folderCreated
                .replace(Constants.NAME_PLACEHOLDER, response.name)
                .replace(Constants.PATH_PLACEHOLDER, response.path);
            this.feedbackEmitter(successMessage, null, Constants.SUCCESS_FEEDBACK_TYPE);
            this.explorerNavigator.listDossierContent();
        });
    }

    _handleFileFolderUpload = (event) => {
        event.stopImmediatePropagation();

        let filesArray = event.data || [];
        if (!filesArray.length) {
            return this.feedbackEmitter(this.model.error.labels.noFileUploaded, null, Constants.ERROR_FEEDBACK_TYPE);
        }

        let wDir = this.model.currentPath || '/';
        // Open the ui-loader
        this.feedbackController.setLoadingState(true);
        this.DSUStorage.uploadMultipleFiles(wDir, filesArray, { preventOverwrite: true }, (err, filesUploaded) => {
            if (err) {
                filesUploaded = err.data;
            }

            if (!Array.isArray(filesUploaded)) {
                filesUploaded = [filesUploaded];
            }
            filesUploaded.forEach((entry) => {
                let name, path, messageTemplate, messageType;

                if (entry.error) {
                    path = entry.file.path;
                    if (entry.error.code === 30) {
                        messageTemplate = this.model[Constants.SUCCESS].fileUploadExists;
                        messageType = Constants.ERROR_FEEDBACK_TYPE;
                    } else {
                        messageTemplate = this.model[Constants.SUCCESS].fileUploaded;
                        messageType = Constants.SUCCESS_FEEDBACK_TYPE;
                    }
                } else {
                    path = entry;
                    messageTemplate = this.model[Constants.SUCCESS].fileUploaded;
                    messageType = Constants.SUCCESS_FEEDBACK_TYPE;
                }

                name = path.split('/').pop();
                let displayedMessage = messageTemplate
                    .replace(Constants.NAME_PLACEHOLDER, name)
                    .replace(Constants.PATH_PLACEHOLDER, path);
                this.feedbackEmitter(displayedMessage, null, messageType);
            });

            // Close the ui-loader as upload is finished
            this.feedbackController.setLoadingState(false);
            this.explorerNavigator.listDossierContent();
        })
    };

    _handleDownload = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        const selectedItem = this._getSelectedItem(event.data);
        if (!selectedItem) {
            console.error(`No item selected to be downloaded!`);
            return;
        }

        const itemViewModel = this._getCleanProxyObject(selectedItem);
        if (itemViewModel.type === 'file') {
            this._handleDownloadFile(this.model.currentPath, itemViewModel.name);
        }
    }

    _handleDownloadFile(path, fileName) {
        let fileDownloader = new FileDownloader(path, fileName);
        fileDownloader.downloadFile();
    }

    _handleViewFile = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        const selectedItem = this._getSelectedItem(event.data);
        if (!selectedItem) {
            console.error(`No item selected to be downloaded!`);
            return;
        }

        const itemViewModel = this._getCleanProxyObject(selectedItem);
        if (itemViewModel.type !== 'file') {
            console.error(`Only files support this funtionality!`);
            return;
        }

        this.explorerNavigator.openViewFileModal(itemViewModel);
    }

    _getSelectedItemAndWorkingDir = (name) => {
        if (!this.model.content.length) {
            throw console.error('No content available');
        }

        const selectedItem = this._getSelectedItem(name);
        if (!selectedItem) {
            throw console.error('No item selected!');
        }

        return {
            currentPath: this.model.currentPath,
            selectedItem: this._getCleanProxyObject(selectedItem)
        };
    }

    _getSelectedItem = (name) => {
        return this.model.content.find((el) => el.name === name);
    }

    _getCleanProxyObject = (obj) => {
        return obj ? JSON.parse(JSON.stringify(obj)) : null;
    }
}