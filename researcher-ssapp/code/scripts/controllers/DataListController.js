const {WebcController} = WebCardinal.controllers;
const commonServices = require("common-services");
const {StudiesService, PermissionedHealthDataService} = commonServices;
const DataSourceFactory = commonServices.getDataSourceFactory();

export default class DataListController extends WebcController {
    constructor(...props) {
        super(...props);

        this.model = {};

        const prevState = this.getState() || {};
        const {breadcrumb, message, ...state} = prevState;

        this.model = prevState;

        this.model.breadcrumb.push({
            label:this.model.title + " Data List",
            tag:"data-list",
            state: state
        });

        this.model.studyID = state.uid;

        this.init();

        this.StudiesService.getStudy(this.model.studyID, (err, study_info) => {
            if (err){
                return console.log(err);
            }
            this.model.studyTitle = study_info.ResearchStudyTitle;
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
                    allObservations.push(observation)
                });
            });

            let observations = allObservations.filter(observation => observation.studyUID === this.model.studyID);
            this.model.hasData = observations.length !== 0;
            this.model.dataDataSource = DataSourceFactory.createDataSource(8, 20, observations);
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
