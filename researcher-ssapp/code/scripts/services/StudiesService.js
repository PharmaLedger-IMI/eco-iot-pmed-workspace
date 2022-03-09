const commonServices = require("common-services");
const DSUService = commonServices.DSUService;

export default class StudiesService extends DSUService {

    constructor() {
        super('/studies');
    }

    mount = (keySSI, callback) => this.mountEntity(keySSI, callback);

    getStudies = (callback) => this.getEntities(callback);

    getStudy = (uid, callback) => this.getEntity(uid, callback);

    saveStudy = (data, callback) => this.saveEntity(data, callback);

    updateStudy = (data, callback) => this.updateEntity(data, callback);

}