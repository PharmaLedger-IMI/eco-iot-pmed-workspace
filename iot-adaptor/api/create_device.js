function createDevice(request, response, next) {
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
    flow.createDsuResource(keySSI, dbName, "Device", request.body, (error, result) => {
      if (error) {
        return response.send(error.status, error);
      } else {
        return response.send(200, result);
      }
    });
}
module.exports = createDevice;
