import ContainerController from '../../../cardinal/controllers/base-controllers/ContainerController.js';
import EDiaryService from "./services/EDiaryService.js";

const initModel = {
    title: 'Create EDiary',
    date: {
        label: "Please indicate the date of the activity",
        name: "date",
        required: true,
        dataFormat: "DD/MM/YYYY",
        placeholder: "DD/MM/YYYY",
        value: ''
    },
    notes: {
        label: "Notes",
        name: "notes",
        required: true,
        placeholder: "Notes",
        value: ''
    },

}

export default class CreateEdiaryController extends ContainerController {
    constructor(element, history) {
        super(element, history);

        this.setModel(JSON.parse(JSON.stringify(initModel)));

        this._attachHandlerEDiaryCreate();

        this.on('openFeedback', (evt) => {
            this.feedbackEmitter = evt.detail;
        });
    }


    _attachHandlerEDiaryCreate() {
        this.on('ediary:create', (event) => {

            if (this.__displayErrorMessages(event)) {
                return;
            }
            let ediaryObject = {
                name: this.model.name.value,
                consentName: this.model.consentName.value,
                version: this.model.version.value,
                status: this.model.status.value,
            }

            this.EDiaryService.saveEdiary(ediaryObject, (err, updEDiary) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log("EDiary saved" + updEDiary.uid);

            });
        });
    }

    __displayErrorMessages = (event) => {
        debugger;
        return this.__displayErrorRequiredField(event, 'name', this.model.name.value) ||
            this.__displayErrorRequiredField(event, 'version', this.model.version.value) ||
            this.__displayErrorRequiredField(event, 'consentName', this.model.consentName.value);
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
