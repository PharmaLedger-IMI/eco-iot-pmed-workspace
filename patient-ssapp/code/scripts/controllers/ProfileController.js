import PatientService from "./services/PatientService.js";
import {patientModelHL7} from '../models/PatientModel.js';
const { WebcController } = WebCardinal.controllers;


const DisplayProfileModel = {

    name: {
        name: 'name',
        label: "Name",
        placeholder: 'Enter your full name',
        required: true,
        readOnly: true,
        value: ''
    },
    birthdate: {
        name: 'birthdate',
        label: "Birthdate",
        placeholder: 'Enter your birthdate',
        required: true,
        readOnly: true,
        value: ''
    },
    email: {
        name: 'email',
        label: "Email",
        placeholder: 'Enter your email',
        required: true,
        readOnly: true,
        value: ''
    },
    password: {
        name: 'password',
        label: "Password",
        placeholder: 'Enter your password',
        required: true,
        readOnly: true,
        value: ''
    },
    editButton: {
        label: "Edit profile",
        editState: false
    },
    backButton: {
        label: "Back",
        editState: false
    },
    modal: { 
        opened: false 
    }
}

export default class ProfileController extends WebcController {
    constructor(element, history) {
        super(element, history);
        this._attachHandlerGoBack();
        this.setModel(JSON.parse(JSON.stringify(DisplayProfileModel)));
       

        let receivedModel = this.History.getState();
        //debugger
        this.PatientService = new PatientService(this.DSUStorage);
        this.PatientService.getProfile(receivedModel.profileId, (err, profile) => {
            if(err) {
                return console.log(err);
            }

            this.model.profile = profile;

            this.model.name.value = profile.PatientName.value
            this.model.birthdate.value = profile.PatientBirthDate.value
            this.model.email.value = profile.PatientTelecom.value
            this.model.password.value = profile.password.value

            console.log("BROUGHT HERE BY GET PROFILE", profile);
        })

        this.on('profile:edit', (event) => {
            if(this.model.editButton.editState) {
                this.model.editButton.label = "Edit profile";
                this.model.name.readOnly = true;
                this.model.birthdate.readOnly = true;
                this.model.email.readOnly = true;
                this.model.password.readOnly = true;
                this.model.editButton.editState = false;
                
                let ProfileAmendmentObj = patientModelHL7;
                ProfileAmendmentObj.identifier = this.model.profile.identifier;

                ProfileAmendmentObj.PatientName.value = this.model.name.value;
                ProfileAmendmentObj.PatientBirthDate.value = this.model.birthdate.value;
                ProfileAmendmentObj.PatientTelecom.value = this.model.email.value;
                ProfileAmendmentObj.password.value = this.model.password.value;

                this.PatientService.updateProfile(ProfileAmendmentObj, (err, profileObject) => {
                    if(err) {
                        return console.log(err);
                    }
                    console.log("EDIT WORKED", profileObject);
                    this.model.modal.opened =true;
                })
                
                
                

            } else {
                this.model.editButton.label = "Save profile";
                this.model.name.readOnly = false;
                this.model.birthdate.readOnly = false;
                this.model.email.readOnly = false;
                this.model.password.readOnly = false;
                this.model.editButton.editState = true;
            }
        })

        

        this.on('closeModal', _ => this.model.modal.opened = false);
        
       
       

    }

    _attachHandlerGoBack(){
        this.on('go-back', (event) => {
            console.log ("Go Back button pressed");
            this.navigateToPageTag('home');
        });
    }


}