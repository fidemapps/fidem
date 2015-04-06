/**
 * Start a new session.
 *
 * @param {string} memberId If of the member.
 * @param {Function} [cb] Optional callback.
 * @returns {Promise}
 */

module.exports = function (memberId, cb) {
  return this.request({
    method: 'POST',
    body: memberId ? {member_id: memberId} : {},
    path: '/api/sessions'
  }, cb);
};
