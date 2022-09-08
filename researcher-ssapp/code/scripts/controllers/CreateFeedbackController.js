const commonServices = require('common-services');
const {WebcController} = WebCardinal.controllers;
const {StudiesService, FeedbackService} = commonServices;
const CommunicationService = commonServices.CommunicationService;
const CONSTANTS = commonServices.Constants;
const BreadCrumbManager = commonServices.getBreadCrumbManager();

export default class CreateFeedbackController extends BreadCrumbManager {
    constructor(...props) {

        super(...props);

        const prevState = this.getState() || {};
        this.model.breadcrumb = this.setBreadCrumb(
            {
                label: "New Feedback",
                tag: "create-feedback"
            }
        );

        this.model.studyID = prevState.uid;
        this.model.studyTitle = prevState.title;
        this.model = this.getFeedbackDetailsViewModel();
        this.model.participantsDIDs = [];

        this.StudiesService = new StudiesService();
        this.StudiesService.getStudy(this.model.studyID, (err, studyData) => {
            if (err) {
                return console.log(err);
            }
            studyData.participants.forEach(participant => {
                this.model.participantsDIDs.push(participant.participantInfo.patientDID);
            });
        });

        this._attachHandlerGoBack();
        this._attachHandlerFeedbackCreate();

    }

    sendMessageToTps(subjectsDids, feedbackSReadSSI, callback) {
        this.CommunicationService = CommunicationService.getCommunicationServiceInstance();

        let promisesArr = [];
        let counter = 0;
        this.model.feedbacksSending.isLoading = false;

        subjectsDids.forEach((did, index) => {

            let promise = new Promise((resolve) => {
                setTimeout(async () => {
                    await this.CommunicationService.sendMessage(did, {
                        operation: CONSTANTS.MESSAGES.RESEARCHER.NEW_FEEDBACK,
                        ssi: feedbackSReadSSI,
                        shortDescription: 'Researcher sent feedback to patient',
                    })

                    counter = counter+1;
                    if (counter === subjectsDids.length) {
                        this.model.feedbacksSending.progress = 100;
                    } else {
                        this.model.feedbacksSending.progress = counter * (100 / subjectsDids.length);
                    }
                    resolve();
                }, 100*index)

            })
            promisesArr.push(promise);
        });

        Promise.allSettled(promisesArr).then(callback);
    }

    prepareFeedbackDSUData() {
        let FeeedbackRecord = {

            date: new Date().toISOString().slice(0, 10),
            feedback_content: this.model.feedback_content.value,
            feedback_subject: this.model.feedback_subject.value,
            studyID: this.model.studyID,
            studyTitle: this.model.studyTitle
        }

        return FeeedbackRecord;
    }

    saveFeedback() {
        this.FeedbackService = new FeedbackService();

        this.model.feedbacksSending = {
            progress: 0,
            sendingInProgress: true,
            eta: '-',
            isLoading: true
        };

        this.showModalFromTemplate('progressModal', () => {
        }, () => {
        }, {
            controller: 'ProgressModalController',
            modalTitle: `Sending Feedback Progress`,
            disableExpanding: true,
            disableBackdropClosing: true,
            disableClosing: true,
            disableCancelButton: true,
            model: this.model
        });

        this.FeedbackService.saveFeedback(this.prepareFeedbackDSUData(), (err, feedback) => {
            let feedbackState = {};

            if (err) {
                feedbackState = {
                    uid: this.model.studyID,
                    breadcrumb: this.model.toObject('breadcrumb'),
                    message: {
                        content: `An error has been occurred!`,
                        type: 'error'
                    }
                }
            } else {
                feedbackState = {
                    uid: this.model.studyID,
                    title: this.model.studyTitle,
                    breadcrumb: this.model.toObject('breadcrumb'),
                    message: {
                        content: `The feedback "${this.model.feedback_subject.value}" has been sent to the study participants.`,
                        type: 'success'
                    }
                }
            }

            this.sendMessageToTps(this.model.participantsDIDs, feedback.sReadSSI, () => {
                this.navigateToPageTag('feedback-list', feedbackState);
            });
        })
    }


    _attachHandlerGoBack() {
        this.onTagClick('go:back', () => {
            this.navigateToPageTag('feedback-list', {
                uid: this.model.studyID,
                breadcrumb: this.model.toObject('breadcrumb')
            });
        });
    }

    _attachHandlerFeedbackCreate() {

        this.model.addExpression("isFormFeedbackInvalid",()=>{
            if(this.model.feedback_content.value.trim() === ""){
                return true
            }
            if(this.model.feedback_subject.value.trim() === ""){
                return true
            }
            return this.model.send_acknowledgement.checked === false;

        },["feedback_content","send_acknowledgement","feedback_subject"])

        this.onTagClick('feedback:send', () => {
            this.saveFeedback();
        });
    }

    getFeedbackDetailsViewModel() {
        return {
            feedback_subject: {
                name: 'feedback_subject',
                id: 'feedback_subject',
                label: "Feedback Title",
                placeholder: 'Enter feedback title',
                required: true,
                value: ""
            },
            feedback_content: {
                name: 'feedback_content',
                id: 'feedback_content',
                label: `Feedback Content`,
                required: true,
                placeholder: 'Description of the Feedback (Free Text - No limits of Characters)',
                value: ""
            },
            send_acknowledgement:{
                label: `I am aware that this feedback will be sent to all participants involved in study "${this.model.studyTitle}".`,
                "type": "checkbox",
                "placeholder": "terms",
                "checked": false
            }
        }
    }

}