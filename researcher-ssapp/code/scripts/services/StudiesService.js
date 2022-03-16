const commonServices = require("common-services");
const DSUService = commonServices.DSUService;
import StudyNotesService from './StudyNotesService.js';

export default class StudiesService extends DSUService {

    constructor() {
        super('/studies');

        this.StudyNotesService = new StudyNotesService();
    }

    mount = (keySSI, callback) => this.mountEntity(keySSI, callback);

    getStudies = (callback) => this.getEntities(callback);

    getStudy = (uid, callback) => this.getEntity(uid, callback);

    saveStudy = (data, callback) => this.saveEntity(data, callback);

    updateStudy = (data, note, callback) => {
        if (typeof callback !== "function") {
            callback = note;
            note = undefined;
        }

        this.updateEntity(data, (err, studyEntity) => {
            if (err) {
                return callback(err);
            }
            if (note) {
                return this.StudyNotesService.saveNote(note, (err) => {
                    if (err) {
                        return callback(err);
                    }
                    callback(undefined, studyEntity)
                });
            }
            callback(undefined, studyEntity);
        });
    }

}