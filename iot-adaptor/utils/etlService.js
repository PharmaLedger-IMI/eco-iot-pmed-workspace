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
    if(err) {
      callback(err, null);
    } else {
      const patient_info = result.dantest.patient_info[0];
      const measurement_info = result.dantest.measurement_info[0];
      const results = result.dantest.results[0];
      const pwv = results.pwv[0];
      const patientIdentifier = patient_info.patientcode[0];
      const deviceSN = measurement_info.hw_sn[0];
      // console.log(pwv);
      const newPatient = {
        name: [{ use: 'official', family: patient_info.lname[0], given: [patient_info.fname[0]]}],
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

      fhirService.patient.findOrCreate(newPatient, { identifier: patientIdentifier }, (err, response) => {
        if(err) {
          // console.log(err);
        } else {
          // console.log(response);
          //Start Height
          const heightIdentifier = `Patient/${response.id}/height/cm/${patient_info.height[0]}`;
          const bodyHeight = {
            identifier: [
              {
                use: 'secondary',
                value: heightIdentifier
              }
            ],
            code: {
              coding: [ {
                system: "http://loinc.org",
                code: "8302-2"
              } ],
              text: "Height"
            },
            subject: {
              reference: `Patient/${response.id}`
            },
            effectiveDateTime: moment(measurement_info.date[0], 'YYYY-MM-DD HH:mm:ss').toISOString(),
            valueQuantity: {
              value: patient_info.height[0],
              unit: "cm",
              system: "http://unitsofmeasure.org",
              code: "cm"
            }
          }
          fhirService.observation.findOrCreate(bodyHeight, { identifier: heightIdentifier }, (err, response) => {
            // console.log(err);
            // console.log(response);
          });
          //End Height
          //Start Weight
          const weightIdentifier = `Patient/${response.id}/weight/kg/${patient_info.weight[0]}`;
          const bodyWeight = {
            identifier: [
              {
                use: 'secondary',
                value: weightIdentifier
              }
            ],
            code: {
              coding: [ {
                system: "http://loinc.org",
                code: "29463-7"
              } ],
              text: "Weight"
            },
            subject: {
              reference: `Patient/${response.id}`
            },
            effectiveDateTime: moment(measurement_info.date[0], 'YYYY-MM-DD HH:mm:ss').toISOString(),
            valueQuantity: {
              value: patient_info.weight[0],
              unit: "kg",
              system: "http://unitsofmeasure.org",
              code: "kg"
            }
          }
          fhirService.observation.findOrCreate(bodyWeight, { identifier: weightIdentifier }, (err, response) => {
            // console.log(err);
            // console.log(response);
          });
        //End Weight

         //Start Age
         const ageIdentifier = `Patient/${response.id}/age/a/${patient_info.age[0]}`;
         const age = {
           identifier: [
             {
               use: 'secondary',
               value: ageIdentifier
             }
           ],
           code: {
             coding: [ {
               system: "http://loinc.org",
               code: "30525-0"
             } ],
             text: "Age"
           },
           subject: {
             reference: `Patient/${response.id}`
           },
           effectiveDateTime: moment(measurement_info.date[0], 'YYYY-MM-DD HH:mm:ss').toISOString(),
           valueQuantity: {
             value: patient_info.age[0],
             unit: "a",
             system: "http://unitsofmeasure.org",
             code: "a"
           }
         }
         fhirService.observation.findOrCreate(age, { identifier: ageIdentifier }, (err, response) => {
           // console.log(err);
           // console.log(response);
         });
         //End Age


         //Start SpO2
         const spo2  = _.find(pwv.item, function(object){ return object.$.code === 'PTG-SpO2'; });
         const SpO2Identifier = `Patient/${response.id}/SpO2/%/${spo2._}`;
         const SpO2 = {
           identifier: [
             {
               use: 'secondary',
               value: SpO2Identifier
             }
           ],
           code: {
             coding: [ {
               system: "http://loinc.org",
               code: "20564-1"
             } ],
             text: "SpO2"
           },
           subject: {
             reference: `Patient/${response.id}`
           },
           effectiveDateTime: moment(measurement_info.date[0], 'YYYY-MM-DD HH:mm:ss').toISOString(),
           valueQuantity: {
             value: spo2._,
             unit: "%",
             system: "http://unitsofmeasure.org",
             code: "%"
           }
         }
         fhirService.observation.findOrCreate(SpO2, { identifier: SpO2Identifier }, (err, response) => {
           // console.log(err);
           // console.log(response);
           console.log("Successfully created SpO2");
         });
         //End Age

        }
      });

      fhirService.device.findOrCreate(newDevice, { identifier: deviceSN }, (err, response) => {
        if(err) {
          // console.log(err);
        } else {
          // console.log(response);
        }
      });

      callback(undefined, {success: true});
    }
  });
};

module.exports = {
    processXml: processXml
}
