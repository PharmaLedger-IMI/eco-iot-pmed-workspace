const {WebcController} = WebCardinal.controllers;


export default class EvidenceController extends WebcController {
    constructor(...props) {
        super(...props);

        this.model = {};

        this._attachHandlerEvidenceP1();
        this._attachHandlerEvidenceList();
        this._attachHandlerEvidenceBackMenu();

    }

    _attachHandlerEvidenceP1() {
        this.onTagClick('evidence:add-evidence-p1', (event) => {
            this.navigateToPageTag('add-evidence-p1');
        });
    }

    _attachHandlerEvidenceList() {
        this.onTagClick('evidence:list', (event) => {
            this.navigateToPageTag('evidence-list');
        });
    }

    _attachHandlerEvidenceBackMenu() {
        this.onTagClick('evidence:home', (event) => {
            this.navigateToPageTag('home');
        });
    }

}
