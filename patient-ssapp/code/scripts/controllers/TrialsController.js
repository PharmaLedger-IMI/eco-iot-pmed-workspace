
import TrialService from "./services/TrialService.js";
const { WebcController } = WebCardinal.controllers;

const initModel = {
    title: 'Create Trial',
    name: {
        name: 'name',
        label: 'Trial Name',
        required: true,
        placeholder: 'Trial name',
        value: ''
    },
    consentName: {
        name: 'consentName',
        label: 'Consent Name',
        required: true,
        placeholder: 'Consent name',
        value: ''
    },
    version: {
        name: 'version',
        label: 'Version',
        required: true,
        placeholder: 'Version',
        value: ''
    },
    status: {
        name: "status",
        required: true,
        checkboxLabel: "status",
        checkedValue: 1,
        uncheckedValue: 0,
        value: ''
    }

}

export default class TrialsController extends WebcController {
    constructor(element, history) {
        super(element, history);

        this.setModel(JSON.parse(JSON.stringify(initModel)));

        this._attachHandlerTrialCreate();

        this.TrialService = new TrialService(this.DSUStorage);
        this.TrialService.getTrial((err, data) => {
            if (err) {
                console.log(err);
                return;
            }
            //bind
            this.setModel(data);
        });

        this.on('openFeedback', (evt) => {
            this.feedbackEmitter = evt.detail;
        });
    }



    _attachHandlerTrialCreate (){
        this.on('trial:create', (event) => {

            if(this.__displayErrorMessages(event)){
                return;
            }
            let trialObject = {
                name: this.model.name.value,
                consentName: this.model.consentName.value,
                version: this.model.version.value,
                status: this.model.status.value,
            }

            this.TrialService.saveTrial( trialObject,(err, updTrial) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log("Trial saved" +updTrial.uid);
            
            });
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

