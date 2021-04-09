const _ = require('lodash');
const FhirClient = require('fhir-kit-client');
const { concat } = require('lodash');
const fhirClient = new FhirClient({
  baseUrl: 'http://hapi.fhir.org/baseR4'
});



//Patient
const searchPatient = (callback) => {
  fhirClient
    .search({ resourceType: 'Patient', searchParams: {}})
    .then((response) => {
      callback(undefined, response);
    })
    .catch((error) => {
      callback(error, []);
    });
};

const getPatientById = (id, callback) => {
  console.log(id);
  fhirClient
    .request(`Patient/${id}`)
    .then((response) => {
     
      callback(undefined, response);
    })
    .catch((error) => {
      callback(error, []);
    });
};

const createPatient = (jsonData, callback) => {

  console.log(jsonData);
  // return jsonData;
  const newPatient = _.merge({"resourceType":"Patient"}, jsonData);
  console.log(jsonData.name);
  console.log(newPatient);
  // jsonData.resourceType = 'Patient';
  // jsonData.active = true;

  fhirClient
    .create({
      resourceType: 'Patient',
      body: newPatient,
    })
    .then((response) => {
      console.log("Done");
      callback(undefined, response);
    })
    .catch((error) => {
      // console.log(erro.data);
      callback(error, null);
    });
};

const updatePatient = (id, jsonData, callback) => {

  console.log(jsonData);
  // return jsonData;
  const newPatient = _.merge({"resourceType":"Patient"}, jsonData);
  // console.log(jsonData.name);
  console.log(newPatient);
  console.log(id);
  // jsonData.resourceType = 'Patient';
  // jsonData.active = true;

  fhirClient
    .update({
      resourceType: 'Patient',
      id: id,
      body: newPatient,
    })
    .then((response) => {
      console.log("Done");
      callback(undefined, response);
    })
    .catch((error) => {
      console.log(error);
      callback(error, null);
    });
};

//Observation
const searchObservation = (callback) => {
  console.log("Hello Search");
  fhirClient
    .search({ resourceType: 'Observation', searchParams: {}})
    .then((response) => {
      callback(undefined, response);
    })
    .catch((error) => {
      callback(error, []);
    }); 
};

const createObservation = (jsonData, callback) => {

  console.log(jsonData);
  // return jsonData;
  const newObservation = _.merge({"resourceType":"Observation"}, jsonData);
  console.log(jsonData.name);
  console.log(newObservation);
  // jsonData.resourceType = 'Patient';
  // jsonData.active = true;

  fhirClient
    .create({
      resourceType: 'Observation',
      body: newObservation,
    })
    .then((response) => {
      console.log("Done");
      callback(undefined, response);
    })
    .catch((error) => {
      // console.log(erro.data);
      callback(error, null);
    });
};

const updateObservation = (id, jsonData, callback) => {

  console.log(jsonData);
  // return jsonData;
  const newPatient = _.merge({"resourceType":"Patient"}, jsonData);
  // console.log(jsonData.name);
  console.log(newPatient);
  console.log(id);
  // jsonData.resourceType = 'Patient';
  // jsonData.active = true;

  fhirClient
    .update({
      resourceType: 'Observation',
      id: id,
      body: newPatient,
    })
    .then((response) => {
      console.log("Done");
      callback(undefined, response);
    })
    .catch((error) => {
      console.log(error);
      callback(error, null);
    });
};

const getObservationById = (id, callback) => {
  console.log(id);
  fhirClient
    .request(`Observation/${id}`)
    .then((response) => {
     
      callback(undefined, response);
    })
    .catch((error) => {
      callback(error, []);
    });
};


module.exports = {
    patient: {
      search: searchPatient,
      getById: getPatientById,
      create: createPatient,
      update: updatePatient
    },
    observation: {
      search: searchObservation,
      create: createObservation,
      update: updateObservation, 
      getById: getObservationById
    }

}
