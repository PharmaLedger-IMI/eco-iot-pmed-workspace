const {WebcController} = WebCardinal.controllers;


const AddDevicesViewModel = {
    deviceid: {
        name: 'deviceid',
        label: "Device ID",
        placeholder: 'Device ID',
        required: true,
        readOnly: false,
        value: ''
    },
    saveButton: {
        name: 'saveButton',
        label: "Save",
        required: true,
        readOnly: false,
        value: ''
    },
    gobackButton: {
        name: 'Go Back Button',
        label: "Back",
        required: true,
        readOnly: false,
        value: ''
    }
}



export default class AddDeviceController extends WebcController {
    constructor(element, history) {

        super(element, history);

        this.model = AddDevicesViewModel;

        this._attachHandlerGoBackButton();


    }

    _attachHandlerGoBackButton(){
        this.on('devices:go-back', (event) => {
            console.log ("Go back button pressed");
            this.navigateToPageTag('manage-devices');
        });
    }



}