function IotAdapter(server) {
    console.log("IotAdapter called")
    require('./strategies/IotAdapter');

    const SearchPatient = require('./patient/search');
    const CreatePatient = require('./patient/create');

    const { responseModifierMiddleware, requestBodyJSONMiddleware } = require('../privatesky/modules/apihub/utils/middlewares');

    server.use(`/iotAdapter/*`, responseModifierMiddleware);

    server.get(`/iotAdapter/Patient`, SearchPatient);
    server.post(`/iotAdapter/Patient`, requestBodyJSONMiddleware);
    server.post(`/iotAdapter/Patient`, CreatePatient);
}

module.exports = IotAdapter;
