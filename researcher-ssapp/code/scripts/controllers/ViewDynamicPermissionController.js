import DPermissionService from "../services/DPermissionService.js";

const {WebcController} = WebCardinal.controllers;

const ViewDynamicPermissionViewModel = {

    gobackbutton: {
        name: 'Go Back Button',
        label: "Back",
        required: true,
        readOnly: false,
        value: ''
    },
    viewbutton: {
        name: 'View Button',
        label: "View",
        required: true,
        readOnly: false,
        value: ''
    },
    patient_options: {
        label: "Select the patient",
        placeholder: "Please select one option...",
        required: true,
        options: [
            {
            label: "Patient 1",
            value: "P1"
        },
        {
            label: "Patient 2",
            value: "P2"
        },
        {
            label: "Patient X",
            value: "PX"
        }
        ]
    },

    d_permission_per_day: {
        name: 'Number of dynamic permissions per day',
        label: "Number of dynamic permissions per day",
        required: true,
        value: ''
    },

    users_d_permission_per_day: {
        name: 'Number of users with dynamic permissions per day',
        label: "Number of users with dynamic permissions per day",
        required: true,
        value: ''
    },

    total_users_button: {
        name: 'Total users',
        label: "Total users",
        required: true,
        value: ''
    },

    all_d_permissions: 0,
    all_users: 0,
    all_users_number: 0,
    observation_types: 0

}


export default class ViewDynamicPermissionController extends WebcController {
    constructor(...props) {

        super(...props);
        this.model = ViewDynamicPermissionViewModel;
        this._attachHandlerGoBack()
        this._attachHandlerdpperday()
        this._attachHandlerudpperday()
        this._attachHandlertotalusers()

        let selectSubmit = () => {
            let option_chosen = this.model.patient_options.value;
            if(option_chosen){
                console.log("Chosen Patient ...");
                this.navigateToPageTag('patient-dynamic-permission');
            } else {
                console.log("Chosen Patient ...");
            }
        }

        this.on("View",selectSubmit,true);

        this.DPermissionService = new DPermissionService(this.DSUStorage);
        //List all the D.Permissions
        this.DPermissionService.getDPermissions((err, data) => {
            if (err) {
                return console.log(err);
            }
            //console.log(JSON.stringify(data, null, 4));
            console.log("Total D Permissions are: " + (data.length));
            this.model.all_d_permissions = data.length;

            let users = [];
            for (let i=0;i<data.length;i+=1){
                users.push((data[i].ConsentPatient.value));
            }

            this.model.all_users = users.filter((v, i, a) => a.indexOf(v) === i);
            this.model.all_users_number = this.model.all_users.length;
        });


        //Mount Specific D Permission with given keySSI
        // if (!this._isBlank(this.model.dssi)){
        //     //console.log("Trying to mount this D Permission: " + this.model.dssi);
        //
        //     this.DPermissionService.mount(this.model.dssi, (err, data) => {
        //         if (err) {
        //             return console.log(err);
        //         }
        //         // console.log("This D Permission is: ");
        //         // console.log(JSON.stringify(data, null, 4));
        //     });
        // }


    }

    _attachHandlerGoBack(){
        this.on('dynamic-permission:go-back', (event) => {
            console.log ("Go back button pressed");
            this.navigateToPageTag('home');
        });
    }

    _attachHandlerdpperday(){
        this.on('dynamic-permission:statistics-d-permission-per-day', (event) => {
            this.navigateToPageTag('statistics-d-permissions-per-day');
        });
    }

    _attachHandlerudpperday(){
        this.on('dynamic-permission:statistics-users-d-permission-per-day', (event) => {
            this.navigateToPageTag('statistics-d-permissions-per-day-users');
        });
    }

    _attachHandlertotalusers(){
        this.on('dynamic-permission:statistics-total-users', (event) => {
            let state = {
                all_d_permissions: this.model.all_d_permissions,
                all_users_number: this.model.all_users_number,
            }
            this.navigateToPageTag('statistics-d-permissions-total-users', state);
        });
    }

}