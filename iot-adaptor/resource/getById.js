const _ = require('lodash');

function getResourceById(request, response) {
  const domainConfig = {
    "type": "IotAdaptor",
    "option": {
      "endpoint": "http://localhost:3000/iotAdapter"
    }
  }

  let flow = $$.flow.start(domainConfig.type);
  flow.init(domainConfig);
    const resourceType  = _.upperFirst(_.camelCase(request.params.resource_type));
    flow.getResourceById(resourceType, request.params.id, (error, result) => {
      if (error) {
        return response.send(error.status, error);
      } else {
        return response.send(200, result);
      }
    });
}

module.exports = getResourceById;
