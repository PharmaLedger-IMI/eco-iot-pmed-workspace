const commonServices = require("common-services");
const DSUService = commonServices.DSUService;

export default class EvidenceService extends DSUService {

    constructor() {
        super('/evidence');
    }

    mount = (keySSI, callback) => this.mountEntity(keySSI, callback);

    getEvidences = (callback) => this.getEntities(callback);

    getEvidence = (callback) => this.getEntity(keySSI, callback);

    saveEvidence = (data, callback) => this.saveEntity(data, callback);

    updateEvidence = (data, callback) => this.updateEntity(data, callback);

}