var Promise = require('promise');
var assign = require('lodash.assign');
var request = require('request');
var RequestError = require('./request-error');
var methods = require('./methods');

// Expose module.
module.exports = Client;

/**
 * Create a new client.
 *
 * @param {object} config
 * @param {string} config.key API key.
 * @param {string} config.secret API secret.
 * @param {string} [config.hostname="services.fidemapps.com"] Hostname.
 * @param {string} [config.protocol=http] Protocol (http or https).
 * @param {string} [config.port=80|443] Port.
 */

function Client(config) {
  config = config || {};
  this.config = assign({
    hostname: config.hostname || 'services.fidemapps.com',
    port: config.protocol === 'https' ? 443 : 80,
    protocol: 'http'
  }, config);
}

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
 * @param {object} [options.headers={}] Additional headers.
 * @param {object} [options.requestOptions={}] Custom options of the internal
 [request](https://github.com/mikeal/request#requestoptions-callback).
 * @param {Function} [cb] Optional callback.
 * @returns {Promise}
 */

Client.prototype.request = function (options, cb) {
  var client = this;

  return new Promise(function (resolve, reject) {
    // Defaults options.
    options = assign({
      token: null,
      sign: true,
      method: 'GET',
      body: null,
      headers: {},
      requestOptions: {}
    }, options);

    // Check required options.
    if (!options.path)
      throw new Error('You must provide a path.');

    // Create request.
    var req = assign({
      method: options.method,
      hostname: client.config.hostname,
      path: options.path,
      url: formatUrl(assign({}, options, client.config)),
      headers: {
        accept: 'application/json'
      }
    }, options.requestOptions);

    // Put a body for PUT and POST.
    if (['put', 'post'].indexOf(options.method.toLowerCase()) !== -1)
      options.body = options.body || {};

    // If there is a body, add it.
    if (options.body) {
      req.headers['content-type'] = 'application/json';
      req.body = JSON.stringify(options.body);
    }

    // If there are query string params, add them.
    if (options.qs)
      req.qs = options.qs;

    // Use token.
    if (options.token)
      req.headers['X-Fidem-SessionToken'] = options.token;

    req.headers['X-Fidem-Access-Key'] = client.config.key;

    // Additional headers.
    assign(req.headers, options.headers);

    // Sign the request.
    if (process.env.NODE_ENV !== 'browser')
      require('./modifiers')(options, client, req);

    // Make the request.
    request(req, function (err, res, body) {
      // Basic error.
      if (err)
        return reject(err);

      // Status error.
      if (res.statusCode >= 299)
        return reject(new RequestError(body, res.statusCode));

      // No error.
      resolve(JSON.parse(body));
    });
  }).nodeify(cb);
};

assign(Client.prototype, methods);

/**
 * Format url.
 *
 * @param {object} options
 * @returns {string}
 */

function formatUrl(options) {
  return options.protocol + '://' + options.hostname + ':' + options.port + options.path;
}
