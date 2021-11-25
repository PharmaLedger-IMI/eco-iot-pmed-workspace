const {WebcController} = WebCardinal.controllers;


export default class RequestsMainController extends WebcController {
    constructor(...props) {
        super(...props);

        this.model = {};

        this._attachHandlerNewRequest();
        this._attachHandlerRequestsList();
        this._attachHandlerRequestsBackMenu();

    }

    _attachHandlerNewRequest() {
        this.onTagClick('requests-main:new-request', (event) => {
            this.navigateToPageTag('information-request');
        });
    }

    _attachHandlerRequestsList() {
        this.onTagClick('requests-main:list', (event) => {
            this.navigateToPageTag('view-information-requests');
        });
    }

    _attachHandlerRequestsBackMenu() {
        this.onTagClick('requests-main:home', (event) => {
            this.navigateToPageTag('home');
        });
    }

}
