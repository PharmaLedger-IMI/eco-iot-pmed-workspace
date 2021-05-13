const {WebcController} = WebCardinal.controllers;

// const ViewPatientList = {
//
//     name: {
//         name: 'NAME',
//         label: "name",
//         value: 'name'
//     },
//     id: {
//         name: 'ID',
//         label: "id",
//         value: 'id'
//     }
// }


export default class PatientStatusController extends WebcController {
    constructor(element, history) {
        super(element, history);
        //this.model= ViewPatientList;
        this._attachHandlerGoBack();
        this._attachHandlerPatientAlertHistory();
        this._attachHandlerPatientDeviceHistory();
        this._attachHandlerPatientConsentStatus();
        

    }

    _attachHandlerGoBack(){
        this.on('go-back', (event) => {
            console.log ("Go Back button pressed");
            this.navigateToPageTag('list-of-patients');
        });
    }
    _attachHandlerPatientAlertHistory(){        
        this.on('patient-alert-history',  (event) => {
            console.log ("Patient Alert History button pressed");
            this.navigateToPageTag('patient-alert-history');
        });
    }
    _attachHandlerPatientDeviceHistory(){
        this.on('patient-device-history',  (event) => {
            console.log ("Patient Device History button pressed");
            this.navigateToPageTag('patient-device-history');
        });
    }
    _attachHandlerPatientConsentStatus(){
        this.on('patient-consent-status',  (event) => {
            console.log ("Patient Consent Status button pressed");
            this.navigateToPageTag('patient-consent-status');
        });
    }


}