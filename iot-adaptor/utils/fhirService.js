const _ = require('lodash');
const FhirClient = require('fhir-kit-client');
const fhirClient = new FhirClient({
  baseUrl: 'http://localhost:8090/fhir'
});

//Resource

const searchResource = (type, params, callback) => {
  fhirClient
    .search({ resourceType: type, searchParams: params})
    .then((response) => {
      callback(undefined, response);
    })
    .catch((error) => {
      callback(error, []);
    });
};

const createResource = (type, jsonData, callback) => {
  const resource = _.merge({"resourceType":type}, jsonData);
  fhirClient
    .create({
      resourceType: type,
      body: resource,
    })
    .then((response) => {
      callback(undefined, response);
    })
    .catch((error) => {
      callback(error, null);
    });
};

const updateResource = (type, id, jsonData, callback) => {
  const resource = _.merge({"resourceType":type}, jsonData);
  fhirClient
    .update({
      resourceType: type,
      id: id,
      body: resource,
    })
    .then((response) => {
      callback(undefined, response);
    })
    .catch((error) => {
      callback(error, null);
    });
};

const getResourceById = (type, id, callback) => {
  fhirClient
    .request(`${type}/${id}`)
    .then((response) => {
      callback(undefined, response);
    })
    .catch((error) => {
      callback(error, null);
    });
};

const deleteResource = (type, id, callback) => {
  fhirClient
    .request(`${type}/${id}`)
    .then((response) => {
      callback(undefined, response);
    })
    .catch((error) => {
      callback(error, null);
    });
};

const findOrCreateResource = (type, jsonData, params, callback) => {
  fhirClient
    .search({ resourceType: type, searchParams: params})
    .then((response) => {
      if(response.entry){
        callback(undefined, response.entry[0].resource);
      } else {
        const resource = _.merge({"resourceType":type}, jsonData);
        fhirClient
          .create({
            resourceType: type,
            body: resource,
          })
          .then((response) => {
            callback(undefined, response);
          })
          .catch((error) => {
            callback(error, null);
          });
      }
    })
    .catch((error) => {
      callback(error, null);
    });
};



module.exports = {
    resource: {
      search: searchResource,
      getById: getResourceById,
      create: createResource,
      update: updateResource,
      findOrCreate: findOrCreateResource,
      delete: deleteResource
    }

}
