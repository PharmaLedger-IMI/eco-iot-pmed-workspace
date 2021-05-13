const {WebcController} = WebCardinal.controllers;


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
            console.log ("Search devices button pressed");
            this.navigateToPageTag('list-all-devices');
        });
    }

    _attachHandlerGoBack(){
        this.on('devices:back', (event) => {
            console.log ("Back devices Patients button pressed");
            this.navigateToPageTag('home');
        });
    }


}