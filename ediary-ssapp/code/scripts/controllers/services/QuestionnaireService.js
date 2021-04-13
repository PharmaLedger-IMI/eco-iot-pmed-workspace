export default class QuestionnaireService {

    QUESTIONNAIRE_PATH = "/questionnaires";

    constructor(DSUStorage) {
        this.DSUStorage = DSUStorage;
    }

    getServiceModel(callback) {
        this.DSUStorage.call('listDSUs', this.QUESTIONNAIRE_PATH, (err, dsuList) => {
            if (err) {
                callback(err, undefined);
                return;
            }
            let questionnaires = [];
            let getServiceDsu = (dsuItem) => {
                this.DSUStorage.getItem(this._getDsuStoragePath(dsuItem.identifier), (err, content) => {
                    if (err) {
                        questionnaires.slice(0);
                        callback(err, undefined);
                        return;
                    }
                    let textDecoder = new TextDecoder("utf-8");
                    let trial = JSON.parse(textDecoder.decode(content));
                    questionnaires.push(trial);

                    if (dsuList.length === 0) {
                        callback(undefined, {questionnaires: questionnaires});
                        return;
                    }
                    getServiceDsu(dsuList.shift());
                })
            };

            if (dsuList.length === 0) {
                callback(undefined, {questionnaires: []});
                return;
            }
            getServiceDsu(dsuList.shift());
        })

    }

    getQuestionnaire(uid, callback) {
        this.DSUStorage.getItem(this._getDsuStoragePath(uid), (err, content) => {
            if (err) {
                callback(err, undefined);
                return;
            }
            let textDecoder = new TextDecoder("utf-8");
            let trial = JSON.parse(textDecoder.decode(content));
            callback(undefined, trial);
        })
    }

    saveQuestionnaire(data, callback) {
        this.DSUStorage.call('createSSIAndMount', this.QUESTIONNAIRE_PATH, (err, keySSI) => {
            if (err) {
                callback(err, undefined);
                return;
            }
            data.KeySSI = keySSI;
            data.uid = keySSI;
            this.updateQuestionnaire(data, callback);
        })
    }

    mountQuestionnaire(keySSI, callback) {
        this.DSUStorage.call('mount', this.QUESTIONNAIRE_PATH, keySSI, (err) => {
            if (err) {
                return callback(err, undefined);
            }

            this.getQuestionnaire(keySSI, (err, org) => {
                if (err) {
                    return callback(err, undefined);
                }
                callback(undefined, org);
            })
        })
    }

    updateQuestionnaire(data, callback) {
        this.DSUStorage.setObject(this._getDsuStoragePath(data.uid), data, (err) => {
            if (err) {
                callback(err, undefined);
                return;
            }
            callback(undefined, data);
        })
    }

    unmountQuestionnaire(diaryUid, callback) {
        let unmountPath = this.QUESTIONNAIRE_PATH + '/' + diaryUid;
        this.DSUStorage.call('unmount', unmountPath, (err, result) => {
            if (err) {
                callback(err, undefined);
                return;
            }
            callback(undefined, result);
        });
    }

    _getDsuStoragePath(keySSI) {
        return this.QUESTIONNAIRE_PATH + '/' + keySSI + '/data.json';
    }
}