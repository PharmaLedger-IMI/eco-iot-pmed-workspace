const {WebcController} = WebCardinal.controllers;
import {consentModelHL7} from '../models/HL7/ConsentModel.js';


const ViewPatientDynamicPermissionViewModel = {

    gobackbutton: {
        name: 'Go Back Button',
        label: "Back",
        required: true,
        readOnly: false,
        value: 'sasdsad'
    },

    entities: [
        {
            id: {
                label: "id",
                value: "1",
            },
            name: {
                label: "name",
                value: "2",
            },
            information: {
                label: "information",
                value: "3",
            }
        },
        {
            id: {
                label: "id",
                value: "4",
            },
            name: {
                label: "name",
                value: "5",
            },
            information: {
                label: "information",
                value: "6",
            }
        }
    ]
}

export default class PatientDynamicPermissionController extends WebcController {

    constructor(...props) {

        super(...props);
        this.model = ViewPatientDynamicPermissionViewModel;
        this._attachHandlerGoBack()





    }

    _attachHandlerGoBack(){
        this.onTagClick('patient-permission:go-back', (event) => {
            console.log ("Go back button pressed");
            this.navigateToPageTag('view-dynamic-permission');
        });
    }


}