const _ = require('lodash');
const FhirClient = require('fhir-kit-client');
const fhirClient = new FhirClient({
  baseUrl: 'http://localhost:8090/fhir'
});



//Patient
const searchPatient = (params, callback) => {
  fhirClient
    .search({ resourceType: 'Patient', searchParams: params})
    .then((response) => {
      callback(undefined, response);
    })
    .catch((error) => {
      callback(error, []);
    });
};

const findOrCreatePatient = (jsonData, searchParams, callback) => {
  fhirClient
    .search({ resourceType: 'Patient', searchParams: searchParams})
    .then((response) => {
      if(response.entry){
        console.log('Patient found');
        callback(undefined, response.entry[0].resource);
      } else {
        const newObject = _.merge({"resourceType":"Patient"}, jsonData);
        fhirClient
          .create({
            resourceType: 'Patient',
            body: newObject,
          })
          .then((response) => {
            console.log('Patient created');
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

const findOrCreateDevice = (jsonData, searchParams, callback) => {
  fhirClient
    .search({ resourceType: 'Device', searchParams: searchParams})
    .then((response) => {
      if(response.entry){
        console.log('Device found');
        callback(undefined, response.entry[0].resource);
      } else {
        const newObject = _.merge({"resourceType":"Device"}, jsonData);
        fhirClient
          .create({
            resourceType: 'Device',
            body: newObject,
          })
          .then((response) => {
            console.log('Device created');
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

const findOrCreateObservation = (jsonData, searchParams, callback) => {
  fhirClient
    .search({ resourceType: 'Observation', searchParams: searchParams})
    .then((response) => {
      if(response.entry){
        console.log('Observation found');
        callback(undefined, response.entry[0].resource);
      } else {
        const newObject = _.merge({"resourceType":"Observation"}, jsonData);
        fhirClient
          .create({
            resourceType: 'Observation',
            body: newObject,
          })
          .then((response) => {
            console.log('Observation created');
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
  const newPatient = _.merge({"resourceType":"Patient"}, jsonData);

  fhirClient
    .create({
      resourceType: 'Patient',
      body: newPatient,
    })
    .then((response) => {
      //console.log("Done");
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
      update: updatePatient,
      findOrCreate: findOrCreatePatient
    },
    observation: {
      search: searchObservation,
      create: createObservation,
      update: updateObservation,
      getById: getObservationById,
      findOrCreate: findOrCreateObservation
    },
    device: {
      findOrCreate: findOrCreateDevice
    }

}
