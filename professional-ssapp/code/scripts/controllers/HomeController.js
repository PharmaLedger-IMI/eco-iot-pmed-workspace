const {WebcController} = WebCardinal.controllers;
import CommunicationService from '../services/CommunicationService.js';
import ResponsesService from '../services/ResponsesService.js';
import TrialParticipantRepository from '../repositories/TrialParticipantRepository.js';
import TrialRepository from '../repositories/TrialRepository.js';
import IotAdaptorApi from "../services/IotAdaptorApi.js";

export default class HomeController extends WebcController {
    constructor(element, history) {
        super(element, history);

        this.model = {};

        this.attachHandlerManageDevices();
        this.attachHandlerTrialManagement();
        this.attachHandlerListOfPatients();

        this.ResponsesService = new ResponsesService(this.DSUStorage);
        this.TrialParticipantRepository = TrialParticipantRepository.getInstance(this.DSUStorage);
        this.TrialRepository = TrialRepository.getInstance(this.DSUStorage);
        this.CommunicationService = CommunicationService.getInstance(CommunicationService.identities.IOT.PROFESSIONAL_IDENTITY);
        this.CommunicationService.listenForMessages((err, data) => {
            if (err) {
                return console.error(err);
            }
            data = JSON.parse(data);
            switch (data.domain) {
                case 'iot': {
                    this.handleIotMessages(data);
                    break;
                }
                case 'eco': {
                    this.handleEcoMessages(data);
                    break;
                }
            }
        });
    }

    attachHandlerManageDevices() {
        this.onTagClick('home:manage-devices', () => {
            this.navigateToPageTag('manage-devices');
        });
    }

    attachHandlerTrialManagement() {
        this.onTagClick('home:trial-management', () => {
            this.navigateToPageTag('trial-management');
        });
    }

    attachHandlerListOfPatients() {
        this.onTagClick('home:list-of-patients', () => {
            console.log("List of Patients button pressed");
            this.navigateToPageTag('list-of-patients');
        });
    }

    handleIotMessages(data) {
        switch (data.message.operation) {
            case 'questionnaire-response': {
                console.log('Received message', data.message);
                this.ResponsesService.mount(data.message.ssi, (err, data) => {
                    if (err) {
                        return console.log(err);
                    }
                    this.ResponsesService.getResponses((err, data) => {
                        if (err) {
                            return console.log(err);
                        }
                        console.log('ProfessionalSSAPPHomeController');
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
    }

    async handleEcoMessages(data) {
        switch (data.did) {
            case CommunicationService.identities.ECO.HCO_IDENTITY.did: {
                switch (data.message.operation) {
                    case 'add-trial-subject': {
                        let useCaseSpecifics = data.message.useCaseSpecifics;
                        let trial = useCaseSpecifics.trial;
                        let participant = useCaseSpecifics.participant;
                        let trials = await this.TrialRepository.filterAsync(`id == ${trial.id}`, 'ascending', 30);
                        if (trials.length === 0) {
                            await this.TrialRepository.createAsync(trial);
                        }
                        participant.trialId = trial.id;
                        await this.TrialParticipantRepository.createAsync(participant);
                        break;
                    }
                }
                break;
            }
        }
    }


    // async attachHandlerListOfPatients() {
    //     this.onTagClick('home:list-of-patients', () => {
    //         this.IotAdaptorApi = new IotAdaptorApi();
    //         let observations = [];
    //         this.IotAdaptorApi.searchResource("Observation", function (err, result) {
    //             result.forEach(value => {
    //                 let initData = {
    //                     name: value.code.text,
    //                     value: value.valueQuantity.value,
    //                     unit: value.valueQuantity.unit
    //                 };
    //                 observations.push(initData);
    //             });
    //         });
    //
    //         this.navigateToPageTag('patient-status', {allData: observations});
    //     });
    // }


}