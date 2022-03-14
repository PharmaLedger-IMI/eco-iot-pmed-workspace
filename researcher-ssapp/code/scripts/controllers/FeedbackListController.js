const { WebcController } = WebCardinal.controllers;
import StudiesService from "../services/StudiesService.js";
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

        this.model = prevState;
        this.model.breadcrumb.push({
            label:this.model.title + " Feedback",
            tag:"feedback-list",
            state: state
        });

        this.model.studyID = state.uid;

        this.StudiesService = new StudiesService();
        this.StudiesService.getStudy(this.model.studyID, (err, study_info) => {
            if (err){
                return console.log(err);
            }
            this.model.studyTitle = study_info.ResearchStudyTitle;
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
                    studyID: model.studyID,
                    studyTitle: model.studyTitle,
                    feedbackID: model.uid,
                    breadcrumb: this.model.breadcrumb.toObject()
                }
                this.navigateToPageTag('view-feedback', state);
            });
            this.onTagClick("edit-feedback", (model) => {
                let state = {
                    studyID: model.studyID,
                    studyTitle: model.studyTitle,
                    feedbackID: model.uid,
                    breadcrumb: this.model.breadcrumb.toObject()
                }
                this.navigateToPageTag('edit-feedback' ,state);
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
                title: this.model.title,
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
