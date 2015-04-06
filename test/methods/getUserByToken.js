var expect = require('chai').expect;

module.exports = function (reg) {
  describe('#getUserByToken', function () {
    var token;

    beforeEach(function (done) {
      // Authenticate to get a valid token.
      reg.client.authenticate({
        username: reg.testAccount.email,
        password: reg.testAccount.password
      }, function (err, res) {
        if (err) return done();
        token = res.data.token;
        done();
      });
    });

    it('should return the user', function (done) {
      reg.client.getUserByToken(token, function (err, user) {
        if (err) return done(err);
        expect(user.data).to.have.property('email', reg.testAccount.email);
        done();
      });
    });
  });
};
