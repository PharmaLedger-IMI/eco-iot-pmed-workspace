const _ = require('lodash');
const Client = require('fhir-kit-client');

class FhirStorage {
  constructor(config) {
    this.client = new Client(config);
    this.normalizeCollectionResponse = function(response) {
      const entries = response.entry;
      return _.map(entries, function(entry) {
        return _.omit(entry.resource, [
          'meta',
          'text'
        ]);
      });
    }
    this.normalizeSingleResponse = function(response) {
      return _.omit(response, [
        'meta',
        'text'
      ]);
    }
    this.normalizeErrorResponse = function(error) {
      // console.log(error);
      return { status: error.response.status, message: error.response.data.issue[0].diagnostics }
    }
  }

  searchResources(type, params, callback) {
    const _self = this;
    this.client
      .search({
        resourceType: type,
        searchParams: params
      })
      .then((response) => {
        callback(undefined, _self.normalizeCollectionResponse(response));
      })
      .catch((error) => {
        callback(_self.normalizeErrorResponse(error), {});
      });
  }

  createResource(type, jsonData, callback) {
    const _self = this;
    const resource = _.merge({
      "resourceType": type
    }, jsonData);

    this.client
      .create({
        resourceType: type,
        body: resource,
      })
      .then((response) => {
        callback(undefined, _self.normalizeSingleResponse(response));
      })
      .catch((error) => {
        callback(_self.normalizeErrorResponse(error), null);
      });
  }

  updateResource(type, id, jsonData, callback) {
    const _self = this;
    const resource = _.merge({
      "resourceType": type
    }, jsonData);

    this.client
      .update({
        resourceType: type,
        id: id,
        body: resource,
      })
      .then((response) => {
        callback(undefined, _self.normalizeSingleResponse(response));
      })
      .catch((error) => {
        callback(_self.normalizeErrorResponse(error), null);
      });
  }

  getResourceById(type, id, callback) {
    const _self = this;
    this.client
      .request(`${type}/${id}`)
      .then((response) => {
        callback(undefined, _self.normalizeSingleResponse(response));
      })
      .catch((error) => {
        callback(_self.normalizeErrorResponse(error), null);
      });
  }

  deleteResource(type, id, callback) {
    this.client
      .request(`${type}/${id}`)
      .then((response) => {
        callback(undefined, {});
      })
      .catch((error) => {
        callback(_self.normalizeErrorResponse(error), null);
      });
  }

  findOrCreateResource(type, jsonData, params, callback) {
    const _self = this;
    _self.searchResources(type, params, function(error, resources){
      if(error){
        callback(error, null);
      } else {
        if (resources && resources.length > 0) {
          callback(undefined, resources[0]);
        } else {
          _self.createResource(type, jsonData, callback);
        }
      }
    });
  }
}

module.exports = FhirStorage;
