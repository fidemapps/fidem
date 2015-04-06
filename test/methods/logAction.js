var expect = require('chai').use(require('chai-as-promised')).expect;

module.exports = function (reg) {
  describe('#logAction', function () {
    it('should log action', function (done) {
      expect(reg.client.logAction({
        type: 'viewShow',
        data: {
          id: 'show1',
          name: 'The Big Show'
        }
      })).to.eventually.have.property('status').notify(done);
    });
  });
};
