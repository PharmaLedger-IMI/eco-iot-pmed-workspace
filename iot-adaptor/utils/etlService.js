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
      const patientIdentifier = patient_info.patientcode[0];
      const deviceSN = measurement_info.hw_sn[0];
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
              unit: "cm"
            }
          }
          fhirService.observation.findOrCreate(bodyHeight, { identifier: heightIdentifier }, (err, response) => {
            // console.log(err);
            // console.log(response);
          });
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
