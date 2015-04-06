/**
 * Get an authentication token for the credentials provided.
 *
 * @param {object} credentials
 * @param {string} credentials.username Username.
 * @param {string} credentials.password Password.
 * @param {Function} [cb] Optional callback.
 * @returns {Promise}
 */

module.exports = function (credentials, cb) {
  return this.request({
    method: 'POST',
    path: '/internal/security/authenticate',
    sign: false,
    requestOptions: {
      auth: credentials
    }
  }, cb);
};
