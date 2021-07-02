const {WebcController} = WebCardinal.controllers;
import CommunicationService from '../services/CommunicationService.js';
import ResponsesService from '../services/ResponsesService.js';

export default class HomeController extends WebcController {
    constructor(element, history) {
        super(element, history);


        this._attachHandlerManageDevices();
        this._attachHandlerTrialManagement();
        this._attachHandlerListOfPatients();

        this.ResponsesService = new ResponsesService(this.DSUStorage);
        this.CommunicationService = CommunicationService.getInstance(CommunicationService.identities.IOT.PROFESSIONAL_IDENTITY);
        this.CommunicationService.listenForMessages((err, data) => {
            if (err) {
                return console.error(err);
            }
            data = JSON.parse(data);
            debugger
            switch (data.message.operation) {
                case 'questionnaire-response': {
                    console.log('Received message', data.message)
                    this.ResponsesService.mount(data.message.ssi, (err, data) => {
                        if (err) {
                            return console.log(err);
                        }
                        this.ResponsesService.getResponses((err, data) => {
                            if (err) {
                                return console.log(err);
                            }
                            console.log('ProfessionalSSAPP_HomeController');
                            data.forEach(response => {
                                response.item.forEach(item => {
                                    console.log(item.answer[0], item.linkId, item.text)
                                })
                            })
                        })
                    });
                    break;
                }
            }
        });
        //this._demoOfDomainCommunications();
    }

    _demoOfDomainCommunications() {
        this.CommunicationService.listenForMessages('eco', (err, data) => {
            debugger
            this.CommunicationService.sendMessage(CommunicationService.identities.ECO.HCO_IDENTITY, {
                operation: "operation",
                ssi: "ssi"
            });
        });
    }

    _attachHandlerManageDevices() {
        this.on('home:manage-devices', (event) => {
            console.log ("Manage devices button pressed");
            this.navigateToPageTag('manage-devices');
        });
    }

    _attachHandlerTrialManagement(){
        this.on('home:trial-management', (event) => {
            console.log ("Trial Management button pressed");
            this.navigateToPageTag('trial-management');
        });
    }

    _attachHandlerListOfPatients(){
        this.on('home:list-of-patients', (event) => {
            console.log ("List of Patients button pressed");
            this.navigateToPageTag('list-of-patients');
        });
    }


}