const { WebcController } = WebCardinal.controllers;
const commonServices = require("common-services");
const {StudiesService, EvidenceService} = commonServices;
const DataSourceFactory = commonServices.getDataSourceFactory();
const BreadCrumbManager = commonServices.getBreadCrumbManager();

export default class EvidenceListController extends BreadCrumbManager {
    constructor(...props) {
        super(...props);

        this.model = {};

        const prevState = this.getState() || {};
        this.model = prevState;

        this.model.breadcrumb = this.setBreadCrumb(
            {
                label: this.model.title + " Evidence List",
                tag: "evidence-list"
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

        this.EvidenceService = new EvidenceService();
        const getEvidences = () => {
            return new Promise ((resolve, reject) => {
                this.EvidenceService.getEvidences((err, received_evidences ) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(received_evidences)
                })
            })
        }

        getEvidences().then(data => {
            let evidences = data.filter(data => data.studyID === this.model.studyID);
            this.model.hasEvidence = evidences.length !== 0;
            this.model.evidenceDataSource = DataSourceFactory.createDataSource(6, 8, evidences);
            const { evidenceDataSource } = this.model;

            this.onTagClick("view-evidence", (model) => {
                let evidenceState = {
                    studyID: model.studyID,
                    evidenceID: model.uid,
                    breadcrumb: this.model.toObject('breadcrumb')
                }
                this.navigateToPageTag('view-evidence', evidenceState);
            });
            this.onTagClick("edit-evidence", (model) => {
                let evidenceState = {
                    studyID: model.studyID,
                    evidenceID: model.uid,
                    breadcrumb: this.model.toObject('breadcrumb')
                }
                this.navigateToPageTag('edit-evidence' ,evidenceState);
            });
            this.onTagClick("prev-page", () => evidenceDataSource.goToPreviousPage());
            this.onTagClick("next-page", () => evidenceDataSource.goToNextPage());
        })

        this._attachHandlerAddEvidence();
    }

    _attachHandlerAddEvidence(){
        this.onTagClick('new:evidence', () => {
            let evidenceState = {
                uid: this.model.studyID,
                breadcrumb: this.model.toObject('breadcrumb'),
            }
            this.navigateToPageTag('add-evidence', evidenceState);
        });
    }

}
