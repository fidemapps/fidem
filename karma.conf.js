module.exports = function (config) {
  config.set({
    frameworks: ['browserify', 'mocha'],
    singleRun: false,
    autoWatch: true,
    colors: true,
    reporters: ['dots'],
    browsers: ['Chrome'],
    files: [
      'test/index.js'
    ],
    preprocessors: {
      'test/**/*.js': ['browserify']
    },
    browserify: {
      debug: true
    },
    logLevel: config.LOG_ERROR
  });
};
