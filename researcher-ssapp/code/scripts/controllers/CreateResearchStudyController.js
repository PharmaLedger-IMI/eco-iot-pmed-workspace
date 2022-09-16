import StudyStatusesService from "../services/StudyStatusesService.js";
const commonServices = require("common-services");
const {StudiesService} = commonServices;
const contractModelHL7 = commonServices.models.ContractModel;
const researchStudyModelHL7 = commonServices.models.ResearchStudyModel;
const  {getCommunicationServiceInstance} = commonServices.CommunicationService;
const BreadCrumbManager = commonServices.getBreadCrumbManager();
const Constants = commonServices.Constants;


export default class CreateResearchStudyController extends BreadCrumbManager {
    constructor(...props) {

        super(...props);

        const prevState = this.getState() || {};

        this.model = this.getBasicViewModel(prevState);

        this.model.breadcrumb = this.setBreadCrumb(
            {
                label: `${this.model.actionType} ${this.model.title.value}`,
                tag: "create-research-study"
            }
        );

        this._attachHandlerResearchStudyBack();
        this._attachHandlerResearchStudyNext();
        this.CommunicationService = getCommunicationServiceInstance();
    }

    prepareContractStudy(){
        let studyContract = {...contractModelHL7, ...researchStudyModelHL7};

        studyContract.ContractTitle = this.model.title.value;
        studyContract.ResearchStudyTitle = this.model.title.value;
        studyContract.ContractApplies = [this.model.startdate.value, this.model.enddate.value];
        studyContract.ResearchStudyPeriod = [this.model.startdate.value, this.model.enddate.value];
        studyContract.ResearchStudyDescription = this.model.description.value;

        studyContract.ResearchStudyRecruitmentAgeGroup = this.model.age.value;
        studyContract.ResearchStudyRecruitmentSex = this.model.sex.value;
        studyContract.ResearchStudyRecruitmentPreviousPathologies = this.model.pathologies.value;
        studyContract.ResearchStudyRecruitmentOthers = this.model.others.value;
        studyContract.ContractTerm = this.model.data.value;

        studyContract.ContractStatus = 'APPROVED';
        studyContract.ContractIssued = new Date();
        studyContract.ContractVersion = 0;
        return studyContract;
    }

    getAllStudyData() {

        let viewData = {
            participants: 0 ,
            status: StudyStatusesService.getInitialStatus(),
            title: this.model.title.value,
            startdate: this.model.startdate.value,
            enddate: this.model.enddate.value,
            description: this.model.description.value,
            age: this.model.age.value,
            sex: this.model.sex.value,
            pathologies: this.model.pathologies.value,
            others: this.model.others.value,
            data: this.model.data.value,
            researcherDID: this.model.researcherDID
        }
        let allData = {...this.prepareContractStudy(), ...viewData};
        return allData
    }

    saveStudy() {
        window.WebCardinal.loader.hidden = false;
        this.StudiesService = new StudiesService();
        this.StudiesService.saveStudy(this.getAllStudyData(), (err, data) => {
            let message = {};

            if (err) {
                message.content = "An error has been occurred!";
                message.type = 'error';
            } else {
                message.content = `The study ${this.model.title.value} has been created!`;
                message.type = 'success'
            }

            this.CommunicationService.sendMessageToIotAdapter({
                //TODO put in constants among with other operations that should have a consistent format
                //e.g all messages to iot-adapter should be in CONSTANTS.COMMUNICATION.IOT.NEW_STUDY
                operation: Constants.MESSAGES.RESEARCHER.NEW_STUDY,
                ssi:data.sReadSSI
            })

            window.WebCardinal.loader.hidden = true;
            this.navigateToPageTag('home', message);
        });
    }

    _attachHandlerResearchStudyNext() {
        this.onTagClick('research:next', () => {
            switch (this.model.phase) {
                case "phase1":
                    this.model.phase    = "phase2";
                    this.model.header2  = "Step (2/3) Inclusion Criteria";
                    this.model.header3  = "Please indicate the inclusion criteria of your study";
                    break;
                case "phase2":
                    this.model.phase            = "phase3";
                    this.model.header1          = "Study - Summary";
                    this.model.nextButton       = "Confirm";
                    this.model.previousButton   = "Edit";
                    this.model.header2          = false;
                    this.model.header3          = false;
                    break;
                case "phase3":
                    this.saveStudy();
                    break;
            }
        });
    }

    _attachHandlerResearchStudyBack() {
        this.onTagClick('research:back', () => {
            switch (this.model.phase){
                case "phase3":
                    this.model.nextButton       = "Next";
                    this.model.previousButton   = "Back";
                    this.model.phase            = "phase2";
                    this.model.header1          = "New study";
                    this.model.header2  = "Step (2/3) Inclusion Criteria";
                    this.model.header3  = "Please indicate the inclusion criteria of your study";
                    break;
                case "phase2":
                    this.model.phase = "phase1";
                    this.model.header2  = "Step (1/3) Basic Information";
                    this.model.header3  = "Complete the following information to create a new research study";
                    break;
                case "phase1":
                    this.navigateToPageTag('home');
            }
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
            breadcrumb: this.model.toObject('breadcrumb')
        };
    }

    getBasicViewModel(prevState) {
        return {
            nextButton: "Next",
            previousButton: "Back",
            phase: "phase1",
            header1: "New study",
            header2: "Step (1/3) Basic Information",
            header3: "Complete the following information to create a new research study",
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
                        label: "Age 18-30",
                        value: '18-30'
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
                    },
                    {
                        label: "All",
                        value: 'all'
                    }
                ],
                value: prevState.age || "all"
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
                        label: "All",
                        value: 'both'
                    }
                ],
                value: prevState.sex || "both"
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
                value: prevState.pathologies || "n/a"
            },
            breadcrumb: prevState.breadcrumb,
            actionType: prevState.actionType,
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
                options: [
                    {
                        label: "SpO2",
                        value: 'SpO2'
                    },
                    {
                        label: "Systolic Blood Pressure",
                        value: 'Systolic Blood Pressure'
                    },
                    {
                        label: "Diastolic Blood Pressure",
                        value: 'Diastolic Blood Pressure'
                    },
                    {
                        label: "Fitbit Activity",
                        value: 'fitbit activity'
                    }
                ],
                value: prevState.data || ""
            },
            researcherDID: prevState.researcherDID || ""
        }
    }

}