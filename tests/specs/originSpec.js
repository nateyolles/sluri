(function(window) {
  'use strict';

  describe('SLURI origin tests', function() {

    it('should return the origin from instantiation without port', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.html');
      expect(sluri.origin).toBe('http://www.nateyolles.com');
    });

    it('should return the origin from instantiation with port', function() {
      var sluri = new SLURI('http://www.nateyolles.com:4502/us/en/page.html');
      expect(sluri.origin).toBe('http://www.nateyolles.com:4502');
    });

    it('should return the origin from instantiation with IP address', function() {
      var sluri = new SLURI('http://54.67.97.95:4502/us/en/page.html');
      expect(sluri.origin).toBe('http://54.67.97.95:4502');
    });

    it('should not update as origin is read-only', function() {
      var sluri = new SLURI('http://www.nateyolles.com:4502/us/en/page.html');
      expect(sluri.origin).toBe('http://www.nateyolles.com:4502');

      sluri.origin = 'http://www.foo.com:1111';
      expect(sluri.origin).toBe('http://www.nateyolles.com:4502');
    });
  });
})(this);
