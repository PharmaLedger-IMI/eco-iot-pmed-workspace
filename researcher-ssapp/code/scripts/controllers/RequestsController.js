const { WebcController } = WebCardinal.controllers;


const requestInformationModel = {
    Title: {
        name: 'Title',
        placeholder: 'Title',
        required: true,
        readOnly: false,
        value: ''
    },
    Period: {
        name: 'Period',
        placeholder: 'Period',
        required: true,
        readOnly: false,
        value: ''
    },
    Status: {
        name: 'Status',
        placeholder: 'Status',
        required: true,
        readOnly: false,
        value: ''
    },
    Terms: {
        name: 'Terms',
        placeholder: 'Terms',
        required: true,
        readOnly: false,
        value:''
    },
    requestsButton: {
        label: "New request",
        editState: false,
    },
    goBack: {
        label: "Go Back",
        editState: false
    }
}


export default class RequestsController extends WebcController {
    constructor(element, history) {

        super(element, history);
        this._attachHandlerIssueNewRequest()
        this._attachHandlerGoBack()
        this.setModel(requestInformationModel);

    }

    _attachHandlerIssueNewRequest(){
        this.on('new:request', (event) => {
            console.log ("New information request button pressed");
            this.navigateToPageTag('issue-new-request');
        });
    }

    _attachHandlerGoBack(){
        this.on('request:go-back', (event) => {
            console.log ("Go back button pressed");
            this.navigateToPageTag('home');
        });
    }

}


