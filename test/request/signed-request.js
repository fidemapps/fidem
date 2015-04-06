var expect = require('chai').use(require('chai-as-promised')).expect;
var fidem = require('../../');

module.exports = function (reg) {
  describe('with a signed request', function () {
    it('should return an error if the key or secret is missing', function () {
      var client;

      client = fidem.createClient();
      expect(client.request({
        path: '/api/gamification/actions'
      })).to.be.rejectedWith(Error, 'Signed query required key/secret.');

      client = fidem.createClient({
        key: 'xx'
      });
      expect(client.request({
        path: '/api/gamification/actions'
      })).to.be.rejectedWith(Error, 'Signed query required key/secret.');

      client = fidem.createClient({
        secret: 'xx'
      });
      expect(client.request({
        path: '/api/gamification/actions'
      })).to.be.rejectedWith(Error, 'Signed query required key/secret.');
    });

    it('should not return an error', function (done) {
      expect(reg.client.request({
        method: 'POST',
        path: '/api/gamification/actions',
        body: {
          type: 'viewShow',
          data: {
            id: 'show1',
            name: 'The Big Show'
          }
        }
      })).to.eventually.have.property('status').notify(done);
    });

    it('should support node callback', function (done) {
      reg.client.request({
        method: 'POST',
        path: '/api/gamification/actions',
        body: {
          type: 'viewShow',
          data: {
            id: 'show1',
            name: 'The Big Show'
          }
        }
      }, function (err, res) {
        if (err) return done();
        expect(res).to.have.property('status', 'success');
        done();
      });
    });
  });
};
