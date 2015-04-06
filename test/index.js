var expect = require('chai').use(require('chai-as-promised')).expect;
var fidem = require('../');

var testAccount = {
  hostname: 'dev-services.fidemapps.com',
  username: 'demo-admin',
  email: 'admin@demo.com',
  password: 'admin'
};

var methods = [];

if (typeof window !== 'undefined') {
  methods = [
    require('./methods/assignMemberToSession'),
    require('./methods/logAction'),
    require('./methods/startSession')
  ];
} else {
  methods = [
    require('./methods/assignMemberToSession'),
    require('./methods/authenticate'),
    require('./methods/createMember'),
    require('./methods/getUserByToken'),
    require('./methods/logAction'),
    require('./methods/startSession')
  ];
}

describe('Client', function () {
  describe('create a new client', function () {
    it('should extend config correctly', function () {
      var client = fidem.createClient({
        secret: 'a',
        key: 'b'
      });

      expect(client.config).to.eql({
        hostname: 'services.fidemapps.com',
        port: 80,
        protocol: 'http',
        secret: 'a',
        key: 'b'
      });
    });

    it('should use 443 if protocol is https', function () {
      var client = fidem.createClient({
        secret: 'a',
        key: 'b',
        protocol: 'https'
      });

      expect(client.config).to.eql({
        hostname: 'services.fidemapps.com',
        port: 443,
        protocol: 'https',
        secret: 'a',
        key: 'b'
      });
    });
  });

  describe('methods', function () {
    var reg = {};

    beforeEach(function () {
      reg.client = fidem.createClient({
        hostname: 'dev-services.fidemapps.com',
        key: 'DEMO-ACCESSKEY',
        secret: 'DEMO-SECRETKEY'
      });

      reg.testAccount = testAccount;
    });

    describe('#request', function () {

      if (typeof window === 'undefined') {
        require('./request/signed-request')(reg);
        require('./request/additional-headers')(reg);
        require('./request/additional-qs')(reg);
        require('./request/token-based')(reg);
      }

      describe('wrong request', function () {
        it('should return an error', function (done) {
          reg.client.request({
            method: 'POST',
            path: '/api/gamification/actions',
            body: {}
          }, function (err) {
            expect(err).to.be.instanceOf(Error);
            done();
          });
        });
      });
    });

    methods.forEach(function (method) {
      method(reg);
    });
  });
});
