const _ = require('lodash');
const parseXml = require('xml2js').parseString;
// const FhirStorage = require("../storages/fhir.js")
const DbStorage = require("../storages/db.js")
const moment = require('moment');

const escapeXml = (unsafe) => {
  return unsafe.replace(/[&]/g, function (c) {
    switch (c) {
      case '&': return '&amp;';
    }
  });
}

const buildPatientResource = (xmlDocument) => {
  const patientInfo = xmlDocument.dantest.patient_info[0];
  const resource = {
    name: [{ use: 'official', family: patientInfo.lname[0], given: [patientInfo.fname[0]] }],
    identifier: [
      {
        use: 'official',
        type: {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/v2-0203",
              code: "MR"
            }
          ]
        },
        value: patientInfo.patientcode[0]
      },
      {
        use: 'official',
        type: {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/v2-0203",
              code: "RI"
            }
          ]
        },
        value: patientInfo.usercode[0]
      },
    ]
  };
  return resource;
}

const buildDeviceResource = (xmlDocument) => {
  const measurement_info = xmlDocument.dantest.measurement_info[0];
  const resource = {
    identifier: [
      {
        use: 'official',
        type: {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/v2-0203",
              code: "SNO"
            }
          ]
        },
        value: measurement_info.hw_sn[0]
      }
    ],
    serialNumber: measurement_info.hw_sn[0]
  };
  return resource;
}

const buildHeightResource = (patientId, xmlDocument) => {
  const patientInfo = xmlDocument.dantest.patient_info[0];
  const measurementInfo = xmlDocument.dantest.measurement_info[0];
  const effectiveDateTime = moment(measurementInfo.date[0], 'YYYY-MM-DD HH:mm:ss');
  const identifier = `patient/${patientId}/observation/height/${effectiveDateTime.unix()}`;
  const resource = {
    identifier: [
      {
        use: 'secondary',
        value: identifier
      }
    ],
    code: {
      coding: [{
        system: "http://loinc.org",
        code: "8302-2"
      }],
      text: "Height"
    },
    subject: {
      reference: `Patient/${patientId}`
    },
    effectiveDateTime: effectiveDateTime.toISOString(),
    valueQuantity: {
      value: patientInfo.height[0],
      unit: "cm",
      system: "http://unitsofmeasure.org",
      code: "cm"
    }
  };
  return resource;
}

const buildWeightResource = (patientId, xmlDocument) => {
  const patientInfo = xmlDocument.dantest.patient_info[0];
  const measurementInfo = xmlDocument.dantest.measurement_info[0];
  const effectiveDateTime = moment(measurementInfo.date[0], 'YYYY-MM-DD HH:mm:ss');
  const identifier = `patient/${patientId}/observation/weight/${effectiveDateTime.unix()}`;
  const resource = {
    identifier: [
      {
        use: 'secondary',
        value: identifier
      }
    ],
    code: {
      coding: [{
        system: "http://loinc.org",
        code: "29463-7"
      }],
      text: "Weight"
    },
    subject: {
      reference: `Patient/${patientId}`
    },
    effectiveDateTime: effectiveDateTime.toISOString(),
    valueQuantity: {
      value: patientInfo.weight[0],
      unit: "kg",
      system: "http://unitsofmeasure.org",
      code: "kg"
    }
  };
  return resource;
}

const buildAgeResource = (patientId, xmlDocument) => {
  const patientInfo = xmlDocument.dantest.patient_info[0];
  const measurementInfo = xmlDocument.dantest.measurement_info[0];
  const effectiveDateTime = moment(measurementInfo.date[0], 'YYYY-MM-DD HH:mm:ss');
  const identifier = `patient/${patientId}/observation/age/${effectiveDateTime.unix()}`;
  const resource = {
    identifier: [
      {
        use: 'secondary',
        value: identifier
      }
    ],
    code: {
      coding: [{
        system: "http://loinc.org",
        code: "30525-0"
      }],
      text: "Age"
    },
    subject: {
      reference: `Patient/${patientId}`
    },
    effectiveDateTime: effectiveDateTime.toISOString(),
    valueQuantity: {
      value: patientInfo.age[0],
      unit: "a",
      system: "http://unitsofmeasure.org",
      code: "a"
    }
  };
  return resource;
}

