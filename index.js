/**
 * Expose module.
 */

var Client = require('./lib/client');

/**
 * Create a new client.
 *
 * @see Client
 * @returns {Client}
 */

exports.createClient = function (config) {
  return new Client(config);
};
