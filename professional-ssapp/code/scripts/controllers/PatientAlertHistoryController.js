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


export default class PatientAlertHistoryController extends ContainerController {
    constructor(element, history) {
        super(element, history);
        //this.setModel(ViewPatientList);
        this._attachHandlerGoBack();
        this._attachHandlerPatientAlertHistory();

    }

    _attachHandlerGoBack(){
        this.on('go-back', (event) => {
            console.log ("Go Back button pressed");
            this.History.navigateToPageByTag('manage-devices');
        });
        
        this.on('patient-alert-history',  (event) => {
            console.log ("Patient Alert History button pressed");
            this.History.navigateToPageByTag('patient-alert-history');
        });
    }
    

    





}