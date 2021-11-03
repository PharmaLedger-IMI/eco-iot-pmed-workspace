const {
    WebcController
} = WebCardinal.controllers;

var data = [
    {
        name: "Height",
        value: 170,
        unit: "cm"
    },
    {
        name: "Weight",
        value: 92,
        unit: "kg"
    },
    {
        name: "Age",
        value: 63,
        unit: "a"
    },
    {
        name: "Systolic Blood Pressure",
        value: 102.7,
        unit: "mmHg"
    },
    {
        name: "Diastolic Blood Pressure",
        value: 72,
        unit: "mmHg"
    },
    {
        name: "SpO2",
        value: 95.4179104477612,
        unit: "%"
    }
]

export default class PatientStatusController extends WebcController {
    constructor(element, history) {
        super(element, history);
        //this.model= ViewPatientList;
        // this.model = {...this.history.win.history.state.state};

        let test = this.getState();
        let t = test.allData;
        if(t.length){
            this.model.allData = test.allData;
        }
        else {
            console.log("There is no data in Model");
            this.model.allData = data;
        }
        
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