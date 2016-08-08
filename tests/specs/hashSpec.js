(function(window) {
  'use strict';

  describe('SLURI hash tests', function() {

    it('should return the hash from instantiation', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.html#foxtrot');
      expect(sluri.hash).toBe('#foxtrot');
    });

    it('should return empty string if the hash was absent from instantiation', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.html');
      expect(sluri.hash).toBe('');
    });

    it('should update the hash', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.html');
      expect(sluri.hash).toBe('');

      sluri.hash = 'foo';
      expect(sluri.hash).toBe('#foo');

      sluri.hash = 'bar';
      expect(sluri.hash).toBe('#bar');
    });

    it('should update the hash if hash sign is used', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.html');
      expect(sluri.hash).toBe('');

      sluri.hash = '#foo';
      expect(sluri.hash).toBe('#foo');
    });

    it('should reset the hash', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.html#foo');
      expect(sluri.hash).toBe('#foo');

      sluri.hash = '';
      expect(sluri.hash).toBe('');
    });
  });
})(this);