const buildSystolicBloodPressureResource = (patientId, xmlDocument) => {
  const measurementInfo = xmlDocument.dantest.measurement_info[0];
  const effectiveDateTime = moment(measurementInfo.date[0], 'YYYY-MM-DD HH:mm:ss');
  const results = xmlDocument.dantest.results[0];
  const pwv = results.pwv[0];

  const bpSys = _.find(pwv.item, function (object) { return object.$.code === 'PTG-BPSYS'; });
  const identifier = `patient/${patientId}/observation/bpsys/${effectiveDateTime.unix()}`;
  const resource = {
    identifier: [
      {
        use: 'secondary',
        value: identifier
      }
    ],
    code: {
      coding: [{
        system: "http://loinc.org",
        code: "8480-6"
      }
      ],
      text: "Systolic Blood Pressure"
    },
    subject: {
      reference: `Patient/${patientId}`
    },
    effectiveDateTime: effectiveDateTime.toISOString(),
    valueQuantity: {
      value: bpSys._,
      unit: "mmHg",
      system: "http://unitsofmeasure.org",
      code: "mmHg"
    }
  };
  return resource;
}

const buildDiasystolicBloodPressureResource = (patientId, xmlDocument) => {
  const measurementInfo = xmlDocument.dantest.measurement_info[0];
  const effectiveDateTime = moment(measurementInfo.date[0], 'YYYY-MM-DD HH:mm:ss');
  const results = xmlDocument.dantest.results[0];
  const pwv = results.pwv[0];

  const bpDia = _.find(pwv.item, function (object) { return object.$.code === 'PTG-BPDIA'; });
  const identifier = `patient/${patientId}/observation/bpdia/${effectiveDateTime.unix()}`;
  const resource = {
    identifier: [
      {
        use: 'secondary',
        value: identifier
      }
    ],
    code: {
      coding: [
        {
          system: "http://loinc.org",
          code: "8462-4"
        }
      ],
      text: "Diastolic Blood Pressure"
    },
    subject: {
      reference: `Patient/${patientId}`
    },
    effectiveDateTime: effectiveDateTime.toISOString(),
    valueQuantity: {
      value: bpDia._,
      unit: "mmHg",
      system: "http://unitsofmeasure.org",
      code: "mmHg"
    }
  };
  return resource;
}

const buildSpO2Resource = (patientId, xmlDocument) => {
  const measurementInfo = xmlDocument.dantest.measurement_info[0];
  const effectiveDateTime = moment(measurementInfo.date[0], 'YYYY-MM-DD HH:mm:ss');
  const results = xmlDocument.dantest.results[0];
  const pwv = results.pwv[0];

  const spO2 = _.find(pwv.item, function (object) { return object.$.code === 'PTG-SpO2'; });
  const identifier = `patient/${patientId}/observation/spo2/${effectiveDateTime.unix()}`;
  const resource = {
    identifier: [
      {
        use: 'secondary',
        value: identifier
      }
    ],
    code: {
      coding: [{
        system: "http://loinc.org",
        code: "20564-1"
      }],
      text: "SpO2"
    },
    subject: {
      reference: `Patient/${patientId}`
    },
    effectiveDateTime: effectiveDateTime.toISOString(),
    valueQuantity: {
      value: spO2._,
      unit: "%",
      system: "http://unitsofmeasure.org",
      code: "%"
    }
  };
  return resource;
}

