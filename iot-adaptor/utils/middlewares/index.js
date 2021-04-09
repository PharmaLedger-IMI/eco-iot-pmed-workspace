function requestBodyXMLMiddleware(request, response, next) {
    /**
     * Prepare headers for response
     */
    response.setHeader('Content-Type', 'application/json');

    let body = '';

    request.on('data', (chunk) => {
        body += chunk;
    });

    request.on('end', () => {
        request.body = body;
        next();
    });
}

module.exports = { requestBodyXMLMiddleware };
