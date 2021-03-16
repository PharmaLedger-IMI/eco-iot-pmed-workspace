import ContainerController from '../../../cardinal/controllers/base-controllers/ContainerController.js';


export default class HomeController extends ContainerController {
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
            this.History.navigateToPageByTag('information-request');
        });
    }

    _attachHandlerConfigureAccessToData(){
        this.on('home:configure-access', (event) => {
            console.log ("Configure Access to Data button pressed");
            this.History.navigateToPageByTag('configure-access');
        });
    }

    _attachHandlerViewDynamicConsent(){
        this.on('home:view-dynamic-consent', (event) => {
            console.log ("View dynamic consent button pressed");
            this.History.navigateToPageByTag('view-dynamic-consent');
        });
    }

    _attachHandlerEvidence(){
        this.on('home:evidence', (event) => {
            console.log ("Evidence button pressed");
            this.History.navigateToPageByTag('evidence');
        });
    }
}