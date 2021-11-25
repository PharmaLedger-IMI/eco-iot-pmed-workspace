const {WebcController} = WebCardinal.controllers;


export default class ViewInformationRequestsController extends WebcController {
    constructor(...props) {
        super(...props);

        this.model = {};

        this._attachHandlerViewRequestsBackMenu();

    }

    _attachHandlerViewRequestsBackMenu() {
        this.onTagClick('view-requests:go-back', (event) => {
            this.navigateToPageTag('requests-main');
        });
    }

}