const processXml = (xmlString, callback) => {
  parseXml(escapeXml(xmlString), function (error, result) {
    if (error) {
      callback(error, null);
    } else {
      const patient_info = result.dantest.patient_info[0];
      const measurement_info = result.dantest.measurement_info[0];
      const results = result.dantest.results[0];
      const pwv = results.pwv[0];
      const effectiveDateTime = moment(measurement_info.date[0], 'YYYY-MM-DD HH:mm:ss');
      // console.log(pwv);

      const newPatient = buildPatientResource(result);
      const newDevice = buildDeviceResource(result);

      const patientIdentifier = newPatient.identifier[0].value;
      const deviceSN = newDevice.identifier[0].value;

      // storage = new FhirStorage({
      //   baseUrl: 'http://localhost:8090/fhir'
      // });

      storage = new DbStorage({
        baseURL: 'http://localhost:1337/v1/storage',
        headers: {
          'X-Storage-Application-Id': '4d98fbf2-f85f-4153-9e1c-91ee5776b0d7',
          'X-Storage-REST-API-Key': '4c8dc298-de81-48c2-8fdc-3897e1ac2a17',
          'Content-Type': 'application/json'
        }
      })

      //storage.findOrCreateResource('Patient', newPatient, { identifier: patientIdentifier }, (error, resource) => {
      storage.findOrCreateResource('Patient', newPatient, { where: { "identifier.value": patientIdentifier } }, (error, resource) => {
        if (error) {
          // console.log(error);
        } else {
          //Start Height

          const bodyHeight = buildHeightResource(resource.id, result);
          const heightIdentifier = bodyHeight.identifier[0].value;

          //storage.findOrCreateResource('Observation', bodyHeight, { identifier: heightIdentifier }, (error, resource) => {
          storage.findOrCreateResource('Observation', bodyHeight, { where: { "identifier.value": heightIdentifier } }, (error, resource) => {
            // console.log(error);
            // console.log(resource);
          });
          //End Height

          //Start Weight
          const bodyWeight = buildWeightResource(resource.id, result);
          const weightIdentifier = bodyWeight.identifier[0].value;
          //storage.findOrCreateResource('Observation', bodyWeight, { identifier: weightIdentifier }, (error, resource) => {
          storage.findOrCreateResource('Observation', bodyWeight, { where: { "identifier.value": weightIdentifier } }, (error, resource) => {
            // console.log(error);
            // console.log(resource);
          });
          //End Weight

          //Start Age
          const age = buildAgeResource(resource.id, result);
          const ageIdentifier = age.identifier[0].value;
          //storage.findOrCreateResource('Observation', age, { identifier: ageIdentifier }, (error, resource) => {
          storage.findOrCreateResource('Observation', age, { where: { "identifier.value": ageIdentifier } }, (error, resource) => {
            // console.log(error);
            // console.log(resource);
          });
          //End Age

          //Start Systolic Blood Pressure
          const bpSys = buildSystolicBloodPressureResource(resource.id, result);
          const bpSysIdentifier = bpSys.identifier[0].value;
          //storage.findOrCreateResource('Observation', bpSys, { identifier: bpSysIdentifier }, (error, resource) => {
          storage.findOrCreateResource('Observation', bpSys, { where: { "identifier.value": bpSysIdentifier } }, (error, resource) => {
            // console.log(error);
            // console.log(resource);
          });
          //End Blood Pressure

          //Start Diasystolic Blood Pressure
          const bpDia = buildDiasystolicBloodPressureResource(resource.id, result);
          const bpDiaIdentifier = bpDia.identifier[0].value;
          //storage.findOrCreateResource('Observation', bpDia, { identifier: bpDiaIdentifier }, (error, resource) => {
          storage.findOrCreateResource('Observation', bpDia, { where: { "identifier.value": bpDiaIdentifier } }, (error, resource) => {
            // console.log(error);
            // console.log(resource);
          });
          //End Diasystolic Blood Pressure

          //Start SpO2
          const spO2 = buildSpO2Resource(resource.id, result);
          const spO2Identifier = spO2.identifier[0].value;
          //storage.findOrCreateResource('Observation', spO2, { identifier: spO2Identifier }, (error, resource) => {
          storage.findOrCreateResource('Observation', spO2, { where: { "identifier.value": spO2Identifier } }, (error, resource) => {
            // console.log(error);
            // console.log(resource);
          });
          //End SpO2
        }
      });

      //storage.findOrCreateResource('Device', newDevice, { identifier: deviceSN }, (error, resource) => {
      storage.findOrCreateResource('Device', newDevice, { where: { "identifier.value": deviceSN } }, (error, resource) => {
        if (error) {
          // console.log(error);
        } else {
          // console.log(resource);
        }
      });

      callback(undefined, { success: true });
    }
  });
};

module.exports = {
  processXml: processXml
}
