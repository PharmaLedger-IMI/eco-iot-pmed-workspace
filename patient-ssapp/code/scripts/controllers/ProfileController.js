import ContainerController from '../../../cardinal/controllers/base-controllers/ContainerController.js';
import PatientService from "./services/PatientService.js";

const initModel = {
    name: {
        name: 'name',
        label: "Name",
        placeholder: 'Enter your full name',
        required: true,
        readOnly: true,
        value: ''
    },
    age: {
        name: 'age',
        label: "Age",
        placeholder: 'Enter your age',
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
    }
}

export default class ProfileController extends ContainerController {
    constructor(element, history) {
        super(element, history);
        this.setModel(initModel);

        let receivedModel = this.History.getState();
        debugger
        this.PatientService = new PatientService(this.DSUStorage);
        this.PatientService.getProfile(receivedModel.profileId, (err, profile) => {
            if(err) {
                return console.log(err);
            }
            this.model.profile = profile;
            this.model.name.value = profile.name;
            this.model.age.value = profile.age;
            this.model.email.value = profile.email;
            this.model.password.value = profile.password;
            console.log("BRINGED HERE BY GET PROFILE", profile);
        })

        this.on('profile:edit', (event) => {
            if(this.model.editButton.editState) {
                this.model.editButton.label = "Edit profile";
                this.model.name.readOnly = true;
                this.model.age.readOnly = true;
                this.model.email.readOnly = true;
                this.model.password.readOnly = true;
                this.model.editButton.editState = false;

                let profileObject = {
                    identifier: this.model.profile.identifier,
                    name: this.model.name.value,
                    age: this.model.age.value,
                    email: this.model.email.value,
                    password: this.model.password.value
                }
                this.PatientService.updateProfile(profileObject, (err, profileObject) => {
                    if(err) {
                        return console.log(err);
                    }
                    console.log("EDIT WORKED", profileObject);
                })
                console.log(profileObject)

            } else {
                this.model.editButton.label = "Save profile";
                this.model.name.readOnly = false;
                this.model.age.readOnly = false;
                this.model.email.readOnly = false;
                this.model.password.readOnly = false;
                this.model.editButton.editState = true;
            }
        })

    }



}