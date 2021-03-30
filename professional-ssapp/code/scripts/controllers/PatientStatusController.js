import ContainerController from '../../../cardinal/controllers/base-controllers/ContainerController.js';

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


export default class PatientStatusController extends ContainerController {
    constructor(element, history) {
        super(element, history);
        //this.setModel(ViewPatientList);
        this._attachHandlerGoBack();
        this._attachHandlerPatientAlertHistory();
        this._attachHandlerPatientDeviceHistory();
        this._attachHandlerPatientConsentStatus();
        

    }

    _attachHandlerGoBack(){
        this.on('go-back', (event) => {
            console.log ("Go Back button pressed");
            this.History.navigateToPageByTag('manage-devices');
        });
    }
    _attachHandlerPatientAlertHistory(){        
        this.on('patient-alert-history',  (event) => {
            console.log ("Patient Alert History button pressed");
            this.History.navigateToPageByTag('patient-alert-history');
        });
    }
    _attachHandlerPatientDeviceHistory(){
        this.on('patient-device-history',  (event) => {
            console.log ("Patient Device History button pressed");
            this.History.navigateToPageByTag('patient-device-history');
        });
    }
    _attachHandlerPatientConsentStatus(){
        this.on('patient-consent-status',  (event) => {
            console.log ("Patient Consent Status button pressed");
            this.History.navigateToPageByTag('patient-consent-status');
        });
    }


}