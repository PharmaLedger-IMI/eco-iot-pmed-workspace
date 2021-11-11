const {WebcController} = WebCardinal.controllers;

import DeviceService from "../services/DeviceService.js"

export default class ManageDevicesController extends WebcController {
    constructor(element, history) {
        super(element, history);
        this.model = {};

        this._attachHandlerAddDevice();
        this._attachHandlerSearchDevice();
        this._attachHandlerGoBack();

    }

    _attachHandlerAddDevice() {
        this.onTagClick('devices:add', () => {
            this.navigateToPageTag('add-device');
        });
    }

    _attachHandlerSearchDevice() {
        this.onTagClick('devices:search', () => {
            this.DeviceService = new DeviceService();
            this.DeviceService.searchDevice((err, devices) => {
                if (err) {
                    return console.log(err);
                }
                this.navigateToPageTag('list-all-devices', devices);
            });
        });
    }

    _attachHandlerGoBack() {
        this.onTagClick('devices:back', () => {
            this.navigateToPageTag('home');
        });
    }


}