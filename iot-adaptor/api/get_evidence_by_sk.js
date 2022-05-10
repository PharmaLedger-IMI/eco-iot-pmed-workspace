const _ = require('lodash');

function getEvidenceBySk(request, response) {
    const domainConfig = {
        "type": "IotAdaptor",
        "option": {
            "endpoint": "http://127.0.0.1:1000/adaptor"
        }
    };
    let flow = $$.flow.start(domainConfig.type);
    flow.init(domainConfig);
    flow.getResourceBySk("Evidence", request.params.id, (error, result) => {
      if (error) {
        return response.send(error.status, error);
      } else {
        return response.send(200, result);
      }
    });
}

module.exports = getEvidenceBySk;