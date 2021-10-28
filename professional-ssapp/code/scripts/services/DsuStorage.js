const opendsu = require("opendsu");
const keySSISpace = opendsu.loadApi('keyssi');

export default class DsuStorage {
  constructor(config) {

    const sReadSSI = keySSISpace.parse(config.keySSI);
    this.client = opendsu.loadApi('db').getSharedDB(sReadSSI, config.dbName);

    this.normalizeCollectionResponse = function(response) {
      return response;
    }
    this.normalizeSingleResponse = function(response) {
      return response;
    }
    this.normalizeErrorResponse = function(error) {
      return { status: 500, message: error.debug_message };
    }
  }

  searchResources(type, params, callback) {
    const _self = this;
    this.client.filter(type, params.query, params.sort, params.limit, function(error, response){
        if(error){
          callback(error, {});
        }
        else{
          callback(undefined, response);
        }
    });
  }

 

}


// module.exports = DsuStorage;
