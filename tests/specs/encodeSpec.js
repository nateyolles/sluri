(function(window) {
  'use strict';

  /**
   * Encode URI string to RFC 3986 specification
   *
   * Replace all characters except the following with the appropriate UTF-8
   * escape sequences:
   *
   *   Reserved characters     ; , / ? : @ & = + $
   *   Unescaped characters    alphabetic, decimal digits, - _ . ! ~ * ' ( )
   *   Number sign             #
   *
   * @function
   * @private
   * @param {string} The string to encode
   * @returns {string} The encoded string
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI
   */
  function fixedEncodeURI(str) {
      return encodeURI(str).replace(/%5B/g, '[').replace(/%5D/g, ']');
  }

  /**
   * Encode URI component string to RFC 3986 specification
   *
   * Escapes all characters except the following:
   * 
   *   alphabetic, decimal digits, - _ . ! ~ * ' ( )
   *
   * @function
   * @private
   * @param {string} The string to encode
   * @returns {string} The encoded string
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent}
   */
  function fixedEncodeURIComponent(str) {
      return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
          return '%' + c.charCodeAt(0).toString(16);
      });
  }

  var SPECIAL_CHARACTERS = ' %^{}[]\'"\\*$();,',
      ENCODED_CHARACTERS = fixedEncodeURI(SPECIAL_CHARACTERS),
      ENCODED_COMPONENT_CHARACTERS = fixedEncodeURIComponent(SPECIAL_CHARACTERS);

  describe('SLURI encode and decode URI tests', function() {

    it('should encode username on instantiation', function() {
      var sluri = new SLURI('http://user' + SPECIAL_CHARACTERS + 'name:password@www.nateyolles.com/us/en/page.html');
      expect(sluri.username).toBe('user' + ENCODED_CHARACTERS + 'name');
    });

    it('should encode username on update', function() {
      var sluri = new SLURI('http://username:password@www.nateyolles.com/us/en/page.html');
      expect(sluri.username).toBe('username');

      sluri.username = 'foo' + SPECIAL_CHARACTERS + 'bar';
      expect(sluri.username).toBe('foo' + ENCODED_CHARACTERS + 'bar');
    });

    it('should encode password on instantiation', function() {
      var sluri = new SLURI('http://username:pass' + SPECIAL_CHARACTERS + 'word@www.nateyolles.com/us/en/page.html');
      expect(sluri.password).toBe('pass' + ENCODED_CHARACTERS + 'word');
    });

    it('should encode password on update', function() {
      var sluri = new SLURI('http://username:password@www.nateyolles.com/us/en/page.html');
      expect(sluri.password).toBe('password');

      sluri.password = 'foo' + SPECIAL_CHARACTERS + 'bar';
      expect(sluri.password).toBe('foo' + ENCODED_CHARACTERS + 'bar');
    });

    it('should encode hostname on instantiation', function() {
      var sluri = new SLURI('http://www.nate' + SPECIAL_CHARACTERS + 'yolles.com');
      expect(sluri.href).toBe('http://www.nate' + ENCODED_CHARACTERS + 'yolles.com/');
      expect(sluri.origin).toBe('http://www.nate' + ENCODED_CHARACTERS + 'yolles.com');
      expect(sluri.hostname).toBe('www.nate' + ENCODED_CHARACTERS + 'yolles.com');
      expect(sluri.host).toBe('www.nate' + ENCODED_CHARACTERS + 'yolles.com');
      expect(sluri.pathname).toBe('/');
    });

    it('should encode hostname on update', function() {
      var sluri = new SLURI('http://www.nateyolles.com');
      expect(sluri.hostname).toBe('www.nateyolles.com');
      
      sluri.hostname = 'www.foo' + SPECIAL_CHARACTERS + 'bar.com';
      expect(sluri.hostname).toBe('www.foo' + ENCODED_CHARACTERS + 'bar.com');
    });

    it('should encode pathname on instantiation', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/' + SPECIAL_CHARACTERS + '/en/page.html');
      expect(sluri.href).toBe('http://www.nateyolles.com/us/' + ENCODED_CHARACTERS + '/en/page.html');
      expect(sluri.hostname).toBe('www.nateyolles.com');
      expect(sluri.host).toBe('www.nateyolles.com');
      expect(sluri.pathname).toBe('/us/' + ENCODED_CHARACTERS + '/en/page.html');
      expect(sluri.extension).toBe('html');
    });

    it('should encode pathname on update', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.html');
      expect(sluri.pathname).toBe('/us/en/page.html');
      
      sluri.pathname = '/foo' + SPECIAL_CHARACTERS + 'bar.html';
      expect(sluri.pathname).toBe('/foo' + ENCODED_CHARACTERS + 'bar.html');
    });

    it('should retrieve selectors unencoded and search string encoded on instantiation', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.' + SPECIAL_CHARACTERS + '.html');
      expect(sluri.href).toBe('http://www.nateyolles.com/us/en/page.' + ENCODED_CHARACTERS + '.html');

      expect(sluri.selectors.has(SPECIAL_CHARACTERS)).toBe(true);
      expect(sluri.selectors.has(ENCODED_CHARACTERS)).toBe(false);

      expect(sluri.pathname).toBe('/us/en/page.' + ENCODED_CHARACTERS + '.html');
      expect(sluri.selectors.toString()).toBe(ENCODED_CHARACTERS);
      expect(sluri.selectorString).toBe(ENCODED_CHARACTERS);
      expect(sluri.resourcePath).toBe('/us/en/page');
      expect(sluri.extension).toBe('html');
    });

    it('should retrieve selectors unencoded and search string encoded on update', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.foo.html');
      sluri.selectors.append(SPECIAL_CHARACTERS);

      expect(sluri.selectors.has(SPECIAL_CHARACTERS)).toBe(true);
      expect(sluri.selectors.has(ENCODED_CHARACTERS)).toBe(false);

      expect(sluri.pathname).toBe('/us/en/page.foo.' + ENCODED_CHARACTERS + '.html');
      expect(sluri.selectors.toString()).toBe('foo.' + ENCODED_CHARACTERS);
      expect(sluri.selectorString).toBe('foo.' + ENCODED_CHARACTERS);
      expect(sluri.resourcePath).toBe('/us/en/page');
      expect(sluri.extension).toBe('html');
    });

    it('should encode extension on instantiation', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.ht' + SPECIAL_CHARACTERS + 'ml');
      expect(sluri.href).toBe('http://www.nateyolles.com/us/en/page.ht' + ENCODED_CHARACTERS + 'ml');
      expect(sluri.pathname).toBe('/us/en/page.ht' + ENCODED_CHARACTERS + 'ml');
      expect(sluri.extension).toBe('ht' + ENCODED_CHARACTERS + 'ml');
    });

    it('should encode extension on update', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.html');
      expect(sluri.extension).toBe('html');

      sluri.extension = 'js' + SPECIAL_CHARACTERS + 'on';
      expect(sluri.pathname).toBe('/us/en/page.js' + ENCODED_CHARACTERS + 'on');
      expect(sluri.extension).toBe('js' + ENCODED_CHARACTERS + 'on');
    });

    it('should retrieve search param unencoded and search string encoded on instantiation', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.html?foo=' + SPECIAL_CHARACTERS);

      expect(sluri.searchParams.get('foo')).toBe(SPECIAL_CHARACTERS);

      expect(sluri.search).toBe('?foo=' + ENCODED_COMPONENT_CHARACTERS);
      expect(sluri.searchParams.toString()).toBe('foo=' + ENCODED_COMPONENT_CHARACTERS);
    });

    it('should retrieve search param unencoded and search string encoded on update', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.html');
      sluri.searchParams.append('foo', SPECIAL_CHARACTERS);

      expect(sluri.searchParams.get('foo')).toBe(SPECIAL_CHARACTERS);

      expect(sluri.search).toBe('?foo=' + ENCODED_COMPONENT_CHARACTERS);
      expect(sluri.searchParams.toString()).toBe('foo=' + ENCODED_COMPONENT_CHARACTERS);
    });

    it('should not encode hash on instantiation', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.html#' + SPECIAL_CHARACTERS);

      expect(sluri.hash).toBe('#' + SPECIAL_CHARACTERS);
    });

    it('should not encode hash on update', function() {
      var sluri = new SLURI('http://www.nateyolles.com/us/en/page.html');
      sluri.hash = SPECIAL_CHARACTERS;

      expect(sluri.hash).toBe('#' + SPECIAL_CHARACTERS);
    });

  });
})(this);
