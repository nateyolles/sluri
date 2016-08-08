(function(window) {
  'use strict';

  describe('SLURI password tests', function() {

    it('should return the password from instantiation', function() {
      var sluri = new SLURI('http://foo:bar@www.nateyolles.com:4502/us/en/page.html');
      expect(sluri.password).toBe('bar');
    });

    it('should return the empty password from instantiation', function() {
      var sluri = new SLURI('http://www.nateyolles.com:4502/us/en/page.html');
      expect(sluri.password).toBe('');
    });

    it('should update the password', function() {
      var sluri = new SLURI('http://foo:bar@www.nateyolles.com:4502/us/en/page.html');
      expect(sluri.password).toBe('bar');

      sluri.password = 'biz';
      expect(sluri.password).toBe('biz');
    });

    it('should update the password as a string', function() {
      var sluri = new SLURI('http://foo:bar@www.nateyolles.com:4502/us/en/page.html');
      expect(sluri.password).toBe('bar');

      sluri.password = 123456;
      expect(sluri.password).toBe('123456');
    });

    it('should update the password with an empty string', function() {
      var sluri = new SLURI('http://foo:bar@www.nateyolles.com:4502/us/en/page.html');
      expect(sluri.password).toBe('bar');

      sluri.password = '';
      expect(sluri.password).toBe('');
    });
  });
})(this);
