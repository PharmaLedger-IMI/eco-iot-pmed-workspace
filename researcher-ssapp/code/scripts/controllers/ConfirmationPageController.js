const {WebcController} = WebCardinal.controllers;

export default class ConfirmationPageController extends WebcController {
    constructor(element, history) {
        super(element, history);

        this.model = this.getState();

        this.attachBackToMenuHandler();
    }

    attachBackToMenuHandler() {
        this.onTagClick("back-to-menu", () => {
            this.navigateToPageTag(this.model.redirectPage);
        });
    }
}