const {WebcController} = WebCardinal.controllers;

export default class TrialManagementController extends WebcController {
    constructor(...props) {
        super(...props);

        this._attachHandlerGoBack();
    }

    _attachHandlerGoBack() {
        this.on('go-back', (event) => {
            console.log("Go Back button pressed");
            this.navigateToPageTag('home');
        });
    }



}
