const {WebcController} = WebCardinal.controllers;

export default class FeedbackListController extends WebcController {
    constructor(...props) {
        super(...props);
        const prevState = this.getState() || {};
        this.model = prevState
        this._attachHandlerResearcherBack();
        this._attachHandlerResearcherCreateFeedback();
    }

    _attachHandlerResearcherBack() {
        this.onTagClick('back', (event) => {
            this.navigateToPageTag('home');
        });
    }

    _attachHandlerResearcherCreateFeedback() {
        this.onTagClick('create-feedback', (event) => {
            this.navigateToPageTag('create-feedback',this.model.toObject());
        });
    }
 
}