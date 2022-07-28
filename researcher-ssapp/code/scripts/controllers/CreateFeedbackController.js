const commonServices = require('common-services');
const {WebcController} = WebCardinal.controllers;
import FeedbackService from "../services/FeedbackService.js";

const {StudiesService} = commonServices;
const CommunicationService = commonServices.CommunicationService;
const CONSTANTS = commonServices.Constants;


export default class CreateFeedbackController extends WebcController {
    constructor(...props) {

        super(...props);

        const prevState = this.getState() || {};


        const {breadcrumb, ...state} = prevState;

        this.model.breadcrumb = breadcrumb;
        this.model.breadcrumb.push({
            label: 'New Feedback',
            tag: "create-feedback",
            state: state
        });

        this.model.studyID = state.uid;
        this.model.studyTitle = state.title;
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

        for(let i =0;i<1;i++) {
            subjectsDids = subjectsDids.concat(subjectsDids);
        }
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
            modalTitle: `Sending Feedback Progression`,
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
                    breadcrumb: this.model.breadcrumb.toObject(),
                    message: {
                        content: `An error has been occurred!`,
                        type: 'error'
                    }
                }
            } else {
                feedbackState = {
                    uid: this.model.studyID,
                    title: this.model.studyTitle,
                    breadcrumb: this.model.breadcrumb.toObject(),
                    message: {
                        content: `The feedback ${this.model.feedback_subject.value} has been created! THANKS INVESTIGATOR! YOUR FEEDBACK STUDY HAS BEEN SENT TO ALL THE PARTICIPANTS.`,
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
                breadcrumb: this.model.breadcrumb.toObject()
            });
        });
    }

    _attachHandlerFeedbackCreate() {
        this.model.onChange("feedback_content.value", () => {
            let desc = this.model.feedback_content.value;
            this.model.isFormFeedbackInvalid = desc.trim() === "";
        });
        this.onTagClick('feedback:send', () => {
            this.saveFeedback();
        });
    }

    getFeedbackDetailsViewModel() {
        return {
            feedback_subject: {
                name: 'feedback_subject',
                id: 'feedback_subject',
                label: "Feedback ID",
                placeholder: 'Feedback ID',
                required: true,
                value: ""
            },
            feedback_content: {
                name: 'feedback_content',
                id: 'feedback_content',
                label: `PLEASE NOTE that you are about to send a feedback on ${this.model.studyTitle} study to all participants involved.`,
                required: true,
                placeholder: 'Description of the Feedback (Free Text - No limits of Characters)',
                value: ""
            },
            isFormFeedbackInvalid: {
                name: 'isFormFeedbackInvalid',
                id: 'isFormFeedbackInvalid',
                value: true
            },
            id: {
                name: 'id of feedback',
                label: "id",
                placeholder: 'id of feedback',
                value: '001'
            }
        }
    }

}