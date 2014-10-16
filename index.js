/**
 * Expose module.
 */

/**
 * TODO: I don't know what is the better way to expose the two kinds of service.  I think they can share the same options.
 */

module.exports.services = require('./lib/services');
module.exports.tokenServices = require('./lib/services-token');
