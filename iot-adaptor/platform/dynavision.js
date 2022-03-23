function processXml(request, response, next) {

    const domainConfig = {
        "type": "IotAdaptor",
        "option": {
            "endpoint": "http://127.0.0.1:1000/adaptor"
        }
    }

    let flow = $$.flow.start(domainConfig.type);
    flow.init(domainConfig);
    flow.processXml(request.body, (err, result) => {
        if (err) {
            if (err.code === 'EACCES') {
                return response.send(409);
            }
            return response.send(500);
        }
        response.send(200, result);
    });
}
module.exports = processXml;
