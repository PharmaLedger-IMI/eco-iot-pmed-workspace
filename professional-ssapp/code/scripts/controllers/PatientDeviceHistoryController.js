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


export default class PatientDeviceHistoryController extends ContainerController {
    constructor(element, history) {
        super(element, history);
        //this.setModel(ViewPatientList);
        this._attachHandler();

    }

    _attachHandler(){
        this.on('go-back', (event) => {
            console.log ("Go Back button pressed");
            this.History.navigateToPageByTag('manage-devices');
        });
        this.on('patient-device-history',  (event) => {
            console.log ("Patient device History button pressed");
            this.History.navigateToPageByTag('patient-device-history');
        });
    }





}