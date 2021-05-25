const { WebcController } = WebCardinal.controllers;

const ViewPersonalHealthDataModel = {

    name: {
        name: 'NAME',
        label: "name",
        value: 'name'
    },
    id: {
        name: 'ID',
        label: "id",
        value: 'id'
    },
    mydata: {
        label: "My documents",
        required: true,
        options: [{
            label: "All records",
            value: 'All records',
            checked: true
        },
            {
                label: "Allergies",
                value: "Allergies"
            },
            {
                label: "Clinical vitals",
                value: "cv"
            },
            {
                label: "Conditions",
                value: "Conditions"
            },
            {
                label: "Immunizations",
                value: "Immunizations"
            },
            {
                label: "Lab results",
                value: "Lab results"
            },
            {
                label: "Medications/Treatments",
                value: "Medications/Treatments"
            }
        ],
        value: ''
    },
    myhealthsources: {
        label: "My sources:",
        required: true,
        options: [{
            label: "All sources",
            value: 'All sources'
        },
            {
                label: "St. Maarten Medical Center",
                value: "St. Maarten Medical Center"
            },
            {
                label: "Hospital Universitario Infanta Leonor",
                value: "Hospital Universitario Infanta Leonor"
            }
        ],
        value: ''
    }
}


export default class MyDataMainPageController extends  WebcController  {
    constructor(element, history) {
        super(element, history);
       
        this.model = ViewPersonalHealthDataModel ;

        let receivedModel = this.getState();

        console.log("Welcome: " + receivedModel.nameId);
        this.model.name = receivedModel.nameId
        this.model.id   = receivedModel.profileId
        this._attachHandlerGoBack()


        let radioSubmitData = () => {
            let choice = this.model.mydata.value;
            if (choice === "cv"){
                console.log(`Hello there, Clinical vitals!`,"radio Example","alert-primary")
                this.navigateToPageTag('sample');
            } else {
                console.log(`Good day to you, rest of choices!`,"radio Example","alert-primary")
            }
        }

        this.on("View",radioSubmitData,true);


        let radioSubmitSources = () => {
            let choice = this.model.myhealthsources.value;
            if (choice === "All sources"){
                console.log("All sources click!")
            } else {
                console.log("something else clicked!")
            }
        }
        this.on("Select",radioSubmitSources,true);
    }


    _attachHandlerGoBack(){
        this.on('go-back', (event) => {
            console.log ("Go back button pressed");
            this.navigateToPageTag('home');
        });
    }

   

}