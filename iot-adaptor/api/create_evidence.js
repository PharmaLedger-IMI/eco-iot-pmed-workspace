function createEvidence(request, response, next) {

    const domainConfig = {
        "type": "IotAdaptor",
        "option": {
            "endpoint": "http://localhost:3000/iotAdapter"
        }
    }

    let flow = $$.flow.start(domainConfig.type);
    flow.init(domainConfig);
    const keySSI = request.headers['x-keyssi'];
    const dbName = "clinicalDecisionSupport";
   
    flow.createDsuResource(keySSI, dbName, "Evidence", request.body, (error, result) => {
      if (error) {
        // console.log("Error create Evidence");
        return response.send(error.status, error);
      } else {
        return response.send(200, result);
      }
    });
}
module.exports = createEvidence;
