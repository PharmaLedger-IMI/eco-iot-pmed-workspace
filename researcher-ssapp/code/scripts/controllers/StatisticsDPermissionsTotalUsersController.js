const {WebcController} = WebCardinal.controllers;

const StatisticsDPermissionsTotalUsersControllerViewModel = {

    gobackbutton: {
        name: 'Go Back Button',
        label: "Back",
        required: true,
        readOnly: false,
        value: ''
    },

    all_d_permissions: 0,
    all_users_number: 0
}


export default class StatisticsDPermissionsTotalUsersController extends WebcController {
    constructor(...props) {

        super(...props);
        this.model = StatisticsDPermissionsTotalUsersControllerViewModel;
        this._attachHandlerGoBack();

        if (this.getState()){
            let receivedState = this.getState();
            console.log("Received State: " + JSON.stringify(receivedState, null, 4));
            this.model.all_d_permissions = receivedState.all_d_permissions
            this.model.all_users_number = receivedState.all_users_number;
        }
        var all_permissions = this.model.all_d_permissions;
        var all_users = this.model.all_users_number;


        if (all_permissions === 0 || all_users === 0){
            console.log("Users or permissions are zero, graph will not be displayed.")
        }
        else{
            google.charts.load("current", {packages:["corechart"]});
            google.charts.setOnLoadCallback(drawChart);
        }


        function drawChart() {

            var data = google.visualization.arrayToDataTable([
                ['Category', '# Number'],
                ['#Users',       all_users],
                ['#Permissions', all_permissions]
            ]);

            var options = {
                is3D: true,
                width: 900,
                height: 450
            };

            var chart = new google.visualization.PieChart(document.getElementById('piechart'));
            chart.draw(data, options);
        }




    }


    _attachHandlerGoBack(){
        this.on('dynamic-permission:go-back', (event) => {
            console.log ("Go back button pressed");
            this.navigateToPageTag('home');
        });
    }

}