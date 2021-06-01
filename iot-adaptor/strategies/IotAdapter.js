const etlService = require("../utils/etlService");
const dsuService = require("../utils/dsuService");
const FhirStorage = require("../storages/fhir.js")
const DbStorage = require("../storages/db.js")
const DsuStorage = require("../storages/dsu.js")

$$.flow.describe('IotAdaptor', {

    init: function (domainConfig) {
        const endpointURL = new URL(domainConfig.option.endpoint);
        this.commandData = {};
        this.commandData.apiEndpoint = endpointURL.hostname;
        this.commandData.apiPort = endpointURL.port;
        this.commandData.protocol = endpointURL.protocol.replace(':', "");
        // this.fhir = new FhirStorage({
        //   baseUrl: 'http://localhost:8090/fhir'
        // });

        this.db = new DbStorage({
          baseURL: 'http://localhost:1337/v1/storage',
          headers: {
            'X-Storage-Application-Id': '4d98fbf2-f85f-4153-9e1c-91ee5776b0d7',
            'X-Storage-REST-API-Key': '4c8dc298-de81-48c2-8fdc-3897e1ac2a17',
            'Content-Type': 'application/json'
          }
        });
        this.dsu = new DsuStorage({
          keySSI: '27XvCBPKSWpUwscQUxwsVDTxRbu6NJNsNQdej53NWdT4n2vpZQ9C9Togs4JtULoJL5HFAWG6oFBjNukMN1ej7Ly5HXCWorTHinNhYtpUpEtmvKrSh6f1HVcm6MLBNJy1EXLZmVt4HgbgW2Xq8KzAnT1',
          dbName: 'sharedDB'
        });
    },
    processXml: function (xmlString, callback) {
        etlService.processXml(xmlString, callback);
    },
    searchResources: function (resourceType, params, callback) {
        //this.fhir.searchResources(resourceType, params, callback);
        this.db.searchResources(resourceType, params, callback);
    },
    createResource: function (resourceType, jsonData, callback) {
        //this.fhir.createResource(resourceType, jsonData, callback);
        this.db.createResource(resourceType, jsonData, callback);
    },
    updateResource: function (resourceType, id, jsonData, callback) {
        //this.fhir.updateResource(resourceType, id, jsonData, callback);
        this.db.updateResource(resourceType, id, jsonData, callback);
    },
    getResourceById: function (resourceType, id, callback) {
        //this.fhir.getResourceById(resourceType, id, callback);
        this.db.getResourceById(resourceType, id, callback);
    },
    deleteResource: function(resourceType, id, callback) {
        //this.fhir.deleteResource(resourceType, id, callback);
        this.db.deleteResource(resourceType, id, callback);
    },
    createDSU: function (callback) {
        dsuService.createWalletDB('sharedDB', callback);
    },
    createDsuResource: function (resourceType, jsonData, callback) {
        this.dsu.createResource(resourceType, jsonData, callback);
    },

});
