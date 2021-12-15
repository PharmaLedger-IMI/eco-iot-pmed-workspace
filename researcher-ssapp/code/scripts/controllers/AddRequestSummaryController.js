const commonServices = require("common-services");
const CommunicationService = commonServices.CommunicationService;

import InformationRequestService from "../services/InformationRequestService.js";
import {contractModelHL7} from "../models/HL7/ContractModel.js";
const {WebcController} = WebCardinal.controllers;


export default class AddRequestSummaryController extends WebcController {
    constructor(...props) {
        super(...props);

        this.model = this.getState();

        this.attachHandlerEditButton();
        this.attachHandlerAcceptButton();
    }

    attachHandlerEditButton() {
        this.onTagClick('request:edit', () => {
            console.log("Edit button pressed");
            this.navigateToPageTag('information-request', this.model.toObject());
        });
    }

    sendMessageToPatient(operation, ssi) {
        this.CommunicationService.sendMessage(CommunicationService.identities.IOT.PATIENT_IDENTITY, {
            operation: operation,
            ssi: ssi
        });
    }

    attachHandlerAcceptButton() {
        this.onTagClick('request:accept', () => {

            //prepare contract // need to change later // use correct models
            let initContract = JSON.parse(JSON.stringify(contractModelHL7));
            initContract.ContractTitle = this.model.title;
            initContract.ContractStatus = this.model.status;
            initContract.ContractTerm = this.model.terms;
            initContract.ContractIssued = new Date();
            initContract.ContractVersion = 0;
            initContract.ContractApplies = [this.model.startdate, this.model.enddate];

            this.InformationRequestService = new InformationRequestService();
            this.InformationRequestService.saveInformationRequest(initContract, (err, data) => {
                if (err) {
                    this.navigateToPageTag('confirmation-page', {
                        confirmationMessage: "An error has been occurred!",
                        redirectPage: "home"
                    });
                    return console.log(err);
                }
                this.CommunicationService = CommunicationService.getInstance(CommunicationService.identities.IOT.RESEARCHER_IDENTITY);
                this.sendMessageToPatient('information-request-response', data.uid);

                this.model.dsuStatus = " Debug information: DSU KeySSI: ".concat('', data.KeySSI.substr(data.KeySSI.length - 10));

                this.navigateToPageTag('confirmation-page', {
                    confirmationMessage: "Request has been issued!",
                    redirectPage: "home"
                });
            });
        });
    }
}