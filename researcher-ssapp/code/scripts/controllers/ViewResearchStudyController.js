const {WebcController} = WebCardinal.controllers;
import StudyNotesService from "../services/StudyNotesService.js"
const { DataSource } = WebCardinal.dataSources;


class NotesDataSource extends DataSource {
    constructor(notes,getTableElement) {
        super();
        this.model.notes = notes;
        this.getTableElement = getTableElement;
        this.model.elements = 10;
        this.hasAttachedView = false;
        this.setPageSize(this.model.elements);
        this.model.noOfColumns = 3;
    }

    addNewNotes(notes){
        notes.forEach(note=>{
            this.model.notes.push(note);
        });

        this.attachView();
        this.forceUpdate(true);
    }

    attachView(){
        if(!this.hasAttachedView){
            this._init(this.getTableElement)
            this.hasAttachedView = true;
        }
    }

    async getPageDataAsync(startOffset, dataLengthForCurrentPage) {
        console.log({startOffset, dataLengthForCurrentPage});
        if (this.model.notes.length <= dataLengthForCurrentPage ){
            this.setPageSize(this.model.notes.length);
        }
        else{
            this.setPageSize(this.model.elements);
        }
        let slicedData = [];
        this.setRecordsNumber(this.model.notes.length);
        if (dataLengthForCurrentPage > 0) {
            slicedData = Object.entries(this.model.notes).slice(startOffset, startOffset + dataLengthForCurrentPage).map(entry => entry[1]);
            console.log(slicedData)
        } else {
            slicedData = Object.entries(this.model.notes).slice(0, startOffset - dataLengthForCurrentPage).map(entry => entry[1]);
            console.log(slicedData)
        }
        return slicedData;
    }
}


export default class ViewResearchStudyController extends WebcController {

    dataSourceGetElement(){
        return this.querySelector("webc-datatable");
    }

    constructor(...props) {
        super(...props);

        this.containerElement = props[0];
        const prevState = this.getState() || {};
        this.model = prevState;
        this.model.notesViewModel = this.getViewNotesModel();

        this.StudyNotesService = new StudyNotesService();
        const getNotes = () => {
            return new Promise ((resolve, reject) => {
                this.StudyNotesService.getNotes((err, notes ) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(notes)
                })
            })
        }

        this.model.notesDataSource = new NotesDataSource([], this.dataSourceGetElement.bind(this));

        getNotes().then(data => {
            //this.model.hasNotes = data.length !== 0;
            let notes = data.filter(note => note.studyID === this.model.uid);
            this.model.notesDataSource.addNewNotes(notes);
            const { notesDataSource } = this.model;
            // this.onTagClick("view", (model) => {
            //     const {title} = model;
            //     console.log(title);
            // });
            this.onTagClick("prev-page", () => notesDataSource.goToPreviousPage());
            this.onTagClick("next-page", () => notesDataSource.goToNextPage());
        })


        this._attachHandlerBackMenu();
        this._attachHandlerViewDynamicConsents();
        this._attachHandlerSaveNote();
        this._attachHandlerViewNote();
    }

    _attachHandlerBackMenu() {
        this.onTagClick('view-research-study:go-back', (event) => {
            this.navigateToPageTag('home');
        });
    }

    _attachHandlerViewNote() {
        this.onTagClick('view-note', (model) => {
            const { noteTitle, noteText } = model;
            this.showModal(noteText, "note: "+ noteTitle);
        });
    }

    _attachHandlerSaveNote() {
        this.onTagClick('save-note', (event) => {
            let note = {
                date: new Date().toString(),
                noteText: this.model.notesViewModel.text.value,
                noteTitle: this.model.notesViewModel.title.value,
                studyID: this.model.uid
            }
            this.StudyNotesService.saveNote(note, (err, data) => {
                if (err) {
                    this.navigateToPageTag('confirmation-page', {
                        confirmationMessage: "An error has been occurred!",
                        redirectPage: "home"
                    });
                    return console.log(err);
                }
                this.model.notesDataSource.addNewNotes([data]);
                this.model.notesViewModel = this.getViewNotesModel();
            });
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
