import ContainerController from '../../../cardinal/controllers/base-controllers/ContainerController.js';


export default class RequestsController extends ContainerController {
    constructor(element, history) {

        super(element, history);
        this._attachHandlerIssueNewRequest()

    }

    _attachHandlerIssueNewRequest(){
        this.on('home:new-information-request', (event) => {
            console.log ("New information request button pressed");
            this.History.navigateToPageByTag('issue-new-request');
        });
    }

}