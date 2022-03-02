const {WebcController} = WebCardinal.controllers;

export default class CreateFeedbackController extends WebcController {
    constructor(...props) {
        super(...props);
        const prevState = this.getState() || {};
        this.model = prevState
        //this.model.desc = "Descripttion of the Feedback (Free Text - No limits of Characters)"
        this._attachHandlerResearcherBack();
    }

    _attachHandlerResearcherBack() {
        this.onTagClick('back-to-feedback-list', (event) => {
            this.navigateToPageTag('feedback-list',this.model.toObject());
        });
    }

}