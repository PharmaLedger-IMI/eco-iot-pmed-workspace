const commonServices = require('common-services');
const DSUService = commonServices.DSUService;

export default class QuestionnaireService extends DSUService {

    constructor() {
        super( '/questionnaires');
    }

    getQuestionnaires = (callback) => this.getEntities(callback);

    saveQuestionnaire = (data, callback) => this.saveEntity(data, callback);
}