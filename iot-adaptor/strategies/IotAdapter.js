const fileService = require("../utils/fileService");
    //   , mkFhir = require('fhir.js');
//     try {
//         const mkFhir = require('fhir.js');
//     } catch (error) {
//         console.log("Error Found!", error);
//         console.log(__dirname);
//     }
$$.flow.describe('IotAdaptor', {

    init: function (domainConfig) {
        // this.fhirClient = mkFhir({
        //     baseUrl: 'http://hapi.fhir.org/baseR4'
        // });
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
