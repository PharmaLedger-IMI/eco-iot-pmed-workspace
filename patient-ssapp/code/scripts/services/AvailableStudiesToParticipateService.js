import DSUService from "./DSUService.js";

export default class AvailableStudiesToParticipateService extends DSUService {

    constructor(DSUStorage) {
        super(DSUStorage, '/studies-to-participate');
    }

    mount = (keySSI, callback) => this.mountEntity(keySSI, callback);

    getStudies = (callback) => this.getEntities(callback);

    saveStudy = (data, callback) => this.saveEntity(data, callback);

}
