module.exports = RequestError;

/**
 * Create a new request error.
 *
 * @param {object} body
 * @param {number} statusCode
 */

function RequestError(body, statusCode) {
  // Try parsing body as JSON.
  try {
    body = JSON.parse(body);
  } catch (e) {}

  this.statusCode = statusCode;
  this.body = body;
  Error.call(this, body.error);
}

RequestError.prototype = new Error();
