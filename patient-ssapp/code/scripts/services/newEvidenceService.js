import DSUService from "./DSUService.js";

export default class NewEvidencetService extends DSUService {

    constructor(DSUStorage) {
        super(DSUStorage, '/new-evidence');
    }

    mount = (keySSI, callback) => this.mountEntity(keySSI, callback);

    getNewEvidence = (callback) => this.getEntities(callback);

    saveNewEvidence = (data, callback) => this.saveEntity(data, callback);
}
