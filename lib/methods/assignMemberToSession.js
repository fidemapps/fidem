/**
 * Assign a member to an existing session.
 *
 * @param {string} sessionId If of the session.
 * @param {string} memberId If of the member.
 * @param {Function} [cb] Optional callback.
 * @returns {Promise}
 */

module.exports = function (memberId, sessionId, cb) {
  return this.request({
    method: 'PUT',
    path: '/api/sessions/' + sessionId + '/member/' + memberId
  }, cb);
};
