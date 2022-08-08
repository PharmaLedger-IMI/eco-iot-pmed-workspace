const commonServices = require("common-services");
const DataSourceFactory = commonServices.getDataSourceFactory();
const { WebcController } = WebCardinal.controllers;
const {StudiesService} = commonServices;
const BreadCrumbManager = commonServices.getBreadCrumbManager();

export default class ViewDynamicConsentsController extends BreadCrumbManager {
    constructor(...props) {
        super(...props);

        let state =  this.getState();
        this.model = state;

        this.model.breadcrumb = this.setBreadCrumb(
            {
                label: "Dynamic Consents",
                tag: "dynamic-consents"
            }
        );

        this.StudiesService = new StudiesService();
        const getStudyInfo = () => {
            return new Promise ((resolve, reject) => {
                this.StudiesService.getStudy(this.model.studyId, (err, studyData ) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(studyData);
                });
            });
        }

        getStudyInfo().then(data => {
            console.log(data);
            this.model.participants = data.participants;
            this.model.hasParticipants = this.model.participants.length > 0;
            console.log(this.model.hasParticipants);
            console.log(this.model.participants);

            if (this.model.participants.length > 0) {
                this.model.participants.forEach(participant => {
                    if (participant.dpermissionStartSharingDate) {
                        participant.date = new Date(participant.dpermissionStartSharingDate).toDateString();
                        participant.status = "Approved";
                    }
                    if (participant.dpermissionStopSharingDate) {
                        participant.date = new Date(participant.dpermissionStopSharingDate).toDateString();
                        participant.status = "Revoked";
                    }
                    if (participant.dpermissionRejectedDate) {
                        participant.date = new Date(participant.dpermissionRejectedDate).toDateString();
                        participant.status = "Rejected";
                    }
                });
            }
            console.log(this.model.participants);
            this.model.ParticipantsDataSource = DataSourceFactory.createDataSource(3, 10, this.model.participants);
            const { ParticipantsDataSource } = this.model;
        })

        this.onTagClick("view-graphs",() => {
            let state = {
                studyId: this.model.studyId,
                breadcrumb:this.model.toObject('breadcrumb')
            }
            this.navigateToPageTag("dynamic-consents-graphs", state)
        });
    }
}