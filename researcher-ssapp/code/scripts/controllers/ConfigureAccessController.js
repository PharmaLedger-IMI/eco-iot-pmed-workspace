const {WebcController} = WebCardinal.controllers;

const ConfigureAccessViewModel = {

    gobackbutton: {
        name: 'Go Back Button',
        label: "Back",
        required: true,
        readOnly: false,
        value: ''
    },
    configurebutton: {
        name: 'Configure Button',
        label: "Configure",
        required: true,
        readOnly: false,
        value: ''
    }

}

export default class ConfigureAccessController extends WebcController {
    constructor(element, history) {

        super(element, history);
        this.model = ConfigureAccessViewModel;
        this._attachHandlerGoBack()
      
    }

    _attachHandlerGoBack(){
        this.on('configure-access:go-back', (event) => {
            console.log ("Go back button pressed");
            this.navigateToPageTag('home');
        });
    }

}