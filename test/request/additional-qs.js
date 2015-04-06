var expect = require('chai').expect;

module.exports = function (reg) {
  describe('additional query string', function () {
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

    it('should be supported', function (done) {
      reg.client.request({
        token: token,
        sign: false,
        path: '/internal/members',
        qs: {page: 1, limit: 1}
      }, function (err, res) {
        if (err) return done(err);
        expect(res.data.items.length).to.equal(1);
        done();
      });
    });

    it('should be interpreted', function (done) {
      reg.client.request({
        token: token,
        sign: false,
        path: '/internal/members',
        qs: {page: 1, limit: 2}
      }, function (err, res) {
        if (err) return done(err);
        expect(res.data.items.length).to.equal(2);
        done();
      });
    });
  });
};
