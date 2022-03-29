const _ = require('lodash');

function searchDevice(request, response, next) {
    const domainConfig = {
        "type": "IotAdaptor",
        "option": {
            "endpoint": "http://127.0.0.1:1000/adaptor"
        }
    };
    let flow = $$.flow.start(domainConfig.type);
    flow.init(domainConfig);
    const queryParams = _.merge({}, request.query);
    const keySSI = request.headers['X-KeySSI'];
    const dbName = "clinicalDecisionSupport";
    flow.searchDsuResources(keySSI, dbName, "Device", queryParams, (error, result) => {
      if (error) {
        return response.send(error.status, error);
      } else {
        return response.send(200, result);
      }
    });
}

module.exports = searchDevice;
