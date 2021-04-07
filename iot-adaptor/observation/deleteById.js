function deleteObservationById(request, response) {
    // console.log("Hello getById");
    // console.log(request.params.id);
    const receivedDomain = "default";
    const domainConfig = require("../utils").getClusterDomainConfig(receivedDomain);
    if (!domainConfig) {
        console.log('Deployment Domain not found : ', receivedDomain);
        return response.send(500);
    }

    let flow = $$.flow.start(domainConfig.type);
    flow.init(domainConfig);
    flow.deleteObservationById(request.params.id, (err, result) => {
        if (err) {
            if (err.code === 'EACCES') {
                return response.send(409);
            }
            return response.send(500);
        }
        response.send(200, result);
    });
}

module.exports = deleteObservationById;
