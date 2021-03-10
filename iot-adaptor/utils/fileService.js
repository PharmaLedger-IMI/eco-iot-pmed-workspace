const fs = require('fs');
const path = require('path');

const readPatients = (callback) => {
    fs.readFile(path.resolve(__dirname, '../patients.json'), (err, data) => {
        if (err) {
            return callback(err);
        }
        const patientFile = JSON.parse(data)
        const patients = patientFile.patients;
        if (!patients) {
            return callback(err, []);
        }
        callback(undefined, patients);
    })
};

module.exports = {
    readClusters: readPatients
}