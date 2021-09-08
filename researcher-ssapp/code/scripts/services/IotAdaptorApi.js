import AbstractAPI from "./AbstractAPI.js";

export default class IotAdaptorApi extends AbstractAPI {

    GET_EVIDENCE = `${this.ADAPTER_PATH}/get-evidence`;

    constructor(serverEndpoint) {
        super(serverEndpoint, 'iotAdapter');
    }

    getEvidence(id, keySSI, callback) {
        let path = this.GET_EVIDENCE + '/' + id;
        let headers = {
            'X-KeySSI': keySSI
        }
        this.makeRequest('GET', path, headers, callback);
    }
} 