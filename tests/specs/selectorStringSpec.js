(function(window) {
  'use strict';

  describe('SLURI selector string tests', function() {

    it('should return the selector string from instantiation', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.foo.bar.html');
      expect(sluri.selectorString).toBe('foo.bar');
    });

    it('should return empty string if the selector string was absent from instantiation', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.html');
      expect(sluri.selectorString).toBe('');
    });

    it('should update the selector string', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.html');
      expect(sluri.selectorString).toBe('');

      sluri.selectorString = 'foo.bar';
      expect(sluri.selectorString).toBe('foo.bar');
    });

    it('should remove the selector string', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.foo.bar.html');
      expect(sluri.selectorString).toBe('foo.bar');

      sluri.selectorString = '';
      expect(sluri.selectorString).toBe('');
    });

    it('should not update the selector string with null or undefined', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.foo.bar.html');
      expect(sluri.selectorString).toBe('foo.bar');

      sluri.selectorString = null;
      expect(sluri.selectorString).toBe('foo.bar');

      sluri.selectorString = undefined;
      expect(sluri.selectorString).toBe('foo.bar');
    });

    it('should update selectors as well', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.foo.bar.html');
      expect(sluri.selectorString).toBe('foo.bar');
      expect(sluri.selectors.values()).toEqual(['foo', 'bar']);

      sluri.selectorString = 'alpha.bravo';
      expect(sluri.selectorString).toBe('alpha.bravo');
      expect(sluri.selectors.values()).toEqual(['alpha', 'bravo']);

      sluri.selectorString = '';
      expect(sluri.selectorString).toBe('');
      expect(sluri.selectors.values()).toEqual([]);
    });
  });
})(this);
