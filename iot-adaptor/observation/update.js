function updateObservation(request, response) {
    const receivedDomain = "default";
    const domainConfig = require("../utils").getClusterDomainConfig(receivedDomain);
    if (!domainConfig) {
        console.log('Deployment Domain not found : ', receivedDomain);
        return response.send(500);
    }
    console.log("check 1");
    let flow = $$.flow.start(domainConfig.type);
    flow.init(domainConfig);
    flow.updateObservation(request.params.id, request.body, (err, result) => {
        if (err) {
            if (err.code === 'EACCES') {
                return response.send(409);
            }
            return response.send(500);
        }
        response.send(200, result);
    });
}
module.exports = updateObservation;
