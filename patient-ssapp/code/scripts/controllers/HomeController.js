import CommunicationService from '../services/CommunicationService.js';
import InformationRequestService from '../services/InformationRequestService.js';
import PatientService from "./services/PatientService.js";
import {patientModelHL7} from '../models/PatientModel.js';
const {WebcController} = WebCardinal.controllers;


export default class HomeController extends WebcController {
    constructor(element, history) {
        super(element, history);
        this.setModel({});

        let initProfile = patientModelHL7;
        initProfile.PatientName.value = "Maria";
        initProfile.PatientBirthDate.value = "01/01/2000";
        initProfile.PatientTelecom.value = "maria@gmail.com";
        initProfile.password.value = "password";


        this.PatientService = new PatientService(this.DSUStorage);

        this.PatientService.createProfile(initProfile, (err, userProfile) => {
            if (err) {
                return console.log(err);
            }
            console.log("CREATED WITH DSU-STORAGE AND KEYSSI: ", userProfile);

            this.model.profileIdentifier = userProfile.identifier;
            this.model.name = userProfile.PatientName.value;
        })

        this.InformationRequestService = new InformationRequestService(this.DSUStorage);
        this.CommunicationService = CommunicationService.getInstance(CommunicationService.identities.PATIENT_IDENTITY);
        this.CommunicationService.listenForMessages((err, data) => {
            if (err) {
                return console.error(err);
            }
            data = JSON.parse(data);
            console.log('Received message', data.message)

            switch (data.message.operation) {
                case 'information-request-response': {
                    this.InformationRequestService.mount(data.message.ssi, (err, data) => {
                        console.log("mounted!!!")
                        if (err) {
                            return console.log(err);
                        }
                        this.InformationRequestService.getInformationRequests((err, data) => {
                            if (err) {
                                return console.log(err);
                            }
                            console.log('PatientSSAPP_HomeController');
                            console.log(data[data.length-1]);
                        });
                    });
                    console.log("CASE RECEIVED INFORMATION REQUEST!")
                    break;
                }
            }

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
            this.navigateToPageTag('platforms');
        });
    }

    _attachHandlerFeedback(){
        this.on('home:feedback', (event) => {
            console.log ("Feedback button pressed");
            this.navigateToPageTag("personalized-feedback");
        });
        
    }
}