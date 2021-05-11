const {WebcController} = WebCardinal.controllers;


export default class HomeController extends WebcController {
    constructor(element, history) {

        super(element, history);


        this._attachHandlerInformationRequest()
        this._attachHandlerConfigureAccessToData()
        this._attachHandlerViewDynamicConsent()
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

    _attachHandlerViewDynamicConsent(){
        this.on('home:view-dynamic-consent', (event) => {
            console.log ("View dynamic consent button pressed");
            this.navigateToPageTag('view-dynamic-consent');
        });
    }

    _attachHandlerEvidence(){
        this.on('home:evidence', (event) => {
            console.log ("Evidence button pressed");
            this.navigateToPageTag('evidence');
        });
    }
}