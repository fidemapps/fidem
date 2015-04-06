var signer = require('fidem-signer');

/**
 * Conditionally sign the request.
 *
 * @param {object} options
 * @param {Client} Client
 * @param {object} req
 * @returns {object} req
 */

module.exports = function (options, client, req) {
  // Sign the request.
  if (options.sign) {
    // Check required config entries.
    if (!client.config.key || !client.config.secret)
      throw new Error('Signed query required key/secret.');

    return signer.sign(req, {
      accessKeyId: client.config.key,
      secretAccessKey: client.config.secret
    });
  }

  return req;
};
