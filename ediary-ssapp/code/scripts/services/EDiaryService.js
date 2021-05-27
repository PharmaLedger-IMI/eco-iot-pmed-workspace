import DSUService from "./DSUService.js";

export default class EDiaryService extends DSUService {

    constructor(DSUStorage) {
        super(DSUStorage, '/ediaries');
    }

    getEdiaries = (callback) => this.getEntities(callback);

    saveEdiary = (data, callback) => this.saveEntity(data, callback);
}