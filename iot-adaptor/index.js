function IotAdapter(server) {
    console.log("IotAdapter called")
    require('./strategies/IotAdapter');

    const DynavisionPlatform = require('./platform/dynavision');

    const CreatePatient = require('./patient/create');
    const SearchPatient = require('./patient/search');
    const GetPatientById = require('./patient/getById');
    const UpdatePatient = require('./patient/update');

    const CreateObservation = require('./observation/create');
    const SearchObservation = require('./observation/search');
    const UpdateObservation = require('./observation/update');
    const GetObservationById = require('./observation/getById');


    const CreateResource = require('./resource/create');
    const SearchResource = require('./resource/search');
    const UpdateResource = require('./resource/update');
    const DeleteResource = require('./resource/delete');
    const GetResourceById = require('./resource/getById');
    // const DeleteObservationById = require('./observation/deleteById');



    const { responseModifierMiddleware, requestBodyJSONMiddleware } = require('../privatesky/modules/apihub/utils/middlewares');
    const { requestBodyXMLMiddleware } = require('./utils/middlewares');

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


    server.get(`/iotAdapter/resource/:resource_type`, SearchResource);
    // server.get(`/iotAdapter/Resource/:id`, requestBodyJSONMiddleware);
    server.get(`/iotAdapter/resource/:resource_type/:id`, GetResourceById);
    // server.delete(`/iotAdapter/Resource/:id`, DeleteResourceById);
    server.post(`/iotAdapter/resource/:resource_type`, requestBodyJSONMiddleware);
    server.post(`/iotAdapter/resource/:resource_type`, CreateResource);
    server.put(`/iotAdapter/resource/:resource_type/:id`, requestBodyJSONMiddleware);
    server.put(`/iotAdapter/resource/:resource_type/:id`, UpdateResource);
    server.delete(`/iotAdapter/resource/:resource_type/:id`, DeleteResource);

    server.post(`/iotAdapter/platform/dynavision`, requestBodyXMLMiddleware);
    server.post(`/iotAdapter/platform/dynavision`, DynavisionPlatform);
}

module.exports = IotAdapter;
