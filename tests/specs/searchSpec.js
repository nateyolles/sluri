(function(window) {
  'use strict';

  describe('SLURI search tests', function() {

    it('should return the search from instantiation', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.html?alpha=bravo&charlie=delta');
      expect(sluri.search).toBe('?alpha=bravo&charlie=delta');
    });

    it("it should return empty string if there isn't a search string", function() {
      var sluri = new SLURI('http://www.nateyolles.com:4502/us/en/page.html');
      expect(sluri.search).toBe('');
    });

    it("it should format a parameter with an equals sign even without a value", function() {
      var sluri = new SLURI('http://www.nateyolles.com:4502/us/en/page.html?alpha=bravo&charlie');
      expect(sluri.search).toBe('?alpha=bravo&charlie=');

      sluri.search = '?delta&echo=foxtrot';
      expect(sluri.search).toBe('?delta=&echo=foxtrot');
    });

    it('should update the search with a single string', function() {
      var sluri = new SLURI('http://www.nateyolles.com:4502/us/en/page.html?alpha=bravo');
      expect(sluri.search).toBe('?alpha=bravo');

      sluri.search = 'charlie';
      expect(sluri.search).toBe('?charlie=');
    });

    it('should update the search with a number', function() {
      var sluri = new SLURI('http://www.nateyolles.com:4502/us/en/page.html?alpha=bravo');
      expect(sluri.search).toBe('?alpha=bravo');

      sluri.search = 123;
      expect(sluri.search).toBe('?123=');

      sluri.search = 123.45;
      expect(sluri.search).toBe('?123.45=');
    });

    it('should not remove the search when provided empty string', function() {
      var sluri = new SLURI('http://www.nateyolles.com:4502/us/en/page.html?alpha=bravo');
      expect(sluri.search).toBe('?alpha=bravo');
    });

    it('should update the search', function() {
      var sluri = new SLURI('http://www.nateyolles.com:4502/us/en/page.html?alpha=bravo');
      expect(sluri.search).toBe('?alpha=bravo');

      sluri.search = '?charlie=delta'
      expect(sluri.search).toBe('?charlie=delta');

      sluri.search = '?echo=foxtrot&golf'
      expect(sluri.search).toBe('?echo=foxtrot&golf=');
    });

    it('should not update when provided null or undefined', function() {
      var sluri = new SLURI('http://www.nateyolles.com:4502/us/en/page.html?alpha=bravo');
      expect(sluri.search).toBe('?alpha=bravo');

      sluri.search = null;
      expect(sluri.search).toBe('?alpha=bravo');

      sluri.search = undefined;
      expect(sluri.search).toBe('?alpha=bravo');
    });
  });
})(this);
