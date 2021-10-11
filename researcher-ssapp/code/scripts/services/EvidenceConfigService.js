import DSUService from "./DSUService.js";

export default class EvidenceConfigService extends DSUService {

    constructor(DSUStorage) {
        super(DSUStorage, '/evidence-config');
    }

    mount = (keySSI, callback) => this.mountEntity(keySSI, callback);

    getEvidenceConfig = (callback) => this.getEntities(callback);

    saveEvidenceConfig = (data, callback) => this.saveEntity(data, callback);
}