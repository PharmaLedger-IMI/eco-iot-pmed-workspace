const {WebcController} = WebCardinal.controllers;

const StatisticsDPermissionsPerDayControllerViewModel = {

    gobackbutton: {
        name: 'Go Back Button',
        label: "Back",
        required: true,
        readOnly: false,
        value: ''
    }
}


export default class StatisticsDPermissionsPerDayController extends WebcController {
    constructor(...props) {

        super(...props);
        this.model = StatisticsDPermissionsPerDayControllerViewModel;
        this._attachHandlerGoBack();

        google.charts.load('current', {packages: ['corechart', 'bar']});
        google.charts.setOnLoadCallback(drawAxisTickColors);

        function drawAxisTickColors() {

            var data = google.visualization.arrayToDataTable([
                ['day', '#Day', { role: 'style' }],
                ['day 1', 8.94, '#b87333'],            // RGB value
                ['day 2', 10.49, 'silver'],            // English color name
                ['day 3', 19.30, 'gold'],
                ['day 4', 21.45, 'color: #e5e4e2' ], // CSS-style declaration
            ]);

            var options = {width:900, height:500};

            var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
            chart.draw(data, options);
        }

    }


    _attachHandlerGoBack(){
        this.onTagClick('dynamic-permission:go-back', (event) => {
            console.log ("Go back button pressed");
            this.navigateToPageTag('view-dynamic-permission');
        });
    }

}