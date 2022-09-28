const commonServices = require("common-services");
const DidService =commonServices.DidService;
const { getCommunicationServiceInstance } = commonServices.CommunicationService;
const {StudiesService} = commonServices;
import StudyStatusesService from "../services/StudyStatusesService.js";
import MessageSubscriberService from "../services/MessageSubscriberService.js";
const Constants = commonServices.Constants;
const {STUDY_STATUSES} = commonServices.Constants;
const DataSourceFactory = commonServices.getDataSourceFactory();
const BreadCrumbManager = commonServices.getBreadCrumbManager();

const ACTION_TYPES = {
    ADD: 'New Study',
    EDIT: 'Edit Study'
}

export default class HomeController extends BreadCrumbManager {
    constructor(...props) {
        super(...props);

        this.model = this.getInitialModel();
        this.studies = [];

        this.MessageSubscriberService = MessageSubscriberService.init();
        let communicationService = getCommunicationServiceInstance();
        this.model.publicDidReady = false;
        communicationService.onPrimaryDidReady((err, didDocument)=>{

            if(err){
                throw err;
            }
            this.model.publicDidReady = true;
        })

        this.model.message = this.getState() || {};

        this.initHandlers();
        this.initServices();
    }

    initHandlers() {
        this.onTagClick('new:study', () => {
            this.navigateToPageTag('create-research-study', { breadcrumb: this.model.toObject('breadcrumb'), actionType: ACTION_TYPES.ADD, researcherDID: this.model.did });
        });

        this.onTagClick('change-status',(nextStatus)=>{
            let selectedStudy = this.studies.find(study => study.uid === nextStatus.studyId);
            const uid = selectedStudy.uid;
            
            this.model.statusModal = {
                note: {
                    placeholder: 'Please insert a reason...',
                    value: '',
                    label: 'Status Change Reason:'
                },
                noteIsEmpty: true,
                fromStatus: selectedStudy.statusLabel,
                toStatus: nextStatus.label,
                studyId: nextStatus.studyId
            }

            this.showModalFromTemplate('statusModal',
                () => {
                    window.WebCardinal.loader.hidden = false;
                    let note = {
                        date: Date.now(),
                        noteText: `${this.model.statusModal.note.value}`,
                        noteTitle: `Changed Status from ${this.model.statusModal.fromStatus} to ${this.model.statusModal.toStatus}`,
                        studyID: uid
                    }
                    
                    selectedStudy.status = nextStatus.step;

                    this.StudiesService.updateStudy(selectedStudy, note,  (err, data) => {
                        if (this.model.statusModal.toStatus=== STUDY_STATUSES.LABEL_ACTIVE && this.model.statusModal.fromStatus!== STUDY_STATUSES.LABEL_ON_HOLD) {
                            this.StudiesService.getDSUsReadSSI(data.uid, (err, SReadSSI)=> {
                                let communicationService = getCommunicationServiceInstance();
                                communicationService.sendMessageToIotAdapter({
                                    operation: Constants.MESSAGES.RESEARCHER.COMMUNICATE_STUDY_DATA_MATCHMAKING,
                                    ssi:SReadSSI
                                })
                            });
                        }
                        this.prepareStudiesView();
                        this.model.studiesDataSource.updateRecords();
                        window.WebCardinal.loader.hidden = true;
                    });
                },
                () => {}, {
                controller: 'StatusModalController',    
                model: this.model,
                disableExpanding: true,
                cancelButtonText: 'Cancel',
                confirmButtonText: 'Confirm',
            });

        })
    }

    async initServices() {
        this.StudiesService = new StudiesService();


        const getStudies = () => {
            return new Promise ((resolve, reject) => {
                this.StudiesService.getStudies((err, received_studies ) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(received_studies)
                })
            })
        }

