const commonServices = require("common-services");
const DSUService = commonServices.DSUService;

export default class EvidenceConfigService extends DSUService {

    constructor() {
        super('/evidence-config');
    }

    mount = (keySSI, callback) => this.mountEntity(keySSI, callback);

    getEvidenceConfig = (callback) => this.getEntities(callback);

    saveEvidenceConfig = (data, callback) => this.saveEntity(data, callback);
}