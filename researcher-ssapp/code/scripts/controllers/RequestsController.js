const {WebcController} = WebCardinal.controllers;


const requestInformationViewModel = {
    Title: {
        name: 'Title',
        placeholder: 'Title',
        required: true,
        readOnly: false,
        value: ''
    },
    Status: {
        label: "Status",
        placeholder: "Select the status",
        required: true,
        options: [
            {
                label: "Cancelled",
                value: "cancelled"
            },
            {
                label: "Executable",
                value: "executable"
            },
            {
                label: "Executed",
                value: "executed"
            },
            {
                label: "Offered",
                value: "offered"
            },
        ]
    },
    Terms: {
        label: "Terms",
        placeholder: "Select the terms",
        required: true,
        options: [
            {
                label: "ECG",
                value: "ecg"
            },
            {
                label: "Respiration",
                value: "respiration"
            },
            {
                label: "SpO2",
                value: "spo2"
            },
            {
                label: "Temperature",
                value: "temperature"
            },
        ]
    },
    requestsButton: {
        label: "New request",
        editState: false,
    },
    goBack: {
        label: "Back",
        editState: false
    },
    startDate: {
        label: "Start Date",
        input: {
            name: "date-to-start",
            required: false,
            value: ''
        }
    },
    endDate: {
        label: "End Date",
        input: {
            name: "date-to-end",
            required: false,
            value: ''
        }
    },
}


export default class RequestsController extends WebcController {
    constructor(...props) {

        super(...props);
        this._attachHandlerIssueNewRequest()
        this._attachHandlerGoBack()
        this.model = requestInformationViewModel;

    }

    _attachHandlerIssueNewRequest(){
        this.on('new:request', (event) => {
            console.log ("New information request button pressed");

            let RequestState = {
                title: this.model.Title.value,
                startDate: this.model.startDate.value,
                endDate: this.model.endDate.value,
                status: this.model.Status.value,
                terms: this.model.Terms.value
            }
            console.log(RequestState)

            this.navigateToPageTag('issue-new-request', RequestState);
        });
    }

    _attachHandlerGoBack(){
        this.on('request:go-back', (event) => {
            console.log ("Go back button pressed");
            this.navigateToPageTag('home');
        });
    }

}


