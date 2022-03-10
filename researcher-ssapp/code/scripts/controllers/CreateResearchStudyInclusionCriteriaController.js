const {WebcController} = WebCardinal.controllers;


export default class CreateResearchStudyInclusionCriteriaController extends WebcController {
    constructor(...props) {

        super(...props);

        const prevState = this.getState() || {};
        this.model = this.getResearchViewModel(prevState);

        const { breadcrumb } = prevState;

        this._attachHandlerResearcherBackMenu();
        this._attachHandlerResearchStudySummary();

    }

    _attachHandlerResearchStudySummary() {
        this.onTagClick('go-to-summary', (event) => {
            const formData = this.getFormData();
            this.navigateToPageTag('create-research-study-summary', formData);
        });
    }

    _attachHandlerResearcherBackMenu() {
        this.onTagClick('back-to-first-page', (event) => {
            const formData = this.getFormData();
            this.navigateToPageTag('create-research-study', formData);
        });
    }

    getFormData() {
        return {
            title: this.model.title.value,
            startdate: this.model.startdate.value,
            enddate: this.model.enddate.value,
            description: this.model.description.value,
            age: this.model.age.value,
            sex: this.model.sex.value,
            pathologies: this.model.pathologies.value,
            others: this.model.others.value,
            data: this.model.data.value,
            header1: this.model.header1,
            uid: this.model.uid,
            breadcrumb: this.model.breadcrumb.toObject()
        };
    }

    getResearchViewModel(prevState) {
        return {
            uid: prevState.uid && prevState.uid || "",
            header1: prevState.header1 && prevState.header1 || "New study",
            header2: prevState.header2 && prevState.header2 || "Step (2/3) Inclusion Criteria",
            header3: prevState.header3 && prevState.header3 || "Please indicate the inclusion criteria of your study",
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
            breadcrumb: prevState.breadcrumb,
            others: {
                name: 'others',
                id: 'others',
                label: "Others",
                placeholder: 'Others (Separate each criteria using ;)',
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


}