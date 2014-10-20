var util = require('util');

/**
 * Expose module.
 */

module.exports = RequestError;

/**
 * Create a new request error.
 *
 * @param {object} body
 */

function RequestError(body) {
  // Try parsing body as JSON.
  try {
    body = JSON.parse(body);
  } catch (e) {}

  this.body = body;
  Error.call(this, body.error);
}

// Inherits from error.
util.inherits(RequestError, Error);
