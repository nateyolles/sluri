(function(window) {
  'use strict';

  describe('slURI instantiation tests', function() {

    it('should throw TypeError if not instantiated with the "new" keyword', function() {
      expect(slURI.bind()).toThrowError(TypeError, "Failed to construct 'slURI': " +
                                                  "Please use the 'new' operator, this DOM " +
                                                  "object constructor cannot be called as a function.");
    });

  });
})(this);
