var expect = require('chai').expect;

module.exports = function (reg) {
  describe('with a token based request', function () {
    var token;

    beforeEach(function (done) {
      // Authenticate to get a valid token.
      reg.client.authenticate({
        username: reg.testAccount.email,
        password: reg.testAccount.password
      }, function (err, res) {
        if (err) return done(err);
        token = res.data.token;
        done();
      });
    });

    it('should return the members', function (done) {
      reg.client.request({
        token: token,
        sign: false,
        path: '/internal/members'
      }, function (err, res) {
        if (err) return done(err);
        expect(res.status).to.equal('success');
        done();
      });
    });
  });
};
