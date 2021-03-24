import ContainerController from '../../../cardinal/controllers/base-controllers/ContainerController.js';
import PatientService from "./services/PatientService.js";
import {patientModelHL7} from '../models/PatientModel.js';


export default class HomeController extends ContainerController {
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
            this.History.navigateToPageByTag('profile', state);
        });
    }

    _attachHandlerMyData(){
        this.on('home:mydata', (event) => {
            console.log ("My Data button pressed");
            let state = {
                profileId: this.model.profileIdentifier,
                nameId: this.model.name
            }
            this.History.navigateToPageByTag('mydata', state);
        });
    }

    _attachHandlerMyPlatforms(){
        this.on('home:platforms', (event) => {
            console.log ("Platforms button pressed");
            this.History.navigateToPageByTag('platforms');
        });
    }

    _attachHandlerFeedback(){
        this.on('home:feedback', (event) => {
            console.log ("Feedback button pressed");
            this.History.navigateToPageByTag('feedback');
        });
    }
}