const fileService = require("../utils/fileService");

$$.flow.describe('IotAdaptor', {

    init: function (domainConfig) {
        const endpointURL = new URL(domainConfig.option.endpoint);
        this.commandData = {};
        this.commandData.apiEndpoint = endpointURL.hostname;
        this.commandData.apiPort = endpointURL.port;
        this.commandData.protocol = endpointURL.protocol.replace(':', "");
    },

    listPatients: function (callback) {
        fileService.readClusters(callback);
    },

    addPatient: function (jsonData, callback) {
        const body = {
            patientName: jsonData.patientName
        };
        console.log("addPatient", body);
        return callback(undefined, body);
    }
});
