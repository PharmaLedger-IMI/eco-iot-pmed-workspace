const _ = require('lodash');

function updateResource(request, response) {
    const domainConfig = {
      "type": "IotAdaptor",
      "option": {
        "endpoint": "http://localhost:3000/iotAdapter"
      }
    }

    let flow = $$.flow.start(domainConfig.type);
    flow.init(domainConfig);
    const resourceType  = _.upperFirst(_.camelCase(request.params.resource_type));
    flow.updateResource(resourceType, request.params.id, request.body, (error, result) => {
      if (error) {
        return response.send(error.status, error);
      } else {
        return response.send(200, result);
      }
    });
}
module.exports = updateResource;
