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

function responseWrapper(body) {
    if (typeof body === 'string') {
        return JSON.stringify({message: body});
    }

    return JSON.stringify(body);
}

function requestBodyJSONMiddleware(request, response, next) {
    /**
     * Prepare headers for response
     */
    response.setHeader('Content-Type', 'application/json');

    const data = [];

    request.on('data', (chunk) => {
        data.push(chunk);
    });

    request.on('end', () => {
        if (!data.length) {
            request.body = {};
            return next();
        }

        let body;

        try {
            body = JSON.parse(data);
        } catch (e) {
            return response.send(500, 'Unable to decode JSON request body')
        }
        request.body = body;
        next();
    });
}

function responseModifierMiddleware(request, response, next) {
    if (!response.hasOwnProperty('send')) {
        response.send = function (statusCode, body, callback = response.end) {
            response.statusCode = statusCode;

            if (body) {
                response.write(responseWrapper(body));
            }

            callback.call(response);
            // callback();
        };
    }

    next();
}

module.exports = {
    requestBodyJSONMiddleware,
    responseModifierMiddleware,
    requestBodyXMLMiddleware
};
