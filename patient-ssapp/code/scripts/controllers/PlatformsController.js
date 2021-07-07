import InformationRequestService from "../services/InformationRequestService.js";
import DPermissionService from "../services/DPermissionService.js";


const {WebcController} = WebCardinal.controllers;


const ViewModel = {
    notification: ""
}


export default class PlatformsController extends WebcController {
    constructor(...props) {
        super(...props);

        this.model = ViewModel;

        this._attachHandlerGoBack();
        this._attachHandlerGoToMyNotifications();

        let receivedState = this.getState();
        console.log("Received State: " + JSON.stringify(receivedState, null, 4));
        this.model.ssi = receivedState.ssi
        this.model.dssi = receivedState.dssi;

        this.model.notification = "There is a new request, Please review your notifications."
        if (this.model.ssi == null){
            this.model.notification = ""
        }
        this.model.dssi = receivedState.dssi;



        if (!this._isBlank(this.model.ssi)){
            // DATA MATCHMAKING FUNCTION
            // List all the requests
            this.InformationRequestService = new InformationRequestService(this.DSUStorage);
            let mounted_information_request;
            let all_information_requests;
            this.InformationRequestService.mount(this.model.ssi, (err, data) => {
                if (err) {
                    return console.log(err);
                }
                mounted_information_request = data;
                this.InformationRequestService.getInformationRequests((err, data) => {
                    if (err) {
                        return console.log(err);
                    }
                    all_information_requests = data;
                    console.log("Mounted Information Request with SSI " + this.model.ssi)
                    //console.log(JSON.stringify(mounted_information_request, null, 4));
                    //console.log(JSON.stringify(all_information_requests[all_information_requests.length-1], null, 4 ));
                });
            });
        }


        //List all the D.Permissions
        if (!this._isBlank(this.model.dssi)){
            console.log(this.model.dssi);

            this.DPermissionService = new DPermissionService(this.DSUStorage);


            this.DPermissionService.mount(this.model.dssi, (err, data) => {
                if (err) {
                    return console.log(err);
                }
                this.DPermissionService.getDPermissions((err, data) => {
                    if (err) {
                        return console.log(err);
                    }
                    console.log(JSON.stringify(data, null, 4));
                });
            });
        }



    }

    _attachHandlerGoBack(){
        this.on('go-back', (event) => {
            console.log ("Go Back button pressed");
            this.navigateToPageTag('home');
        });
    }

    _attachHandlerGoToMyNotifications(){
        this.on('my-notifications', (event) => {
            console.log ("My notifications button pressed");
            let information_request_state = {
                ssi: this.model.ssi
            }
            this.navigateToPageTag('my-notifications', information_request_state);
        });
    }

    _isBlank(str) {
        return (!str || /^\s*$/.test(str));
    }



}