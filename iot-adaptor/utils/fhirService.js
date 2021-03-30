const FhirClient = require('fhir-kit-client');
const fhirClient = new FhirClient({
  baseUrl: 'http://hapi.fhir.org/baseR4'
});

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

const createPatient = (jsonData, callback) => {
  console.log(jsonData);

  const newPatient = {
    resourceType: 'Patient',
    active: true,
    name: [{ use: 'official', family: ['Coleman'], given: ['Lisa', 'P.'] }],
    gender: 'female',
    birthDate: '1948-04-14',
  };

  fhirClient
    .create({
      resourceType: 'Patient',
      body: newPatient,
    })
    .then((response) => {
      callback(undefined, response);
    })
    .catch((error) => {
      callback(error, null);
    });
};

module.exports = {
    patient: {
      search: searchPatient,
      create: createPatient
    }
}
