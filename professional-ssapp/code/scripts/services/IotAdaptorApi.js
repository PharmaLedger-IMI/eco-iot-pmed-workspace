import AbstractAPI from "./AbstractAPI.js";

export default class IotAdaptorApi extends AbstractAPI {

    GET_EVIDENCE = `${this.ADAPTER_PATH}/get-device`;

    constructor(serverEndpoint) {
        super(serverEndpoint, 'iotAdapter');
    }

    getDevice(id, keySSI, callback) {
        let path = this.GET_EVIDENCE + '/' + id;
        let headers = {
            'X-KeySSI': keySSI
        }
        this.makeRequest('GET', path, headers, callback);
    }
    createDevice(data, keySSI, callback) {
        let path = `${this.ADAPTER_PATH}/create-device`;
        let headers = {
            'X-KeySSI': keySSI, 
            'Content-Type': 'application/json'
        }
        this.makeRequest('POST', path, headers, data, callback);
    }
    searchDevice(keySSI, callback) {
        let path = `${this.ADAPTER_PATH}/search-device`;
        let headers = {
            'X-KeySSI': keySSI
        }
        this.makeRequest('GET', path, headers, callback);
    }
    searchResource(resourceType, callback) {
        let path = `${this.ADAPTER_PATH}/resource/${resourceType}`;
        let headers = {}
        this.makeRequest('GET', path, headers, callback);
    }
    observationByPatientId(patientId, callback) {
        let path = `${this.ADAPTER_PATH}/Observation/Patient/${patientId}`;
        let headers = {}
        this.makeRequest('GET', path, headers, callback);
    }

    
} 