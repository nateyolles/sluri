(function(window) {
  'use strict';

  describe('SLURI pathname tests', function() {

    it('should return the pathname from instantiation', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.html?alpha=bravo&charlie=delta');
      expect(sluri.pathname).toBe('/us/en/page.html');
    });

    it('should return the pathname from instantiation with selectors', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.foo.bar.html?alpha=bravo&charlie=delta');
      expect(sluri.pathname).toBe('/us/en/page.foo.bar.html');
    });

    it('should return the pathname "/" for root', function() {
      var sluri = new SLURI('http://www.nateyolles.com');
      expect(sluri.pathname).toBe('/');
    });

    it('should return the pathname "/" for root instantiated with a slash', function() {
      var sluri = new SLURI('http://www.nateyolles.com/');
      expect(sluri.pathname).toBe('/');
    });

    it('should update the pathname with selectors', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.foo.bar.html?alpha=bravo&charlie=delta');
      expect(sluri.pathname).toBe('/us/en/page.foo.bar.html');

      sluri.pathname = '/fr/fr/page.biz.baz.html'
      expect(sluri.pathname).toBe('/fr/fr/page.biz.baz.html');
      expect(sluri.selectorString).toBe('biz.baz');
      expect(sluri.extension).toBe('html');
    });

    it('should update the pathname when selectors are updated', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.foo.bar.html?alpha=bravo&charlie=delta');
      expect(sluri.pathname).toBe('/us/en/page.foo.bar.html');

      sluri.selectors.append('qux');
      expect(sluri.pathname).toBe('/us/en/page.foo.bar.qux.html');
      expect(sluri.selectorString).toBe('foo.bar.qux');
      expect(sluri.extension).toBe('html');
    });

    it('should update the pathname with a slash', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.foo.bar.html?alpha=bravo&charlie=delta');
      expect(sluri.pathname).toBe('/us/en/page.foo.bar.html');

      sluri.pathname = '/'
      expect(sluri.pathname).toBe('/');
      expect(sluri.selectorString).toBe('');
      expect(sluri.extension).toBe('');
    });

    it('should update the pathname with a single word', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.foo.bar.html?alpha=bravo&charlie=delta');
      expect(sluri.pathname).toBe('/us/en/page.foo.bar.html');

      sluri.pathname = '/biz';
      expect(sluri.pathname).toBe('/biz');
      expect(sluri.selectorString).toBe('');
      expect(sluri.extension).toBe('');
      expect(sluri.suffix).toBe('');
    });

    it('should update the pathname with a single word no slash', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.foo.bar.html?alpha=bravo&charlie=delta');
      expect(sluri.pathname).toBe('/us/en/page.foo.bar.html');

      sluri.pathname = 'biz';
      expect(sluri.pathname).toBe('/biz');
      expect(sluri.selectorString).toBe('');
      expect(sluri.extension).toBe('');
      expect(sluri.suffix).toBe('');
    });

    it('should update the pathname without starting with a slash', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.foo.bar.html?alpha=bravo&charlie=delta');
      expect(sluri.pathname).toBe('/us/en/page.foo.bar.html');

      sluri.pathname = 'fr/fr/page.html';
      expect(sluri.pathname).toBe('/fr/fr/page.html');
      expect(sluri.selectorString).toBe('');
      expect(sluri.extension).toBe('html');
    });

    it('should update the pathname with a number', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.foo.bar.html?alpha=bravo&charlie=delta');
      expect(sluri.pathname).toBe('/us/en/page.foo.bar.html');

      sluri.pathname = 123;
      expect(sluri.pathname).toBe('/123');
      expect(sluri.selectorString).toBe('');
      expect(sluri.suffix).toBe('');
    });

    it('should update the pathname with an empty string', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.foo.bar.html?alpha=bravo&charlie=delta');
      expect(sluri.pathname).toBe('/us/en/page.foo.bar.html');

      sluri.pathname = '';
      expect(sluri.pathname).toBe('/');
      expect(sluri.selectorString).toBe('');
      expect(sluri.extension).toBe('');
    });

    it('should not update the pathname with null or undefined', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.foo.bar.html?alpha=bravo&charlie=delta');
      expect(sluri.pathname).toBe('/us/en/page.foo.bar.html');

      sluri.pathname = '/'
      expect(sluri.pathname).toBe('/');
      expect(sluri.selectorString).toBe('');
      expect(sluri.extension).toBe('');
    });

  });
})(this);
