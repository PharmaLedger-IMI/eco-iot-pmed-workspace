const {WebcController} = WebCardinal.controllers;
import CommunicationService from '../services/CommunicationService.js';
import ResponsesService from '../services/ResponsesService.js';
import TrialParticipantRepository from '../repositories/TrialParticipantRepository.js';
import TrialRepository from '../repositories/TrialRepository.js';

export default class HomeController extends WebcController {
    constructor(element, history) {
        super(element, history);


        this._attachHandlerManageDevices();
        this._attachHandlerTrialManagement();
        this._attachHandlerListOfPatients();

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

    handleIotMessages(data) {
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