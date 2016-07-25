(function(window) {
  'use strict';

  describe('slURI resource path tests', function() {

    it('should return the resource path from instantiation', function() {
      var sluri = new slURI('http://www.nateyolles.com/us/en/page.html?alpha=bravo&charlie=delta');
      expect(sluri.resourcePath).toBe('/us/en/page');
    });

    it('should return the resource path from instantiation with a root URI', function() {
      var sluri = new slURI('http://www.nateyolles.com/');
      expect(sluri.resourcePath).toBe('/');
    });

    it('should return the resource path from instantiation with a root URI, no slash', function() {
      var sluri = new slURI('http://www.nateyolles.com');
      expect(sluri.resourcePath).toBe('/');
    });

    it('should not update the read-only resource path', function() {
      var sluri = new slURI('http://www.nateyolles.com/us/en/page.html?alpha=bravo&charlie=delta');
      expect(sluri.resourcePath).toBe('/us/en/page');

      sluri.resourcePath = '/fr/fr/page';
      expect(sluri.resourcePath).toBe('/us/en/page');
    });

  });
})(this);
