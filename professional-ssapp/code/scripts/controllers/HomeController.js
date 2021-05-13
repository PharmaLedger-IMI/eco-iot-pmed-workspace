const {WebcController} = WebCardinal.controllers;


export default class HomeController extends WebcController {
    constructor(element, history) {
        super(element, history);


        this._attachHandlerManageDevices();
        this._attachHandlerTrialManagement();
        this._attachHandlerListOfPatients();

    }

    _attachHandlerManageDevices(){
        this.on('home:manage-devices', (event) => {
            console.log ("Manage devices button pressed");
            this.navigateToPageTag('manage-devices');
        });
    }

    _attachHandlerTrialManagement(){
        this.on('home:trial-management', (event) => {
            console.log ("Trial Management button pressed");
            this.navigateToPageTag('trial-management');
        });
    }

    _attachHandlerListOfPatients(){
        this.on('home:list-of-patients', (event) => {
            console.log ("List of Patients button pressed");
            this.navigateToPageTag('list-of-patients');
        });
    }


}