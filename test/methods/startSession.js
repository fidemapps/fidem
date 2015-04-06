var expect = require('chai').expect;
var idRegexp = /^[\-_a-zA-Z0-9]{8,15}$/;

module.exports = function (reg) {
  describe('#startSession', function () {
    it('should start a new session', function (done) {
      reg.client.startSession(null, function (err, res) {
        if (err) return done(err);
        expect(res.data.id).to.match(idRegexp);
        done();
      });
    });
  });
};
