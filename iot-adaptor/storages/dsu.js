const _ = require('lodash');
//Load openDSU SDK
const opendsu = require("opendsu");
//Load resolver library
const resolver = opendsu.loadApi("resolver");
//Load keyssi library
const keyssispace = opendsu.loadApi("keyssi");

const db = opendsu.loadApi("db");

const { v4: uuidv4 } = require('uuid');

class DsuStorage {
  constructor(config) {

    const sReadSSI = keyssispace.parse(config.keySSI);
    this.client = db.getSharedDB(sReadSSI, config.dbName);

    this.normalizeCollectionResponse = function(response) {
      return _.map(response, function(resource) {
        const _resource = _.omit(resource, [
          'pk',
          '__version',
          '__timestamp',
          'sk',
        ]);
        _resource.id = resource.pk;
        return _resource;
      });
    }
    this.normalizeSingleResponse = function(response) {
      const resource = response;
      const _resource = _.omit(resource, [
        'pk',
        '__version',
        '__timestamp',
        'sk',
      ]);
      _resource.id = resource.pk;
      return _resource;
    }
    this.normalizeErrorResponse = function(error) {
      return { status: 500, message: error.debug_message };
    }
  }

  searchResources(type, params, callback) {
    const _self = this;
    this.client.filter(type, params.query, params.sort, params.limit, function(error, response){
        if(error){
          callback(_self.normalizeErrorResponse(error), {});
        }
        else{
          callback(undefined, _self.normalizeCollectionResponse(response));
        }
    });
  }

  createResource(type, jsonData, callback) {
    const _self = this;
    const resource = _.merge({
      "resourceType": type
    }, jsonData);

    this.client.insertRecord(type, uuidv4(), resource, function(error, response){
        if(error){
            callback(_self.normalizeErrorResponse(error), undefined);
        }
        else{
            callback(undefined, _self.normalizeSingleResponse(response));
        }
    });

  }

  updateResource(type, id, jsonData, callback) {
    const _self = this;
    const resource = _.merge({
        "resourceType": type
      }, jsonData);
    this.client.updateRecord(type, id, resource, function(error, response){
        if(error){
            callback(_self.normalizeErrorResponse(error), undefined);
        }
        else{
            callback(undefined, _self.normalizeSingleResponse(response));
        }
        // console.log(response);
    });

  }

  getResourceById(type, id, callback) {
    const _self = this;
    this.client.getRecord(type, id, function(error, response){
        if(error){
            callback(_self.normalizeErrorResponse(error), undefined);
        }
        else{
            callback(undefined, _self.normalizeSingleResponse(response));
        }
        // console.log(error);
    });

  }

  deleteResource(type, id, callback) {
    const _self = this;
    this.client.deleteRecord(type, id, function(error, response){
      if(error){
          callback(_self.normalizeErrorResponse(error), undefined);
      }
      else{
          callback(undefined, {});
      }
      // console.log(response);
    });
  }

  findOrCreateResource(type, jsonData, params, callback) {
    const _self = this;
    _self.searchResources(type, params, function(error, resources){
      if(error){
        callback(_self.normalizeErrorResponse(error), undefined);
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

module.exports = DsuStorage;
