import DSUService from "./DSUService.js";

export default class ProfileManagementService extends DSUService {

    constructor(DSUStorage) {
        super(DSUStorage, '/profiles');
    }

    mount = (keySSI, callback) => this.mountEntity(keySSI, callback);

    getProfiles = (callback) => this.getEntities(callback);

    saveProfile = (data, callback) => this.saveEntity(data, callback);

    updateProfile = (data, callback) => this.updateEntity(data, callback);

}
