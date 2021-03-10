export default class PatientService {

    PROFILE_PATH = "/profiles";

    constructor(DSUStorage) {
        this.DSUStorage = DSUStorage;
    }

    createProfile(profileObject, callback) {
        this.DSUStorage.call('createSSIAndMount', this.PROFILE_PATH, (err, keySSI) => {
            if (err) {
                callback(err, undefined);
                return;
            }
            profileObject.identifier = keySSI;
            let dataPath = this.PROFILE_PATH + '/' + keySSI + '/data.json';
            this.DSUStorage.setObject(dataPath, profileObject, (err) => {
                if (err) {
                    callback(err, undefined);
                    return;
                }
                callback(undefined, profileObject);
            })
        })
    }

    getProfile(identifier, callback) {
        let dataPath = this.PROFILE_PATH + '/' + identifier + '/data.json';
        this.DSUStorage.getItem(dataPath, (err, content) => {
            if (err) {
                return callback(err, undefined);
            }
            let textDecoder = new TextDecoder("utf-8");
            let profileData = JSON.parse(textDecoder.decode(content));
            callback(undefined, profileData);
        });
    }

    updateProfile(profileObject, callback) {
        let dataPath = this.PROFILE_PATH + '/' + profileObject.identifier + '/data.json';
        this.DSUStorage.setObject(dataPath, profileObject, (err) => {
            if (err) {
                callback(err, undefined);
                return;
            }
            callback(undefined, profileObject);
        })
    }

}