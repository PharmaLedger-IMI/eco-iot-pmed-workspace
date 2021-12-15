const {WebcController} = WebCardinal.controllers;

export default class ResearchStudyListController extends WebcController {
    constructor(...props) {
        super(...props);
        this.model = {};

        this.model.researchStudy = this.getState();

        this.attachHandlerHome();
    }

    attachHandlerHome() {
        this.onTagClick('research:back', () => {
            this.navigateToPageTag('research-study');
        });
    }


}