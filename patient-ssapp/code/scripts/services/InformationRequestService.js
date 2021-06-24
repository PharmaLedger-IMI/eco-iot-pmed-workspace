import DSUService from "./DSUService.js";

export default class InformationRequestService extends DSUService {

    constructor(DSUStorage) {
        super(DSUStorage, '/information-requests');
    }

    mount = (keySSI, callback) => this.mountEntity(keySSI, callback);

    getInformationRequests = (callback) => this.getEntities(callback);

    saveInformationRequest = (data, callback) => this.saveEntity(data, callback);
}
