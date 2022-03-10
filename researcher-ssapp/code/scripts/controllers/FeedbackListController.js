const {WebcController} = WebCardinal.controllers;

export default class FeedbackListController extends WebcController {
    constructor(...props) {
        super(...props);
        const prevState = this.getState() || {};
        const {breadcrumb, ...state} = prevState;

        this.model = prevState;
        this.model.breadcrumb.push({
            label:this.model.title + " Feedback",
            tag:"evidence-list",
            state: state
        });
       
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