const commonServices = require("common-services");
const {StudiesService, ResultsService} = commonServices;
const DataSourceFactory = commonServices.getDataSourceFactory();
const BreadCrumbManager = commonServices.getBreadCrumbManager();

export default class ResultsListController extends BreadCrumbManager {
    constructor(...props) {
        super(...props);

        this.model = {};

        const prevState = this.getState() || {};
        this.model = prevState;

        this.model.breadcrumb = this.setBreadCrumb(
            {
                label: this.model.title + " Results List",
                tag: "results-list"
            }
        );

        this.model.studyID = prevState.uid;

        this.StudiesService = new StudiesService();
        this.StudiesService.getStudy(this.model.studyID, (err, study_info) => {
            if (err){
                return console.log(err);
            }
            this.model.studyTitle = study_info.ResearchStudyTitle;
        });

        this.ResultsService = new ResultsService();
        const getResults = () => {
            return new Promise ((resolve, reject) => {
                this.ResultsService.getResults((err, received_results ) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(received_results)
                })
            })
        }

        getResults().then(data => {
            let results = data.filter(data => data.studyID === this.model.studyID);
            this.model.hasResults = results.length !== 0;
            this.model.resultsDataSource = DataSourceFactory.createDataSource(6, 8, results);
            const { resultsDataSource } = this.model;

            this.onTagClick("view-result", (model) => {
                let resultState = {
                    studyID: model.studyID,
                    resultID: model.uid,
                    breadcrumb: this.model.toObject('breadcrumb')
                }
                this.navigateToPageTag('view-result', resultState);
            });
            this.onTagClick("edit-result", (model) => {
                let resultState = {
                    studyID: model.studyID,
                    resultID: model.uid,
                    breadcrumb: this.model.toObject('breadcrumb')
                }
                this.navigateToPageTag('edit-result' ,resultState);
            });
            this.onTagClick("prev-page", () => resultsDataSource.goToPreviousPage());
            this.onTagClick("next-page", () => resultsDataSource.goToNextPage());
        })

        this._attachHandlerAddResult();
    }

    _attachHandlerAddResult(){
        this.onTagClick('new:result', () => {
            let resultState = {
                uid: this.model.studyID,
                breadcrumb: this.model.toObject('breadcrumb'),
            }
            this.navigateToPageTag('add-result', resultState);
        });
    }

}
