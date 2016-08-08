(function(window) {
  'use strict';

  describe('SLURI extension tests', function() {

    it('should return the extension from instantiation', function() {
      var sluri = new SLURI('http://www.nateyolles.com:4502/us/en/page.html');
      expect(sluri.extension).toBe('html');
    });

    it('should return empty string if the path absent from instantiation', function() {
      var sluri = new SLURI('http://www.nateyolles.com/');
      expect(sluri.extension).toBe('');
    });

    it('should return empty string if the path absent from instantiation', function() {
      var sluri = new SLURI('http://www.nateyolles.com');
      expect(sluri.extension).toBe('');
    });

    it('should update the extension', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.html');
      expect(sluri.extension).toBe('html');

      sluri.extension = 'json';
      expect(sluri.extension).toBe('json');
      expect(sluri.pathname).toBe('/us/en/page.json');
    });

    it("should not update the extension if there wasn't one to begin with", function() {
      var sluri = new SLURI('http://www.nateyolles.com/');
      expect(sluri.extension).toBe('');

      sluri.extension = 'json';
      expect(sluri.extension).toBe('');
    });

    it('should not update the extension if null, undefined, or empty string', function(){
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.html');
      expect(sluri.extension).toBe('html');

      sluri.extension = null;
      expect(sluri.extension).toBe('html');

      sluri.extension = undefined;
      expect(sluri.extension).toBe('html');

      sluri.extension = '';
      expect(sluri.extension).toBe('html');
    });
  });
})(this);
