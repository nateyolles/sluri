(function(window) {
  'use strict';

  describe('SLURI href tests', function() {

    it('should return the href from instantiation', function() {
      var sluri = new SLURI('http://user:pass@www.nateyolles.com:4502/us/en/page.foo.bar.html/biz/baz?alpha=bravo&charlie=delta');
      expect(sluri.href).toBe('http://user:pass@www.nateyolles.com:4502/us/en/page.foo.bar.html/biz/baz?alpha=bravo&charlie=delta');
    });

    it('should update the protocol', function() {
      var sluri = new SLURI('http://user:pass@www.nateyolles.com:4502/us/en/page.foo.bar.html/biz/baz?alpha=bravo&charlie=delta');
      expect(sluri.href).toBe('http://user:pass@www.nateyolles.com:4502/us/en/page.foo.bar.html/biz/baz?alpha=bravo&charlie=delta');

      sluri.port = 1234;
      expect(sluri.href).toBe('http://user:pass@www.nateyolles.com:1234/us/en/page.foo.bar.html/biz/baz?alpha=bravo&charlie=delta');
    });

    it('should update the username', function() {
      var sluri = new SLURI('http://user:pass@www.nateyolles.com:4502/us/en/page.foo.bar.html/biz/baz?alpha=bravo&charlie=delta');
      expect(sluri.href).toBe('http://user:pass@www.nateyolles.com:4502/us/en/page.foo.bar.html/biz/baz?alpha=bravo&charlie=delta');

      sluri.username = 'foo';
      expect(sluri.href).toBe('http://foo:pass@www.nateyolles.com:4502/us/en/page.foo.bar.html/biz/baz?alpha=bravo&charlie=delta');
    });

    it('should update the password', function() {
      var sluri = new SLURI('http://user:pass@www.nateyolles.com:4502/us/en/page.foo.bar.html/biz/baz?alpha=bravo&charlie=delta');
      expect(sluri.href).toBe('http://user:pass@www.nateyolles.com:4502/us/en/page.foo.bar.html/biz/baz?alpha=bravo&charlie=delta');

      sluri.password = 'foo';
      expect(sluri.href).toBe('http://user:foo@www.nateyolles.com:4502/us/en/page.foo.bar.html/biz/baz?alpha=bravo&charlie=delta');
    });

    it('should update the hostname', function() {
      var sluri = new SLURI('http://user:pass@www.nateyolles.com:4502/us/en/page.foo.bar.html/biz/baz?alpha=bravo&charlie=delta');
      expect(sluri.href).toBe('http://user:pass@www.nateyolles.com:4502/us/en/page.foo.bar.html/biz/baz?alpha=bravo&charlie=delta');

      sluri.hostname = 'www.example.com';
      expect(sluri.href).toBe('http://user:pass@www.example.com:4502/us/en/page.foo.bar.html/biz/baz?alpha=bravo&charlie=delta');
    });

    it('should update the host', function() {
      var sluri = new SLURI('http://user:pass@www.nateyolles.com:4502/us/en/page.foo.bar.html/biz/baz?alpha=bravo&charlie=delta');
      expect(sluri.href).toBe('http://user:pass@www.nateyolles.com:4502/us/en/page.foo.bar.html/biz/baz?alpha=bravo&charlie=delta');

      sluri.host = 'www.example.com:1111';
      expect(sluri.href).toBe('http://user:pass@www.example.com:1111/us/en/page.foo.bar.html/biz/baz?alpha=bravo&charlie=delta');
    });

    it('should update the port', function() {
      var sluri = new SLURI('http://user:pass@www.nateyolles.com:4502/us/en/page.foo.bar.html/biz/baz?alpha=bravo&charlie=delta');
      expect(sluri.href).toBe('http://user:pass@www.nateyolles.com:4502/us/en/page.foo.bar.html/biz/baz?alpha=bravo&charlie=delta');

      sluri.port = 1111;
      expect(sluri.href).toBe('http://user:pass@www.nateyolles.com:1111/us/en/page.foo.bar.html/biz/baz?alpha=bravo&charlie=delta');
    });

    it('should update the pathname', function() {
      var sluri = new SLURI('http://user:pass@www.nateyolles.com:4502/us/en/page.foo.bar.html/biz/baz?alpha=bravo&charlie=delta');
      expect(sluri.href).toBe('http://user:pass@www.nateyolles.com:4502/us/en/page.foo.bar.html/biz/baz?alpha=bravo&charlie=delta');

      sluri.pathname = '/fr/fr/page.foo.bar.html';
      expect(sluri.href).toBe('http://user:pass@www.nateyolles.com:4502/fr/fr/page.foo.bar.html/biz/baz?alpha=bravo&charlie=delta');
    });

    it('should update the extension', function() {
      var sluri = new SLURI('http://user:pass@www.nateyolles.com:4502/us/en/page.foo.bar.html/biz/baz?alpha=bravo&charlie=delta');
      expect(sluri.href).toBe('http://user:pass@www.nateyolles.com:4502/us/en/page.foo.bar.html/biz/baz?alpha=bravo&charlie=delta');

      sluri.extension = 'json';
      expect(sluri.href).toBe('http://user:pass@www.nateyolles.com:4502/us/en/page.foo.bar.json/biz/baz?alpha=bravo&charlie=delta');
    });

  });
})(this);
