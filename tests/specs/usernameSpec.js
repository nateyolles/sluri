(function(window) {
  'use strict';

  describe('SLURI username tests', function() {

    it('should return the username from instantiation', function() {
      var sluri = new SLURI('http://foo:bar@www.nateyolles.com:4502/us/en/page.html');
      expect(sluri.username).toBe('foo');
    });

    it('should return the empty username from instantiation', function() {
      var sluri = new SLURI('http://www.nateyolles.com:4502/us/en/page.html');
      expect(sluri.username).toBe('');
    });

    it('should update the username', function() {
      var sluri = new SLURI('http://foo:bar@www.nateyolles.com:4502/us/en/page.html');
      expect(sluri.username).toBe('foo');

      sluri.username = 'biz';
      expect(sluri.username).toBe('biz');
    });

    it('should update the username as a string', function() {
      var sluri = new SLURI('http://foo:bar@www.nateyolles.com:4502/us/en/page.html');
      expect(sluri.username).toBe('foo');

      sluri.username = 123456;
      expect(sluri.username).toBe('123456');
    });

    it('should update the username with an empty string', function() {
      var sluri = new SLURI('http://foo:bar@www.nateyolles.com:4502/us/en/page.html');
      expect(sluri.username).toBe('foo');

      sluri.username = '';
      expect(sluri.username).toBe('');
    });
  });
})(this);
