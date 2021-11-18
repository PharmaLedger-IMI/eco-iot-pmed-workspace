const {WebcController} = WebCardinal.controllers;
import {participantsService} from '../services/participants.service.js';
import TrialRepository from '../repositories/TrialRepository.js';
import TrialParticipantRepository from '../repositories/TrialParticipantRepository.js';

export default class ListPatientsController extends WebcController {
    constructor(element, history) {
        super(element, history);
        this.model = {
            // trials: {
            //       //   label: 'Select a trial',
            //       //   placeholder: 'Please select an option',
            //       //   required: false,
            //       //   options: [],
            //       },
            participants: [],
        };

        this.TrialRepository = TrialRepository.getInstance(this.DSUStorage);
        this.TrialParticipantRepository = TrialParticipantRepository.getInstance(this.DSUStorage);

        this.participantsService = participantsService;
        // this.init();
        this.attachAll();
    }

    // async init() {
    //   this.TrialRepository.findAll((err, trials) => {
    //     if (err) {
    //       return console.log(err);
    //     }
    //     this.model.trials.options = trials.map((trial) => ({
    //       label: trial.name,
    //       value: trial.id
    //     }));
    //   });
    // }

    attachAll() {
        this.model.addExpression(
            'participantsNotEmpty',
            () => {
                return this.model.participants && Array.isArray(this.model.participants) && this.model.participants.length > 0;
            },
            'participants'
        );

        this.onTagClick('go-back', () => {
            this.navigateToPageTag('home');
        });

        this.onTagClick('view', (model) => {
            this.navigateToPageTag('patient-status', model);
        });

        // this.on('trial-select', async (event) => {
        //   this.TrialParticipantRepository.filter(`trialId == ${this.model.trials.value}`, 'ascending', 30, (err, trialParticipants) => {
        //     if (err) {
        //       return console.log(err);
        //     }
        //     this.model.participants = trialParticipants.map(tp => {
        //       // TODO: bring other relevant data from ECO.
        //       return {
        //         ...tp,
        //         deviceStatus: 'OK',
        //         patientSigned: tp.signDate
        //       }
        //     })
        //   });
        // });
    }
}
