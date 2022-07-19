const {WebcController} = WebCardinal.controllers;
const commonServices = require("common-services");
const DidService =commonServices.DidService;
const MessageHandlerService = commonServices.MessageHandlerService;
const {StudiesService, PermissionedHealthDataService} = commonServices;
import DPermissionService from "../services/DPermissionService.js";
import StudyStatusesService from "../services/StudyStatusesService.js";
const DataSourceFactory = commonServices.getDataSourceFactory();

const ACTION_TYPES = {
    ADD: 'Add',
    EDIT: 'Edit'
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
            this.navigateToPageTag('create-research-study', { breadcrumb: this.model.breadcrumb.toObject(), actionType: ACTION_TYPES.ADD, researcherDID: this.model.did });
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

    async initServices() {
        this.DPermissionService = new DPermissionService();
        this.StudiesService = new StudiesService();
        this.PermissionedHealthDataService = new PermissionedHealthDataService();

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
            this.model.studiesDataSource = DataSourceFactory.createDataSource(8, 10, studies);
            this.model.studiesDataSource.__proto__.updateData = function(updatedStudy) {
                let toBeUpdatedIndex = studies.findIndex(study => updatedStudy.uid === study.uid);
                studies[toBeUpdatedIndex] = updatedStudy;
                this.forceUpdate(true);
            }
            const { studiesDataSource } = this.model;
            this.onTagClick("view", (model) => {
                let chosenStudy = studies.find(study => study.uid === model.uid);
                let viewStatus = {
                    title: chosenStudy.title,
                    uid: chosenStudy.uid,
                    breadcrumb: this.model.breadcrumb.toObject()
                }
                this.navigateToPageTag('view-research-study', viewStatus);
            });
            this.onTagClick("edit", (model) => {
                let chosenStudy = studies.find(study => study.uid === model.uid);
                let studyState = {
                    uid: chosenStudy.uid,
                    title: chosenStudy.title,
                    breadcrumb: this.model.breadcrumb.toObject(),
                    actionType: ACTION_TYPES.EDIT,
                    researcherDID: this.model.did
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
                let chosenStudy = studies.find(study => study.uid === model.uid);
                let studyState = {
                    uid: chosenStudy.uid,
                    title: chosenStudy.title,
                    breadcrumb: this.model.breadcrumb.toObject(),
                }
                this.navigateToPageTag('data-list', studyState);
            });
        })

        this.model.did = await DidService.getDidServiceInstance().getDID();
        MessageHandlerService.init(async (data) => {
            data = JSON.parse(data);
            console.log('Received Message', data);

            switch (data.operation) {
                case "add_participants_to_study": {
                    this.StudiesService.getStudy(data.studyUID, (err, study ) => {
                        if (err) {
                            return reject(err);
                        }

                        if (!study.participants) study.participants = []
                        let participant = {
                            dpermission: data.dpermission,
                            dpermissionStartSharingDate: data.dpermissionStartSharingDate,
                            participantInfo: data.participant
                        }

                        let patientMatchIndex = study.participants.findIndex(p => p.participantInfo.patientDID === data.participant.patientDID);
                        if (study.participants[patientMatchIndex]) {
                            study.participants[patientMatchIndex].dpermission = true;
                            study.participants[patientMatchIndex].dpermissionStartSharingDate = data.dpermissionStartSharingDate;
                        }
                        else {
                            study.participants.push(participant)
                        }

                        study.participantsNumber = 0
                        study.participants.forEach(p => {
                            if (p.dpermission===true) study.participantsNumber+=1
                        })

                        this.StudiesService.updateStudy(study, (err, data) => {
                            if (err) {
                                console.log(err);
                            }
                            let toBeUpdatedIndex = this.studies.findIndex(study => data.uid === study.uid);
                            this.studies[toBeUpdatedIndex] = data;
                            this.prepareStudiesView(this.studies);
                            this.model.studiesDataSource.updateData(data);
                        });
                    })

                    this.PermissionedHealthDataService.mountObservation(data.permissionedDataDSUSSI, (err, data)=> {
                        if (err) {
                            console.log(err);
                        }
                        console.log(data);
                    });



                    break;
                }
                case "remove_participants_from_study": {
                    this.StudiesService.getStudy(data.studyUID, (err, study ) => {
                        if (err) {
                            return reject(err);
                        }
                        let patientMatchIndex = study.participants.findIndex(pt => pt.participantInfo.patientDID === data.participant.patientDID);

                        study.participants[patientMatchIndex].dpermission = false;
                        study.participants[patientMatchIndex].dpermissionStopSharingDate = data.dpermissionStopSharingDate;

                        study.participantsNumber = 0
                        study.participants.forEach(p => {
                            if (p.dpermission===true) study.participantsNumber+=1
                        })

                        this.StudiesService.updateStudy(study, (err, updatedStudy) => {
                            if (err) {
                                console.log(err);
                            }
                            let toBeUpdatedIndex = this.studies.findIndex(study => updatedStudy.uid === study.uid);
                            this.studies[toBeUpdatedIndex] = updatedStudy;
                            this.prepareStudiesView(this.studies);
                            this.model.studiesDataSource.updateData(updatedStudy);
                        });
                    })
                    break;
                }
                case "reject_participants_from_study": {
                    this.StudiesService.getStudy(data.studyUID, (err, study ) => {
                        if (err) {
                            return reject(err);
                        }
                        if (!study.participants) study.participants = []
                        let participant = {
                            dpermission: false,
                            dpermissionRejectedDate: data.dpermissionRejectedDate,
                            participantInfo: data.participant
                        }
                        let patientMatchIndex = study.participants.findIndex(p => p.participantInfo.patientDID === data.participant.patientDID);
                        if (study.participants[patientMatchIndex]) {
                            study.participants[patientMatchIndex].dpermission = false;
                            study.participants[patientMatchIndex].dpermissionRejectedDate = data.dpermissionRejectedDate;
                        }
                        else {
                            study.participants.push(participant)
                        }
                        this.StudiesService.updateStudy(study, (err, updatedStudy) => {
                            if (err) {
                                console.log(err);
                            }
                            let toBeUpdatedIndex = this.studies.findIndex(study => updatedStudy.uid === study.uid);
                            this.studies[toBeUpdatedIndex] = updatedStudy;
                            this.prepareStudiesView(this.studies);
                            this.model.studiesDataSource.updateData(updatedStudy);
                            console.log(study);
                        });
                    })
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
