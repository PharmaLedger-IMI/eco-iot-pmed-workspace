const _ = require('lodash');

function updateDsuResource(request, response) {
    const domainConfig = {
      "type": "IotAdaptor",
      "option": {
          "endpoint": "http://127.0.0.1:1000/adaptor"
      }
    }

    let flow = $$.flow.start(domainConfig.type);
    flow.init(domainConfig);
    const resourceType  = _.upperFirst(_.camelCase(request.params.resource_type));
    const keySSI = request.headers['x-keyssi'];
    const dbName = request.headers['x-db-name'];
    flow.updateDsuResource(keySSI, dbName, resourceType, request.params.id, request.body, (error, result) => {
      if (error) {
        return response.send(error.status, error);
      } else {
        return response.send(200, result);
      }
    });
}
module.exports = updateDsuResource;
