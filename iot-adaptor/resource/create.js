const _ = require('lodash');

function createResource(request, response, next) {
    
  const domainConfig = {
    "type": "IotAdaptor",
    "option": {
        "endpoint": "http://localhost:3000/iotAdapter"
    }
  }

  let flow = $$.flow.start(domainConfig.type);
  flow.init(domainConfig);
  const resourceType  = _.upperFirst(_.camelCase(request.params.resource_type));
  flow.createResource(resourceType, request.body, (error, result) => {
    if (error) {
      return response.send(error.status, error);
    } else {
      return response.send(200, result);
    }
  });
}
module.exports = createResource;
