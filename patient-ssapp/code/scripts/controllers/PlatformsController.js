import InformationRequestService from "../services/InformationRequestService.js";
import DPermissionService from "../services/DPermissionService.js";
import AvailableStudiesToParticipateService from "../services/AvailableStudiesToParticipateService.js";
import {consentModelHL7} from "../models/HL7/ConsentModel.js"
import EconsentStatusService from "../services/EconsentStatusService.js"
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
        this._attachHandlerMyStudies();
        this._attachHandlerParticipate();

        if (this.getState()){
            let receivedState = this.getState();
            console.log("Received State: " + JSON.stringify(receivedState, null, 4));
            this.model.ssi = receivedState.ssi
            this.model.dssi = receivedState.dssi;
            this.model.cssi = receivedState.cssi;

            this.model.notification = "There is a new request, Please review your notifications."
            if (this.model.ssi == null){
                this.model.notification = ""
            }
            this.model.dssi = receivedState.dssi;
        }


        // HELPER FUNCTIONS FOR DATA MATCHMAKING AND DCONSENT GENERATION
        this.InformationRequestService = new InformationRequestService(this.DSUStorage);
        this.DPermissionService = new DPermissionService(this.DSUStorage);
        this.AvailableStudiesToParticipateService = new AvailableStudiesToParticipateService(this.DSUStorage);
        this.EconsentStatusService = new EconsentStatusService(this.DSUStorage);


        //List all information Requests
        this.InformationRequestService.getInformationRequests((err, data) => {
            let all_information_requests;
            if (err) {
                return console.log(err);
            }
            all_information_requests = data;
            //console.log("All information Requests are: " + (all_information_requests.length+1));
            //console.log(JSON.stringify(all_information_requests[all_information_requests.length-1], null, 4 ));
        });


        // Mount Specific Information Request
        if (!this._isBlank(this.model.ssi)){
            let mounted_information_request;
            this.InformationRequestService.mount(this.model.ssi, (err, data) => {
                if (err) {
                    return console.log(err);
                }
                mounted_information_request = data;
                //console.log(JSON.stringify(mounted_information_request, null, 4 ));
            });
        }


        //List all the D.Permissions
        this.DPermissionService.getDPermissions((err, data) => {
            if (err) {
                return console.log(err);
            }
            //console.log(JSON.stringify(data, null, 4));
            //console.log("Total D Permissions are: " + (data.length+1));
        });


        // Mount Specific D Permission with given keySSI
        if (!this._isBlank(this.model.dssi)){
            //console.log("Trying to mount this D Permission: " + this.model.dssi);

            this.DPermissionService.mount(this.model.dssi, (err, data) => {
                if (err) {
                    return console.log(err);
                }
                // console.log("This D Permission is: ");
                // console.log(JSON.stringify(data, null, 4));
            });
        }

        // Generate study to participate according to the Information Request
        //Save Sample Study
        let sampleStudy = {
            study: "Study with date time: " + new Date().toString()
        }
        this.AvailableStudiesToParticipateService.saveStudy(sampleStudy, (err, data) => {
            if (err) {
                return console.log(err);
            }
            //console.log("Sample Study saved with keySSI " + data.keySSI)
            this.model.studyssi = data.KeySSI;
        });

        //Mount the last or a specific consent with given ssi
        console.log("Trying to mount this Consent: " + this.model.cssi);
        this.EconsentStatusService.mount(this.model.cssi,  (err, data) => {
            if (err) {
                return console.log(err);
            }
            // console.log("This E Consent is: ");
            // console.log(JSON.stringify(data, null, 4));
            let e_consent = data;
        });

        //List all the eConsents
        this.EconsentStatusService.getConsents((err, data) => {
            if (err) {
                return console.log(err);
            }
            //console.log("Total consents are: " + (data.length+1));

        });

        //F-M3-6F dynamic Permissioning using eConsent UC
        // 1. check if covered by the list of already generated DPermissions
        //List all the D.Permissions
        this.DPermissionService.getDPermissions((err, data) => { // COVERED BY D PERMISSIONS
            if (err) {
                return console.log(err);
            }
            //console.log(JSON.stringify(data, null, 4));
            console.log("Total D Permissions are: " + (data.length+1));

            for (let key in data){
                if(data[key].ConsentStatus.value === "active"){
                    //console.log("Consent is ACTIVE, check other filters");
                    let not_revoked = true;
                    if (not_revoked) {
                        let DPermissionObject = data[key];
                        // Add metadata to the new D Permission object
                        DPermissionObject.ConsentStatus.value = "not active";
                        DPermissionObject.Metadata = "metadata";
                        DPermissionObject.Covered = true;
                        // optional?? send to researcher ?? ACCEPT SEND DSU
                        // this.DPermissionService.saveDPermission(DPermissionObject, (err, data) => {
                        //     if (err) {
                        //         return console.log(err);
                        //     }
                        //     //console.log("New Dynamic Permission Object saved with keySSI " + data.keySSI);
                        //     //console.log(JSON.stringify(data, null, 4));
                        //     // Send this info to Researcher - OPTIONAL - HE CAN GET THE D PERMISSION LIST
                        // });
                    }
                    else{
                        console.log("D Permission cannot be generated, rejected!");
                    }
                }
                else { // CHECK IF COVERED MY ECONSENTS
                    this.EconsentStatusService.getConsents((err, data) => {
                        if (err) {
                            return console.log(err);
                        }
                        console.log("Total consents are: " + (data.length+1));
                        for (let key in data) {
                            if(data[key].ConsentStatus.value === "active"){
                                let DPermissionObject = data[key];
                                // Add metadata to the new D Permission object
                                DPermissionObject.ConsentStatus.value = "not active";
                                DPermissionObject.Metadata = "metadata";
                                DPermissionObject.Covered = true;
                                // optional?? send to researcher ?? ACCEPT SEND DSU
                                this.DPermissionService.saveDPermission(DPermissionObject, (err, data) => {
                                    if (err) {
                                        return console.log(err);
                                    }
                                    console.log("New Dynamic Permission Object saved with keySSI " + data.keySSI);
                                    //console.log(JSON.stringify(data, null, 4));
                                    // Send this info to Researcher - OPTIONAL - HE CAN GET THE D PERMISSION LIST
                                });
                            }
                            else{
                                let answer = window.confirm("Do you agree to share this content?");
                                if (answer) {
                                    console.log("USER AGREES SAVE THE DSU")
                                    // this.DPermissionService.saveDPermission(DPermissionObject, (err, data) => {
                                    //     if (err) {
                                    //         return console.log(err);
                                    //     }
                                    //     console.log("New Dynamic Permission Object saved with keySSI " + data.keySSI);
                                    //     //console.log(JSON.stringify(data, null, 4));
                                    //     // Send this info to Researcher - OPTIONAL - HE CAN GET THE D PERMISSION LIST
                                    // });
                                }
                                else {
                                    console.log("USER DOES NOT AGREE")
                                }
                            }

                        }
                    });
                }
            }
        });




    }

    _attachHandlerGoBack(){
        this.on('go-back', (event) => {
            console.log ("Go Back button pressed");
            this.navigateToPageTag('home');
        });
    }


    _attachHandlerParticipate(){
        this.on('participate-to-study', (event) => {
            console.log ("Participate to study button pressed");
            this.navigateToPageTag('participate-to-study');
        });
    }

    _attachHandlerMyStudies(){
        this.on('my-studies', (event) => {
            console.log ("My Studies button pressed");
            this.navigateToPageTag('my-studies');
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