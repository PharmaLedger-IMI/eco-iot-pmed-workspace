const opendsu = require("opendsu");

export default class AbstractAPI {

    ADAPTER_PATH = "";

    constructor(serverEndpoint, adapterPath = this.ADAPTER_PATH) {
        this.ADAPTER_PATH = adapterPath;
        let SERVER_ENDPOINT = serverEndpoint || window.location.origin;
        if (SERVER_ENDPOINT[SERVER_ENDPOINT.length - 1] !== "/") {
            SERVER_ENDPOINT += "/";
        }
        this.serverEndpoint = SERVER_ENDPOINT;
        const endpointURL = new URL(SERVER_ENDPOINT);
        this.apiEndpoint = endpointURL.hostname;
        this.apiPort = endpointURL.port;
    }

    makeRequest(method, path, headers, body, callback) {
        if (typeof body === 'function') {
            callback = body;
            body = {};
        }
        // console.log(`[${this.ADAPTER_PATH}][Request]`, method, path, JSON.stringify(body));
        const bodyData = JSON.stringify(body);
        const apiHeaders = {
            'Content-Type': 'application/json',
            'Content-Length': bodyData.length,
            ...headers
        };
        const options = {
            hostname: this.apiEndpoint,
            headers: apiHeaders,
            port: this.apiPort,
            path,
            method
        };
        if (body && JSON.stringify(body) !== JSON.stringify({})) {
            options.body = bodyData;
        }
        let protocolInit = opendsu.loadAPI('http');
        protocolInit.fetch(this.serverEndpoint + path + "#x-blockchain-domain-request", options)
            .then(async (response) => {
                try {
                    const data = await response.json();
                    console.log(`[${this.ADAPTER_PATH}][Response]`, method, path, response.status, response.statusCode, data);
                    if (!response.ok || response.status != 200) {
                        return callback(response);
                    }
                    return callback(undefined, data);
                } catch (err) {
                    console.error('Response could not be transformed into JSON.');
                    return callback(err);
                }
            })
            .catch(error => {
                return callback(error);
            })
    }
} 