const {
    WebcController
} = WebCardinal.controllers;

export default class PatientStatusController extends WebcController {
    constructor(element, history) {
        super(element, history);
        //this.model= ViewPatientList;
        // this.model = {...this.history.win.history.state.state};

        let test = this.getState();
        this.model.allData = test.allData;
        console.log("List of Patient Observation from Patient Status Controller ");
        console.log(test.allData);
        this._attachHandlerGoBack();
        this._attachHandlerPatientAlertHistory();
        this._attachHandlerPatientDeviceHistory();
        this._attachHandlerPatientConsentStatus();
    }

    _attachHandlerGoBack() {
        this.on('go-back', (event) => {
            console.log("Go Back button pressed");
            this.navigateToPageTag('home');
        });
    }
    _attachHandlerPatientAlertHistory() {
        this.on('patient-alert-history', (event) => {
            console.log("Patient Alert History button pressed");
            this.navigateToPageTag('patient-alert-history');
        });
    }
    _attachHandlerPatientDeviceHistory() {
        this.on('patient-device-history', (event) => {
            console.log("Patient Device History button pressed");
            this.navigateToPageTag('patient-device-history');
        });
    }
    _attachHandlerPatientConsentStatus() {
        this.on('patient-consent-status', (event) => {
            console.log("Patient Consent Status button pressed");
            this.navigateToPageTag('patient-consent-status');
        });
    }


}