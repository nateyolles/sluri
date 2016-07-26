(function(window) {
  'use strict';

  describe('slURI instantiation tests', function() {
    var NOT_INSTANTIATED_ERROR = "Failed to construct 'slURI': Please use the 'new' operator, this DOM object constructor cannot be called as a function.",
        GENERAL_ERROR = "Failed to construct 'URL': Invalid URL";

    it('should throw TypeError if not instantiated with the "new" keyword', function() {
      expect(slURI.bind()).toThrowError(TypeError, NOT_INSTANTIATED_ERROR);
    });

    it('should throw TypeError if instantiated with a relative path', function() {
      expect(function(){ new slURI('/us/en/page.html') }).toThrowError(TypeError, GENERAL_ERROR);
    });

    it('should throw TypeError if instantiated with a relative path and an invalid baseURL string', function() {
      expect(function(){ new slURI('/us/en/page.html', '/foo.html') }).toThrowError(TypeError, GENERAL_ERROR);
    });

    it('should throw TypeError if instantiated with a relative path and an invalid baseURL object', function() {
      expect(function(){ new slURI('/us/en/page.html', '') }).toThrowError(TypeError, GENERAL_ERROR);
      expect(function(){ new slURI('/us/en/page.html', null) }).toThrowError(TypeError, GENERAL_ERROR);
      expect(function(){ new slURI('/us/en/page.html', undefined) }).toThrowError(TypeError, GENERAL_ERROR);
      expect(function(){ new slURI('/us/en/page.html', 123) }).toThrowError(TypeError, GENERAL_ERROR);
      expect(function(){ new slURI('/us/en/page.html', {}) }).toThrowError(TypeError, GENERAL_ERROR);
      expect(function(){ new slURI('/us/en/page.html', []) }).toThrowError(TypeError, GENERAL_ERROR);
    });

    it('should instantiate with a relative path and a valid baseURL string', function() {
      var sluri = new slURI('/us/en/page.html', 'http://www.nateyolles.com');
      expect(sluri.href).toBe('http://www.nateyolles.com/us/en/page.html');
    });

    // TODO: Isn't getting baseURL.origin
    // it('should instantiate with a relative path and a URL baseURL object', function() {
    //   var baseURL = new URL('http://www.nateyolles.com/fr/fr/index.html');
    //   var sluri = new slURI('/us/en/page.html', baseURL);
    //   expect(sluri.href).toBe('http://www.nateyolles.com/us/en/page.html');
    // });

    it('should instantiate with a relative path and an HTMLAnchorElement baseURL object', function() {
      var baseURL = document.createElement('a');
      baseURL.href = 'http://www.nateyolles.com/fr/fr/index.html';
      var sluri = new slURI('/us/en/page.html', baseURL);
      expect(sluri.href).toBe('http://www.nateyolles.com/us/en/page.html');
    });

    it('should instantiate with a relative path and a Location baseURL object', function() {
      var baseURL = Object.create(Location.prototype);
      baseURL.origin = 'http://www.nateyolles.com';
      var sluri = new slURI('/us/en/page.html', baseURL);
      expect(sluri.href).toBe('http://www.nateyolles.com/us/en/page.html');
    });

  });
})(this);
