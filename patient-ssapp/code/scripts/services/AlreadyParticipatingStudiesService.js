import DSUService from "./DSUService.js";

export default class AlreadyParticipatingStudiesService extends DSUService {

    constructor(DSUStorage) {
        super(DSUStorage, '/my-studies');
    }

    mount = (keySSI, callback) => this.mountEntity(keySSI, callback);

    getStudies = (callback) => this.getEntities(callback);

    saveStudy = (data, callback) => this.saveEntity(data, callback);
    
}
