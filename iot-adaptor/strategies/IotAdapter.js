const fhirService = require("../utils/fhirService");
$$.flow.describe('IotAdaptor', {

    init: function (domainConfig) {
        const endpointURL = new URL(domainConfig.option.endpoint);
        this.commandData = {};
        this.commandData.apiEndpoint = endpointURL.hostname;
        this.commandData.apiPort = endpointURL.port;
        this.commandData.protocol = endpointURL.protocol.replace(':', "");
    },

    searchPatient: function (callback) {
        fhirService.patient.search(callback);
        // dsuService.patient.search(callback);
    },

    cratePatient: function (jsonData, callback) {
        fhirService.patient.create(jsonData, callback);
        // dsuService.patient.create(jsonData, callback);
    }
});
