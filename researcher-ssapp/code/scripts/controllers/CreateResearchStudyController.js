import StudiesService from "../services/StudiesService.js";
const {WebcController} = WebCardinal.controllers;


export default class CreateResearchStudyController extends WebcController {
    constructor(...props) {

        super(...props);

        const prevState = this.getState() || {};
        this.model = this.getBasicViewModel(prevState);
        this._attachHandlerResearcherBackMenu();
        this._attachHandlerResearchStudySummary();
        this.saveSampleStudy();
    }

    _attachHandlerResearchStudySummary() {
        this.onTagClick('research:2page', (event) => {
            const basicData = this.getBasicData();
            this.navigateToPageTag("create-research-study-inclusion-criteria", basicData);
        });
    }

    _attachHandlerResearcherBackMenu() {
        this.onTagClick('back-to-menu', (event) => {
            this.navigateToPageTag('home');
        });
    }

    getBasicData() {
        return {
            title: this.model.title.value,
            startdate: this.model.startdate.value,
            enddate: this.model.enddate.value,
            description: this.model.description.value
        };
    }

    getBasicViewModel(prevState) {
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
            }
        }
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
            participants: Date.now() ,
            status: "phase-1" + Date.now(),
        })
    }
}