let expect = require('chai').expect;

// This is to prevent p5.prototype calls from causing mocha to
// throw errors.
global.p5 = null;

let touchgui = require('../lib/p5.touchgui.js');

describe('p5.touchgui', function() {
  it('should work!', function() {
    expect(true).to.be.true;
  })
});