'use strict';

var assert = require("chai").assert,
    signer = require('../lib/signer');

// For test inspiration see
// https://github.com/mhart/aws4/blob/master/test/fast.js
// https://github.com/aws/aws-sdk-js/blob/master/test/signers/v4.spec.coffee
//
// The difference from Amazon implementations, is we use "FIDEM4" instead of "AWS4" in authorization scheme and hmac, "X-fidem" instead of "X-aws" and "fidem4" instead of "aws4".

describe('<Unit Test>', function () {
    describe('Signer:', function () {
        it('Test generate signature', function (done) {
            var request = {
                method: 'GET',
                host: 'test.fidemapps.com',
                port: 80,
                body: '',
                path: '/api/test',
                headers: []
            };

            var signature = signer.generateSignature(request, { accessKeyId: 'API_KEY', secretAccessKey: 'SECRET_KEY'});
            console.log(signature);

            done();
        });
    });
});
