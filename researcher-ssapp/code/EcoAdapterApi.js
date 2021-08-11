const opendsu = require("opendsu");

export default class EcoAdaptorApi {

    ECO_ADAPTER_PATH = "ecoAdapter";
    SITES_LIST_PATH = `${this.ECO_ADAPTER_PATH}/sites`;

    constructor(serverEndpoint) {
        let SERVER_ENDPOINT = serverEndpoint || window.location.origin;
        if (SERVER_ENDPOINT[SERVER_ENDPOINT.length - 1] !== "/") {
            SERVER_ENDPOINT += "/";
        }
        this.serverEndpoint = SERVER_ENDPOINT;
        const endpointURL = new URL(SERVER_ENDPOINT);
        this.apiEndpoint = endpointURL.hostname;
        this.apiPort = endpointURL.port;
    }


    getSites(callback) {
        this.makeRequest('GET', this.SITES_LIST_PATH, {}, callback);
    }

    makeRequest(method, path, body, callback) {
        console.log('[EcoAdapterApiCall][Request]', method, path, JSON.stringify(body));
        const bodyData = JSON.stringify(body);
        const apiHeaders = {
            'Content-Type': 'application/json',
            'Content-Length': bodyData.length
        };
        const options = {
            hostname: this.apiEndpoint,
            port: this.apiPort,
            path,
            method,
            apiHeaders
        };
        if (body && JSON.stringify(body) !== JSON.stringify({})) {
            options.body = bodyData;
        }
        let protocolInit = opendsu.loadAPI('http');
        protocolInit.fetch(this.serverEndpoint + path + "#x-blockchain-domain-request", options)
            .then(response => {
                response.json()
                    .then((data) => {
                        console.log('[EcoAdapterApiCall][Response]', method, path, response.status, response.statusCode, data);
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