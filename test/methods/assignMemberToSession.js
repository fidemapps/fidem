var expect = require('chai').expect;

module.exports = function (reg) {
  describe('#assignMemberToSession', function () {
    var sessionId, memberId;

    beforeEach(function (done) {
      reg.client.startSession(null, function (err, res) {
        if (err) return done(err);
        sessionId = res.data.id;
        done();
      });
    });

    beforeEach(function (done) {
      reg.client.createMember({}, function (err, res) {
        if (err) return done(err);
        memberId = res.data.id;
        done();
      });
    });

    it('should add a member to a session', function (done) {
      reg.client.assignMemberToSession(memberId, sessionId, function (err, res) {
        if (err) return done(err);
        expect(res.data.id).to.equal(sessionId);
        done();
      });
    });
  });
};
