const _ = require('lodash');

function getEvidenceById(request, response) {
  console.log("Calling get evidence by id");
    const receivedDomain = "default";
    const domainConfig = {
        "type": "IotAdaptor",
        "option": {
            "endpoint": "http://127.0.0.1:1000/adaptor"
        }
    };
    if (!domainConfig) {
        console.log('Deployment Domain not found : ', receivedDomain);
        return response.send(500);
    }
    let flow = $$.flow.start(domainConfig.type);
    flow.init(domainConfig);
    const keySSI = request.headers['x-keyssi'];
    const dbName = "clinicalDecisionSupport";
    flow.getDsuResourceById(keySSI, dbName, "Evidence", request.params.id, (error, result) => {
      if (error) {
        return response.send(error.status, error);
      } else {
        return response.send(200, result);
      }
    });
}

module.exports = getEvidenceById;
