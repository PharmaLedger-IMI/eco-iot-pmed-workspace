import DSUService from "./DSUService.js";

export default class QuestionnaireService extends DSUService {

    constructor(DSUStorage) {
        super(DSUStorage, '/questionnaires');
    }

    getQuestionnaires = (callback) => this.getEntities(callback);

    saveQuestionnaire = (data, callback) => this.saveEntity(data, callback);
}