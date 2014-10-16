'use strict';

/**
 * This service is use for internal api call to server to server with a server session.  Theses calls requires a session token.
 * To get a valid session token you must first call "authenticate" with valid user credentials.
 */

var Q = require('bluebird'),
    http = require('http'),
    logger = require('./logger'),  // TO REPLACE
    config = require('./config');  // TO REPLACE

function createRequest(token, method, path) {
    logger.debug(method + ' /internal' + path + ' (' + token + ')');

    var headers = {};

    if (token) {
        headers['X-Fidem-SessionToken'] = token;
    }

    if (method !== 'GET' && method !== 'DELETE') {
        if (!headers['Content-Type']) {
            headers['Content-Type'] = 'application/json';
        }
    }

    return {
        method: method,
        host: config.services.host, // TO REPLACE WITH OPTIONS
        port: config.services.port, // TO REPLACE WITH OPTIONS
        path: '/internal' + path,
        headers: headers
    };
}

function executeRequest(fidemRequest, deferred, body) {
    var executeRequest = http.request(fidemRequest, function (fidemResponse) {
        fidemResponse.setEncoding('utf8');
        fidemResponse.on('data', function (data) {
            logger.debug(data);
            try {
                deferred.resolve({res: fidemResponse, statusCode: fidemResponse.statusCode, body: JSON.parse(data)});
            }
            catch (err) {
                logger.error(err);
                deferred.reject(err);
            }
        });
        fidemResponse.on('error', function (err) {
            logger.error(err);
            deferred.reject(err);
        });
    });
    if (body) {
        logger.debug(JSON.stringify(body));
        executeRequest.write(JSON.stringify(body));
    }

    executeRequest.on('clientError', function (err) {
        logger.error(err);
        deferred.reject(err);
    });
    executeRequest.on('error', function (err) {
        logger.error(err);
        deferred.reject(err);
    });

    executeRequest.end();
}

module.exports = {
    // High Level
    authenticate: function (username, password) {
        var deferred = Q.defer();

        // Special case with authorization headers
        var fidemRequest = createRequest(null, 'POST', '/security/authenticate');
        fidemRequest.headers.Authorization = "Basic " + new Buffer(username + ":" + password).toString("base64");
        executeRequest(fidemRequest, deferred, {});

        return deferred.promise;
    },
    getUserByToken: function (token) {
        return this.doGet(token, '/security/user/' + token);
    },

    // Low Level
    doGet: function (token, path) {
        var deferred = Q.defer();

        var fidemRequest = createRequest(token, 'GET', path);
        executeRequest(fidemRequest, deferred);

        return deferred.promise;
    },
    doPut: function (token, path, body) {
        var deferred = Q.defer();

        var fidemRequest = createRequest(token, 'PUT', path);
        executeRequest(fidemRequest, deferred, body);

        return deferred.promise;
    },
    doPost: function (token, path, body) {
        var deferred = Q.defer();

        var fidemRequest = createRequest(token, 'POST', path);
        executeRequest(fidemRequest, deferred, body);

        return deferred.promise;
    },
    doDelete: function (token, path) {
        var deferred = Q.defer();

        var fidemRequest = createRequest(token, 'DELETE', path);
        executeRequest(fidemRequest, deferred);

        return deferred.promise;
    }
};