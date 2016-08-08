# SLURI: Sling URI Manipulation Library for AEM and Apache Sling

[![SLURI Build Status](https://circleci.com/gh/nateyolles/sluri.svg?style=shield "SLURI Build Status")](https://circleci.com/gh/nateyolles/sluri) [![GitHub version](https://badge.fury.io/gh/nateyolles%2Fsluri.svg)](https://badge.fury.io/gh/nateyolles%2Fsluri) [![Bower version](https://badge.fury.io/bo/sluri.svg)](https://badge.fury.io/bo/sluri) [![npm version](https://badge.fury.io/js/sluri.svg)](https://www.npmjs.com/package/sluri) [![Dependencies](https://david-dm.org/nateyolles/sluri.svg)](https://david-dm.org/nateyolles/sluri) [![SLURI License](https://img.shields.io/badge/license-Apache_2.0-blue.svg?style=flat "SLURI License")](https://github.com/nateyolles/sluri/blob/master/LICENSE)

SLURI is a client-side URI/URL manipulation library for [Adobe Experience Manager](http://www.adobe.com/marketing-cloud/enterprise-content-management.html) (AEM/CQ5) and [Apache Sling](https://sling.apache.org/). SLURI is an implementation of the URL API (see the [Mozilla Developer Network: URL documentation](https://developer.mozilla.org/en-US/docs/Web/API/URL)) with considerations for the unique URL structure of AEM and Sling applications.

An AEM/Sling URI could look something like `http://user:pass@www.nateyolles.com/us/en/page.foo.bar.html/biz/baz?a=alpha&b=bravo#charlie`. See the documentation for [Apache Sling URL decomposition](https://sling.apache.org/documentation/the-sling-engine/url-decomposition.html).

SLURI encodes the URL string according to [RFC 3986](https://tools.ietf.org/html/rfc3986).

Instead of writing repetitive and tedious string manipulation such as:

```javascript
qs += (qs.indexOf('?') === -1 ? '?' : '&') + key + '=' + value;
url = path.split('.html')[0] + selectors + '.html';
```

SLURI allows you to write:

```javascript
sluri.searchParams.append(key, value);
sluri.suffix = '/foo/bar';
sluri.selectors.append('foo');
sluri.selectors.delete('bar');
sluri.extension = 'json';
```

## Using SLURI

SLURI can be be used in three ways: as a global, with [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) and an AMD loader such as [RequireJS](http://requirejs.org/) or [Almond](https://github.com/requirejs/almond), or in CommonJS-like environments that support `module.exports` such as [Node](https://nodejs.org) or [Grunt](http://gruntjs.com/).

Include the provided JavaScript and simply instantiate SLURI objects using the `new` keyword.

#### Bower

Install with [Bower](https://bower.io/):

```bash
bower install sluri --save
```

#### NPM

Install with [NPM](https://www.npmjs.com/) ([https://www.npmjs.com/package/sluri](https://www.npmjs.com/package/sluri)):

```bash
npm install sluri --save
```

#### Global

Include the minified distribution file [/dist/sluri.min.js](https://github.com/nateyolles/sluri/blob/master/dist/sluri.min.js) or the expanded development file [/src/sluri.js](https://github.com/nateyolles/sluri/blob/master/src/sluri.js) in your project.

```javascript
var sluri = new SLURI('http://www.nateyolles.com/us/page.foo.bar.html/alpha/bravo');
```

#### RequireJS

If required, setup your RequireJS `config.js` file with the SLURI dependency:

```javascript
require.config({
    paths: {
        SLURI: 'bower_components/sluri/sluri'
    }
});
```

```javascript
require(['sluri'], function(SLURI) {
    var sluri = new SLURI('http://www.nateyolles.com/us/page.foo.bar.html/alpha/bravo');
});
```

#### CommonJS

```javascript
var SLURI = require('sluri');
var sluri = new SLURI('http://www.nateyolles.com/us/page.foo.bar.html/alpha/bravo');
```

#### Browser Compatibility

Even though the URL API is listed as experimental, SLURI does not depend on the browser's implementation of the API. SLURI works on all modern browsers and Internet Explorer 9+.

## Building SLURI

#### Tests

SLURI tests are written with [Jasmine](http://jasmine.github.io/) and run on the PhantomJS headless browser. Tests are run with [CircleCI](https://circleci.com/)'s integration testing platform. Tests can be run locally with:

```
grunt test
```

#### Build

Build SLURI with:

```
grunt build
```

## API

SLURI implements the URL API with a few additions and modification building upon the URL API to handle `selectors`, `suffixes`, `resourcePath` and `extensions`. SLURI respects all `read-only` property definitions. The only alteration in this version is that the implementation of the `URLSearchParams` interface returns arrays rather than [Iterators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols).

##### given the following instantiated object for example:
```javascript
var sluri = new SLURI('http://user:pass@www.nateyolles.com:4502/us/en/page.biz.baz.html/foo/bar?alpha=bravo&charlie=delta&echo#foxtrot');
```

### SLURI

```
SLURI(urlString [, baseURL])
```
The SLURI object must be instantiated with the *new* keyword. Throws *TypeError* if unable to construct a URL.

> **urlString**
> 
> String to parse into a URL. Can also be a *URL*, *SLURI*, *Location* or *HTMLAnchorElement* object.

> **baseURL**
> 
> String to use for the origin when parsing *urlString* into a URL. This parameter is optional but useful if *urlString* is a relative path. Can also be a *URL*, *SLURI*, *Location* or *HTMLAnchorElement* object.

```
SLURI.protocol
```
> **getter**
> 
> `sluri.protocol; // returns 'http:'`

> **setter**
> 
> `sluri.protocol = 'https';`

```
SLURI.username
```
> **getter**
> 
> `sluri.username; // returns 'user'`

> **setter**
> 
> `sluri.username = 'newuser';`

```
SLURI.password
```
> **getter**
> 
> `sluri.password; // returns 'pass'`

> **setter**
> 
> `sluri.password = 'newpass';`

```
SLURI.hostname
```
> **getter**
> 
> `sluri.hostname; // returns 'www.nateyolles.com'`

> **setter**
> 
> `sluri.hostname = 'www.example.com';`

```
SLURI.port
```
> **getter**
> 
> `sluri.port; // returns '4502'`

> **setter**
> 
> `sluri.port = 4503;`

```
SLURI.host
```
> **getter**
> 
> `sluri.host; // returns 'www.nateyolles.com:4502'`

> **setter**
> 
> `sluri.host = 'www.example.com:4503';`

```
SLURI.origin
```
> **getter**
> 
> `sluri.origin; // returns 'http://www.nateyolles.com:4502'`

> **setter**
> 
> *read-only*

```
SLURI.pathname
```
> **getter**
> 
> `sluri.pathname; // returns '/us/en/page.biz.baz.html'`

> **setter**
> 
> `sluri.pathname = '/fr/fr/example.html';`

```
SLURI.resourcePath
```
> **getter**
> 
> `sluri.resourcePath; // returns '/us/en/page'`

> **setter**
> 
> `sluri.resourcePath = '/fr/fr/example';`

```
SLURI.extension
```
> **getter**
> 
> `sluri.extension; // returns 'html'`

> **setter** 
> 
> `sluri.extension = 'json';`

```
SLURI.selectorString
```
> **getter**
> 
> `sluri.selectorString; // returns 'biz.baz'`

> **setter**
> 
> `sluri.selectorString = 'foo.bar';`

```
SLURI.search
```
> **getter**
> 
> `sluri.search; // returns '?alpha=bravo&charlie=delta&echo'`

> **getter**
> 
> `sluri.search = '?foo=bar';`

```
SLURI.suffix
```
> **getter**
> 
> `sluri.suffix; // returns '/foo/bar'`

> **setter**
> 
> `sluri.suffix = '/biz/baz';`

```
SLURI.hash
```
> **getter**
> 
> `sluri.hash; // returns '#foxtrot'`

> **setter**
> 
> `sluri.hash = 'foo';`

```
SLURI.href
```
> **getter**
> 
> `sluri.href; // returns 'http://user:pass@www.nateyolles.com:4502/us/en/page.biz.baz.html/foo/bar?alpha=bravo&charlie=delta&echo#foxtrot'`

> **setter**
> 
> `sluri.href = 'http://www.example.com/fr/fr/foo.html/bar/biz';`


```
SLURI.toString()
```
> **returns {string}**
> 
> `sluri.toString(); // returns 'http://user:pass@www.nateyolles.com:4502/us/en/page.biz.baz.html/foo/bar?alpha=bravo&charlie=delta&echo#foxtrot'`

### SLURISelectors

```
SLURISelectors(selectorString)
```
Allows easy access to create, read, update and delete the selectors without having to resort to manual string manipulation.

Selectors are unique to *Apache Sling* and *Adobe Experience Manager*, as such there isn't an interface to implement. However, the *SLURISelectors* API matches the *slURLSearchParams* API and *URLSearchParams* interface as closely as possible.

> **selectorString**
> 
> The selector string to be deconstructed and manipulated

```
SLURI.selectors
```
> **getter**
> 
> `sluri.selectors; // returns instanceof SLURISelectors`

> **setter**
> 
> *read-only*

```
SLURI.selectors.toString()
```
> **returns {string}**
> 
> `sluri.selectors.toString(); // returns 'biz.baz'`

```
SLURI.selectors.has(selector)
```
> **selector**
>
> The string to check the SLURI object's selectors against

> **returns {boolean}**
> 
> `sluri.selectors.has('biz'); // returns true`

```
SLURI.selectors.append(selector)
```
> **selector**
>
> The string to append to the SLURI object's selectors

> `sluri.selectors.append('qux'); // sluri.selectorString === 'biz.baz.qux'`

```
SLURI.selectors.delete(selector)
```
> **selector**
>
> The string to delete from the SLURI object's selectors

> `sluri.selectors.delete('biz'); // sluri.selectorString === 'baz'`

```
SLURI.selectors.values()
```
> **returns {array}**
> 
> `sluri.selectors.values(); // returns ['biz', 'baz']`

### SLURISearchParams

```
SLURISearchParams(searchString)
```
The *SLURI* implementation of the *URLSearchParams* interface.

Allows easy access to create, read, update and delete querystring parameters without having to resort to manual string manipulation.

Handles multiple values for a given key in the querystring. There are many ways different web frameworks handle this. *SLURISearchParams* takes the same approach as the *SearchParams* interface that it is implementing. An example of multiple values is: *?foo=red&bar=blue&foo=green*. Calling the *#get* method will return the first occurrence, while calling the *#getAll* method will return an array of all values. Calling the *#set* method with remove all values and create the new one. Calling *#delete* will remove all values. The *#append* method is how multiple values can be added to the querystring.

> **searchString**
> 
> The querystring to be deconstructed and manipulated

```
SLURI.searchParams
```
> **getter**
> 
> `sluri.searchParams; // returns instanceof SLURISearchParams`

> **setter**
> 
> *read-only*

```
SLURI.searchParams.toString()
```
> **returns {string}**
> 
> `sluri.searchParams.toString(); // returns 'alpha=bravo&charlie=delta&echo'`

```
SLURI.searchParams.has(key)
```
> **key**
>
> The parameter key to check against the querystring to see if it exists

> **returns {boolean}**
>
> `sluri.searchParams.has('alpha'); // returns true`

```
SLURI.searchParams.get(key)
```
> **key**
>
> The parameter key to retrieve the querystring value

> **returns {string}**
>
> `sluri.searchParams.get('alpha'); // returns 'bravo'`

```
SLURI.searchParams.getAll(key)
```
> **key**
>
> The parameter key to retrieve the querystring values

> **returns {array}**
>
>  `sluri.searchParams.getAll('alpha'); // returns ['bravo']`

```
SLURI.searchParams.keys()
```
> **returns {array}**
>
> `sluri.searchParams.keys(); // returns ['alpha', 'charlie', 'echo']`

```
SLURI.searchParams.values()
```
> **returns {array}**
>
>  `sluri.searchParams.values(); // returns ['bravo', 'delta', '']`

```
SLURI.searchParams.set(key, value)
```
> **key**
>
> The parameter key to set in the querystring

> **value**
>
> The parameter value to set in the querystring for the key

> `sluri.searchParams.set('alpha', 'golf'); // sluri.search === '?alpha=golf&charlie=delta&echo='`

```
SLURI.searchParams.delete(key)
```
> **key**
>
> The parameter key to delete from the querystring

> `sluri.searchParams.set('alpha'); // sluri.search === '?charlie=delta&echo='`
