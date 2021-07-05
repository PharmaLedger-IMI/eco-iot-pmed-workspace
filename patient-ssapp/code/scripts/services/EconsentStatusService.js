import DSUService from "./DSUService.js";

export default class EconsentStatusService extends DSUService {

    constructor(DSUStorage) {
        super(DSUStorage, '/econsent-status');
    }

    mount = (keySSI, callback) => this.mountEntity(keySSI, callback);

    getConsents = (callback) => this.getEntities(callback);

    saveConsent = (data, callback) => this.saveEntity(data, callback);
}
