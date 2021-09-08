const {WebcController} = WebCardinal.controllers;


const AddDevicesViewModel = {
    deviceId: {
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
    },
    status: {
        label: "Status",
        required: true,
        options: [
            {
                label: "Status 1",
                value: 'Status 1'
            },
            {
                label: "Status 2",
                value: 'Status 2'
            },
            {
                label: "Status 3",
                value: 'Status 3'
            },
            
        ],
        value: ''
    },
    brands: {
        label: "Brand",
        required: true,
        options: [
            {
                label: "Brand 1",
                value: 'Brand 1'
            },
            {
                label: "Brand 2",
                value: 'Brand 2'
            },
            {
                label: "Brand 3",
                value: 'Brand 3'
            }
        ],
        value: ''
    },
    trails: {
        label: "Trails",
        required: true,
        options: [
            {
                label: "Trails 1",
                value: 'Trails 1'
            },
            {
                label: "Trails 2",
                value: 'Trails 2'
            },
            {
                label: "Trails 3",
                value: 'Trails 3'
            }
        ],
        value: ''
    },
    models: {
        label: "Model",
        required: true,
        options: [
            {
                label: "Model 1",
                value: 'Model 1'
            },
            {
                label: "Model 2",
                value: 'Model 2'
            },
            {
                label: "Model 3",
                value: 'Model 3'
            }
        ],
        value: ''
    },
}
let deviceData = {
    deviceId: "",
    brand: "",
    trail: "",
    model: "",
    status: ""

};


export default class AddDeviceController extends WebcController {
    constructor(element, history) {

        super(element, history);

        this.model = AddDevicesViewModel;

        this._attachHandlerGoBackButton();
        this._attachHandlerSaveButton();


    }

    _attachHandlerGoBackButton(){
        this.on('devices:go-back', (event) => {
            console.log ("Go back button pressed");
            this.navigateToPageTag('manage-devices');
        });
    }
    _attachHandlerSaveButton(){
        this.on('devices:save', (event) => {
            console.log (this.model);
            deviceData.deviceId = this.model.deviceId.value;
            deviceData.trail = this.model.trails.value;
            deviceData.model = this.model.models.value;
            deviceData.status = this.model.status.value;
            deviceData.brand = this.model.brands.value;
            console.log(deviceData);
            console.log ("Save button pressed");
            this.navigateToPageTag('manage-devices');
        });
    }



}