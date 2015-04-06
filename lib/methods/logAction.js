/**
 * Log action.
 *
 * @param {string} action Action.
 * @param {Function} [cb] Optional callback.
 * @returns {Promise}
 */

module.exports = function (action, cb) {
  return this.request({
    method: 'POST',
    body: action,
    path: '/api/gamification/actions'
  }, cb);
};
