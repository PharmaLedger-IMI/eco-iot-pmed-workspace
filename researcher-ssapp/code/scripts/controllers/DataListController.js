const {WebcController} = WebCardinal.controllers;
const commonServices = require("common-services");
const {StudiesService, PermissionedHealthDataService} = commonServices;
const DataSourceFactory = commonServices.getDataSourceFactory();
const BreadCrumbManager = commonServices.getBreadCrumbManager();

export default class DataListController extends BreadCrumbManager {
    constructor(...props) {
        super(...props);

        this.model = {};

        const prevState = this.getState() || {};

        this.model = prevState;

        this.model.breadcrumb = this.setBreadCrumb(
            {
                label: this.model.title + " Data List",
                tag: "data-list"
            }
        );

        this.model.studyID = prevState.uid;

        this.init();

        this.StudiesService.getStudy(this.model.studyID, (err, study_info) => {
            if (err){
                return console.log(err);
            }
            this.model.studyTitle = study_info.ResearchStudyTitle;
            this.model.participants_withPermission = study_info.participants.filter(p => p.dpermission===true);
        });

        const getPermissionedData = () => {
            return new Promise ((resolve, reject) => {
                this.PermissionedHealthDataService.getAllObservations((err, observations ) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(observations)
                })
            })
        }

        getPermissionedData().then(dataPerParticipant => {

            let allObservations = []
            dataPerParticipant.forEach(participant => {
                participant.forEach(observation => {
                    observation.date = new Date(observation.effectiveDateTime).toDateString();
                    observation.time =  new Date(observation.effectiveDateTime).toLocaleTimeString();
                    allObservations.push(observation)
                });
            });

            let observations = allObservations.filter(observation => observation.studyUID === this.model.studyID);
            // comment this to present all mounted data and use the observations array in DataSource
            let observations_only_permission = []
            this.model.participants_withPermission.forEach(par => {
                observations.forEach(function(obs, index) {
                    if (obs.subject.reference === par.participantInfo.patientDID) {
                        observations_only_permission.push(obs);
                    }
                })
            });
            //

            this.model.hasData = observations.length !== 0;
            this.model.dataDataSource = DataSourceFactory.createDataSource(8, 20, observations_only_permission);
            const { dataDataSource } = this.model;
            this.onTagClick("prev-page", () => dataDataSource.goToPreviousPage());
            this.onTagClick("next-page", () => dataDataSource.goToNextPage());
        });

        this._attachHandlerExportData();
    }

    init(){
        this.StudiesService = new StudiesService();
        this.PermissionedHealthDataService = new PermissionedHealthDataService();
    }

    _attachHandlerExportData(){
        this.onTagClick('export:data', () => {
           console.log("A method to export the data???");
        });
    }

}
