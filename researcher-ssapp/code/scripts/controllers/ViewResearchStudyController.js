const {WebcController} = WebCardinal.controllers;
import StudyNotesService from "../services/StudyNotesService.js"
import StudiesService from "../services/StudiesService.js";
const { DataSource } = WebCardinal.dataSources;


class NotesDataSource extends DataSource {
    constructor(notes) {
        super();
        this.model.notes = notes;
        this.model.elements = 10;
        this.setPageSize(this.model.elements);
        this.model.noOfColumns = 3;
    }

    addNewNotes(notes){
        if(notes.length === 0){
            return;
        }
        this.model.notes.push(...notes);
        //update the dataSize while the webc-component is not yet aware of updated data
        this.getElement().dataSize = this.model.notes.length;
        this.forceUpdate(true);
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

    constructor(...props) {
        super(...props);

        this.containerElement = props[0];
        const prevState = this.getState() || {};
        const {breadcrumb, ...state} = prevState

        this.model.study_id = prevState.uid;
        this.model.breadcrumb = prevState.breadcrumb;
        this.model.title = prevState.title;

        this.model.breadcrumb.push({
            label:this.model.title,
            tag:"view-research-study",
            state: state
        });

        this.StudiesService = new StudiesService();
        this.StudiesService.getStudy(this.model.study_id, (err, studyData) => {
            if (err){
                return console.log(err);
            }
            this.model = this.getViewStudyModel(studyData);
        });

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


        getNotes().then(data => {
            this.model.hasNotes = data.length>0;
            let notes = data.filter(note => note.studyID === this.model.uid);
            notes.forEach(note => note.date = new Date(note.date).toLocaleDateString());
            this.model.notesDataSource = new NotesDataSource(notes);
            const { notesDataSource } = this.model;
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
            window.WebCardinal.loader.hidden = false;
            let note = {
                date: Date.now(),
                noteText: this.model.notesViewModel.text.value,
                noteTitle: this.model.notesViewModel.title.value,
                studyID: this.model.uid
            }
            this.StudyNotesService.saveNote(note, (err, note) => {
                if (err) {
                    let message = {
                        content: `An error has been occurred!`,
                        type: 'error'
                    }
                    window.WebCardinal.loader.hidden = true;
                    this.navigateToPageTag('home', message);
                    return console.log(err);
                }
                note.date = new Date(note.date).toLocaleDateString();
                this.model.notesDataSource.addNewNotes([note]);
                this.model.notesViewModel = this.getViewNotesModel();
                window.WebCardinal.loader.hidden = true;
            });
        });
    }

    _attachHandlerViewDynamicConsents() {
        this.onTagClick('view-dynamic-permission', (event) => {
            let study = {
                studyId: this.model.uid,
                breadcrumb:this.model.breadcrumb.toObject()
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

    getViewStudyModel(prevState) {
        return {
            title: {
                name: 'title',
                id: 'title',
                label: "Title",
                placeholder: 'Name for this study',
                required: true,
                value: prevState.title || ""
            },
            startdate: {
                name: 'Start Date',
                id: 'Start Date',
                label: "Starting date",
                placeholder: 'Starting date',
                value: prevState.startdate || ""
            },
            enddate: {
                name: 'End Date',
                id: 'End Date',
                label: "Ending date",
                placeholder: 'Ending date',
                value: prevState.enddate || ""
            },
            description: {
                name: 'description',
                id: 'description',
                label: "Description",
                placeholder: 'Description for this study',
                value: prevState.description || ""
            },
            age: {
                label: "Age Group",
                required: true,
                options: [
                    {
                        label: "Age 10-30",
                        value: '10-30'
                    },
                    {
                        label: "Age 30-40",
                        value: '30-40'
                    },
                    {
                        label: "Age 40-50",
                        value: '40-50'
                    },
                    {
                        label: "Age 50-60",
                        value: '50-60'
                    },
                    {
                        label: "Age 60+",
                        value: '60+'
                    }
                ],
                value: prevState.age || ""
            },
            sex: {
                label: "Sex",
                required: true,
                options: [{
                    label: "Males",
                    value: 'males'
                },
                    {
                        label: "Females",
                        value: 'females'
                    },
                    {
                        label: "Males & Females",
                        value: 'both'
                    },
                    {
                        label: "N/A",
                        value: 'n/a'
                    }
                ],
                value: prevState.sex || ""
            },
            pathologies: {
                label: "Previous Pathologies",
                required: true,
                options: [{
                    label: "Heart Disease",
                    value: 'Heart Disease'
                },
                    {
                        label: "Respiratory Disease",
                        value: 'Respiratory Disease'
                    },
                    {
                        label: "T2D",
                        value: 'T2D'
                    },
                    {
                        label: "Chikungunya virus disease",
                        value: 'Chikungunya virus disease'
                    },
                    {
                        label: "Cholera",
                        value: 'Cholera'
                    },
                    {
                        label: "COVID-19",
                        value: 'COVID-19'
                    },
                    {
                        label: "N/A",
                        value: 'n/a'
                    }
                ],
                value: prevState.pathologies || ""
            },
            others: {
                name: 'others',
                id: 'others',
                label: "Others (Separate each criteria using ;)",
                placeholder: 'others',
                value: prevState.others || ""
            },
            data: {
                label: "Please indicate the data that you need to obtain:",
                required: true,
                options: [{
                    label: "ECG",
                    value: 'ECG'
                },
                    {
                        label: "Respiration",
                        value: 'respiration'
                    },
                    {
                        label: "SpO2",
                        value: 'spo2'
                    },
                    {
                        label: "Temperature",
                        value: 'temperature'
                    },
                    {
                        label: "N/A",
                        value: 'n/a'
                    },
                ],
                value: prevState.data || ""
            },
            uid: prevState.uid || "",
            status: prevState.status || ""
        }
    }

}
