var Promise = require('bluebird');
var request = require('request');
var _ = require('lodash');
var formatUrl = require('url').format;
var RequestError = require('./request-error');
var signer = require('./signer');

/**
 * Expose module.
 */

module.exports = Client;

/**
 * Create a new client.
 *
 * @param {object} config
 * @param {string} config.key API key.
 * @param {string} config.secret API secret.
 * @param {string} [config.hostname="services.fidemapps.com"] Hostname.
 * @param {string} [config.port=80] Port.
 */

function Client(config) {
  // Defaults config.
  this.config = _.defaults(config || {}, {
    hostname: 'services.fidemapps.com',
    port: 80
  });

  // Check required config entries.
  if (!this.config.key) throw new Error('API key not provided.');
  if (!this.config.secret) throw new Error('API secret not provided.');
}

/**
 * Get an authentication token for the credentials provided.
 *
 * @param {object} credentials
 * @param {string} credentials.username Username.
 * @param {string} credentials.password Password.
 * @param {Function} [cb] Optional callback.
 * @returns {Promise}
 */

Client.prototype.authenticate = function (credentials, cb) {
  return this.request({
    method: 'POST',
    path: '/internal/security/authenticate',
    sign: false,
    requestOptions: {
      auth: credentials
    }
  }).then(function (body) {
    return body.token;
  }).nodeify(cb);
};

/**
 * Make a request.
 *
 * @param {object} options
    will use a session token request.
 * @param {string} options.path Path of the request.
 * @param {string} [options.token=null] Session token. If provided,
 * @param {boolean} [options.sign=true] Sign the request
    using key and secret of the client.
 * @param {string} [options.method=GET] HTTP method.
 * @param {object} [options.body=null] HTTP body of the request for methods
    that supports it (POST, PUT, ...).
 * @param {object} [options.requestOptions={}] Custom options of the internal
    [request](https://github.com/mikeal/request#requestoptions-callback).
 * @param {Function} [cb] Optional callback.
 * @returns {Promise}
 */

Client.prototype.request = function (options, cb) {
  var client = this;

  return new Promise(function (resolve, reject) {
    // Defaults options.
    options = _.defaults(options || {}, {
      token: null,
      sign: true,
      method: 'GET',
      body: null,
      requestOptions: {}
    });

    // Check required options.
    if (!options.path) throw new Error('You must provide a path.');

    // Create request.
    var req = _.defaults(options.requestOptions, {
      method: options.method,
      hostname: client.config.hostname,
      path: options.path,
      url: formatUrl({
        protocol: 'http',
        hostname: client.config.hostname,
        port: client.config.port,
        pathname: options.path
      }),
      headers: {
        accept: 'application/json'
      }
    });

    // Put a body for PUT and POST.
    if (['put', 'post'].indexOf(options.method.toLowerCase()) !== -1) {
      options.body = options.body || {};
    }

    // If there is a body, add it.
    if (options.body) {
      req.headers['content-type'] = 'application/json';
      req.body = JSON.stringify(options.body);
    }

    // Sign the request.
    if (options.sign) {
      req = signer.sign(req, {
        accessKeyId: client.config.key,
        secretAccessKey: client.config.secret
      });
    }

    // Use token.
    if (options.token) {
      // Add header.
      req.headers['X-Fidem-SessionToken'] = options.token;
    }

    // Make the request.
    request(req, function (err, res, body) {
      // Basic error.
      if (err) return reject(err);

      // Status error.
      if (res.statusCode !== 200) return reject(new RequestError(body));

      // No error.
      resolve(JSON.parse(body));
    });
  }).nodeify(cb);
};

/**
 * Retrieve a user by token.
 *
 * @param {string} token Token of the user.
 * @param {Function} [cb] Optional callback.
 * @returns {Promise}
 */

Client.prototype.getUserByToken = function (token, cb) {
  return this.request({
    sign: false,
    token: token,
    path: '/internal/security/user/' + token
  }, cb);
};

/**
 * Log action.
 *
 * @param {string} action Action.
 * @param {Function} [cb] Optional callback.
 * @returns {Promise}
 */

Client.prototype.logAction = function (action, cb) {
  return this.request({
    method: 'POST',
    body: action,
    path: '/api/gamification/actions'
  }, cb);
};

/**
 * Create a member.
 *
 * @param {string} accountId If of the account.
 * @param {Function} [cb] Optional callback.
 * @returns {Promise}
 */

Client.prototype.createMember = function (accountId, cb) {
  return this.request({
    method: 'POST',
    path: '/api/members',
    body: accountId ? {account_id: accountId} : {}
  }, cb);
};

/**
 * Start a new session.
 *
 * @param {string} memberId If of the member.
 * @param {Function} [cb] Optional callback.
 * @returns {Promise}
 */

Client.prototype.startSession = function (memberId, cb) {
  return this.request({
    method: 'POST',
    body: memberId ? {member_id: memberId} : {},
    path: '/api/sessions'
  }, cb);
};

/**
 * Assign a member to an existing session.
 *
 * @param {string} sessionId If of the session.
 * @param {string} memberId If of the member.
 * @param {Function} [cb] Optional callback.
 * @returns {Promise}
 */

Client.prototype.assignMemberToSession = function (memberId, sessionId, cb) {
  return this.request({
    method: 'PUT',
    path: '/api/session/' + sessionId + '/member/' + memberId
  }, cb);
};
