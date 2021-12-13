const commonServices = require('common-services');
const DSUService = commonServices.DSUService;

export default class QuestionnaireService extends DSUService {

    constructor(DSUStorage) {
        super(DSUStorage, '/questionnaires');
    }

    getQuestionnaires = (callback) => this.getEntities(callback);

    saveQuestionnaire = (data, callback) => this.saveEntity(data, callback);
}