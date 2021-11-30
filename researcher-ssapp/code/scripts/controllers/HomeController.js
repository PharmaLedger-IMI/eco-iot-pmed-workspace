import CommunicationService from "../services/CommunicationService.js";
import DPermissionService from "../services/DPermissionService.js";
const {WebcController} = WebCardinal.controllers;


export default class HomeController extends WebcController {
    constructor(...props) {
        super(...props);

        this.model = {};


        this._attachHandlerInformationRequest()
        this._attachHandlerViewDynamicPermission()
        this._attachHandlerEvidence()

        this.DPermissionService = new DPermissionService(this.DSUStorage);
        this.CommunicationService = CommunicationService.getInstance(CommunicationService.identities.IOT.RESEARCHER_IDENTITY);
        this.CommunicationService.listenForMessages((err, data) => {
            if (err) {
                return console.error(err);
            }
            data = JSON.parse(data);
            // console.log('Received Message', data.message);

            switch (data.message.operation) {
                case 'd-permission-list': {
                    data.message.d_permission_keyssi_list.forEach(ssi => {
                        // console.log(ssi);
                    })
                    this.DPermissionService.mount(data.message.d_permission_keyssi_list[data.message.d_permission_keyssi_list.length-1], (err, data) => {
                        if (err) {
                            return console.log(err);
                        }
                        // console.log(JSON.stringify(data, null, 4));
                    });
                              console.log("Received D Permission List");
                    break;
                }
            }
        });
    }

    _attachHandlerInformationRequest(){
        this.onTagClick('home:information-request', (event) => {
            console.log ("Information request button pressed");
            this.navigateToPageTag('requests-main');
        });
    }

    _attachHandlerViewDynamicPermission(){
        this.onTagClick('home:view-dynamic-permission', (event) => {
            console.log ("View dynamic permission button pressed");
            this.navigateToPageTag('view-dynamic-permission');
        });
    }

    _attachHandlerEvidence(){
        this.onTagClick('home:evidence', (event) => {
            console.log ("Evidence button pressed");
            this.navigateToPageTag('evidence');
        });
    }
    _attachHandlerEvidence(){
        this.onTagClick('home:researchStudy', (event) => {
            this.navigateToPageTag('research-study');
        });
    }
}