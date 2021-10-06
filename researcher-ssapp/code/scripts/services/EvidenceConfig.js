import DSUService from "./DSUService.js";

export default class EvidenceConfig extends DSUService {

    constructor(DSUStorage) {
        super(DSUStorage, '/evidence-config');
    }

    mount = (keySSI, callback) => this.mountEntity(keySSI, callback);

    getEvidenceConfig = (callback) => this.getEntity(callback);

    saveEvidenceConfig = (data, callback) => this.saveEntity(data, callback);
}