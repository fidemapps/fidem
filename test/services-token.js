'use strict';

var assert = require("chai").assert,
    fidemTokenServices = require('../index').tokenServices;

var sessionToken;

describe('<Integration Test>', function () {
    describe('Fidem Token Services:', function () {
        beforeEach(function (done) {
            fidemTokenServices.authenticate('demo@fidemapps.com', 'demo').then(function (results) {
                assert.equal(200, results.statusCode);

                sessionToken = results.body.token;
                assert.isNotNull(sessionToken);
                assert.isDefined(sessionToken);
                done();
            }).catch(function (err) {
                done(err);
            });
        });

        describe('Gets user information by token', function () {
            it('Example', function (done) {
                fidemTokenServices.getUserByToken(sessionToken).then(function (results) {
                    assert.equal(200, results.statusCode);
                    assert.equal('demo', results.body.username);
                    done();
                }).catch(function (err) {
                    done(err);
                });
            });
        });
    });
});
