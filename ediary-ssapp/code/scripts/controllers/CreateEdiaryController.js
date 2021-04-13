const { WebcController } = WebCardinal.controllers;

const BUTTON_NEW = 'ed-button-new';
const BUTTON_USED = 'ed-button-used';
const BUTTON_ATTACHED = 'ed-button-attached';
const BUTTON_DETACHED = 'ed-button-detached';

const initModel = {
    title: 'Create EDiary',
    patchState: null,
    patchOption: null,
    date: {
        label: "Please indicate the date of the activity",
        name: "date",
        required: true,
        dataFormat: "DD MM YYYY",
        placeholder: "DD MM YYYY",
        value: ''
    },
    notes: {
        label: "Notes",
        name: "notes",
        required: true,
        placeholder: "Notes",
        value: ''
    }
}

export default class CreateEdiaryController extends WebcController {
    constructor(element, history) {
        super(element, history);

        this.setModel(JSON.parse(JSON.stringify(initModel)));

        this.on('openFeedback', (evt) => {
            this.feedbackEmitter = evt.detail;
        });

        this._initHandlers()
    }

    _initHandlers() {
        this._attachHandlerEDiaryCreate();

        this.on(BUTTON_NEW, (event) => {
            this.model.patchState = BUTTON_NEW;
            this._unfadeButton(BUTTON_NEW);
            this._fadeButton(BUTTON_USED);
        });
        this.on(BUTTON_USED, (event) => {
            this.model.patchState = BUTTON_USED;
            this._unfadeButton(BUTTON_USED);
            this._fadeButton(BUTTON_NEW);
        });

        this.on(BUTTON_ATTACHED, (event) => {
            this.model.patchOption = BUTTON_ATTACHED;
            this._unfadeButton(BUTTON_ATTACHED);
            this._fadeButton(BUTTON_DETACHED);
        });
        this.on(BUTTON_DETACHED, (event) => {
            this.model.patchOption = BUTTON_DETACHED;
            this._unfadeButton(BUTTON_DETACHED);
            this._fadeButton(BUTTON_ATTACHED)
        });

        this._fadeButton(BUTTON_USED);
        this._fadeButton(BUTTON_DETACHED);
    }

    _attachHandlerEDiaryCreate() {
        this.on('ediary:create', (event) => {
            console.log(this.model)
            debugger
            console.log('ediary:create');
        });
    }

    _fadeButton(id) {
        this.element.querySelector("#" + id).classList.add('ed-faded')
    }

    _unfadeButton(id) {
        this.element.querySelector("#" + id).classList.remove('ed-faded')
    }

    __displayErrorMessages = (event) => {
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
