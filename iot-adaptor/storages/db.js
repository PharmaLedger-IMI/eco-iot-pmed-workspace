const _ = require('lodash');
const axios = require('axios');

class DbStorage {
  constructor(config) {
    this.client = axios.create(config);
    this.normalizeCollectionResponse = function(response) {
      const resources = response.data.results;
      return _.map(resources, function(resource) {
        const _resource = _.omit(resource, [
          'objectId',
          'createdAt',
          'updatedAt',
          'ACL'
        ]);
        _resource.id = resource.objectId;
        return _resource;
      });
    }
    this.normalizeSingleResponse = function(response) {
      const resource = response.data;
      const _resource = _.omit(resource, [
        'objectId',
        'createdAt',
        'updatedAt',
        'ACL'
      ]);
      _resource.id = resource.objectId;
      return _resource;
    }
    this.normalizeErrorResponse = function(error) {
      return { status: error.response.status, message: error.response.statusText }
    }
  }

  searchResources(type, params, callback) {
    const _self = this;
    this.client
      .get(`/classes/${type}`)
      .then((response) => {
        callback(undefined, _self.normalizeCollectionResponse(response));
      })
      .catch((error) => {
        callback(_self.normalizeErrorResponse(error), null);
      });
  }

  createResource(type, jsonData, callback) {
    const _self = this;
    const resource = _.merge({
      "resourceType": type
    }, jsonData);

    this.client
      .post(`/classes/${type}`, resource)
      .then((response) => {
        let _resource = _self.normalizeSingleResponse(response);
        _self.getResourceById(type, _resource.id, callback);
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
      .put(`/classes/${type}`, resource)
      .then((response) => {
        _self.getResourceById(type, id, callback);
      })
      .catch((error) => {
        callback(_self.normalizeErrorResponse(error), null);
      });
  }

  getResourceById(type, id, callback) {
    const _self = this;
    this.client
      .get(`/classes/${type}/${id}`)
      .then((response) => {
        callback(undefined, _self.normalizeSingleResponse(response));
      })
      .catch((error) => {
        callback(_self.normalizeErrorResponse(error), null);
      });
  }

  deleteResource(type, id, callback) {
    const _self = this;
    this.client
      .delete(`/classes/${type}/${id}`)
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
        callback(_self.normalizeErrorResponse(error), null);
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

module.exports = DbStorage;
