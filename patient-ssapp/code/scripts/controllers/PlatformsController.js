import CommunicationService from "../services/CommunicationService.js";
import DConsentHelperService from "../utils/DConsentHelperService.js"
import DPermissionService from "../services/DPermissionService.js";
import DataMatchMakingService from "../utils/DataMatchMakingService.js"
const {WebcController} = WebCardinal.controllers;


const ViewModel = {
    notification: false
}


export default class PlatformsController extends WebcController {
    constructor(...props) {
        super(...props);

        this.model = ViewModel;

        this._attachHandlerGoBack();
        this._attachHandlerGoToMyNotifications();
        this._attachHandlerMyStudies();
        this._attachHandlerParticipate();

        this.model.information_request_ssi = ""
        this.model.dssi = false
        this.model.cssi = false
        this.model.notification = false

        if (this.getState()){
            let receivedState = this.getState();
            console.log("Received State: " + JSON.stringify(receivedState, null, 4));

            this.model.information_request_ssi = receivedState.information_request_ssi
            this.model.dssi = receivedState.d_permission_ssi;
            this.model.cssi = receivedState.e_consent_ssi;

           if (this._isBlank(this.model.information_request_ssi) || this.model.information_request_ssi === null) {
               this.model.notification = false
           }
           else{
               this.model.notification = "Received a new information request with keySSI: " + this.model.information_request_ssi.substr(this.model.information_request_ssi.length - 10)
           }
        }



        // this.DConsentHelperService = new DConsentHelperService(this.DSUStorage);
        // this.DConsentHelperService.DPermissionCheckAndGeneration();

        if (!this._isBlank(this.model.information_request_ssi) || this.model.information_request_ssi === null) {
            this.DataMatchMakingService = new DataMatchMakingService(this.DSUStorage, this.model.information_request_ssi);
        }


        //
        // this.DataMatchMakingService.listInformationRequests();
        // this.DataMatchMakingService.listEConsents();
        // this.DataMatchMakingService.listDPermissions();

        //this.DataMatchMakingService.generateParticipatingStudy();

        //Send all the D.Permissions to Researcher
        // this.DPermissionService = new DPermissionService(this.DSUStorage);
        // this.DPermissionService.getDPermissions((err, data) => {
        //     if (err) {
        //         return console.log(err);
        //     }
        //
        //     console.log("Sending to Researcher the D Permissions: " + (data.length));
        //     let DpermissionKeySSIlist = []
        //     data.forEach(d_permission => {
        //         DpermissionKeySSIlist.push(d_permission.KeySSI);
        //     })
        //     console.log(DpermissionKeySSIlist);
        //     this.CommunicationService = CommunicationService.getInstance(CommunicationService.identities.IOT.PATIENT_IDENTITY);
        //     this.sendMessageToResearcher('d-permission-list', DpermissionKeySSIlist);
        // });
    }

    sendMessageToResearcher(operation, ssi_list) {
        this.CommunicationService.sendMessage(CommunicationService.identities.IOT.RESEARCHER_IDENTITY, {
            operation: operation,
            d_permission_keyssi_list: ssi_list
        });
<<<<<<< HEAD

        //check econsentStatus here




=======
>>>>>>> origin/master
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
            // let information_request_state = {
            //     information_request_ssi: this.model.information_request_ssi
            // }
            //this.DataMatchMakingService.printTheRequest();
            this.navigateToPageTag('my-notifications');
        });
    }

    _isBlank(str) {
        return (!str || /^\s*$/.test(str));
    }


}