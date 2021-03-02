import TrialModel from '../../models/EDIaryModel.js';

export default class EDiaryService {

    EDIARY_PATH = "/ediaryies";

    constructor(DSUStorage) {
        this.DSUStorage = DSUStorage;
    }

    getServiceModel(callback){
        this.DSUStorage.call('listDSUs', this.EDIARY_PATH, (err, dsuList) => {
            if (err){
                callback(err, undefined);
                return;
            }
            let ediaryies = [];
            let getServiceDsu = (dsuItem) => {
                this.DSUStorage.getItem(this._getDsuStoragePath(dsuItem.identifier), (err, content) => {
                    if (err)
                    {
                        ediaryies.slice(0);
                        callback(err, undefined);
                        return;
                    }
                    let textDecoder = new TextDecoder("utf-8");
                    let trial = JSON.parse(textDecoder.decode(content));
                    ediaryies.push(trial);

                    if (dsuList.length === 0)
                    {
                        const model = new TrialModel()._getWrapperData();
                        model.trials = ediaryies;
                        callback(undefined, model);
                        return;
                    }
                    getServiceDsu(dsuList.shift());
                })
            };


            if (dsuList.length === 0){
                const model = new TrialModel()._getWrapperData();
                callback(undefined, model);
                return;
            }
            getServiceDsu(dsuList.shift());
        })

    }

    getEdiary(uid, callback){
        this.DSUStorage.getItem(this._getDsuStoragePath(uid), (err, content) => {
            if (err)
            {
                callback(err, undefined);
                return;
            }
            let textDecoder = new TextDecoder("utf-8");
            let trial = JSON.parse(textDecoder.decode(content));
            callback(undefined, trial);
        })
    }

    saveEdiary(data, callback){
        debugger
        this.DSUStorage.call('createSSIAndMount',this.EDIARY_PATH, (err, keySSI) => {
            if (err)
            {
                callback(err,undefined);
                return;
            }
            data.KeySSI = keySSI;
            data.uid = keySSI;
            this.updateEdiary(data, callback);
        })
    }
    mountEdiary(keySSI, callback){
        this.DSUStorage.call('mount',this.EDIARY_PATH, keySSI, (err) =>{
            if (err)
            {
                return callback(err, undefined);
            }

            this.getEdiary(keySSI, (err, org) =>{
                debugger
                if (err)
                {
                    return callback(err, undefined);
                }
                callback(undefined, org);
            })


        })
    }
    updateEdiary(data, callback){
        this.DSUStorage.setObject(this._getDsuStoragePath(data.uid), data, (err) => {
            if (err){
                callback(err, undefined);
                return;
            }
            callback(undefined, data);
        })
    }

    unmountEdiary(diaryUid, callback) {
        let unmountPath = this.EDIARY_PATH + '/' + diaryUid;
        this.DSUStorage.call('ediaryUnmount', unmountPath, (err, result) => {
            if (err) {
                callback(err, undefined);
                return;
            }
            callback(undefined, result);
        });
    }

    _getDsuStoragePath(keySSI){
        return this.EDIARY_PATH + '/' + keySSI + '/data.json';
    }
}