
const { WebcController } = WebCardinal.controllers;
import FeedbackService from "../services/FeedbackService.js";

export default class CreateFeedbackController extends WebcController {
    constructor(...props) {

        super(...props);

        const prevState = this.getState() || {};

        
        const { breadcrumb, ...state } = prevState;
 

        this.model.breadcrumb = breadcrumb;
        this.model.breadcrumb.push({
            label: 'New Feedback',
            tag: "create-feedback",
            state: state
        });

        this.model.studyID = state.uid;
        this.model.studyTitle = state.title;
        this.model = this.getFeedbackDetailsViewModel();

        this._attachHandlerGoBack();
        this._attachHandlerFeedbackCreate();


    }

    prepareFeedbackDSUData() {
        let FeeedbackRecord = {
            
            date: new Date().toISOString().slice(0, 10),
            feedback_content: this.model.feedback_content.value,
            feedback_subject: this.model.feedback_subject.value,
            isFormFeedbackInvalid: false,
            hasFeedback: true,
            studyID: this.model.studyID,
            studyTitle: this.model.studyTitle
        }

        return FeeedbackRecord;
    }

    saveFeedback() {
        this.FeedbackService = new FeedbackService();
        this.FeedbackService.saveFeedback(this.prepareFeedbackDSUData(), (err, data) => {

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
                    breadcrumb: this.model.breadcrumb.toObject(),
                    message: {
                        content: `The feedback  ${this.model.studyTitle} study has been created! THANKS INVESTIGATOR !! YOUR FEEDBACK STUDY HAS BEEN SENT TO ALL THE PARTICIPANTS.`,
                     type: 'success'
                   }
                }
            }
            window.WebCardinal.loader.hidden = true;
            this.navigateToPageTag('feedback-list', feedbackState);
        })
    }



    _attachHandlerGoBack() {
        this.onTagClick('go:back', () => {
            this.navigateToPageTag('feedback-list', { uid: this.model.studyID, breadcrumb: this.model.breadcrumb.toObject() });
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
                label: "Feedback subject",
                placeholder: 'Subject',
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

            isFormFeedbackInvalid:{
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