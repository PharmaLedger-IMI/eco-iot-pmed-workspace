const {WebcController} = WebCardinal.controllers;

export default class ListDevicesController extends WebcController {
    constructor(element, history) {
        super(element, history);

        this.model = {allDevice: []};
        this.model.allDevices = JSON.parse(JSON.stringify(this.getState()));

        this.attachHandlerGoBack();
        this.attachHandlerViewDevice();
        this.attachHandlerEditDevice();
    }

    attachHandlerGoBack() {
        this.onTagClick('go-back', () => {
            console.log("Go Back button pressed");
            this.navigateToPageTag('manage-devices');
        });
    }

    attachHandlerViewDevice() {
        this.onTagClick('view', (model) => {
            console.log("Patient Status button pressed", model);
            this.navigateToPageTag('patient-status', model);
        });
    }

    attachHandlerEditDevice() {
        this.onTagClick('view', (model) => {
            console.log("Edit Device button pressed", model);
            this.navigateToPageTag('patient-status', model);
        });
    }
}