function requestBodyXMLMiddleware(request, response, next) {
    let body = '';

    request.on('data', (chunk) => {
        body += chunk;
    });

    request.on('end', () => {
        request.body = body;
        next();
    });
}

function responseBodyJsonMiddleware(request, response, next) {
    /**
     * Prepare headers for response
     */
    response.setHeader('Content-Type', 'application/json');
    next();
}

module.exports = { requestBodyXMLMiddleware, responseBodyJsonMiddleware };
