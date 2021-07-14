import ProfileManagementService from '../services/ProfileManagementService.js';
import CommunicationService from "../services/CommunicationService.js";
import InformationRequestService from "../services/InformationRequestService.js";
import {patientModelHL7} from '../models/PatientModel.js';
import DPermissionService from "../services/DPermissionService.js";
import {consentModelHL7} from "../models/HL7/ConsentModel.js"
import EconsentStatusService from "../services/EconsentStatusService.js";


const {WebcController} = WebCardinal.controllers;


const HomePageViewModel = {
    ssi: null
}


export default class HomeController extends WebcController {
    constructor(...props) {
        super(...props);

        this.model = HomePageViewModel;

        let initProfile = JSON.parse(JSON.stringify(patientModelHL7));
        initProfile.PatientName.value = "Maria";
        initProfile.PatientBirthDate.value = "01/01/2000";
        initProfile.PatientTelecom.value = "maria@gmail.com";
        initProfile.password.value = "password";

        let received_information_request = {};
        this.model.ssi = null

        this.InformationRequestService = new InformationRequestService(this.DSUStorage);
        this.CommunicationService = CommunicationService.getInstance(CommunicationService.identities.IOT.PATIENT_IDENTITY);
        this.CommunicationService.listenForMessages((err, data) => {
            if (err) {
                return console.error(err);
            }
            data = JSON.parse(data);
            console.log('Received Message', data.message);

            switch (data.message.operation) {
                case 'information-request-response': {
                    this.InformationRequestService.mount(data.message.ssi, (err, data) => {
                        if (err) {
                            return console.log(err);
                        }
                        this.InformationRequestService.getInformationRequests((err, data) => {
                            if (err) {
                                return console.log(err);
                            }

                            received_information_request = (data[data.length-1]);
                            //console.log("Mounted Information Request")
                            //console.log(JSON.stringify(received_information_request, null, 4));
                            this.model.ssi = received_information_request.KeySSI;
                        });
                    });
                    console.log("Received Information Request");
                    break;
                }
            }
        });


        this.PatientService = new ProfileManagementService(this.DSUStorage);
        this.PatientService.saveProfile(initProfile, (err, userProfile) => {
            if (err) {
                return console.log(err);
            }
            //console.log("CREATED PROFILE WITH KEYSSI: ", userProfile.KeySSI);

            this.model.profileIdentifier = userProfile.KeySSI;
            this.model.name = userProfile.PatientName.value;
        });


        //Generate Sample DPermission for testing in Platforms page
        this.DPermissionService = new DPermissionService(this.DSUStorage);

        let DPermissionSample = JSON.parse(JSON.stringify(consentModelHL7));
        DPermissionSample.ConsentStatus.value = "active";
        DPermissionSample.ConsentPatient.value = initProfile.PatientName.value;
        DPermissionSample.ConsentScope.value = "research";
        DPermissionSample.ConsentDateTime.value = new Date().toString();
        DPermissionSample.ConsentOrganization.value = "UPM";

        this.DPermissionService.saveDPermission(DPermissionSample, (err, dpermissiondata) => {
            if (err) {
                return console.log(err);
            }
            console.log("A Sample D Permission saved with keySSI " + dpermissiondata.keySSI)
            //console.log(JSON.stringify(dpermissiondata, null, 4));
            this.model.dpermissionssi = dpermissiondata.KeySSI;
        });


        // Generate eConsent Sample for testing in Platforms page
        this.EconsentStatusService = new EconsentStatusService(this.DSUStorage);

        let EConsentSample = JSON.parse(JSON.stringify(consentModelHL7));
        EConsentSample.ConsentStatus.value = "active";

        this.EconsentStatusService.saveConsent(EConsentSample, (err, econsentdata) => {
            if (err) {
                return console.log(err);
            }
            console.log("A Sample E Consent saved with keySSI " + econsentdata.keySSI)
            //console.log(JSON.stringify(econsentdata, null, 4));
            this.model.consentssi = econsentdata.KeySSI;
        });

        this._attachHandlerEditProfile();
        this._attachHandlerMyData();
        this._attachHandlerMyPlatforms();
        this._attachHandlerFeedback();

    }

    _attachHandlerEditProfile(){
        this.on('home:profile', (event) => {
            //console.log ("Profile button pressed");
            let state = {
                profileId: this.model.profileIdentifier
            }
            
            //this.History.navigateToPageTag('profile', state);
            this.navigateToPageTag('profile',state);
        });
    }

    _attachHandlerMyData(){
        this.on('home:mydata', (event) => {
            //console.log ("My Data button pressed");
            let state = {
                profileId: this.model.profileIdentifier,
                nameId: this.model.name
            }
            this.navigateToPageTag('mydata', state);
        });

    }

    _attachHandlerMyPlatforms(){
        this.on('home:platforms', (event) => {
            //console.log ("Platforms button pressed");
            let information_request_state = {
                ssi: this.model.ssi,
                dssi: this.model.dpermissionssi,
                cssi: this.model.consentssi
            }
            this.navigateToPageTag('platforms', information_request_state);
        });
    }

    _attachHandlerFeedback(){
        this.on('home:feedback', (event) => {
            //console.log ("Feedback button pressed");
            this.navigateToPageTag("personalized-feedback");
        });
        
    }
}