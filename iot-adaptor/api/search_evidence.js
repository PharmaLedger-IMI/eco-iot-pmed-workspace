const _ = require('lodash');

function searchEvidence(request, response, next) {
    const receivedDomain = "default";
    const domainConfig = require("../utils").getClusterDomainConfig(receivedDomain);
    if (!domainConfig) {
        console.log('Deployment Domain not found : ', receivedDomain);
        return response.send(500);
    }
    let flow = $$.flow.start(domainConfig.type);
    flow.init(domainConfig);
    const queryParams = _.merge({}, request.query);
    const keySSI = request.headers['x-keyssi'];
    const dbName = "clinicalDecisionSupport";
    flow.searchDsuResources(keySSI, dbName, "Evidence", queryParams, (error, result) => {
      if (error) {
        return response.send(error.status, error);
      } else {
        return response.send(200, result);
      }
    });
}

module.exports = searchEvidence;
