function IotAdapter(server) {
    console.log("IotAdapter called")
    require('./strategies/IotAdapter');

    const CreatePatient = require('./patient/create');
    const SearchPatient = require('./patient/search');
    const GetPatientById = require('./patient/getById');
    const UpdatePatient = require('./patient/update');

    const CreateObservation = require('./observation/create');
    const SearchObservation = require('./observation/search');
    const UpdateObservation = require('./observation/update');
    const GetObservationById = require('./observation/getById');
    // const DeleteObservationById = require('./observation/deleteById');
    
    

    const { responseModifierMiddleware, requestBodyJSONMiddleware } = require('../privatesky/modules/apihub/utils/middlewares');

    server.use(`/iotAdapter/*`, responseModifierMiddleware);

    server.get(`/iotAdapter/Patient`, SearchPatient);
    server.post(`/iotAdapter/Patient`, requestBodyJSONMiddleware);
    server.post(`/iotAdapter/Patient`, CreatePatient);
    server.put(`/iotAdapter/Patient/:id`, requestBodyJSONMiddleware);
    server.put(`/iotAdapter/Patient/:id`, UpdatePatient);
    // server.get(`/iotAdapter/Patient/:id`, requestBodyJSONMiddleware);
    server.get(`/iotAdapter/Patient/:id`, GetPatientById);

    

    server.get(`/iotAdapter/Observation`, SearchObservation);
    // server.get(`/iotAdapter/Observation/:id`, requestBodyJSONMiddleware);
    server.get(`/iotAdapter/Observation/:id`, GetObservationById);
    // server.delete(`/iotAdapter/Observation/:id`, DeleteObservationById);
    server.post(`/iotAdapter/Observation`, requestBodyJSONMiddleware);
    server.post(`/iotAdapter/Observation`, CreateObservation);
    server.put(`/iotAdapter/Observation/:id`, requestBodyJSONMiddleware);
    server.put(`/iotAdapter/Observation/:id`, UpdateObservation);
    
}

module.exports = IotAdapter;

