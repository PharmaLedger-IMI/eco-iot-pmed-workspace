import EDiaryService from "./services/EDiaryService.js";

const { WebcController } = WebCardinal.controllers;


export default class EDiaryController extends WebcController {
    constructor(element, history) {
        super(element, history);

        this.setModel({
            trials: []
        });

        this.EDiaryService = new EDiaryService(this.DSUStorage);
        this.EDiaryService.getEdiaries((err, data) => {
            if (err) {
                return console.log(err);
            }
            this.model.trials = data;
        });

        this._attachHandlerEDiaryCreate();
        this._attachHandlerEDiaryBack();

        this.on('openFeedback', (evt) => {
            this.feedbackEmitter = evt.detail;
        });
    }

    _attachHandlerEDiaryCreate (){
        this.on('ediary:create', (event) => {
            this.navigateToPageTag('create-diary');
        });
    }

    _attachHandlerEDiaryBack() {
        this.on('ediary:back', (event) => {
            this.navigateToPageTag('home');
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
