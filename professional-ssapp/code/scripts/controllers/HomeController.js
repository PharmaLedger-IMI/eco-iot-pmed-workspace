import ContainerController from '../../../cardinal/controllers/base-controllers/ContainerController.js';


export default class HomeController extends ContainerController {
    constructor(element, history) {
        super(element, history);
        //this.setModel({});

        this._attachHandlerManageDevices();
        this._attachHandlerTrialManagement();
        this._attachHandlerListOfPatients();

    }

    _attachHandlerManageDevices(){
        this.on('home:manage-devices', (event) => {
            console.log ("Manage devices button pressed");
            this.History.navigateToPageByTag('manage-devices');
        });
    }

    _attachHandlerTrialManagement(){
        this.on('home:trial-management', (event) => {
            console.log ("Trial Management button pressed");
            this.History.navigateToPageByTag('trial-management');
        });
    }

    _attachHandlerListOfPatients(){
        this.on('home:list-of-patients', (event) => {
            console.log ("List of Patients button pressed");
            this.History.navigateToPageByTag('list-of-patients');
        });
    }


}