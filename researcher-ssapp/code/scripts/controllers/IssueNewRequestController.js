import InformationRequestService from "../services/InformationRequestService.js";
import {contractModelHL7} from "../models/HL7/ContractModel.js";
import {consentModelHL7} from "../models/HL7/ConsentModel.js";
import ResponsesService from "../services/ResponsesService.js";
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

        this.InformationRequestService = new InformationRequestService(this.DSUStorage);
        this.InformationRequestService.saveInformationRequest(contractModelHL7, (err, data) => {
            if (err) {
                return console.log(err);
            }
            this.model.dsuStatus = "DSU saved with keySSI: ".concat('', data.KeySSI);
        });

        this.InformationRequestService.getInformationRequests((err, data) => {
            if (err) {
                return console.log(err);
            }
            this.model.total_dsus = data.length;
        });

        this.CommunicationService = CommunicationService.getInstance(CommunicationService.identities.RESEARCHER_IDENTITY);
        this.ResponsesService = new ResponsesService(this.DSUStorage);
        this.ResponsesService.saveResponse(contractModelHL7, (err, data) => {
            if (err) {
                return console.log(err);
            }
            this.sendMessageToPatient('information-request-response', data.uid);
            this.ResponsesService.getResponses((err, data) => {
                if (err) {
                    return console.log(err);
                }
                console.log(data);
            })
        });


    }

    sendMessageToPatient(operation, ssi) {
        this.CommunicationService.sendMessage(CommunicationService.identities.PATIENT_IDENTITY, {
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


