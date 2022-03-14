import mock from './mock/dynamic-consents.js';
const { WebcController } = WebCardinal.controllers;

export default class ViewGraphsController extends WebcController {
    constructor(...props) {
        super(...props);

        const prevState = this.getState() || {};

        this.model.breadcrumb = prevState.breadcrumb;
        const { breadcrumb, ...state } = prevState;

        this.model.breadcrumb.push({
            label: `View Graphs`,
            tag: "view-graphs",
            state: state
        });

        this.onTagClick("graphs:back", () => {
            let consentsState = {
                studyId: state.studyId,
                breadcrumb: this.model.breadcrumb.toObject()
            }
            this.navigateToPageTag("dynamic-consents", consentsState)
        });


        let consents = mock.getItems(10, 50);
        let consentsStatuses = consents.map(el => el.consentStatus);
        let statusLabels = [...new Set(consentsStatuses)];

        let statusCounter = {};

        consents.forEach(item => {
            if (statusCounter[item.consentStatus]) {
                statusCounter[item.consentStatus]++;
            } else {
                statusCounter[item.consentStatus] = 1;
            }
        });

        let chartItems = [];
        for (let item in statusCounter) {
            chartItems.push(statusCounter[item]);
        }

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


        let consentsAllDates = consents.map(el => el.consentDate);
        let uniqueDates = [...new Set(consentsAllDates)];
        const chartDates = uniqueDates.sort(function (dateA, dateB) {
            return new Date(dateA) - new Date(dateB);
        });

        let datesCounter = {};

        consents.forEach(item => {
            if (datesCounter[item.consentDate]) {
                datesCounter[item.consentDate]++;
            } else {
                datesCounter[item.consentDate] = 1;
            }
        })

        let numberOfEachDate = [];
        for (let item in datesCounter) {
            numberOfEachDate.push(datesCounter[item]);
        }

        let timeSeriesElement = document.getElementById('timeSeriesChart').getContext('2d');

        let timeSeriesChart = new Chart(timeSeriesElement, {
            type: 'line',
            data: {
                labels: chartDates,
                datasets: [
                    {
                        label: 'Consents',
                        data: numberOfEachDate,
                        backgroundColor: statusesColors[1],
                        borderColor: statusesColors[2],
                    }
                ]
            }
        });

    }
}
