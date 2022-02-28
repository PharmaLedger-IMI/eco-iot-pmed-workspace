const commonServices = require("common-services");
const DSUService = commonServices.DSUService;

export default class StudyNotesService extends DSUService {

    constructor() {
        super('/notes');
    }

    mount = (keySSI, callback) => this.mountEntity(keySSI, callback);

    getNotes = (callback) => this.getEntities(callback);

    saveNote = (data, callback) => this.saveEntity(data, callback);

}