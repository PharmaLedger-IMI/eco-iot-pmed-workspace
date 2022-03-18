const { WebcController } = WebCardinal.controllers;
import FeedbackService from "../services/FeedbackService.js";
const { DataSource } = WebCardinal.dataSources;


class FeedbackDataSource extends DataSource {
    constructor(data) {
        super();
        this.model.feedback = data;
        this.model.elements = 5;
        this.setPageSize(this.model.elements);
        this.model.noOfColumns = 3;
    }

    async getPageDataAsync(startOffset, dataLengthForCurrentPage) {
       // console.log({startOffset, dataLengthForCurrentPage});
        if (this.model.feedback.length <= dataLengthForCurrentPage ){
           this.setPageSize(this.model.feedback.length);
       }
        else{
           this.setPageSize(this.model.elements);
       }
        let slicedData = [];
        this.setRecordsNumber(this.model.feedback.length);
        if (dataLengthForCurrentPage > 0) {
           slicedData = Object.entries(this.model.feedback).slice(startOffset, startOffset + dataLengthForCurrentPage).map(entry => entry[1]);
       } else {
            slicedData = Object.entries(this.model.feedback).slice(0, startOffset - dataLengthForCurrentPage).map(entry => entry[1]);
            console.log(slicedData)
        }
        return slicedData;
    }
}


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
            this.model.feedbackDataSource = new FeedbackDataSource(feedback);
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
        this._attachHandlerGoBack();

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

    _attachHandlerGoBack() {
        this.onTagClick('go:back', () => {
           
            this.navigateToPageTag('home');
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
