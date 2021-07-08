import SharedStorage from "../services/SharedStorage.js";

class TrialRepository {

    constructor(DSUStorage) {
        this.StorageService = SharedStorage.getInstance(DSUStorage);
        this.tableName = 'trials';
    }

    create = (key, trial, callback) =>
        this.StorageService.insertRecord(this.tableName, key, trial, callback);

    createAsync = (key, trial) =>
        this.StorageService.insertRecordAsync(this.tableName, key, trial);

    findBy = (trialKey, callback) => this.StorageService.getRecord(this.tableName, trialKey, callback);

    findByAsync = async (trialKey) => this.StorageService.getRecordAsync(this.tableName, trialKey);

    findAll = (callback) => this.StorageService.getAllRecords(this.tableName, callback);

    findAllAsync = async () => this.StorageService.getAllRecordsAsync(this.tableName);

    filter = (query, sort, limit, callback) => this.StorageService.filter(this.tableName, query, sort, limit, callback);

    filterAsync = async (query, sort, limit) =>
        this.StorageService.filterAsync(this.tableName, query, sort, limit);


    update = (key, trial, callback) =>
        this.StorageService.updateRecord(this.tableName, key, trial, callback);

    updateAsync = (key, trial) =>
        this.StorageService.updateRecordAsync(this.tableName, key, trial);

}

export default {
    getInstance: (DSUStorage) => {
        if (typeof window.trialRepositoryInstance === "undefined") {
            window.trialRepositoryInstance = new TrialRepository(DSUStorage);
        }
        return window.trialRepositoryInstance;
    }
}
