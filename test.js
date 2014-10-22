var expect = require('chai').use(require('chai-as-promised')).expect;
var fidem = require('./');

var idRegexp = /^[\-_a-zA-Z0-9]{9,15}$/;

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
        key: 'b',
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
        key: 'b',
      });
    });
  });

  describe('methods', function () {
    var client;

    beforeEach(function () {
      client = fidem.createClient({
        key: 'DEMO-ACCESSKEY',
        secret: 'DEMO-SECRETKEY'
      });
    });

    describe('#authenticate', function () {
      it('should return a token', function (done) {
        client.authenticate({
          username: 'demo@fidemapps.com',
          password: 'demo'
        }, function (err, res) {
          if (err) return done(err);
          expect(res.token).to.match(idRegexp);
          expect(res.user).to.exist;
          done();
        });
      });
    });

    describe('#request', function () {
      describe('with a signed request', function () {
        it('should return an error if the key or secret is missing', function () {
          client = fidem.createClient();
          expect(client.request({
            path: '/api/gamification/actions',
          })).to.be.rejectedWith(Error, 'Signed query required key/secret.');

          client = fidem.createClient({
            key: 'xx'
          });
          expect(client.request({
            path: '/api/gamification/actions',
          })).to.be.rejectedWith(Error, 'Signed query required key/secret.');

          client = fidem.createClient({
            secret: 'xx'
          });
          expect(client.request({
            path: '/api/gamification/actions',
          })).to.be.rejectedWith(Error, 'Signed query required key/secret.');
        });

        it('should not return an error', function (done) {
          expect(client.request({
            method: 'POST',
            path: '/api/gamification/actions',
            body: {
              type: 'viewShow',
              data: {
                id: 'show1',
                name: 'The Big Show'
              }
            }
          })).to.eventually.have.property('id').notify(done);
        });

        it('should support node callback', function (done) {
          client.request({
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
            expect(res).to.have.property('id');
            done();
          });
        });
      });

      describe('additional headers', function () {
        var token;

        beforeEach(function (done) {
          // Authenticate to get a valid token.
          client.authenticate({
            username: 'demo@fidemapps.com',
            password: 'demo'
          }, function (err, res) {
            if (err) return done();
            token = res.token;
            done();
          });
        });

        it('should be supported', function (done) {
          client.request({
            headers: {
              'X-Fidem-SessionToken': token
            },
            sign: false,
            path: '/internal/accounts'
          }, function (err, res) {
            if (err) return done(err);
            expect(res[0].id).to.equal('demo');
            done();
          });
        });
      });

      describe('with a token based request', function () {
        var token;

        beforeEach(function (done) {
          // Authenticate to get a valid token.
          client.authenticate({
            username: 'demo@fidemapps.com',
            password: 'demo'
          }, function (err, res) {
            if (err) return done();
            token = res.token;
            done();
          });
        });

        it('should return the user', function (done) {
          client.request({
            token: token,
            sign: false,
            path: '/internal/accounts'
          }, function (err, res) {
            if (err) return done(err);
            expect(res[0].id).to.equal('demo');
            done();
          });
        });
      });

      describe('wrong request', function () {
        it('should return an error', function (done) {
          client.request({
            method: 'POST',
            path: '/api/gamification/actions',
            body: {}
          }, function (err) {
            expect(err).to.be.instanceOf(Error);
            expect(err.body).to.have.property('error', 'Cannot save the action log');
            done();
          });
        });
      });
    });

    describe('#getUserByToken', function () {
      var token;

      beforeEach(function (done) {
        // Authenticate to get a valid token.
        client.authenticate({
          username: 'demo@fidemapps.com',
          password: 'demo'
        }, function (err, res) {
          if (err) return done();
          token = res.token;
          done();
        });
      });

      it('should return the user', function (done) {
        client.getUserByToken(token, function (err, user) {
          if (err) return done(err);
          expect(user).to.have.property('username', 'demo');
          expect(user).to.have.property('email', 'demo@fidemapps.com');
          done();
        });
      });
    });

    describe('#logAction', function () {
      it('should log action', function (done) {
        expect(client.logAction({
          type: 'viewShow',
          data: {
            id: 'show1',
            name: 'The Big Show'
          }
        })).to.eventually.have.property('id').notify(done);
      });
    });

    describe('#createMember', function () {
      it('create a new member', function (done) {
        client.createMember('demo', function (err, res) {
          if (err) return done(err);
          expect(res.id).to.match(idRegexp);
          done();
        });
      });
    });

    describe('#startSession', function () {
      it('should start a new session', function (done) {
        client.startSession(null, function (err, res) {
          if (err) return done(err);
          expect(res.id).to.match(idRegexp);
          done();
        });
      });
    });

    describe('#assignMemberToSession', function () {
      var sessionId, memberId;

      beforeEach(function (done) {
        client.startSession(null, function (err, res) {
          if (err) return done(err);
          sessionId = res.id;
          done();
        });
      });

      beforeEach(function (done) {
        client.createMember('demo', function (err, res) {
          if (err) return done(err);
          memberId = res.id;
          done();
        });
      });

      it('should add a member to a session', function (done) {
        client.assignMemberToSession(memberId, sessionId, function (err, res) {
          if (err) return done(err);
          expect(res.id).to.equal(sessionId);
          done();
        });
      });
    });
  });
});
