const {
    WebcController
} = WebCardinal.controllers;
import DeviceService from "../services/DeviceService.js"
const keySSI = "27XvCBPKSWpUwscQUxwsVDTxRcaqv8AeYwe1gWThxDxXfJdmac1CRnDBV8VC8X1rxWjG6xjh7NthKZwsSJZw8r12kcpRuvJyo5wtZ6n5x7ATpS7V4N8RUNjcFFHkLpPkCkMeMVxVuL7yfxLvtVccSZ5";

const AddDevicesViewModel = {
    deviceId: {
        name: 'deviceid',
        label: "Device ID",
        placeholder: 'QC1265389',
        required: true,
        readOnly: false,
        value: ''
    },
    model: {
        name: 'model',
        label: "Device Model Number",
        placeholder: 'ELI 230',
        required: true,
        readOnly: false,
        value: ''
    },
    manufacturer: {
        name: 'manufacturer',
        label: "Device Manufacturer",
        placeholder: 'Bionet',
        required: true,
        readOnly: false,
        value: ''
    },
    name: {
        name: 'name',
        label: "Device Name",
        placeholder: 'BURDICK ELI 230 EKG MACHINE',
        required: true,
        readOnly: false,
        value: ''
    },
    brand: {
        name: 'brand',
        label: "Device Brand",
        placeholder: 'Burdick',
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
        label: "Device Status",
        required: true,
        options: [{
                label: "active",
                value: 'active'
            },
            {
                label: "inactive",
                value: 'inactive'
            },
            {
                label: "entered in error",
                value: 'entered in error'
            },
            {
                label: "unknown",
                value: 'unknown'
            }

        ],
        value: 'active'
    },

    trial: {
        label: "Clinical trial Number",
        required: true,
        options: [{
                label: "trials 1",
                value: 'trials 1'
            },
            {
                label: "trials 2",
                value: 'trials 2'
            },
            {
                label: "trials 3",
                value: 'trials 3'
            }
        ],
        value: ''
    }

}
let deviceData = {
    brand: "",
    trial: "",
    modelNumber: "",
    status: "",
    manufacturer: "",
    deviceName: "",
    resourceType: "Device",
    identifier: [{
        "use": "official",
        "type": {
            "coding": [{
                "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                "code": "SNO"
            }]
        },
        "value": "09160534033345"
    }],
    serialNumber: "09160534033345",
    sk: "09160534033345"
};


export default class AddDeviceController extends WebcController {
    constructor(element, history) {

        super(element, history);

        this.model = AddDevicesViewModel;
        
        this._attachHandlerGoBackButton();
        this._attachHandlerSaveButton();

    }

    _attachHandlerGoBackButton() {
        this.on('devices:go-back', (event) => {
            console.log("Go back button pressed");
            this.navigateToPageTag('manage-devices');
        });
    }
    _attachHandlerSaveButton() {
        this.on('devices:save', (event) => {
            // console.log (this.model);
            deviceData.serialNumber = this.model.deviceId.value;
            deviceData.sk = this.model.deviceId.value;
            deviceData.deviceName = this.model.name.value;
            deviceData.manufacturer = this.model.manufacturer.value;
            deviceData.trial = this.model.trial.value;
            deviceData.modelNumber = this.model.model.value;
            deviceData.status = this.model.status.value;
            deviceData.brand = this.model.brand.value;
            deviceData.identifier[0].value = this.model.deviceId.value;

            this.DeviceService = new DeviceService();
            this.DeviceService.createDevice(deviceData, (err, devices) => {
                if (err) {
                    return console.log(err);
                }
            });
            this.navigateToPageTag('manage-devices');
        });
    }



}