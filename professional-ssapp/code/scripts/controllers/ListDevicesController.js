const {WebcController} = WebCardinal.controllers;
export default class ListDevicesController extends WebcController {
    constructor(element, history) {
        super(element, history);

        //this.setModel(ViewPatientList);
        let receivedState = this.getState();
        this.model.allDevices = receivedState;
        console.log (this.model.allDevices);
        this._attachHandlerGoBack();
        this._attachHandlerPatientStatus();


    }

    _attachHandlerGoBack(){
        this.on('go-back', (event) => {
            console.log ("Go Back button pressed");
            this.navigateToPageTag('manage-devices');
        });
    }
    _attachHandlerPatientStatus(){
        this.on('patient-status',  (event) => {
            console.log ("Patient Status button pressed");
            this.navigateToPageTag('patient-status');
        });
    }


}