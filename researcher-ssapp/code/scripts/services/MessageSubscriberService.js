const commonServices = require("common-services");
const MessageHandlerService = commonServices.MessageHandlerService;
const StudiesService = commonServices.StudiesService
const PermissionedHealthDataService = commonServices.PermissionedHealthDataService;
const Constants = commonServices.Constants;
const loader = window.WebCardinal.loader;

class MessageSubscriberService{
    constructor() {
        this.subscribers = {};
        this.StudiesService = new StudiesService();
        this.PermissionedHealthDataService = new PermissionedHealthDataService();

        const onConfirmRefresh = function (event) {
            event.preventDefault();
            return event.returnValue = "Are you sure you want to leave?";
        }

        const blockUI = () =>{
            loader.hidden = false;
            loader.setAttribute("data-value","Updating participants. Please wait...")
            window.addEventListener("beforeunload", onConfirmRefresh, { capture: true });
        }

        const unBlockUI = ()=>{
            loader.removeAttribute("data-value");
            loader.hidden = true;
            window.removeEventListener("beforeunload", onConfirmRefresh, { capture: true });
        }

        MessageHandlerService.init(async (data) => {

            blockUI();
            data = JSON.parse(data);
            console.log('Received Message', data);

            switch (data.operation) {
                case Constants.MESSAGES.RESEARCHER.ADD_PARTICIPANTS_TO_STUDY: {
                    this.StudiesService.getStudy(data.studyUID, (err, study ) => {
                        if (err) {
                            unBlockUI();
                            return console.error(err);
                        }

                        if (!study.participants) {
                            study.participants = []
                        }
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

                        study.participantsNumber = 0;
                        study.participants.forEach(p => {
                            if (p.dpermission === true) {
                                study.participantsNumber += 1
                            }
                        });

                        this.StudiesService.updateStudy(study, (err, study) => {
                            if (err) {
                                unBlockUI();
                                return console.error(err);
                            }

                            this.PermissionedHealthDataService.mountObservation(data.permissionedDataDSUSSI, (err, data)=> {
                                if (err) {
                                    unBlockUI();
                                    return console.error(err);
                                }
                                console.log("Received Data from 1 participant.");
                                this.notifySubscribers("study-participant-update",study);
                                unBlockUI();
                            });

                        });
                    })
                    break;
                }
                case Constants.MESSAGES.RESEARCHER.REMOVE_PARTICIPANTS_FROM_STUDY: {
                    this.StudiesService.getStudy(data.studyUID, (err, study ) => {
                        if (err) {
                            unBlockUI();
                            return console.error(err);
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
                                unBlockUI();
                                return console.error(err);
                            }
                            this.notifySubscribers("study-participant-update",updatedStudy);
                            unBlockUI();
                            console.log("A participant revoked his permission.");
                        });
                    })
                    break;
                }
                case Constants.MESSAGES.RESEARCHER.REJECT_PARTICIPANTS_FROM_STUDY: {
                    this.StudiesService.getStudy(data.studyUID, (err, study ) => {
                        if (err) {
                            unBlockUI();
                            return console.error(err);
                        }
                        if (!study.participants) {
                            study.participants = [];
                        }
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

                        study.participantsNumber = 0
                        study.participants.forEach(p => {
                            if (p.dpermission===true) study.participantsNumber+=1
                        })

                        this.StudiesService.updateStudy(study, (err, updatedStudy) => {
                            if (err) {
                                unBlockUI();
                                return console.error(err);
                            }
                            this.notifySubscribers("study-participant-update",updatedStudy);
                            unBlockUI();
                            console.log("A participant rejected the invitation.");
                        });
                    })
                    break;
                }
            }
        });
    }

    subscribe(type, handler){
        if(!this.subscribers[type]){
            this.subscribers[type] = [];
        }

        this.subscribers[type].push(handler);
    }

    unsubscribe(type, handler){
        if(!this.subscribers[type]){
            console.error(`Subscriber type "${type}" was not found`);
            return;
        }

        const handlerIndex = this.subscribers[type].findIndex(existingHandler => existingHandler === handler);
        if(handlerIndex === -1){
            console.error(`Provided handler for type "${type}" was not found`);
            return;
        }
        this.subscribers[type].splice(handlerIndex,1);
    }

    notifySubscribers(type, data){
        if(!this.subscribers[type]){
            return;
        }
        this.subscribers[type].forEach(handler=>{
            handler(undefined, data);
        })
    }
}

let instance = null;
const init = () => {
    if (instance === null) {
        instance = new MessageSubscriberService();
    }
    return instance;
};



export default {init};