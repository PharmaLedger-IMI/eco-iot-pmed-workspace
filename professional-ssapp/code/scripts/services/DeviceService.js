import AbstractAPI from "./AbstractAPI.js";

export default class DeviceService extends AbstractAPI {

    GET_DEVICE = `${this.ADAPTER_PATH}/resource/Device`;

    constructor(serverEndpoint) {
        super(serverEndpoint, 'iotAdapter');
    }

    getDeviceById(id, callback) {
        let path = this.GET_DEVICE + '/' + id;
        let headers = {
            
        }
        this.makeRequest('GET', path, headers, callback);
    }
    createDevice(data, callback) {
        let headers = {
            'Content-Type': 'application/json'
        }
        this.makeRequest('POST', this.GET_DEVICE, headers, data, callback);
    }
    searchDevice(callback) {
        let headers = {

        }
        this.makeRequest('GET', this.GET_DEVICE, headers, callback);
    }

    
} 