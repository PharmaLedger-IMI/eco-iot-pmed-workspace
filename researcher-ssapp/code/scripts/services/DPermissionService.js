const commonServices = require("common-services");
const DSUService = commonServices.DSUService;

export default class DPermissionService extends DSUService {

    constructor() {
        super('/d-permissions');
    }

    mount = (keySSI, callback) => this.mountEntity(keySSI, callback);

    getDPermissions = (callback) => this.getEntities(callback);

    saveDPermission = (data, callback) => this.saveEntity(data, callback);
}