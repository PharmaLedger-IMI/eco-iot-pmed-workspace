import ContainerController from "../../../cardinal/controllers/base-controllers/ContainerController.js";


const requests_data_model = {

    myrequests: {

        label: "Select the issued information request:",
        required: true,
        options: [{
            label: "All requests",
            value: 'All requests'
        },
            {
                label: "Request Information 1",
                value: "info_request1",
                checked: true
            },
            {
                label: "Request Information 2",
                value: "info_request2"
            },
            {
                label: "Request Information 3",
                value: "info_request3"
            },
            {
                label: "Request Information 4",
                value: "info_request4"
            },
            {
                label: "Request Information 5",
                value: "info_request5"
            }

        ],
        value: ''
    }
}


export default class ViewRequestsController extends ContainerController {
    constructor(element, history) {
        super(element, history);

        this.model = this.setModel(JSON.parse(JSON.stringify(requests_data_model)));

        this.feedbackEmitter = null;

        this.on('openFeedback', (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            this.feedbackEmitter = e.detail;
        });


        let radioSubmit = () => {
            let choice = this.model.myrequests.value;
            if (choice === "info_request1"){
                console.log("Clicked Request 1!")
                //this.History.navigateToPageByTag('my-health-data-sample');
            } else {
                console.log("Some request clicked!")
            }
        }

        this.on("View",radioSubmit,true);
    }




}