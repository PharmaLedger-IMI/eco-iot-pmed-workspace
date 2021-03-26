import ContainerController from '../../../cardinal/controllers/base-controllers/ContainerController.js';


export default class ManageDevicesController extends ContainerController {
    constructor(element, history) {
        super(element, history);
        this.setModel({});

        this._attachHandlerAddDevice();
        this._attachHandlerSearchDevice();
        this._attachHandlerGoBack();

    }

    _attachHandlerAddDevice(){
        this.on('devices:add', (event) => {
            console.log ("Add devices button pressed");
            this.History.navigateToPageByTag('add-device');
        });
    }

    _attachHandlerSearchDevice(){
        this.on('devices:search', (event) => {
            console.log ("Search devices button pressed");
            this.History.navigateToPageByTag('list-all-devices');
        });
    }

    _attachHandlerGoBack(){
        this.on('devices:back', (event) => {
            console.log ("Back devices Patients button pressed");
            this.History.navigateToPageByTag('home');
        });
    }


}