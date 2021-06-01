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
      return response;
    }
    this.normalizeErrorResponse = function(error) {
      return { status: 500, message: error.message }
    }
  }

  searchResources(type, params, callback) {
    const _self = this;
    
  }

  createResource(type, jsonData, callback) {
    const _self = this;
    const resource = _.merge({
      "resourceType": type
    }, jsonData);
    console.log("*******50*******");
    this.client.insertRecord(type, uuidv4(), jsonData, function(error, response){
        console.log("**************");
        console.log(error);
        if(error){
            callback(_self.normalizeErrorResponse(error), null);
        }
        else{
            callback(null, _self.normalizeSingleResponse(response));
        }
        console.log(response);
    });
    
  }

  updateResource(type, id, jsonData, callback) {
    const _self = this;
    const resource = _.merge({
      "resourceType": type
    }, jsonData);

    
  }

  getResourceById(type, id, callback) {
    const _self = this;
    
  }

  deleteResource(type, id, callback) {
    const _self = this;
    
  }

  findOrCreateResource(type, jsonData, params, callback) {
    const _self = this;
    
  }
}

module.exports = DsuStorage;
