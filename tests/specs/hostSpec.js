(function(window) {
  'use strict';

  describe('SLURI host tests', function() {

    it('should return the host from instantiation without port', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.html');
      expect(sluri.host).toBe('www.nateyolles.com');
    });

    it('should return the host with port from instantiation with port', function() {
      var sluri = new SLURI('http://www.nateyolles.com:4502/us/en/page.html');
      expect(sluri.host).toBe('www.nateyolles.com:4502');
    });

    it('should update host without port', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.html');
      expect(sluri.host).toBe('www.nateyolles.com');

      sluri.host = 'www.foobar.com';
      expect(sluri.host).toBe('www.foobar.com');
    });

    it('should update host with port', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.html');
      expect(sluri.host).toBe('www.nateyolles.com');

      sluri.host = 'www.foobar.com:4502';
      expect(sluri.host).toBe('www.foobar.com:4502');
    });

    it('should update host and retain port when not provided with a new port', function() {
      var sluri = new SLURI('http://www.nateyolles.com:4502/us/en/page.html');
      expect(sluri.host).toBe('www.nateyolles.com:4502');

      sluri.host = 'www.foobar.com';
      expect(sluri.host).toBe('www.foobar.com:4502');
    });

    it('should update host and port when provided with a new port', function() {
      var sluri = new SLURI('http://www.nateyolles.com:4502/us/en/page.html');
      expect(sluri.host).toBe('www.nateyolles.com:4502');

      sluri.host = 'www.foobar.com:1111';
      expect(sluri.host).toBe('www.foobar.com:1111');
    });

    it('should not update when provided empty string, null or undefined', function() {
      var sluri = new SLURI('http://www.nateyolles.com:4502/us/en/page.html');
      expect(sluri.host).toBe('www.nateyolles.com:4502');

      sluri.host = '';
      expect(sluri.host).toBe('www.nateyolles.com:4502');

      sluri.host = null;
      expect(sluri.host).toBe('www.nateyolles.com:4502');

      sluri.host = undefined;
      expect(sluri.host).toBe('www.nateyolles.com:4502');
    });

    it('should also update hostname', function() {
      var sluri = new SLURI('http://www.nateyolles.com:4502/us/en/page.html');
      expect(sluri.host).toBe('www.nateyolles.com:4502');
      expect(sluri.hostname).toBe('www.nateyolles.com');

      sluri.host = 'www.foo.com';
      expect(sluri.host).toBe('www.foo.com:4502');
      expect(sluri.hostname).toBe('www.foo.com');

      sluri.host = 'www.bar.com:1111';
      expect(sluri.host).toBe('www.bar.com:1111');
      expect(sluri.hostname).toBe('www.bar.com');
    });
  });
})(this);
