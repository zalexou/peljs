'use strict';

describe('pel.version module', function() {
  beforeEach(module('pel.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