        getStudies().then(received_studies => {
            this.model.hasStudies = received_studies.length !== 0;
            this.studies = received_studies;
            this.prepareStudiesView();
            this.model.studiesDataSource = DataSourceFactory.createDataSource(8, 10, JSON.parse(JSON.stringify(this.studies)));
            const self = this;
            this.model.studiesDataSource.updateRecords = function() {
                if (typeof this.getElement === "function") {
                    this.model.tableData = JSON.parse(JSON.stringify(self.studies));
                    this.getElement().dataSize = self.studies.length;
                    this.forceUpdate(true);
                }
            }
            this.onTagClick("view", (model) => {
                let chosenStudy = this.studies.find(study => study.uid === model.uid);
                let viewStatus = {
                    title: chosenStudy.title,
                    uid: chosenStudy.uid,
                    breadcrumb: this.model.toObject('breadcrumb')
                }
                this.navigateToPageTag('view-research-study', viewStatus);
            });
            this.onTagClick("edit", (model) => {
                let chosenStudy = this.studies.find(study => study.uid === model.uid);
                let studyState = {
                    uid: chosenStudy.uid,
                    title: chosenStudy.title,
                    breadcrumb: this.model.toObject('breadcrumb'),
                    actionType: ACTION_TYPES.EDIT,
                    researcherDID: this.model.did
                }
                this.navigateToPageTag('edit-research-study', studyState);
            });
            this.onTagClick("feedback-list", (model) => {
                let chosenStudy = this.studies.find(study => study.uid === model.uid);
                let studyState = {
                    uid: chosenStudy.uid,
                    title: chosenStudy.title,
                    breadcrumb: this.model.toObject('breadcrumb'),
                }
                this.navigateToPageTag('feedback-list', studyState);
            });
            this.onTagClick("results", (model) => {
                let chosenStudy = this.studies.find(study => study.uid === model.uid);
                let studyState = { 
                    uid: chosenStudy.uid,
                    title: chosenStudy.title,
                    breadcrumb: this.model.toObject('breadcrumb'),
                }
                this.navigateToPageTag('results-list', studyState);
            });
            this.onTagClick("data", (model) => {
                let chosenStudy = this.studies.find(study => study.uid === model.uid);
                let studyState = {
                    uid: chosenStudy.uid,
                    title: chosenStudy.title,
                    breadcrumb: this.model.toObject('breadcrumb'),
                }
                this.navigateToPageTag('data-list', studyState);
            });
        })
        this.model.did = await DidService.getDidServiceInstance().getDID();

        this.updateStudyHandler = (err, updatedStudy) => {
            if(err){
                return console.error(err);
            }

            let toBeUpdatedIndex = this.studies.findIndex(study => updatedStudy.uid === study.uid);
            if(toBeUpdatedIndex === -1){
                return console.error("Study not found");
            }

            this.studies[toBeUpdatedIndex] = updatedStudy;
            this.prepareStudiesView();
            this.model.studiesDataSource.updateRecords();
        };

        this.MessageSubscriberService.subscribe("study-participant-update", this.updateStudyHandler);
    }

    onDisconnectedCallback(){
        if(this.updateStudyHandler){
            this.MessageSubscriberService.unsubscribe("study-participant-update", this.updateStudyHandler);
        }
    }

    prepareStudiesView(){
        this.studies.forEach(study=>{
            let statusesService = new StudyStatusesService(study.status);
            const currentStatus = statusesService.getCurrentStatus();
            const statusActions = currentStatus.actions;
            study.statusLabel = currentStatus.label;
            study.statusActions = statusesService.getNextPossibleSteps();
            study.hasStatusActions = study.statusActions.length > 0;
            study.statusActions.forEach(action => action.studyId = study.uid);

            const ACTIONS = StudyStatusesService.getActions();
            study.preventActions = {
                preventView:!statusActions.includes(ACTIONS.VIEW),
                preventEdit:!statusActions.includes(ACTIONS.EDIT),
                preventFeedback:!statusActions.includes(ACTIONS.FEEDBACK),
                preventResults:!statusActions.includes(ACTIONS.RESULT),
                preventData:!statusActions.includes(ACTIONS.DATA),
            }

        });
    }

    getInitialModel() {
        return {
            did: "",
            breadcrumb : [{
                label:"Dashboard",
                tag:"home",
                state:{}
            }]
        };
    }
}
