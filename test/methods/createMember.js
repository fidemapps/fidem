var expect = require('chai').expect;
var idRegexp = /^[\-_a-zA-Z0-9]{8,15}$/;

module.exports = function (reg) {
  describe('#createMember', function () {
    it('create a new member', function (done) {
      reg.client.createMember({account_id: 'demo'}, function (err, res) {
        if (err) return done(err);
        expect(res.data.id).to.match(idRegexp);
        done();
      });
    });
  });
};
