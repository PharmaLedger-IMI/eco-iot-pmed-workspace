function IotAdapter(server) {
    console.log("IotAdapter called")
    require('./strategies/IotAdapter');

    const AdapterGetExample = require('./get-example');
    const AdapterPostExample = require('./post-example');

    const { responseModifierMiddleware, requestBodyJSONMiddleware } = require('../privatesky/modules/apihub/utils/middlewares');

    server.use(`/iotAdapter/*`, responseModifierMiddleware);

    server.get(`/iotAdapter/listPatients`, AdapterGetExample);

    server.post(`/iotAdapter/addPatient`, requestBodyJSONMiddleware);
    server.post(`/iotAdapter/addPatient`, AdapterPostExample);
}

module.exports = IotAdapter;