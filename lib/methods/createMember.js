/**
 * Create a member.
 *
 * @param {object} member
 * @param {string} member.accountId Id of the account.
 * @param {Function} [cb] Optional callback.
 * @returns {Promise}
 */

module.exports = function (member, cb) {
  return this.request({
    method: 'POST',
    path: '/api/members',
    body: member ? member : {}
  }, cb);
};
