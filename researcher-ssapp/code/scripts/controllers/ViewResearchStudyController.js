const {WebcController} = WebCardinal.controllers;
import StudyNotesService from "../services/StudyNotesService.js"


export default class ViewResearchStudyController extends WebcController {
    constructor(...props) {
        super(...props);

        const prevState = this.getState() || {};
        this.model = prevState;
        this.model.notes = [
            {
                date: new Date().toString(),
                note: "note 1"
            },
            {
                date: new Date().toString(),
                note: "note 2"
            }
        ]

        this.model.notesViewModel = this.getViewNotesModel();

        console.log(this.model);
        this._attachHandlerBackMenu();
        this._attachHandlerViewDynamicConsents();
        this._attachHandlerSaveNote();

    }

    _attachHandlerBackMenu() {
        this.onTagClick('view-research-study:go-back', (event) => {
            this.navigateToPageTag('home');
        });
    }

    _attachHandlerSaveNote() {
        this.onTagClick('save-note', (event) => {
            console.log("saving note...")
        });
    }

    _attachHandlerViewDynamicConsents() {
        this.onTagClick('view-dynamic-permission', (event) => {
            let study = {
                studyID: this.model.uid
            }
            this.navigateToPageTag('dynamic-consents', study);
        });
    }

    getViewNotesModel(){
        return {
            title: {
                name: 'title',
                id: 'title',
                label: "Title",
                placeholder: 'Title for this note',
                required: true,
                value:  ""
            },
            text: {
                name: 'text',
                id: 'text',
                label: "Text",
                placeholder: 'Insert your note text',
                value:  ""
            }
        }
    }

}
