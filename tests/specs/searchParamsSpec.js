(function(window) {
  'use strict';

  describe('SLURI search params tests', function() {

    it('should return SLURISearchParams object from instantiation', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.html?alpha=bravo&charlie=delta');
      expect(sluri.searchParams).toEqual(jasmine.any(Object));
      expect(sluri.searchParams.constructor.name).toBe('SLURISearchParams');
    });

    it('should ignore setting with objects that are not SLURISearchParams types', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.html?alpha=bravo&charlie=delta');
      expect(sluri.searchParams.get('alpha')).toBe('bravo');

      sluri.searchParams = {};
      expect(sluri.searchParams.get('alpha')).toBe('bravo');

      sluri.searchParams = 'foo';
      expect(sluri.searchParams.get('alpha')).toBe('bravo');

      sluri.searchParams = 123;
      expect(sluri.searchParams.get('alpha')).toBe('bravo');
    });

    it('should ignore unsetting with empty string, null and undefined', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.html?alpha=bravo&charlie=delta');
      expect(sluri.searchParams.get('alpha')).toBe('bravo');

      sluri.searchParams = '';
      expect(sluri.searchParams.get('alpha')).toBe('bravo');

      sluri.searchParams = null;
      expect(sluri.searchParams.get('alpha')).toBe('bravo');

      sluri.searchParams = undefined;
      expect(sluri.searchParams.get('alpha')).toBe('bravo');
    });

    it('upon has, should return true if it has the key', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.html?alpha=bravo&charlie=delta&echo');
      
      expect(sluri.searchParams.has('alpha')).toBe(true);
      expect(sluri.searchParams.has('echo')).toBe(true);
    });

    it("upon has, should return false if it doesn't have the key", function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.html?alpha=bravo&charlie=delta&echo');
      
      expect(sluri.searchParams.has('foxtrot')).toBe(false);
    });

    it('upon get, should return the value if it has the key', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.html?alpha=bravo&charlie=delta&echo');
      
      expect(sluri.searchParams.get('alpha')).toBe('bravo');
      expect(sluri.searchParams.get('charlie')).toBe('delta');
    });

    it("upon get, should return null if it doesn't have the key", function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.html?alpha=bravo&charlie=delta&echo');
      
      expect(sluri.searchParams.get('foxtrot')).toBe(null);
    });

    it("upon get, should return empty string if it does have the key which doesn't have a value", function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.html?alpha=bravo&charlie=delta&echo');
      
      expect(sluri.searchParams.get('echo')).toBe('');
    });

    // TODO: console long shows correct string, test shows [Object Undefined]
    it("should return the query string without the question mark", function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.html?alpha=bravo&charlie=delta&echo');
      expect(sluri.searchParams.toString()).toBe('alpha=bravo&charlie=delta&echo=');
      expect(sluri.searchParams.toLocaleString()).toBe('alpha=bravo&charlie=delta&echo=');
    });

    // TODO: console long shows correct string, test shows [Object Undefined]
    it("should return empty string with no params", function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.html');

      expect(sluri.searchParams.toString()).toBe('');
      expect(sluri.searchParams.toLocaleString()).toBe('');
    });

    it("should delete params", function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.html?alpha=bravo&charlie=delta&echo');
      expect(sluri.searchParams.get('alpha')).toBe('bravo');
      expect(sluri.searchParams.toString()).toBe('alpha=bravo&charlie=delta&echo=');
      
      sluri.searchParams.delete('alpha');
      expect(sluri.searchParams.get('alpha')).toBe(null);
      expect(sluri.searchParams.toString()).toBe('charlie=delta&echo=');

      sluri.searchParams.delete('echo');
      expect(sluri.searchParams.get('echo')).toBe(null);
      expect(sluri.searchParams.toString()).toBe('charlie=delta');
    });

    it("should set params", function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.html?alpha=bravo&charlie=delta&echo');
      expect(sluri.searchParams.get('alpha')).toBe('bravo');
      expect(sluri.searchParams.toString()).toBe('alpha=bravo&charlie=delta&echo=');
      
      sluri.searchParams.set('alpha', 'foo');
      expect(sluri.searchParams.get('alpha')).toBe('foo');
      expect(sluri.searchParams.toString()).toBe('alpha=foo&charlie=delta&echo=');

      sluri.searchParams.set('foxtrot', 'bar');
      expect(sluri.searchParams.get('foxtrot')).toBe('bar');
      expect(sluri.searchParams.toString()).toBe('alpha=foo&charlie=delta&echo=&foxtrot=bar');
    });

    it("should set multiple params", function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.html?alpha=bravo&charlie=delta&alpha=echo');
      expect(sluri.searchParams.get('alpha')).toBe('bravo');
      expect(sluri.searchParams.getAll('alpha')).toEqual(['bravo', 'echo']);
      
      sluri.searchParams.set('alpha', 'foxtrot');
      expect(sluri.searchParams.get('alpha')).toBe('foxtrot');
      expect(sluri.searchParams.getAll('alpha')).toEqual(['foxtrot']);
    });

    it("should append params", function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.html?alpha=bravo&charlie=delta&echo');
      expect(sluri.searchParams.get('alpha')).toBe('bravo');
      expect(sluri.searchParams.toString()).toBe('alpha=bravo&charlie=delta&echo=');
      
      sluri.searchParams.set('alpha', 'foo');
      expect(sluri.searchParams.get('alpha')).toBe('foo');
      expect(sluri.searchParams.toString()).toBe('alpha=foo&charlie=delta&echo=');

      sluri.searchParams.set('foxtrot', 'bar');
      expect(sluri.searchParams.get('foxtrot')).toBe('bar');
      expect(sluri.searchParams.toString()).toBe('alpha=foo&charlie=delta&echo=&foxtrot=bar');
    });

    it("should append mulitple params", function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.html?alpha=bravo&charlie=delta&echo');
      expect(sluri.searchParams.toString()).toBe('alpha=bravo&charlie=delta&echo=');
      
      sluri.searchParams.append('alpha', 'foxtrot');
      expect(sluri.searchParams.toString()).toBe('alpha=bravo&charlie=delta&echo=&alpha=foxtrot');
    });

    it("should get the first value from mulitples", function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.html?alpha=bravo&charlie=delta&alpha=echo');
      expect(sluri.searchParams.toString()).toBe('alpha=bravo&charlie=delta&alpha=echo');

      expect(sluri.searchParams.get('alpha')).toBe('bravo');
    });

    it("should get keys", function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.html?alpha=bravo&charlie=delta&echo');
      expect(sluri.searchParams.keys()).toEqual(['alpha', 'charlie', 'echo']);

      sluri.searchParams.set('foxtrot', 'bar');
      expect(sluri.searchParams.keys()).toEqual(['alpha', 'charlie', 'echo', 'foxtrot']);
    });

    it("should get values", function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.html?alpha=bravo&charlie=delta&echo');
      expect(sluri.searchParams.values()).toEqual(['bravo', 'delta', '']);

      sluri.searchParams.set('foxtrot', 'bar');
      expect(sluri.searchParams.values()).toEqual(['bravo', 'delta', '', 'bar']);
    });

    it("should get all values for a key", function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.html?alpha=bravo&alpha=foxtrot&charlie=delta&echo');
      expect(sluri.searchParams.getAll('alpha')).toEqual(['bravo', 'foxtrot']);
    });

    it("should update 'search' as well", function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.html?alpha=bravo&charlie=delta&echo');
      expect(sluri.searchParams.toString()).toBe('alpha=bravo&charlie=delta&echo=');
      expect(sluri.search).toBe('?alpha=bravo&charlie=delta&echo=');
    
      sluri.searchParams.set('alpha', 'foo');
      expect(sluri.searchParams.toString()).toBe('alpha=foo&charlie=delta&echo=');
      expect(sluri.search).toBe('?alpha=foo&charlie=delta&echo=');
    });

    it("should get null if instantiated with no params", function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.html');
      expect(sluri.searchParams.get('alpha')).toBe(null);
    });

    it("should get empty array if instantiated with no keys", function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.html');
      expect(sluri.searchParams.keys()).toEqual([]);
    });

    it("should get empty array if instantiated with no values", function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.html');
      expect(sluri.searchParams.values()).toEqual([]);
    });
  });
})(this);
