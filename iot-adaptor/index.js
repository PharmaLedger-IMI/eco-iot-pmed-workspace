function IotAdapter(server) {
    console.log("IotAdapter called");
    require('./strategies/IotAdapter');

    const DynavisionPlatform = require('./platform/dynavision');

    const CreateDsu = require('./dsu/create');
    const CreateDsuResource = require('./dsu/resource/create');
    const SearchDsuResources = require('./dsu/resource/search');
    const UpdateDsuResource = require('./dsu/resource/update');
    const DeleteDsuResource = require('./dsu/resource/delete');
    const GetDsuResourceById = require('./dsu/resource/getById');

    const CreateResource = require('./resource/create');
    const SearchResources = require('./resource/search');
    const UpdateResource = require('./resource/update');
    const DeleteResource = require('./resource/delete');
    const GetResourceById = require('./resource/getById');
    // const DeleteObservationById = require('./observation/deleteById');

    const AssignDevice = require('./api/assign_device');

    const { responseModifierMiddleware, requestBodyJSONMiddleware } = require('../privatesky/modules/apihub/utils/middlewares');
    const { requestBodyXMLMiddleware, responseBodyJsonMiddleware } = require('./utils/middlewares');

    server.use(`/iotAdapter/*`, responseModifierMiddleware);
    server.use(`/iotAdapter/*`, responseBodyJsonMiddleware);

    // For debugging purpose
    server.get(`/iotAdapter/resource/:resource_type`, SearchResources);
    server.get(`/iotAdapter/resource/:resource_type/:id`, GetResourceById);
    server.post(`/iotAdapter/resource/:resource_type`, requestBodyJSONMiddleware);
    server.post(`/iotAdapter/resource/:resource_type`, CreateResource);
    server.put(`/iotAdapter/resource/:resource_type/:id`, requestBodyJSONMiddleware);
    server.put(`/iotAdapter/resource/:resource_type/:id`, UpdateResource);
    server.delete(`/iotAdapter/resource/:resource_type/:id`, DeleteResource);

    server.post(`/iotAdapter/dsu`, CreateDsu);
    server.get(`/iotAdapter/dsu/resource/:resource_type`, SearchDsuResources);
    server.get(`/iotAdapter/dsu/resource/:resource_type/:id`, GetDsuResourceById);
    server.post(`/iotAdapter/dsu/resource/:resource_type`, requestBodyJSONMiddleware);
    server.post(`/iotAdapter/dsu/resource/:resource_type`, CreateDsuResource);
    server.get(`/iotAdapter/dsu/resource/:resource_type`, SearchDsuResources);
    server.put(`/iotAdapter/dsu/resource/:resource_type/:id`, requestBodyJSONMiddleware);
    server.put(`/iotAdapter/dsu/resource/:resource_type/:id`, UpdateDsuResource);
    server.delete(`/iotAdapter/dsu/resource/:resource_type/:id`, DeleteDsuResource);
    // End for debugging purpose

    // Actual APIs
    server.post(`/iotAdapter/platform/dynavision`, requestBodyXMLMiddleware);
    server.post(`/iotAdapter/platform/dynavision`, DynavisionPlatform);
    server.post(`/iotAdapter/assign-device`, requestBodyJSONMiddleware);
    server.post(`/iotAdapter/assign-device`, AssignDevice);
}

module.exports = IotAdapter;
