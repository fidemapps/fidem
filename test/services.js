'use strict';

var assert = require("chai").assert,
    fidemServices = require('../index').services;

describe('<Integration Test>', function () {
    describe('Fidem Services:', function () {
        describe('Logs an action', function () {
            it('Example', function (done) {
                fidemServices.logAction({
                    type: 'viewShow',
                    data: {
                        id: 'show1',
                        name: 'The Big Show'
                    }
                }).then(function (results) {
                    assert.equal(200, results.statusCode);
                    assert.isNotNull(results.body.id);
                    done();
                }).catch(function (err) {
                    done(err);
                });
            });
        });
    });
});
