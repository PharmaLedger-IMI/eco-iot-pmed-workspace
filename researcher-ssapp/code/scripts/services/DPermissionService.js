import DSUService from "./DSUService.js";

export default class DPermissionService extends DSUService {

    constructor(DSUStorage) {
        super(DSUStorage, '/d-permissions');
    }

    mount = (keySSI, callback) => this.mountEntity(keySSI, callback);

    getDPermissions = (callback) => this.getEntities(callback);

    saveDPermission = (data, callback) => this.saveEntity(data, callback);
}