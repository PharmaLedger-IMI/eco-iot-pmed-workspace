const {WebcController} = WebCardinal.controllers;


export default class HomeController extends WebcController {
    constructor(...props) {

        super(...props);


        this._attachHandlerInformationRequest()
        this._attachHandlerConfigureAccessToData()
        this._attachHandlerViewDynamicPermission()
        this._attachHandlerEvidence()

    }

    _attachHandlerInformationRequest(){
        this.on('home:information-request', (event) => {
            console.log ("Information request button pressed");
            this.navigateToPageTag('information-request');
        });
    }

    _attachHandlerConfigureAccessToData(){
        this.on('home:configure-access', (event) => {
            console.log ("Configure Access to Data button pressed");
            this.navigateToPageTag('configure-access');
        });
    }

    _attachHandlerViewDynamicPermission(){
        this.on('home:view-dynamic-permission', (event) => {
            console.log ("View dynamic permission button pressed");
            this.navigateToPageTag('view-dynamic-permission');
        });
    }

    _attachHandlerEvidence(){
        this.on('home:evidence', (event) => {
            console.log ("Evidence button pressed");
            this.navigateToPageTag('evidence');
        });
    }
}