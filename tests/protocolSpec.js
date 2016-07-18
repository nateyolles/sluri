(function(window) {
  'use strict';

  describe('slURI protocol tests', function() {

    it('should return the http protocol from instantiation', function() {
      var sluri = new slURI('http://www.nateyolles.com:4502/us/en/page.html');
      expect(sluri.protocol).toBe('http:');
    });

    it('should return the https protocol from instantiation', function() {
      var sluri = new slURI('https://www.nateyolles.com:4502/us/en/page.html');
      expect(sluri.protocol).toBe('https:');
    });

    it('should update the protocol without passing in a colon', function() {
      var sluri = new slURI('http://www.nateyolles.com:4502/us/en/page.html');
      expect(sluri.protocol).toBe('http:');

      sluri.protocol = 'ftp';
      expect(sluri.protocol).toBe('ftp:');
    });

    it('should update the protocol with passing in a colon', function() {
      var sluri = new slURI('http://www.nateyolles.com:4502/us/en/page.html');
      expect(sluri.protocol).toBe('http:');

      sluri.protocol = 'ftp:';
      expect(sluri.protocol).toBe('ftp:');
    });

    it('should not update the protocol with numbers or special characters', function() {
      var sluri = new slURI('http://www.nateyolles.com:4502/us/en/page.html');
      expect(sluri.protocol).toBe('http:');

      sluri.protocol = 'alpha9';
      expect(sluri.protocol).toBe('http:');

      sluri.protocol = 'al_pha';
      expect(sluri.protocol).toBe('http:');
    });

    it('should update the protocol with a dash', function() {
      var sluri = new slURI('http://www.nateyolles.com:4502/us/en/page.html');
      expect(sluri.protocol).toBe('http:');

      sluri.protocol = 'al-pha';
      expect(sluri.protocol).toBe('al-pha:');

      sluri.protocol = 'al-pha:';
      expect(sluri.protocol).toBe('al-pha:');
    });

    it('should not update the protocol with undefined, null or empty string', function() {
      var sluri = new slURI('http://www.nateyolles.com:4502/us/en/page.html');
      expect(sluri.protocol).toBe('http:');

      sluri.protocol = null;
      expect(sluri.protocol).toBe('http:');

      sluri.protocol = undefined;
      expect(sluri.protocol).toBe('http:');

      sluri.protocol = '';
      expect(sluri.protocol).toBe('http:');
    });
  });
})(this);
