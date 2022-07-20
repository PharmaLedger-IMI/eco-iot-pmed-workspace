const commonServices = require("common-services");
const DataSourceFactory = commonServices.getDataSourceFactory();
const { WebcController } = WebCardinal.controllers;
const {StudiesService} = commonServices;


export default class ViewDynamicConsentsController extends WebcController {
    constructor(...props) {
        super(...props);

        let state =  this.getState();
        let {breadcrumb, ...breadcrumbState} = state;
        this.model = state;
        let breadcrumbSegment = {
            label: "Dynamic Consents",
            tag: "dynamic-consents",
            state: breadcrumbState
        };
        this.model.breadcrumb.push(breadcrumbSegment);

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
                        participant.date = participant.dpermissionStartSharingDate;
                        participant.status = "Active";
                    }
                    if (participant.dpermissionStopSharingDate) {
                        participant.date = participant.dpermissionStartSharingDate;
                        participant.status = "Revoked";
                    }
                    if (participant.dpermissionRejectedDate) {
                        participant.date = participant.dpermissionRejectedDate;
                        participant.status = "Rejected";
                    }
                });
            }

            console.log(this.model.participants);
            this.model.ParticipantsDataSource = DataSourceFactory.createDataSource(3, 10, this.model.participants);
            const { ParticipantsDataSource } = this.model;
        })

        this.onTagClick("view-graphs",() => {
            let studyState = {
            studyId: this.model.studyId,
            breadcrumb:this.model.breadcrumb.toObject()
            }
            this.navigateToPageTag("dynamic-consents-graphs", studyState)
        });
    }
}