const commonServices = require("common-services");
const DSUService = commonServices.DSUService;

export default class NewEvidencetService extends DSUService {

    constructor() {
        super('/new-evidence');
    }

    mount = (keySSI, callback) => this.mountEntity(keySSI, callback);

    getNewEvidence = (callback) => this.getEntities(callback);

    saveNewEvidence = (data, callback) => this.saveEntity(data, callback);
}
