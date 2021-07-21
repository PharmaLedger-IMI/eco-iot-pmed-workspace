import CommunicationService from "../services/CommunicationService.js";
import DConsentHelperService from "../utils/DConsentHelperService.js"
import DPermissionService from "../services/DPermissionService.js";
import DataMatchMakingService from "../utils/DataMatchMakingService.js"
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

        this.DConsentHelperService = new DConsentHelperService(this.DSUStorage);
        this.DConsentHelperService.DPermissionCheckAndGeneration();

        this.DataMatchMakingService = new DataMatchMakingService(this.DSUStorage);

        this.DataMatchMakingService.listInformationRequests();
        this.DataMatchMakingService.listEConsents();
        this.DataMatchMakingService.listDPermissions();

        this.DataMatchMakingService.generateParticipatingStudy();

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