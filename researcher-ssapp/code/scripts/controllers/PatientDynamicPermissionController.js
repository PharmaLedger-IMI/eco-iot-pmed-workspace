const {WebcController} = WebCardinal.controllers;
import {consentModelHL7} from '../models/HL7/ConsentModel.js';


const ViewPatientDynamicPermissionViewModel = {

    gobackbutton: {
        name: 'Go Back Button',
        label: "Back",
        required: true,
        readOnly: false,
        value: ''
    }
}

export default class PatientDynamicPermissionController extends WebcController {

    constructor(...props) {

        super(...props);
        this.model = ViewPatientDynamicPermissionViewModel;
        this._attachHandlerGoBack()

        //let random_consent = consentModelHL7;



    }

    _attachHandlerGoBack(){
        this.on('patient-permission:go-back', (event) => {
            console.log ("Go back button pressed");
            this.navigateToPageTag('home');
        });
    }


}