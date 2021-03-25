import ContainerController from '../../../cardinal/controllers/base-controllers/ContainerController.js';
import { participantsService } from '../services/participants.service.js';

export default class ListPatientsController extends ContainerController {
  constructor(element, history) {
    super(element, history);
    this.setModel({
      trials: {
        label: 'Select a trial',
        placeholder: 'Please select an option',
        required: false,
        options: [],
      },
      participants: null,
    });

    this.participantsService = participantsService;

    this.attachAll();

    this.init();
  }

  async init() {
    try {
      this.model.trials.options = (await this.participantsService.getTrials()).map((trial) => ({
        label: trial.name,
        value: trial.id,
      }));
    } catch (error) {
      console.log(error);
    }
  }

  attachAll() {
    this.model.addExpression(
      'trialsNotEmpty',
      () => {
        return (
          this.model.trials.options && Array.isArray(this.model.trials.options) && this.model.trials.options.length > 0
        );
      },
      'trials'
    );

    this.model.addExpression(
      'participantsNotEmpty',
      () => {
        return this.model.participants && Array.isArray(this.model.participants) && this.model.participants.length > 0;
      },
      'participants'
    );

    this.on('go-back', async (event) => {
      this.History.navigateToPageByTag('home', event.data);
    });

    this.on('trial-select', async (event) => {
      try {
        this.model.participants = (
          await this.participantsService.getTrialParticipants(parseInt(this.model.trials.value))
        ).map((participant) => ({
          ...participant,
        }));

        console.log(this.model.participants);
      } catch (error) {
        console.log(error);
      }
    });
  }
}
