var expect = require('chai').expect;
var idRegexp = /^[\-_a-zA-Z0-9]{8,15}$/;

module.exports = function (reg) {
  describe('#authenticate', function () {
    it('should return a token', function (done) {
      reg.client.authenticate({
        username: reg.testAccount.email,
        password: reg.testAccount.password
      }, function (err, res) {
        if (err) return done(err);
        expect(res.data.token).to.match(idRegexp);
        expect(res.data.user).to.exist;
        done();
      });
    });
  });
};
