const {WebcController} = WebCardinal.controllers;

export default class PatientAlertHistoryController extends WebcController {
    constructor(element, history) {

        super(element, history);

        this.attachHandlerGoBack();
    }

    attachHandlerGoBack() {
        this.onTagClick('go-back', () => {
            this.history.goBack();
        });
    }
}
