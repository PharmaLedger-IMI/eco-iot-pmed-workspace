import ContainerController from '../../../cardinal/controllers/base-controllers/ContainerController.js';
import EDiaryService from "./services/EDiaryService.js";

const initModel = {

}

export default class EDiaryController extends ContainerController {
    constructor(element, history) {
        super(element, history);

        this.setModel(JSON.parse(JSON.stringify(initModel)));

        this._attachHandlerEDiaryCreate();


        this.on('openFeedback', (evt) => {
            this.feedbackEmitter = evt.detail;
        });
    }



    _attachHandlerEDiaryCreate (){
        this.on('ediary:create', (event) => {
            this.History.navigateToPageByTag('create-diary');
        });
    }

    __displayErrorMessages = (event) => {
        return this.__displayErrorRequiredField(event, 'name', this.model.name.value) ||
            this.__displayErrorRequiredField(event, 'version', this.model.version.value) ||
              this.__displayErrorRequiredField(event, 'consentName', this.model.consentName.value) ;
    }

    __displayErrorRequiredField(event, fieldName, field) {
        if (field === undefined || field === null || field.length === 0) {
            this._emitFeedback(event, fieldName.toUpperCase() + " field is required.", "alert-danger")
            return true;
        }
        return false;
    }

    _emitFeedback(event, message, alertType) {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (typeof this.feedbackEmitter === 'function') {
            this.feedbackEmitter(message, "Validation", alertType)
        }
    }

}
