const { WebcController } = WebCardinal.controllers;

const healthdatamodel = {

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
    }

}


export default class MyDataController extends WebcController {
    constructor(element, history) {
        super(element, history);
        this.model = JSON.parse(JSON.stringify(healthdatamodel));

        this.feedbackEmitter = null;

        this.on('openFeedback', (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            this.feedbackEmitter = e.detail;
        });


        let radioSubmit = () => {
            let choice = this.model.mydata.value;
            if (choice === "cv"){
                console.log(`Hello there, Clinical vitals!`,"radio Example","alert-primary")
                this.navigateToPageTag('sample');
                
            } else {
                console.log(`Good day to you, rest of choices!`,"radio Example","alert-primary")
            }
        }

        this.on("View",radioSubmit,true);

       
        
    }
   
        





  }
