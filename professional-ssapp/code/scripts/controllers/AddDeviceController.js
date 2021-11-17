const {WebcController} = WebCardinal.controllers;

export default class AddDeviceController extends WebcController {
    constructor(element, history) {

        super(element, history);

        const prevState = this.getState() || {};
        this.model = this.getFormViewModel(prevState);

        this.attachHandlerGoBackButton();
        this.attachHandlerSaveButton();

    }

    attachHandlerGoBackButton() {
        this.onTagClick('devices:go-back', () => {
            console.log("Go back button pressed");
            this.navigateToPageTag('manage-devices');
        });
    }

    attachHandlerSaveButton() {
        this.onTagClick('devices:save', () => {
            const deviceData = this.prepareDeviceData();
            this.navigateToPageTag("add-device-summary", deviceData);
        });
    }

    prepareDeviceData() {
        return {
            brand: this.model.brand.value,
            trial: this.model.trial.value,
            modelNumber: this.model.model.value,
            status: this.model.status.value,
            manufacturer: this.model.manufacturer.value,
            deviceName: this.model.name.value,
            resourceType: "Device",
            identifier: [{
                use: "official",
                type: {
                    coding: [{
                        system: "http://terminology.hl7.org/CodeSystem/v2-0203",
                        code: "SNO"
                    }]
                },
                value: this.model.deviceId.value
            }],
            serialNumber: this.model.deviceId.value,
            sk: this.model.deviceId.value
        };
    }

    getFormViewModel(prevState) {
        return {
            deviceId: {
                name: 'deviceid',
                id: 'deviceid',
                label: "Device ID",
                placeholder: 'QC1265389',
                required: true,
                value: prevState.serialNumber || ""
            },
            model: {
                name: 'model',
                id: 'model',
                label: "Device Model Number",
                placeholder: 'ELI 230',
                required: true,
                value: prevState.modelNumber || ""
            },
            manufacturer: {
                name: 'manufacturer',
                id: 'manufacturer',
                label: "Device Manufacturer",
                placeholder: 'Bionet',
                required: true,
                value: prevState.manufacturer || ""
            },
            name: {
                name: 'name',
                id: 'name',
                label: "Device Name",
                placeholder: 'BURDICK ELI 230 EKG MACHINE',
                required: true,
                value: prevState.deviceName || ""
            },
            brand: {
                name: 'brand',
                id: 'brand',
                label: "Device Brand",
                placeholder: 'Burdick',
                required: true,
                value: prevState.brand || ""
            },
            status: {
                label: "Device Status",
                required: true,
                options: [
                    {
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
                value: prevState.status || ""
            },
            trial: {
                label: "Clinical trial Number",
                required: true,
                options: [
                    {
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
                value: prevState.trial || ""
            }
        }
    }
}