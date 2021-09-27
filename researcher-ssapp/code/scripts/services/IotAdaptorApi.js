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
    createEvidence(data, keySSI, callback) {
        let path = `${this.ADAPTER_PATH}/create-evidence`;
        let headers = {
            'X-KeySSI': keySSI, 
            'Content-Type': 'application/json'
        }
        this.makeRequest('POST', path, headers, data, callback);
    }
    searchEvidence(keySSI, callback) {
        let path = `${this.ADAPTER_PATH}/search-evidence`;
        let headers = {
            'X-KeySSI': keySSI
        }
        this.makeRequest('GET', path, headers, callback);
    }
} 