const commonServices = require('common-services');
const DSUService = commonServices.DSUService;

export default class EDiaryService extends DSUService {

    constructor() {
        super( '/ediaries');
    }

    getEdiaries = (callback) => this.getEntities(callback);

    saveEdiary = (data, callback) => this.saveEntity(data, callback);
}