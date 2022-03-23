const {WebcController} = WebCardinal.controllers;
const commonServices = require("common-services");
const DidService =commonServices.DidService;
const {getCommunicationServiceInstance} = commonServices.CommunicationService;
const MessageHandlerService = commonServices.MessageHandlerService;
import StudiesService from "../services/StudiesService.js";
import DPermissionService from "../services/DPermissionService.js";
import StudyStatusesService from "../services/StudyStatusesService.js";
const { DataSource } = WebCardinal.dataSources;

const ACTION_TYPES = {
    ADD: 'Add',
    EDIT: 'Edit'
}

class StudiesDataSource extends DataSource {
    constructor(...props) {
        super(...props);
        this.model.studies = props[0];
        this.model.elements = 10;
        this.setPageSize(this.model.elements);
        this.model.noOfColumns = 4;
    }

    updateData(updatedStudy) {
        let toBeUpdatedIndex = this.model.studies.findIndex(study => updatedStudy.uid === study.uid);
        this.model.studies[toBeUpdatedIndex] = updatedStudy;
        this.forceUpdate(true);
    }

    async getPageDataAsync(startOffset, dataLengthForCurrentPage) {
        console.log({startOffset, dataLengthForCurrentPage});
        if (this.model.studies.length <= dataLengthForCurrentPage ){
            this.setPageSize(this.model.studies.length);
        }
        else{
            this.setPageSize(this.model.elements);
        }
        let slicedData = [];
        this.setRecordsNumber(this.model.studies.length);
        if (dataLengthForCurrentPage > 0) {
            slicedData = Object.entries(this.model.studies).slice(startOffset, startOffset + dataLengthForCurrentPage).map(entry => entry[1]);
            console.log(slicedData)
        } else {
            slicedData = Object.entries(this.model.studies).slice(0, startOffset - dataLengthForCurrentPage).map(entry => entry[1]);
            console.log(slicedData)
        }
        return slicedData;
    }
}


export default class HomeController extends WebcController {
    constructor(...props) {
        super(...props);

        this.model = this.getInitialModel();

        const prevState = this.getState() || {};
        const message = prevState;
        this.model.message = message;

        this.initHandlers();
        this.initServices();
    }

    initHandlers() {
        this.onTagClick('new:study', () => {
            this.navigateToPageTag('create-research-study', { breadcrumb: this.model.breadcrumb.toObject(), actionType: ACTION_TYPES.ADD });
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
                    this.StudiesService.updateStudy(selectedStudy, note,  () => {
                        this.prepareStudiesView(this.studies);
                        this.model.studiesDataSource.updateData(selectedStudy);
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


    // TODO: Remove this when tests are completed.
    sendEchoMessageToIotAdaptor() {
        this.CommunicationService = getCommunicationServiceInstance();
        this.CommunicationService.sendMessageToIotAdaptor( {
            message: "Echo message"
        });
    }

    async initServices() {
        this.DPermissionService = new DPermissionService();
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

        getStudies().then(studies => {
            this.model.hasStudies = studies.length !== 0;
            this.prepareStudiesView(studies);
            this.studies = studies;
            this.model.studiesDataSource = new StudiesDataSource(studies);
            const { studiesDataSource } = this.model;
            this.onTagClick("view", (model) => {
                let chosenStudy = studies.find(study => study.uid === model.uid);
                let viewStatus = {
                    title: chosenStudy.title,
                    uid: chosenStudy.uid,
                    breadcrumb:this.model.breadcrumb.toObject()
                }
                this.navigateToPageTag('view-research-study', viewStatus);
            });
            this.onTagClick("edit", (model) => {
                let chosenStudy = studies.find(study => study.uid === model.uid);
                let studyState = {
                    uid: chosenStudy.uid,
                    title: chosenStudy.title,
                    breadcrumb: this.model.breadcrumb.toObject(),
                    actionType: ACTION_TYPES.EDIT
                }
                this.navigateToPageTag('edit-research-study', studyState);
            });
            this.onTagClick("feedback-list", (model) => {
                let chosenStudy = studies.find(study => study.uid === model.uid);
                let studyState = {
                    uid: chosenStudy.uid,
                    title: chosenStudy.title,
                    breadcrumb: this.model.breadcrumb.toObject(),
                }
                this.navigateToPageTag('feedback-list', studyState);
            });
            this.onTagClick("evidence", (model) => {
                let chosenStudy = studies.find(study => study.uid === model.uid);
                let studyState = { 
                    uid: chosenStudy.uid,
                    title: chosenStudy.title,
                    breadcrumb: this.model.breadcrumb.toObject(),
                }
                this.navigateToPageTag('evidence-list', studyState);
            });
            this.onTagClick("data", (model) => {
                //const { participants } = model;
                console.log('this is data Page!');
            });
            this.onTagClick("prev-page", () => studiesDataSource.goToPreviousPage());
            this.onTagClick("next-page", () => studiesDataSource.goToNextPage());
            this.sendEchoMessageToIotAdaptor();
        })

        this.model.did = await DidService.getDidServiceInstance().getDID();
        MessageHandlerService.init(async (err, data) =>{
            if (err) {
                return console.error(err);
            }

            data = JSON.parse(data);
            console.log('Received Message', data);

            // TODO: Review this behaviour
            switch (data.operation) {
                case 'd-permission-list': {
                    this.DPermissionService.mount(data.d_permission_keyssi_list[data.d_permission_keyssi_list.length - 1], (err, data) => {
                        if (err) {
                            return console.log(err);
                        }
                    });
                    console.log("Received D Permission List");
                    break;
                }
            }
        });

    }

    prepareStudiesView(studies){
        studies.forEach(study=>{
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
                preventEvidence:!statusActions.includes(ACTIONS.EVIDENCE),
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