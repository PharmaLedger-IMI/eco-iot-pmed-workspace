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
        path = "http://localhost:8080/iotAdapter/get-evidence/17110073-c4a5-465f-93da-d84009359133";
        // path = "https://datausa.io/api/data?drilldowns=Nation&measures=Population";
        body = {};
        console.log('[EcoAdapterApiCall][Request]', method, path, JSON.stringify(body));
        const bodyData = JSON.stringify(body);
        const apiHeaders = {
            'Content-Type': 'application/json',
            'X-KeySSI': "27XvCBPKSWpUwscQUxwsVDTxRbtRUj2BgpWpCpmb1K68vgLwMCAcwnDZytNtFmJ5cKvSjfLmBBZas8oGJpHFudxF1gF7thkV7uWv4AywGuZKqUvunP2erz5EkJn9M4qPAkxxinSJDSLfawZuVba7NTR"
        };
        const options = {
            hostname: "http://localhost",
            port: 8080,
            path,
            method,
            apiHeaders
        };
        if (body && JSON.stringify(body) !== JSON.stringify({})) {
            options.body = bodyData;
        }
        let protocolInit = opendsu.loadAPI('http');
        protocolInit.fetch(path, options)
            .then(response => {
                response.json()
                    .then((data) => {
                        console.log(data);
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