const opendsu = require("opendsu");

export default class IotAdapterApi {

    ADAPTER_PATH = "iotAdapter";

    constructor(serverEndpoint) {
        let SERVER_ENDPOINT = serverEndpoint || window.location.origin;
        if (SERVER_ENDPOINT[SERVER_ENDPOINT.length - 1] !== "/") {
            SERVER_ENDPOINT += "/";
        }
        this.serverEndpoint = SERVER_ENDPOINT;
        const endpointURL = new URL(SERVER_ENDPOINT);
        this.apiEndpoint = endpointURL.hostname;
        this.apiPort = endpointURL.port;
        this.options = {
            hostname: this.apiEndpoint,
            port: this.apiPort,
            headers: {
                'Content-Type': 'application/json',
                'X-KeySSI': "27XvCBPKSWpUwscQUxwsVDTxRbtRUj2BgpWpCpmb1K68vgLwMCAcwnDZytNtFmJ5cKvSjfLmBBZas8oGJpHFudxF1gF7thkV7uWv4AywGuZKqUvunP2erz5EkJn9M4qPAkxxinSJDSLfawZuVba7NTR"
            }
        }
    }

    getEvidence(id, callback){
        const path = `/${this.ADAPTER_PATH}/get-evidence/${id}`;
        this.makeRequest("GET", path, {}, callback);
    }

    makeRequest(method, path, body, callback) {

        // console.log('[IotAdapterApiCall][Request]', method, path, JSON.stringify(body));
        const bodyData = JSON.stringify(body);
        this.options["path"] = path;
        this.options["method"] = method;
        if (body && JSON.stringify(body) !== JSON.stringify({})) {
            this.options["body"] = bodyData;
        }
        let protocolInit = opendsu.loadAPI('http');
        protocolInit.fetch(path, this.options)
            .then(response => {
                // debugger
                console.log (response);
                response.json()
                    .then((data) => {
                        // debugger
                        console.log(data);
                        // console.log('[EcoAdapterApiCall][Response]', method, path, response.status, response.statusCode, data);
                        if (!response.ok || response.status != 201) {
                            return callback(response);
                        }
                        callback(undefined, data);
                    })
                    .catch(error => {
                        return callback(error);
                    });
            })
            .catch(error => {
                return callback(error);
            })
    }
}