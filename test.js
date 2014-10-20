var expect = require('chai').use(require('chai-as-promised')).expect;
var fidem = require('./');

var idRegexp = /^[\-_a-zA-Z0-9]{9,15}$/;

describe('Client', function () {
  describe('create a new client', function () {
    it('should throw error if a property is missing', function () {
      expect(function createWithNothing() {
        fidem.createClient();
      }).to.throw('API key not provided.');

      expect(function createWithoutSecret() {
        fidem.createClient({
          key: 'xx'
        });
      }).to.throw('API secret not provided.');
    });

    it('should extend config correctly', function () {
      var client = fidem.createClient({
        secret: 'a',
        key: 'b'
      });

      expect(client.config).to.eql({
        hostname: 'services.fidemapps.com',
        port: 80,
        secret: 'a',
        key: 'b'
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
        expect(client.authenticate({
          username: 'demo@fidemapps.com',
          password: 'demo'
        })).to.eventually.match(idRegexp).notify(done);
      });

      it('should support node callback', function (done) {
        client.authenticate({
          username: 'demo@fidemapps.com',
          password: 'demo'
        }, function (err, token) {
          if (err) return done(err);
          expect(token).to.match(idRegexp);
          done();
        });
      });
    });

    describe('#request', function () {
      describe('with a signed request', function () {
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

      describe('with a token based request', function () {
        var token;

        beforeEach(function (done) {
          // Authenticate to get a valid token.
          client.authenticate({
            username: 'demo@fidemapps.com',
            password: 'demo'
          }, function (err, _token) {
            if (err) return done();
            token = _token;
            done();
          });
        });

        it('should return the user', function (done) {
          client.request({
            token: token,
            sign: false,
            path: '/internal/security/user/' + token
          }, function (err, user) {
            if (err) return done(err);
            expect(user).to.have.property('username', 'demo');
            expect(user).to.have.property('email', 'demo@fidemapps.com');
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
        }, function (err, _token) {
          if (err) return done();
          token = _token;
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
