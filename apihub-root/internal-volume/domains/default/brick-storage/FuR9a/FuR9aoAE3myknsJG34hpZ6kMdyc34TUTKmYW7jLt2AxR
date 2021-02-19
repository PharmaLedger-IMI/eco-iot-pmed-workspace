import ModalController from "../../../cardinal/controllers/base-controllers/ModalController.js";
import FileDownloader from "./FileDownloader.js";
import FeedbackController from "../FeedbackController.js";
import Constants from "../Constants.js";

const TEXT_MIME_TYPE = "text/";

export default class ViewFileController extends ModalController {

    constructor(element, history) {
        super(element, history);

        this.fileName = this.model.name;
        this.path = this.model.path;

        this.feedbackController = new FeedbackController(this.model);
        this.fileDownloader = new FileDownloader(this.path, this.fileName);

        this.feedbackController.setLoadingState(true);
        this._downloadFile();
        this._initListeners();
    }

    _initListeners = () => {
        this.on("start-download", this._downloadHandler);
        this.on("start-edit", this._startEditHandler);
        this.on("save-edit", this._saveEditHandler);

        this.on('exit-save', this._saveChangesHandler);
        this.on('exit-discard', this._discardChangesHandler);
        this.on('exit-cancel', this._cancelExitHandler);

        this.on('closeModal', this._closeModalHandler, true);
    }

    _saveChangesHandler = (evt) => {
        this._saveEditHandler(evt);
        this.model.setChainValue('closingConfirmation.opened', false);
    }

    _discardChangesHandler = (evt) => {
        evt.stopImmediatePropagation();
        evt.preventDefault();

        this.model.setChainValue('textEditor.value', this.model.textEditor.oldValue);
        this.model.setChainValue("isEditing", false);
        this.model.setChainValue('closingConfirmation.opened', false);
    }

    _cancelExitHandler = (evt) => {
        evt.stopImmediatePropagation();
        evt.preventDefault();

        this.model.setChainValue('closingConfirmation.opened', false);
    }

    _closeModalHandler = (evt) => {
        if (this.model.isEditing === true && this._isFileModified()) {
            evt.stopImmediatePropagation();
            evt.preventDefault();
            this.model.setChainValue('closingConfirmation.opened', true);
        }
    }

    _isFileModified = () => {
        return this.model.textEditor.value !== this.model.textEditor.oldValue;
    }

    _startEditHandler = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        if (this.fileName === "manifest") {
            this.feedbackController.updateDisplayedMessage(Constants.ERROR, this.model.error.labels.manifestManipulationError);
            return console.error(this.model.error.labels.manifestManipulationError);
        }

        this.model.setChainValue("isEditing", true);
    }

    _saveEditHandler = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        if (this._isFileModified()) {
            this.DSUStorage.setItem(this.model.title, this.model.textEditor.value, (err) => {
                if (err) {
                    this.model.setChainValue("isEditing", true);
                    this.feedbackController.updateDisplayedMessage(Constants.ERROR, err);
                    return console.error(err);
                }

                this._downloadFile();
            });
        }

        this.model.setChainValue("isEditing", false);
    }

    _downloadHandler = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        this.fileDownloader.downloadFileToDevice({
            contentType: this.mimeType,
            rawBlob: this.rawBlob
        });
    }

    _downloadFile = () => {
        this.fileDownloader.downloadFile((downloadedFile) => {
            this.rawBlob = downloadedFile.rawBlob;
            this.mimeType = downloadedFile.contentType;
            this.blob = new Blob([this.rawBlob], {
                type: this.mimeType
            });

            if (this.mimeType.indexOf(TEXT_MIME_TYPE) !== -1) {
                this._prepareTextEditorViewModel();
            } else {
                this._displayFile();
                this._clearUnsavedFileSection();
            }
        });
    }

    _clearUnsavedFileSection = () => {
        const unsavedFileSection = this.element.querySelector('.unsaved-file');
        if (unsavedFileSection && unsavedFileSection.parentElement) {
            unsavedFileSection.parentElement.remove();
        }
    }

    _prepareTextEditorViewModel = () => {
        const clearInnerHTML = () => {
            const conditionElm = this.element.querySelector(".content psk-condition");
            if (conditionElm && conditionElm.parentElement) {
                conditionElm.parentElement.removeChild(conditionElm);
            }
        }

        const attachInnerHTML = () => {
            clearInnerHTML();

            const conditionElm = document.createElement("psk-condition");
            conditionElm.setAttribute("condition","@isEditing");

            const liveCodeElm = document.createElement("psk-live-code");
            liveCodeElm.setAttribute("slot","condition-true");
            liveCodeElm.setAttribute('view-model', '@textEditor');

            const codeElm = document.createElement("psk-code");
            codeElm.setAttribute("slot","condition-false");
            codeElm.setAttribute("language","@textEditor.language");
            codeElm.innerHTML = this.model.textEditor.value;

            conditionElm.appendChild(liveCodeElm);
            conditionElm.appendChild(codeElm);
            this._appendAsset(conditionElm);
        }

        const reader = new FileReader();
        reader.onload = () => {
            const textEditorViewModel = {
                isEditable: true,
                value: reader.result,
                oldValue: reader.result,
                language: this.mimeType.split(TEXT_MIME_TYPE)[1]
            };

            this.model.setChainValue("textEditor", textEditorViewModel);
            attachInnerHTML();
        }
        reader.readAsText(this.blob);
    }

    _displayFile = () => {
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            const file = new File([this.rawBlob], this.fileName);
            window.navigator.msSaveOrOpenBlob(file);
            this.feedbackController.setLoadingState(true);
            return;
        }

        window.URL = window.URL || window.webkitURL;
        const fileType = this.mimeType.split("/")[0];
        switch (fileType) {
            case "image":
                {
                    this._loadImageFile();
                    break;
                }
            case "audio":
            case "video":
                {
                    this._loadAudioVideoFile(fileType);
                    break;
                }
            default:
                {
                    this._loadOtherFile();
                    break;
                }
        }
    }

    _loadBlob = (callback) => {
        const reader = new FileReader();
        reader.readAsDataURL(this.blob);
        reader.onloadend = function() {
            callback(reader.result);
        }
    }

    _loadImageFile = () => {
        this._loadBlob((base64Blob) => {
            const img = document.createElement("img");
            img.src = base64Blob;
            img.alt = this.path;

            this._appendAsset(img);
        });
    }

    _loadAudioVideoFile = (fileType) => {
        this._loadBlob((base64Blob) => {
            const elm = document.createElement(fileType),
                source = document.createElement("source");
            source.type = this.mimeType;
            source.src = base64Blob;
            elm.append(source);
            elm.controls = "true";

            this._appendAsset(elm);
        });
    }

    _loadOtherFile = () => {
        this._loadBlob((base64Blob) => {
            const obj = document.createElement("object");
            obj.type = this.mimeType;
            obj.data = base64Blob;

            this._appendAsset(obj);
        });
    }

    _appendAsset = (assetObject) => {
        let assetModal = this.element.querySelector(".asset-modal .content");
        if (assetModal) {
            assetModal.append(assetObject);
        }

        this.feedbackController.setLoadingState(false);
    }
}
