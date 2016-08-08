(function(window) {
  'use strict';

  describe('SLURI resource path tests', function() {

    it('should return the resource path from instantiation', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.html?alpha=bravo&charlie=delta');
      expect(sluri.resourcePath).toBe('/us/en/page');
    });

    it('should return the resource path from instantiation with a root URI', function() {
      var sluri = new SLURI('http://www.nateyolles.com/');
      expect(sluri.resourcePath).toBe('/');
    });

    it('should return the resource path from instantiation with a root URI, no slash', function() {
      var sluri = new SLURI('http://www.nateyolles.com');
      expect(sluri.resourcePath).toBe('/');
    });

    it('should update the resource path', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.html?alpha=bravo&charlie=delta');
      expect(sluri.resourcePath).toBe('/us/en/page');

      sluri.resourcePath = '/fr/fr/page';
      expect(sluri.resourcePath).toBe('/fr/fr/page');
      expect(sluri.pathname).toBe('/fr/fr/page.html');
      expect(sluri.extension).toBe('html');
    });

  });
})(this);
