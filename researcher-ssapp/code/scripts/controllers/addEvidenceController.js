import ContainerController from '../../../cardinal/controllers/base-controllers/ContainerController.js';


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



export default class AddDeviceController extends ContainerController {
    constructor(element, history) {

        super(element, history);

        this.model = this.setModel(JSON.parse(JSON.stringify(AddDevicesViewModel)));

        this._attachHandlerGoBackButton();


    }

    _attachHandlerGoBackButton(){
        this.on('devices:go-back', (event) => {
            console.log ("Go back button pressed");
            this.History.navigateToPageByTag('manage-devices');
        });
    }



}