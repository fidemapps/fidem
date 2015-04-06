/**
 * Retrieve a user by token.
 *
 * @param {string} token Token of the user.
 * @param {Function} [cb] Optional callback.
 * @returns {Promise}
 */

module.exports = function (token, cb) {
  return this.request({
    sign: false,
    token: token,
    path: '/internal/security/user/' + token
  }, cb);
};
