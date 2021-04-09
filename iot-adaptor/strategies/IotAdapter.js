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
    getPatientById: function (id, callback) {
        console.log(id);
        console.log("Test ID");
        fhirService.patient.getById(id, callback);
        // dsuService.patient.search(callback);
    },
    cratePatient: function (jsonData, callback) {
        fhirService.patient.create(jsonData, callback);
        // dsuService.patient.create(jsonData, callback);
    },
    updatePatient: function ( id, jsonData, callback) {
        console.log("Hello Update!");
        fhirService.patient.update(id, jsonData,  callback);
        // dsuService.patient.create(jsonData, callback);
    },
    deletePatient: function ( jsonData, callback) {
        console.log("Hello Delete!");
        // fhirService.patient.update(jsonData,  callback);
        // dsuService.patient.create(jsonData, callback);
    },
    searchObservation: function (callback) {
        fhirService.observation.search(callback);
        // dsuService.observation.search(callback);
    },

    crateObservation: function (jsonData, callback) {
        fhirService.observation.create(jsonData, callback);
        // dsuService.patient.create(jsonData, callback);
    },
    updateObservation: function (id, jsonData, callback) {
        fhirService.observation.update(id, jsonData, callback);
        // dsuService.patient.create(jsonData, callback);
    },
    getObservationById: function (id, callback) {
        console.log(id);
        fhirService.observation.getById(id, callback);
        // dsuService.patient.create(jsonData, callback);
    },
    deleteObservation: function(id, callback) {
        fhirService.observation.deleteById(id, callback);
        
    }
});
