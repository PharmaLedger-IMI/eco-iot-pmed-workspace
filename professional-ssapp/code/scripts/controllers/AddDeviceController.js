const {WebcController} = WebCardinal.controllers;
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
    status: {
        label: "Device Status",
        required: true,
        options: [{
                label: "Active",
                value: 'Active'
            },
            {
                label: "Inactive",
                value: 'Inactive'
            },
            {
                label: "Entered in error",
                value: 'Entered in error'
            },
            {
                label: "Unknown",
                value: 'Unknown'
            }

        ],
        value: 'Active'
    },
    trial: {
        label: "Clinical trial Number",
        required: true,
        options: [{
                label: "Trial 1",
                value: 'Trial 1'
            },
            {
                label: "Trial 2",
                value: 'Trial 2'
            },
            {
                label: "Trial 3",
                value: 'Trial 3'
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
        this.onTagClick('devices:go-back', (event) => {
            this.navigateToPageTag('manage-devices');
        });
    }
    _attachHandlerSaveButton() {
        this.onTagClick('devices:save', (event) => {
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