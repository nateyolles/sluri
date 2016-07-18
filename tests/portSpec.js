(function(window) {
  'use strict';

  describe('slURI port tests', function() {

    it('should return the port number from instantiation', function() {
      var sluri = new slURI('http://www.nateyolles.com:4502/us/en/page.html');
      expect(sluri.port).toBe('4502');
    });

    it('should return empty string if the port number was absent from instantiation', function() {
      var sluri = new slURI('http://www.nateyolles.com/us/en/page.html');
      expect(sluri.port).toBe('');
    });

    it('should update the port number with an integer passed in', function(){
      var sluri = new slURI('http://www.nateyolles.com/us/en/page.html');
      expect(sluri.port).toBe('');

      sluri.port = 4502;
      expect(sluri.port).toBe('4502');
    });

    it('should update the port number with a string passed in', function(){
      var sluri = new slURI('http://www.nateyolles.com/us/en/page.html');
      expect(sluri.port).toBe('');

      sluri.port = '4502';
      expect(sluri.port).toBe('4502');
    });

    it('should update the port number with a float', function(){
      var sluri = new slURI('http://www.nateyolles.com/us/en/page.html');
      expect(sluri.port).toBe('');

      sluri.port = 12.5;
      expect(sluri.port).toBe('12');
    });

    it('should update the port number with a float string', function(){
      var sluri = new slURI('http://www.nateyolles.com/us/en/page.html');
      expect(sluri.port).toBe('');

      sluri.port = '12.5';
      expect(sluri.port).toBe('12');
    });

    it('should not update the port number when it cannot be parsed into an int', function(){
      var sluri = new slURI('http://www.nateyolles.com/us/en/page.html');
      expect(sluri.port).toBe('');

      sluri.port = 'alpha';
      expect(sluri.port).toBe('');

      sluri.port = 4502;
      expect(sluri.port).toBe('4502');

      sluri.port = '12b';
      expect(sluri.port).toBe('4502');
    });
  });
})(this);
