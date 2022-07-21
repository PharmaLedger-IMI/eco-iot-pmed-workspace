import mock from './mock/dynamic-consents.js';
const commonServices = require("common-services");
const { WebcController } = WebCardinal.controllers;
const {StudiesService} = commonServices;


export default class ViewGraphsController extends WebcController {
    constructor(...props) {
        super(...props);

        const prevState = this.getState() || {};
        this.model.studyId = prevState.studyId;

        this.model.breadcrumb = prevState.breadcrumb;
        const { breadcrumb, ...state } = prevState;

        this.model.breadcrumb.push({
            label: `View Graphs`,
            tag: "view-graphs",
            state: state
        });

        this.revokedCount = 0;
        this.ApprovedCount = 0;
        this.rejectedCount = 0;

        this.approvedDates = [];

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
            this.model.consents = data.participants;
            this.model.hasConsents = this.model.consents.length > 0;
            if (this.model.consents.length > 0) {
                this.model.consents.forEach(consent => {
                    if (consent.dpermissionStartSharingDate) {
                        consent.date = new Date(consent.dpermissionStartSharingDate).toDateString();
                        consent.status = "Approved";
                    }
                    if (consent.dpermissionStopSharingDate) {
                        consent.date = new Date(consent.dpermissionStopSharingDate).toDateString();
                        consent.status = "Revoked";
                    }
                    if (consent.dpermissionRejectedDate) {
                        consent.date = new Date(consent.dpermissionRejectedDate).toDateString();
                        consent.status = "Rejected";
                    }
                });
            }
            console.log(this.model.consents);

            let statusLabels = ['Revoked', 'Approved', 'Rejected'];
            this.model.consents.forEach(c => {
                if (c.status==="Revoked")  this.revokedCount+=1;
                if (c.status==="Approved") this.ApprovedCount+=1;
                if (c.status==="Rejected") this.rejectedCount+=1;
            });
            let chartItems = [this.revokedCount, this.ApprovedCount, this.rejectedCount];
            // console.log(chartItems)
            let statusesColors = ['#cfe8eb', '#00345B', '#c2ced8'];
            let pieChartElement = document.getElementById('pieChart').getContext('2d');
            let pieChart = new Chart(pieChartElement, {
                type: 'pie',
                data: {
                    labels: statusLabels,
                    datasets: [
                        {
                            data: chartItems,
                            backgroundColor: statusesColors,
                            borderColor: 'white',
                        }
                    ]
                }
            })



            this.model.consents.forEach(c => {
                if (c.status==="Approved") {
                    this.approvedDates.push(c.date);
                }
            });
            this.approvedDates = [...new Set(this.approvedDates)];

            this.countperDate = new Array(this.approvedDates.length).fill(0);
            this.approvedDates.forEach(date =>{
                this.model.consents.forEach(c =>{
                    if (date === c.date && c.status==="Approved") {
                        let index = this.approvedDates.indexOf(date)
                        this.countperDate[index]+=1;
                    }
                });
            });
            console.log(this.approvedDates);
            console.log(this.countperDate);

            let timeSeriesElement = document.getElementById('timeSeriesChart').getContext('2d');
            let chartDates = ["01-Jul-2022", "03-Jul-2022", "11-Jul-2022"];
            let numberOfEachDate = [19,2,10];
            let timeSeriesChart = new Chart(timeSeriesElement, {
                type: 'line',
                data: {
                    labels: this.approvedDates,
                    datasets: [
                        {
                            label: 'Consents',
                            data: this.countperDate,
                            backgroundColor: statusesColors[1],
                            borderColor: statusesColors[2],
                        }
                    ]
                }
            });
        })



    }
}
