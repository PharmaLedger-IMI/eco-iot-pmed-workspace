const {WebcController} = WebCardinal.controllers;
import StudiesService from "../services/StudiesService.js";


export default class ResearchStudyController extends WebcController {
    constructor(...props) {
        super(...props);

        this.model = {};

        this._attachHandlerCreateResearchStudy();
        this._attachHandlerResearchStudyList();
        this._attachHandlerResearchStudyBackMenu();
        this.saveSampleStudy();

    }

    _attachHandlerCreateResearchStudy() {
        this.onTagClick('research:create-research-study', (event) => {
            this.navigateToPageTag('create-research-study');
        });
    }

    _attachHandlerResearchStudyList() {
        this.onTagClick('research:list', (event) => {
            this.navigateToPageTag('research-study-list');
        });
    }

    _attachHandlerResearchStudyBackMenu() {
        this.onTagClick('research:home', (event) => {
            this.navigateToPageTag('home');
        });
    }

    saveSampleStudy(){
        this.StudiesService = new StudiesService();
        this.StudiesService.saveStudy(this.getDemoResearchStudies(), (err, data) => {
            if (err) {
                this.navigateToPageTag('confirmation-page', {
                    confirmationMessage: "An error has been occurred!",
                    redirectPage: "home"
                });
                return console.log(err);
            }
            console.log(data.uid);
        });
    }

    getDemoResearchStudies() {
        return ({
            title: "Research Study 2" + Date.now(),
            participants: "treatment"+ Date.now() ,
            status: "phase-1" + Date.now(),
        })
    }

}
