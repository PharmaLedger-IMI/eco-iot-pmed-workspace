const {WebcController} = WebCardinal.controllers;


export default class ResearchStudyController extends WebcController {
    constructor(...props) {
        super(...props);

        this.model = {};

        this._attachHandlerCreateResearchStudy();
        this._attachHandlerResearchStudyList();
        this._attachHandlerResearchStudyBackMenu();
        this.getDemoResearchStudy();

    }

    _attachHandlerCreateResearchStudy() {
        this.onTagClick('research:create-research-study', (event) => {
            this.navigateToPageTag('create-research-study');
        });
    }

    _attachHandlerResearchStudyList() {
        this.onTagClick('research:list', (event) => {
            const researchData = this.getDemoResearchStudy();
            this.navigateToPageTag('research-study-list', researchData);
        });
    }

    _attachHandlerResearchStudyBackMenu() {
        this.onTagClick('research:home', (event) => {
            this.navigateToPageTag('home');
        });
    }
    getDemoResearchStudy(){
        return [
            {
            title: "Research Study 1",
            primaryPurposeType: "treatment",
            phase: "phase-1",
            status: "active",
            note: "General Note"
            },
            {
                title: "Research Study 2",
                primaryPurposeType: "diagnostic",
                phase: "phase-1-phase-2",
                status: "completed",
                note: "General Note 2"
            },
            {
                title: "Research Study 3",
                primaryPurposeType: "supportive care",
                phase: "phase-2",
                status: "approved",
                note: "General Note 3"
            }
        ];
    }

}
