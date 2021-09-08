import InformationRequestService from "../services/InformationRequestService.js";
import {contractModelHL7} from "../models/HL7/ContractModel.js";
import {consentModelHL7} from "../models/HL7/ConsentModel.js";
import CommunicationService from "../services/CommunicationService.js";
const {WebcController} = WebCardinal.controllers;


const NewRequestViewModel = {
    title: "value",
    startDate: "value",
    endDate: "value",
    status: "value",
    terms: "value",

    formatedDateStart: {
        label: "Start Date is:",
        name: "date-to-format",
        required: false,
        value: '2322352464212',
        dataFormat:"DD MM YYYY"
    },

    formatedDateEnd: {
        label: "End Date is:",
        name: "date-to-format",
        required: false,
        value: '2322352464212',
        dataFormat:"DD MM YYYY"
    },
    dsuStatus: "Not Saved",
    total_dsus: "unknown"
}


export default class IssueNewRequestController extends WebcController {
    constructor(...props) {

        super(...props);
        this.model = NewRequestViewModel;
        this._attachHandlerGoBack();
        let requestState = this.getState();

        this.model.title = requestState.title
        this.model.startDate = requestState.startDate
        this.model.endDate = requestState.endDate
        this.model.status = requestState.status
        this.model.terms = requestState.terms

        this.model.formatedDateStart.value = this.model.startDate;
        this.model.formatedDateEnd.value = this.model.endDate;

        //prepare contract based on input
        let initContract = JSON.parse(JSON.stringify(contractModelHL7));
        initContract.ContractTitle = this.model.title;
        initContract.ContractStatus = this.model.status;
        initContract.ContractTerm = this.model.terms;
        initContract.ContractIssued = new Date();
        initContract.ContractVersion = 0;
        initContract.ContractApplies = [this.model.startDate, this.model.endDate];

        this.InformationRequestService = new InformationRequestService(this.DSUStorage);
        this.InformationRequestService.saveInformationRequest(initContract, (err, data) => {
            if (err) {
                return console.log(err);
            }
            this.model.dsuStatus = "DSU contract saved and sent to patient with keySSI: ".concat('', data.KeySSI.substr(data.KeySSI.length - 10));

            this.CommunicationService = CommunicationService.getInstance(CommunicationService.identities.IOT.RESEARCHER_IDENTITY);
            this.sendMessageToPatient('information-request-response', data.uid);
        });


        this.InformationRequestService.getInformationRequests((err, data) => {
            if (err) {
                return console.log(err);
            }
            this.model.total_dsus = data.length+1;
        });
    }

    sendMessageToPatient(operation, ssi) {
        this.CommunicationService.sendMessage(CommunicationService.identities.IOT.PATIENT_IDENTITY, {
            operation: operation,
            ssi: ssi
        });
    }

    _attachHandlerGoBack(){
        this.on('issue-new-request-go-back', (event) => {
            console.log ("Go back button pressed");
            this.navigateToPageTag('home');
        });
    }

}


