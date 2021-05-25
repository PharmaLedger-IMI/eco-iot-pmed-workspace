const {WebcController} = WebCardinal.controllers;

const ViewDynamicPermissionViewModel = {

    gobackbutton: {
        name: 'Go Back Button',
        label: "Back",
        required: true,
        readOnly: false,
        value: ''
    },
    viewbutton: {
        name: 'View Button',
        label: "View",
        required: true,
        readOnly: false,
        value: ''
    },
    patient_options: {
        label: "Select the patient",
        placeholder: "Please select one option...",
        required: true,
        options: [
            {
            label: "Patient 1",
            value: "P1"
        },
        {
            label: "Patient 2",
            value: "P2"
        },
        {
            label: "Patient X",
            value: "PX"
        }
        ]
    }

}

export default class ViewDynamicPermissionController extends WebcController {
    constructor(...props) {

        super(...props);
        this.model = ViewDynamicPermissionViewModel;
        this._attachHandlerGoBack()


        let selectSubmit = () => {
            let option_chosen = this.model.patient_options.value;
            if(option_chosen === 'P1'){
                console.log("Chosen Patient 1")
                this.navigateToPageTag('patient-dynamic-permission');
            } else {
                console.log("Chosen Patient ...")
            }
        }

        this.on("View",selectSubmit,true);
      
    }

    _attachHandlerGoBack(){
        this.on('dynamic-permission:go-back', (event) => {
            console.log ("Go back button pressed");
            this.navigateToPageTag('home');
        });
    }

}