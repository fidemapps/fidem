'use strict';

// TO REPLACE WITH OPTIONAL OPTIONS (logger)

module.exports = {
    debug: function () {
        // NOOP
    },
    info: function () {
        // NOOP
    },
    error: function (msg) {
        console.log(msg);
    }
};
