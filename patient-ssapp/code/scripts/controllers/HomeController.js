import ContainerController from '../../../cardinal/controllers/base-controllers/ContainerController.js';
import PatientService from "./services/PatientService.js";

export default class HomeController extends ContainerController {
    constructor(element, history) {
        super(element, history);
        this.setModel({});

        this.PatientService = new PatientService(this.DSUStorage);
        let initProfile = {
            name: "Maria",
            age: "24",
            email: "maria@gmail.com",
            password: "password",
        }
        this.PatientService.createProfile(initProfile, (err, userProfile) => {
            if (err) {
                return console.log(err);
            }
            console.log("CREATED WITH DSU-STORAGE", userProfile);
            this.model.profileIdentifier = userProfile.identifier;
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
            this.History.navigateToPageByTag('mydata');
        });
    }

    _attachHandlerMyPlatforms(){
        this.on('home:platforms', (event) => {
            console.log ("Platforms button pressed");
            this.History.navigateToPageByTag('mydata');
        });
    }

    _attachHandlerFeedback(){
        this.on('home:feedback', (event) => {
            console.log ("Feedback button pressed");
            this.History.navigateToPageByTag('mydata');
        });
    }
}