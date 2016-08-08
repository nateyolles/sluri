(function(window) {
  'use strict';

  describe('SLURI selectors tests', function() {

    it('should return SLURISelectors object from instantiation', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.foo.bar.html');
      expect(sluri.selectors).toEqual(jasmine.any(Object));
      expect(sluri.selectors.constructor.name).toBe('SLURISelectors');
    });

    it('should get selector to string', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.foo.bar.html');
      expect(sluri.selectors.toString()).toBe('foo.bar');
      expect(sluri.selectors.toLocaleString()).toBe('foo.bar');
    });

    it('should return true if has selector', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.foo.bar.html');
      expect(sluri.selectors.has('foo')).toBe(true);
      expect(sluri.selectors.has('bar')).toBe(true);
    });

    it('should return false if does not has selector', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.foo.bar.html');
      expect(sluri.selectors.has('alpha')).toBe(false);
    });

    it('should return false if does not has selector in an empty instantiation', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.html');
      expect(sluri.selectors.has('alpha')).toBe(false);
    });

    it('should get array of values', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.foo.bar.html');
      expect(sluri.selectors.values()).toEqual(['foo', 'bar']);
    });

    it('should get an empty array', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.html');
      expect(sluri.selectors.values()).toEqual([]);
    });

    it('should append selectors', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.foo.bar.html');
      expect(sluri.selectors.values()).toEqual(['foo', 'bar']);
      expect(sluri.selectors.has('biz')).toBe(false);

      sluri.selectors.append('biz');
      expect(sluri.selectors.values()).toEqual(['foo', 'bar', 'biz']);
      expect(sluri.selectors.has('biz')).toBe(true);

      expect(sluri.selectors.toString()).toBe('foo.bar.biz');
      expect(sluri.selectorString).toBe('foo.bar.biz');
    });

    it('should delete selectors', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.foo.bar.html');
      expect(sluri.selectors.values()).toEqual(['foo', 'bar']);
      expect(sluri.selectors.has('foo')).toBe(true);

      sluri.selectors.delete('foo');
      expect(sluri.selectors.values()).toEqual(['bar']);
      expect(sluri.selectors.has('foo')).toBe(false);

      expect(sluri.selectors.toString()).toBe('bar');
      expect(sluri.selectorString).toBe('bar');
    });

    it('should do nothing if trying to delete non-existent selectors', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.foo.bar.html');
      expect(sluri.selectors.values()).toEqual(['foo', 'bar']);
      expect(sluri.selectors.has('foo')).toBe(true);

      sluri.selectors.delete('biz');
      expect(sluri.selectors.values()).toEqual(['foo', 'bar']);
    });

  });
})(this);


/*
SLURISelectors {}append: (selector)delete: (selector)has: (selector)toLocaleString: ()toString: ()values: (selector)__proto__: Object
a.selectors.toString()
*/