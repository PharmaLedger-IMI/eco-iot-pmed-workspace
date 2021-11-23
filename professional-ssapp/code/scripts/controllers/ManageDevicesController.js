const {WebcController} = WebCardinal.controllers;

export default class ManageDevicesController extends WebcController {
    constructor(element, history) {
        super(element, history);
        this.model = {};

        this.attachHandlerAddDevice();
        this.attachHandlerSearchDevice();
        this.attachHandlerGoBack();

    }

    attachHandlerAddDevice() {
        this.onTagClick('devices:add', () => {
            this.navigateToPageTag('add-device');
        });
    }

    attachHandlerSearchDevice() {
        this.onTagClick('devices:search', () => {
            this.navigateToPageTag('list-all-devices');
        });
    }

    attachHandlerGoBack() {
        this.onTagClick('devices:back', () => {
            this.navigateToPageTag('home');
        });
    }
}