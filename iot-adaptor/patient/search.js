const _ = require('lodash');

function searchPatient(request, response, next) {
    const receivedDomain = "default";
    const domainConfig = require("../utils").getClusterDomainConfig(receivedDomain);
    if (!domainConfig) {
        console.log('Deployment Domain not found : ', receivedDomain);
        return response.send(500);
    }

    let flow = $$.flow.start(domainConfig.type);
    flow.init(domainConfig);
    const queryParams = _.merge({}, request.query);
    flow.searchPatient(queryParams, (err, result) => {
        if (err) {
            if (err.code === 'EACCES') {
                return response.send(409);
            }
            return response.send(500);
        }
        response.send(200, result);
    });
}

module.exports = searchPatient;