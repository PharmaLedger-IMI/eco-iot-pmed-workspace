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

    _attachHandlerAddDevice(){
        this.on('devices:add', (event) => {
            console.log ("Add devices button pressed");
            this.navigateToPageTag('add-device');
        });
    }

    _attachHandlerSearchDevice(){
        this.on('devices:search', (event) => {
           
        this.DeviceService = new DeviceService();

        this.DeviceService.searchDevice((err, devices) => {
            if (err) {
                return console.log(err);
            }
           this.navigateToPageTag('list-all-devices', devices);
            // console.log(evidence.sReadSSI);
        });
            
        });
    }

    _attachHandlerGoBack(){
        this.on('devices:back', (event) => {
            console.log ("Back devices Patients button pressed");
            this.navigateToPageTag('home');
        });
    }


}