(function(window) {
  'use strict';

  describe('SLURI hostname tests', function() {

    it('should return the hostname from instantiation without port', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.html');
      expect(sluri.hostname).toBe('www.nateyolles.com');
    });

    it('should return the hostname from instantiation with port', function() {
      var sluri = new SLURI('http://www.nateyolles.com:4502/us/en/page.html');
      expect(sluri.hostname).toBe('www.nateyolles.com');
    });

    it('should update the hostname', function() {
      var sluri = new SLURI('http://www.nateyolles.com:4502/us/en/page.html');
      expect(sluri.hostname).toBe('www.nateyolles.com');

      sluri.hostname = 'www.foobar.com';
      expect(sluri.hostname).toBe('www.foobar.com');
    });

    it('should not update the port', function() {
      var sluri = new SLURI('http://www.nateyolles.com:4502/us/en/page.html');
      expect(sluri.hostname).toBe('www.nateyolles.com');

      sluri.hostname = 'www.foobar.com:1111';
      expect(sluri.hostname).toBe('www.foobar.com');
      expect(sluri.port).toBe('4502');
    });

    it('should update the hostname with an IP address', function() {
      var sluri = new SLURI('http://www.nateyolles.com:4502/us/en/page.html');
      expect(sluri.hostname).toBe('www.nateyolles.com');

      sluri.hostname = '54.67.97.95';
      expect(sluri.hostname).toBe('54.67.97.95');
    });

    it('should update the hostname with an IP address if an integer is provided', function() {
      var sluri = new SLURI('http://www.nateyolles.com:4502/us/en/page.html');
      expect(sluri.hostname).toBe('www.nateyolles.com');

      sluri.hostname = '910385503';
      expect(sluri.hostname).toBe('54.67.97.95');

      sluri.hostname = 910385503;
      expect(sluri.hostname).toBe('54.67.97.95');
    });

    it('should not update when provided empty string, null or undefined', function() {
      var sluri = new SLURI('http://www.nateyolles.com:4502/us/en/page.html');
      expect(sluri.hostname).toBe('www.nateyolles.com');

      sluri.hostname = '';
      expect(sluri.hostname).toBe('www.nateyolles.com');

      sluri.hostname = null;
      expect(sluri.hostname).toBe('www.nateyolles.com');

      sluri.hostname = undefined;
      expect(sluri.hostname).toBe('www.nateyolles.com');
    });

    it('should also update host', function() {
      var sluri = new SLURI('http://www.nateyolles.com:4502/us/en/page.html');
      expect(sluri.hostname).toBe('www.nateyolles.com');
      expect(sluri.host).toBe('www.nateyolles.com:4502');

      sluri.hostname = 'www.foo.com';
      expect(sluri.hostname).toBe('www.foo.com');
      expect(sluri.host).toBe('www.foo.com:4502');
    });
  });
})(this);
