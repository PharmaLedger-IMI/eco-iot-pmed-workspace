const {WebcController} = WebCardinal.controllers;


const ViewMyStudiesModel = {

    my_studies: {
        label: "Choose one option to view your on-going study:",
        required: true,
        options: [
            {
                label: "Medication from Oviedo Hospital",
                value: "Medication from Oviedo Hospital",
                checked: true
            },
            {
                label: "Vital signals at La Paz Hospital",
                value: "Vital signals at La Paz Hospital"
            },
            {
                label: "All records with Monte Sinai",
                value: "All records with Monte Sinai"
            },
            {
                label: "Study X",
                value: "Study X"
            }
        ],
        value: ''
    }
}


export default class MyStudiesController extends WebcController {
    constructor(...props) {
        super(...props);

        this.model = ViewMyStudiesModel;

        // Push data from database
        //  Add available studies
        // this.model.my_studies.options.push({
        //     label: "",
        //     value: ""
        // });

        let radioSubmitData = () => {
            let choice = this.model.my_studies.value;
            if (choice === "Medication from Oviedo Hospital"){
                console.log('Medication from Oviedo Hospital!')
                this.navigateToPageTag('home');
            }
        }
        this.on("Show Study",radioSubmitData, true);



        this._attachHandlerGoBack();
        this._attachHandlerStopSharing();

    }

    _attachHandlerGoBack(){
        this.on('go-back', (event) => {
            console.log ("Go Back button pressed");
            this.navigateToPageTag('platforms');
        });
    }

    _attachHandlerStopSharing(){
        this.on('stop-sharing', (event) => {
        let choice = this.model.my_studies.value;
        console.log ("You will stop sharing this data: " + choice);
            //this.navigateToPageTag('platforms');
        });
    }





}