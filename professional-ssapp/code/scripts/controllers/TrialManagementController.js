const {WebcController} = WebCardinal.controllers;

export default class TrialManagementController extends WebcController {
    constructor(...props) {
        super(...props);

        this._attachHandlerGoBack();
        this._attachHandlerPatientDeviceMatch();
    }

    _attachHandlerGoBack() {
        this.onTagClick('go-back', (event) => {
            console.log("Go Back button pressed");
            this.navigateToPageTag('home');
        });
    }
    _attachHandlerPatientDeviceMatch() {
        this.onTagClick('patient-device-match', (event) => {
            console.log ("patient device match");
            this.navigateToPageTag('patient-device-match');
        });
    }



}
