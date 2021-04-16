const fhirService = require("../utils/fhirService");
const etlService = require("../utils/etlService");
$$.flow.describe('IotAdaptor', {

    init: function (domainConfig) {
        const endpointURL = new URL(domainConfig.option.endpoint);
        this.commandData = {};
        this.commandData.apiEndpoint = endpointURL.hostname;
        this.commandData.apiPort = endpointURL.port;
        this.commandData.protocol = endpointURL.protocol.replace(':', "");
    },
    processXml: function (xmlString, callback) {
        etlService.processXml(xmlString, callback);
    },
    searchPatient: function (params, callback) {
        fhirService.resource.search('Patient', params, callback);
    },
    getPatientById: function (id, callback) {
        fhirService.resource.getById('Patient', id, callback);
    },
    cratePatient: function (jsonData, callback) {
        fhirService.resource.create('Patient', jsonData, callback);
    },
    updatePatient: function ( id, jsonData, callback) {
        fhirService.resource.update('Patient', id, jsonData,  callback);
    },
    deletePatient: function ( id, callback) {
        console.log("Hello Delete!");
    },
    searchObservation: function (params, callback) {
        fhirService.resource.search('Observation', params, callback);
    },
    crateObservation: function (jsonData, callback) {
        fhirService.resource.create('Observation', jsonData, callback);
    },
    updateObservation: function (id, jsonData, callback) {
        fhirService.resource.update('Observation', id, jsonData, callback);
    },
    getObservationById: function (id, callback) {
        fhirService.resource.getById('Observation', id, callback);
    },
    deleteObservation: function(id, callback) {
        fhirService.resource.delete('Observation', id, callback);

    },
    searchResource: function (resourceType, params, callback) {
        fhirService.resource.search(resourceType, params, callback);
    },
    createResource: function (resourceType, jsonData, callback) {
        fhirService.resource.create(resourceType, jsonData, callback);
    },
    updateResource: function (resourceType, id, jsonData, callback) {
        fhirService.resource.update(resourceType, id, jsonData, callback);
    },
    getResourceById: function (resourceType, id, callback) {
        fhirService.resource.getById(resourceType, id, callback);
    },
    deleteResource: function(resourceType, id, callback) {
        fhirService.resource.delete(resourceType, id, callback);

    }
});
