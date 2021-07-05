import ProfileManagementService from '../services/ProfileManagementService.js';
import CommunicationService from "../services/CommunicationService.js";
import InformationRequestService from "../services/InformationRequestService.js";
import {patientModelHL7} from '../models/PatientModel.js';

const {WebcController} = WebCardinal.controllers;


export default class HomeController extends WebcController {
    constructor(...props) {
        super(...props);
        this.model = {}

        let initProfile = patientModelHL7;
        initProfile.PatientName.value = "Maria";
        initProfile.PatientBirthDate.value = "01/01/2000";
        initProfile.PatientTelecom.value = "maria@gmail.com";
        initProfile.password.value = "password";

        this.InformationRequestService = new InformationRequestService(this.DSUStorage);
        this.CommunicationService = CommunicationService.getInstance(CommunicationService.identities.IOT.PATIENT_IDENTITY);
        this.CommunicationService.listenForMessages((err, data) => {
            if (err) {
                return console.error(err);
            }
            data = JSON.parse(data);
            console.log('Received message', data.message)

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
                            let last_request = (data[data.length-1]);
                            console.log(last_request);

                            //this.model.contract = last_request;
                            this.model.ssi = last_request.KeySSI;
                            this.model.title = last_request.ContractTitle;
                        });
                    });
                    console.log("CASE RECEIVED INFORMATION REQUEST");
                    break;
                }
            }
        });


        this.PatientService = new ProfileManagementService(this.DSUStorage);
        this.PatientService.saveProfile(initProfile, (err, userProfile) => {
            if (err) {
                return console.log(err);
            }
            console.log("CREATED WITH DSU-STORAGE AND KEYSSI: ", userProfile.KeySSI);

            this.model.profileIdentifier = userProfile.KeySSI;
            this.model.name = userProfile.PatientName.value;
        });


        this._attachHandlerEditProfile();
        this._attachHandlerMyData();
        this._attachHandlerMyPlatforms();
        this._attachHandlerFeedback();

    }

    _attachHandlerEditProfile(){
        this.on('home:profile', (event) => {
            console.log ("Profile button pressed");
            let state = {
                profileId: this.model.profileIdentifier
            }
            
            //this.History.navigateToPageTag('profile', state);
            this.navigateToPageTag('profile',state);
        });
    }

    _attachHandlerMyData(){
        this.on('home:mydata', (event) => {
            console.log ("My Data button pressed");
            let state = {
                profileId: this.model.profileIdentifier,
                nameId: this.model.name
            }
            this.navigateToPageTag('mydata', state);
        });

    }

    _attachHandlerMyPlatforms(){
        this.on('home:platforms', (event) => {
            console.log ("Platforms button pressed");
            let information_request_state = {
                ssi: this.model.ssi,
                title: this.model.title
            }
            this.navigateToPageTag('platforms', information_request_state);
        });
    }

    _attachHandlerFeedback(){
        this.on('home:feedback', (event) => {
            console.log ("Feedback button pressed");
            this.navigateToPageTag("personalized-feedback");
        });
        
    }
}