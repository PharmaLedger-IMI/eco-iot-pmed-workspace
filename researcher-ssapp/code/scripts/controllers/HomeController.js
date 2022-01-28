const {WebcController} = WebCardinal.controllers;
const commonServices = require("common-services");
const DidService =commonServices.DidService;
const {getCommunicationServiceInstance} = commonServices.CommunicationService;
const MessageHandlerService = commonServices.MessageHandlerService;

import DPermissionService from "../services/DPermissionService.js";

export default class HomeController extends WebcController {
    constructor(...props) {
        super(...props);

        this.model = this.getInitialModel();

        this.initHandlers();
        this.initServices();
    }

    initHandlers() {
        this.attachHandlerInformationRequest();
        this.attachHandlerViewDynamicPermission();
        this.attachHandlerEvidence();
        this.attachHandlerResearchStudy();
    }

    // TODO: Remove this when tests are completed.
    sendEchoMessageToIotAdaptor() {
        this.CommunicationService = getCommunicationServiceInstance();
        this.CommunicationService.sendMessage("did:ssi:name:iot:iotAdaptor", {
            message: "Echo message"
        });
    }

    async initServices() {
        this.DPermissionService = new DPermissionService();

        this.model.did = await DidService.getDidServiceInstance().getDID();
        MessageHandlerService.init(async (err, data) =>{
            if (err) {
                return console.error(err);
            }

            data = JSON.parse(data);
            console.log('Received Message', data);

            // TODO: Review this behaviour
            switch (data.operation) {
                case 'd-permission-list': {
                    this.DPermissionService.mount(data.d_permission_keyssi_list[data.d_permission_keyssi_list.length - 1], (err, data) => {
                        if (err) {
                            return console.log(err);
                        }
                    });
                    console.log("Received D Permission List");
                    break;
                }
            }
        });

        this.sendEchoMessageToIotAdaptor();
    }

    attachHandlerInformationRequest() {
        this.onTagClick('home:information-request', () => {
            console.log("Information request button pressed");
            this.navigateToPageTag('requests-main');
        });
    }

    attachHandlerViewDynamicPermission() {
        this.onTagClick('home:view-dynamic-permission', () => {
            console.log("View dynamic permission button pressed");
            this.navigateToPageTag('view-dynamic-permission');
        });
    }

    attachHandlerEvidence() {
        this.onTagClick('home:evidence', () => {
            console.log("Evidence button pressed");
            this.navigateToPageTag('evidence');
        });
    }

    attachHandlerResearchStudy() {
        this.onTagClick('home:researchStudy', () => {
            this.navigateToPageTag('research-study');
        });
    }

    getInitialModel() {
        return {
            did: ""
        };
    }
}