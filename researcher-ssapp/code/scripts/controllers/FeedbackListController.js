const { WebcController } = WebCardinal.controllers;
import FeedbackService from "../services/FeedbackService.js";
const commonServices = require("common-services");
const DataSourceFactory = commonServices.getDataSourceFactory();


export default class FeedbackListController extends WebcController {
    constructor(...props) {
        super(...props);

        this.model = {};
        this.model = this.getInitialModel();

        const prevState = this.getState() || {};
        const {breadcrumb, message, ...state} = prevState;

        this.model.studyID = prevState.uid;
        this.model.studyTitle = prevState.title;
        this.model.breadcrumb = prevState.breadcrumb;
        this.model.message = prevState.message;

        this.model.breadcrumb.push({
            label:this.model.studyTitle + " Feedback",
            tag:"feedback-list",
            state: state
        });

        this.FeedbackService= new FeedbackService();
        const getFeedback = () => {
            return new Promise ((resolve, reject) => {
                this.FeedbackService.getFeedbacks((err, received_feedback) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(received_feedback )
                })
            })
        }

        getFeedback().then(data => {

            let feedback = data.filter(data => data.studyID === this.model.studyID);
            this.model.hasFeedback = feedback.length !== 0;
            this.model.feedbackDataSource = DataSourceFactory.createDataSource(3, 5, feedback);
            const { feedbackDataSource } = this.model;

            this.onTagClick("view-feedback", (model) => {
                let state = {
                    studyID: this.model.studyID,
                    studyTitle: this.model.studyTitle,
                    feedbackID: model.uid,
                    breadcrumb: this.model.breadcrumb.toObject()
                }
                this.navigateToPageTag('view-feedback', state);
            });
            this.onTagClick("prev-page", () => feedbackDataSource.goToPreviousPage());
            this.onTagClick("next-page", () => feedbackDataSource.goToNextPage());
        })

        this._attachHandlerAddFeedback();

    }

    _attachHandlerAddFeedback(){
        this.onTagClick('new:feedback', () => {
            let objToSend = {
                uid: this.model.studyID,
                title: this.model.studyTitle,
                breadcrumb: this.model.breadcrumb.toObject(),
            }
            this.navigateToPageTag('create-feedback', objToSend);
        });
    }

    getInitialModel() {
        return {
            breadcrumb : [{
                label:"Dashboard",
                tag:"home",
                state:{}
            }]
        };
    }

}
