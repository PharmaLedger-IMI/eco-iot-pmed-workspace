const _ = require('lodash');
const parseXml = require('xml2js').parseString;
const fhirService = require("../utils/fhirService");
const moment = require('moment');

const escapeXml = (unsafe) => {
  return unsafe.replace(/[&]/g, function (c) {
    switch (c) {
      case '&': return '&amp;';
    }
  });
}

const processXml = (xmlString, callback) => {
  parseXml(escapeXml(xmlString), function (err, result) {
    if (err) {
      callback(err, null);
    } else {
      const patient_info = result.dantest.patient_info[0];
      const measurement_info = result.dantest.measurement_info[0];
      const results = result.dantest.results[0];
      const pwv = results.pwv[0];
      const patientIdentifier = patient_info.patientcode[0];
      const deviceSN = measurement_info.hw_sn[0];
      const effectiveDateTime = moment(measurement_info.date[0], 'YYYY-MM-DD HH:mm:ss');
      // console.log(pwv);
      const newPatient = {
        name: [{ use: 'official', family: patient_info.lname[0], given: [patient_info.fname[0]] }],
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
            value: patient_info.patientcode[0]
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
            value: patient_info.usercode[0]
          },
        ]
      };
      const newDevice = {
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
            value: deviceSN
          }
        ],
        serialNumber: deviceSN
      }

      fhirService.resource.findOrCreate('Patient', newPatient, { identifier: patientIdentifier }, (err, response) => {
        if (err) {
          // console.log(err);
        } else {
          // console.log(response);
          //Start Height

          const heightIdentifier = `patient/${response.id}/observation/height/${effectiveDateTime.unix()}`;
          const bodyHeight = {
            identifier: [
              {
                use: 'secondary',
                value: heightIdentifier
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
              reference: `Patient/${response.id}`
            },
            effectiveDateTime: effectiveDateTime.toISOString(),
            valueQuantity: {
              value: patient_info.height[0],
              unit: "cm",
              system: "http://unitsofmeasure.org",
              code: "cm"
            }
          }
          fhirService.resource.findOrCreate('Observation', bodyHeight, { identifier: heightIdentifier }, (err, response) => {
            // console.log(err);
            // console.log(response);
            
          });
          //End Height
          //Start Weight
          const weightIdentifier = `patient/${response.id}/observation/weight/${effectiveDateTime.unix()}`;
          const bodyWeight = {
            identifier: [
              {
                use: 'secondary',
                value: weightIdentifier
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
              reference: `Patient/${response.id}`
            },
            effectiveDateTime: effectiveDateTime.toISOString(),
            valueQuantity: {
              value: patient_info.weight[0],
              unit: "kg",
              system: "http://unitsofmeasure.org",
              code: "kg"
            }
          }
          fhirService.resource.findOrCreate('Observation', bodyWeight, { identifier: weightIdentifier }, (err, response) => {
            // console.log(err);
            // console.log(response);
          });
          //End Weight

          //Start Age
          const ageIdentifier = `patient/${response.id}/observation/age/${effectiveDateTime.unix()}`;
          const age = {
            identifier: [
              {
                use: 'secondary',
                value: ageIdentifier
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
              reference: `Patient/${response.id}`
            },
            effectiveDateTime: effectiveDateTime.toISOString(),
            valueQuantity: {
              value: patient_info.age[0],
              unit: "a",
              system: "http://unitsofmeasure.org",
              code: "a"
            }
          }
          fhirService.resource.findOrCreate('Observation', age, { identifier: ageIdentifier }, (err, response) => {
            // console.log(err);
            // console.log(response);
          });
          //End Age
          //Start Systolic Blood Pressure
          const sbp = _.find(pwv.item, function (object) { return object.$.code === 'PTG-BPSYS'; });
          const sbpIdentifier = `patient/${response.id}/observation/sbp/${effectiveDateTime.unix()}`;
          const sBloodPressure = {
            identifier: [
              {
                use: 'secondary',
                value: sbpIdentifier
              }
            ],
            code: {
              coding: [{
                system: "http://loinc.org",
                code: "60984-2"
              }
              ],
              text: "Systolic Blood Pressure"
            },
            subject: {
              reference: `Patient/${response.id}`
            },
            effectiveDateTime: effectiveDateTime.toISOString(),
            valueQuantity: {
              value: sbp._,
              unit: "mmHg",
              system: "http://unitsofmeasure.org",
              code: "mmHg"
            }
          }
          fhirService.resource.findOrCreate('Observation', sBloodPressure, { identifier: sbpIdentifier }, (err, response) => {
            // console.log(err);
            // console.log(response);
            // console.log("Successfully processed Systolic Blood Pressure");
          });
          //End Blood Pressure
          //Start Diasystolic Blood Pressure
          const dbp = _.find(pwv.item, function (object) { return object.$.code === 'PTG-BPDIA'; });
          const dbpIdentifier = `patient/${response.id}/observation/dbp/${effectiveDateTime.unix()}`;
          const dBloodPressure = {
            identifier: [
              {
                use: 'secondary',
                value: dbpIdentifier
              }
            ],
            code: {
              coding: [
                {
                  system: "http://loinc.org",
                  code: "60982-6"
                }
              ],
              text: "Diastolic Blood Pressure"
            },
            subject: {
              reference: `Patient/${response.id}`
            },
            effectiveDateTime: effectiveDateTime.toISOString(),
            valueQuantity: {
              value: dbp._,
              unit: "mmHg",
              system: "http://unitsofmeasure.org",
              code: "mmHg"
            }
          }
          fhirService.resource.findOrCreate('Observation', dBloodPressure, { identifier: dbpIdentifier }, (err, response) => {
            // console.log(err);
            // console.log(response);
            // console.log("Successfully processed Diasystolic Blood Pressure");
          });
          //End Diasystolic Blood Pressure

          //Start Central Systolic Blood Pressure
          const csbp = _.find(pwv.item, function (object) { return object.$.code === 'PTG-BpCASP'; });
          const csbpIdentifier = `patient/${response.id}/observation/csbp/${effectiveDateTime.unix()}`;
          const csBloodPressure = {
            identifier: [
              {
                use: 'secondary',
                value: csbpIdentifier
              }
            ],
            code: {
              coding: [
                {
                  system: "http://loinc.org",
                  code: "60981-8"
                }
              ],
              text: "Central Systolic Blood Pressure"
            },
            subject: {
              reference: `Patient/${response.id}`
            },
            effectiveDateTime: effectiveDateTime.toISOString(),
            valueQuantity: {
              value: csbp._,
              unit: "mmHg",
              system: "http://unitsofmeasure.org",
              code: "mmHg"
            }
          }
          fhirService.resource.findOrCreate('Observation', csBloodPressure, { identifier: csbpIdentifier }, (err, response) => {
            // console.log(err);
            // console.log(response);
            // console.log("Successfully processed Central Systolic Blood Pressure");
          });
          //End Central Systolic Blood Pressure

          //Start SpO2
          const spo2 = _.find(pwv.item, function (object) { return object.$.code === 'PTG-SpO2'; });
          const SpO2Identifier = `patient/${response.id}/observation/spo2/${effectiveDateTime.unix()}`;
          const SpO2 = {
            identifier: [
              {
                use: 'secondary',
                value: SpO2Identifier
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
              reference: `Patient/${response.id}`
            },
            effectiveDateTime: effectiveDateTime.toISOString(),
            valueQuantity: {
              value: spo2._,
              unit: "%",
              system: "http://unitsofmeasure.org",
              code: "%"
            }
          }
          fhirService.resource.findOrCreate('Observation', SpO2, { identifier: SpO2Identifier }, (err, response) => {
            // console.log(err);
            // console.log(response);
            // console.log("Successfully processed SpO2");
          });
          //End SpO2
        }
      });

      fhirService.resource.findOrCreate('Device', newDevice, { identifier: deviceSN }, (err, response) => {
        if (err) {
          // console.log(err);
        } else {
          // console.log(response);
        }
      });

      callback(undefined, { success: true });
    }
  });
};

module.exports = {
  processXml: processXml
}
