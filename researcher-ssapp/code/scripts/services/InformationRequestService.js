const commonServices = require("common-services");
const DSUService = commonServices.DSUService;

export default class InformationRequestService extends DSUService {

    constructor() {
        super('/information-requests');
    }

    mount = (keySSI, callback) => this.mountEntity(keySSI, callback);

    getInformationRequests = (callback) => this.getEntities(callback);

    saveInformationRequest = (data, callback) => this.saveEntity(data, callback);
}
