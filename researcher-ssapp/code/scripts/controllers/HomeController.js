const {WebcController} = WebCardinal.controllers;
const commonServices = require("common-services");
const DIDService = commonServices.DIDService;
const {getCommunicationServiceInstance} = commonServices.CommunicationServiceNew;

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
        this.CommunicationService.sendMessage(
            {
                message: "Echo message"
            }, {
                didType: "ssi:name",
                publicName: "iotAdaptor11"
            });
    }

    async initServices() {
        this.DPermissionService = new DPermissionService();

        const didData = await this.getDidData();
        this.CommunicationService = getCommunicationServiceInstance(didData);
        this.CommunicationService.listenForMessages((err, data) => {
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

    async getDidData() {
        this.model.did = await DIDService.getDidAsync(this);
        const splitDid = this.model.did.split(":");
        return {
            didType: `${splitDid[1]}:${splitDid[2]}`,
            publicName: splitDid[4]
        };
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