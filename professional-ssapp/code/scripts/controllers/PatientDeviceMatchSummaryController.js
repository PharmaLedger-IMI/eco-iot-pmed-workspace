const {WebcController} = WebCardinal.controllers;

export default class PatientDeviceMatchSummaryController extends WebcController {
    constructor(element, history) {
        super(element, history);

        this.model = this.getState();

        this.attachHandlerEditButton();
        this.attachHandlerAcceptButton();
    }

    attachHandlerEditButton() {
        this.onTagClick('summary:edit', () => {
            console.log("Edit button pressed");
            this.navigateToPageTag('patient-device-match', this.model.toObject());
        });
    }

    attachHandlerAcceptButton() {
        this.onTagClick('summary:accept', () => {
            this.navigateToPageTag('confirmation-page', {
                confirmationMessage: "Match Completed!",
                redirectPage: "trial-management"
            });
        });
    }
}