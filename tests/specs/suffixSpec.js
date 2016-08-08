(function(window) {
  'use strict';

  describe('SLURI suffix tests', function() {

    it('should return the suffix from instantiation', function() {
      var sluri = new SLURI('http://www.nateyolles.com:4502/us/en/page.foo.bar.html/biz/baz?alpha=bravo&charlie=delta');
      expect(sluri.suffix).toBe('/biz/baz');
    });

    it('should return the suffix from instantiation without a suffix', function() {
      var sluri = new SLURI('http://www.nateyolles.com:4502/us/en/page.foo.bar.html?alpha=bravo&charlie=delta');
      expect(sluri.suffix).toBe('');
    });

    it('should update the suffix if one already exists', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.foo.bar.html/biz/baz');
      expect(sluri.suffix).toBe('/biz/baz');

      sluri.suffix = '/foo/bar';
      expect(sluri.suffix).toBe('/foo/bar');
    });

    it("should update the suffix if one doesn't exist", function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.foo.bar.html');
      expect(sluri.suffix).toBe('');

      sluri.suffix = '/foo/bar';
      expect(sluri.suffix).toBe('/foo/bar');
    });

    it("should remove the suffix if set to empty string", function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.foo.bar.html/biz/baz');
      expect(sluri.suffix).toBe('/biz/baz');

      sluri.suffix = '';
      expect(sluri.suffix).toBe('');
    });

    it("should not update the suffix if set to null or undefined", function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.foo.bar.html/biz/baz');
      expect(sluri.suffix).toBe('/biz/baz');

      sluri.suffix = null;
      expect(sluri.suffix).toBe('/biz/baz');

      sluri.suffix = undefined;
      expect(sluri.suffix).toBe('/biz/baz');
    });

  });
})(this);
