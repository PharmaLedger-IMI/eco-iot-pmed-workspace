const commonServices = require("common-services");
const CommunicationService = commonServices.CommunicationService;

import DPermissionService from "../services/DPermissionService.js";
const {WebcController} = WebCardinal.controllers;

export default class HomeController extends WebcController {
    constructor(...props) {
        super(...props);

        this.model = {};

        this._attachHandlerInformationRequest();
        this._attachHandlerViewDynamicPermission();
        this._attachHandlerEvidence();
        this._attachHandlerResearchStudy();

        this.DPermissionService = new DPermissionService();
        this.CommunicationService = CommunicationService.getInstance(CommunicationService.identities.IOT.RESEARCHER_IDENTITY);
        this.CommunicationService.listenForMessages((err, data) => {
            if (err) {
                return console.error(err);
            }
            data = JSON.parse(data);
            // console.log('Received Message', data.message);

            switch (data.message.operation) {
                case 'd-permission-list': {
                    this.DPermissionService.mount(data.message.d_permission_keyssi_list[data.message.d_permission_keyssi_list.length - 1], (err, data) => {
                        if (err) {
                            return console.log(err);
                        }
                    });
                    console.log("Received D Permission List");
                    break;
                }
            }
        });
    }

    _attachHandlerInformationRequest() {
        this.onTagClick('home:information-request', () => {
            console.log("Information request button pressed");
            this.navigateToPageTag('requests-main');
        });
    }

    _attachHandlerViewDynamicPermission() {
        this.onTagClick('home:view-dynamic-permission', () => {
            console.log("View dynamic permission button pressed");
            this.navigateToPageTag('view-dynamic-permission');
        });
    }

    _attachHandlerEvidence() {
        this.onTagClick('home:evidence', () => {
            console.log("Evidence button pressed");
            this.navigateToPageTag('evidence');
        });
    }

    _attachHandlerResearchStudy() {
        this.onTagClick('home:researchStudy', () => {
            this.navigateToPageTag('research-study');
        });
    }
}