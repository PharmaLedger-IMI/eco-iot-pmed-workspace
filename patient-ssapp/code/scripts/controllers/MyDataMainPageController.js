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
        label: "Choose one or multiple options to see your data:",
        required: true,
        options: [{
            label: "All records",
            value: 'all',
            checked: true
        },
            {
                label: "ECG",
                value: "ecg"
            },
            {
                label: "Blood pressure",
                value: "blood"
            },
            {
                label: "Respiration data",
                value: "respiration"
            },
            {
                label: "Temperature",
                value: "temperature"
            },
            {
                label: "Height/Weight",
                value: "height"
            },
            {
                label: "EMR (sociodemo data, lab results...)",
                value: "emr"
            }
        ],
        value: ''
    }

}


export default class MyDataMainPageController extends  WebcController  {
    constructor(...props) {
        super(...props);
       
        this.model = ViewPersonalHealthDataModel ;

        if (this.getState()){
            let receivedModel = this.getState();
            console.log("Welcome: " + receivedModel.nameId);
            this.model.name = receivedModel.nameId
            this.model.id   = receivedModel.profileId
        }

        this._attachHandlerGoBack()


        let radioSubmitData = () => {
            let choice = this.model.mydata.value;
            if (choice === "ecg"){
                console.log('Hello ECG pressed!')
                this.navigateToPageTag('sample');
            } else {
                console.log(`Good day to you, rest of choices!`,"radio Example","alert-primary")
            }
        }

        this.on("Show Data",radioSubmitData,true);


    }


    _attachHandlerGoBack(){
        this.on('go-back', (event) => {
            console.log ("Go back button pressed");
            this.navigateToPageTag('home');
        });
    }

   

}