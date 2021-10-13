const _ = require('lodash');

function updateDevice(request, response) {
    const receivedDomain = "default";
    const domainConfig = require("../utils").getClusterDomainConfig(receivedDomain);
    if (!domainConfig) {
        console.log('Deployment Domain not found : ', receivedDomain);
        return response.send(500);
    }

    let flow = $$.flow.start(domainConfig.type);
    flow.init(domainConfig);
    const keySSI = request.headers['x-keyssi'];
    const dbName = "clinicalDecisionSupport";
    flow.updateDsuResource(keySSI, dbName, "Device", request.params.id, request.body, (error, result) => {
      if (error) {
        return response.send(error.status, error);
      } else {
        return response.send(200, result);
      }
    });
}
module.exports = updateDevice;
