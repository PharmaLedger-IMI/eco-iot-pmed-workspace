import ContainerController from '../../../cardinal/controllers/base-controllers/ContainerController.js';


const requestInformationModel = {
    name: {
        name: 'name',
        label: "Name",
        placeholder: 'Enter your full name',
        required: true,
        readOnly: false,
        value: ''
    },
    email: {
        name: 'email',
        label: "Email",
        placeholder: 'Enter your email',
        required: true,
        readOnly: false,
        value: ''
    },
    password: {
        name: 'password',
        label: "Password",
        placeholder: 'Enter your password',
        required: true,
        readOnly: false,
        value: ''
    },
    requestsButton: {
        label: "New request",
        editState: false
    }
}


export default class RequestsController extends ContainerController {
    constructor(element, history) {

        super(element, history);
        this._attachHandlerIssueNewRequest()
        this._attachHandlerGoBack()
        this.setModel(requestInformationModel);

    }

    _attachHandlerIssueNewRequest(){
        this.on('new:request', (event) => {
            console.log ("New information request button pressed");
            this.History.navigateToPageByTag('issue-new-request');
        });
    }

    _attachHandlerGoBack(){
        this.on('request:go-back', (event) => {
            console.log ("Go back button pressed");
            this.History.navigateToPageByTag('home');
        });
    }

}


