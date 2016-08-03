# slURI: Sling URI Manipulation Library for AEM and Apache Sling

[![slURI Build Status](https://circleci.com/gh/nateyolles/sluri.svg?style=shield "slURI Build Status")](https://circleci.com/gh/nateyolles/sluri.svg?style=shield) [![GitHub version](https://badge.fury.io/gh/nateyolles%2Fsluri.svg)](https://badge.fury.io/gh/nateyolles%2Fsluri) [![Bower version](https://badge.fury.io/bo/sluri.svg)](https://badge.fury.io/bo/sluri) [![npm version](https://badge.fury.io/js/sluri.svg)](https://www.npmjs.com/package/sluri) [![Dependencies](https://david-dm.org/nateyolles/sluri.svg)](https://david-dm.org/nateyolles/sluri) [![slURI License](https://img.shields.io/badge/license-Apache_2.0-blue.svg?style=flat "slURI License")](https://github.com/nateyolles/sluri/blob/master/LICENSE)

slURI is a client-side URI/URL manipulation library for [Adobe Experience Manager](http://www.adobe.com/marketing-cloud/enterprise-content-management.html) (AEM/CQ5) and [Apache Sling](https://sling.apache.org/). slURI is an implementation of the URL API (see the [Mozilla Developer Network: URL documentation](https://developer.mozilla.org/en-US/docs/Web/API/URL)) with considerations for the unique URL structure of AEM and Sling applications.

An AEM/Sling URI could look something like `http://user:pass@www.nateyolles.com/us/en/page.foo.bar.html/biz/baz?a=alpha&b=bravo#charlie`. See the documentation for [Apache Sling URL decomposition](https://sling.apache.org/documentation/the-sling-engine/url-decomposition.html).

Instead of writing repetitive and tedious string manipulation such as:

```javascript
qs += (qs.indexOf('?') === -1 ? '?' : '&') + key + '=' + value;
url = path.split('.html')[0] + '/foo/bar' + path.split('.html')[1];
```

slURI allows you to write:

```javascript
sluri.searchParams.append(key, value);
sluri.suffix = '/foo/bar';
sluri.selectors.append('foo');
sluri.selectors.delete('bar');
sluri.extension = 'json';
```

## Using slURI

slURI can be be used in three ways: as a global, with [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) and an AMD loader such as [RequireJS](http://requirejs.org/) or [Almond](https://github.com/requirejs/almond), or in CommonJS-like environments that support `module.exports` such as [Node](https://nodejs.org) or [Grunt](http://gruntjs.com/).

Include the provided JavaScript and simply instantiate slURI objects using the `new` keyword.

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
var sluri = new slURI('http://www.nateyolles.com/us/page.foo.bar.html/alpha/bravo');
```

#### RequireJS

If required, setup your RequireJS `config.js` file with the slURI dependency:

```javascript
require.config({
    paths: {
        slURI: 'bower_components/sluri/sluri'
    }
});
```

```javascript
require(['sluri'], function(slURI) {
    var sluri = new slURI('http://www.nateyolles.com/us/page.foo.bar.html/alpha/bravo');
});
```

#### CommonJS

```javascript
var slURI = require('sluri');
var sluri = new slURI('http://www.nateyolles.com/us/page.foo.bar.html/alpha/bravo');
```

#### Browser Compatibility

Even though the URL API is listed as experimental, slURI does not depend on the browser's implementation of the API. slURI works on all modern browsers and Internet Explorer 9+.

## Building slURI

#### Tests

slURI tests are written with [Jasmine](http://jasmine.github.io/) and run on the PhantomJS headless browser. Tests are run with [CircleCI](https://circleci.com/)'s integration testing platform. Tests can be run locally with:

```
grunt test
```

#### Build

Build slURI with:

```
grunt build
```

## API

slURI implements the URL API with a few additions and modification building upon the URL API to handle `selectors`, `suffixes`, `resourcePath` and `extensions`. slURI respects all `read-only` property definitions. The only alteration in this version is that the implementation of the `URLSearchParams` interface returns arrays rather than [Iterators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols).

##### given the following instantiated object for example:
```javascript
var sluri = new slURI('http://user:pass@www.nateyolles.com:4502/us/en/page.biz.baz.html/foo/bar?alpha=bravo&charlie=delta&echo#foxtrot');
```

### slURI

```
slURI(urlString [, baseURL])
```
The slURI object must be instantiated with the *new* keyword. Throws *TypeError* if unable to construct a URL.

> **urlString**
> 
> String to parse into a URL. Can also be a *URL*, *slURI*, *Location* or *HTMLAnchorElement* object.

> **baseURL**
> 
> String to use for the origin when parsing *urlString* into a URL. This parameter is optional but useful if *urlString* is a relative path. Can also be a *URL*, *slURI*, *Location* or *HTMLAnchorElement* object.

```
slURI.protocol
```
> **getter**
> 
> `sluri.protocol; // returns 'http:'`

> **setter**
> 
> `sluri.protocol = 'https';`

```
slURI.username
```
> **getter**
> 
> `sluri.username; // returns 'user'`

> **setter**
> 
> `sluri.username = 'newuser';`

```
slURI.password
```
> **getter**
> 
> `sluri.password; // returns 'pass'`

> **setter**
> 
> `sluri.password = 'newpass';`

```
slURI.hostname
```
> **getter**
> 
> `sluri.hostname; // returns 'www.nateyolles.com'`

> **setter**
> 
> `sluri.hostname = 'www.example.com';`

```
slURI.port
```
> **getter**
> 
> `sluri.port; // returns '4502'`

> **setter**
> 
> `sluri.port = 4503;`

```
slURI.host
```
> **getter**
> 
> `sluri.host; // returns 'www.nateyolles.com:4502'`

> **setter**
> 
> `sluri.host = 'www.example.com:4503';`

```
slURI.origin
```
> **getter**
> 
> `sluri.origin; // returns 'http://www.nateyolles.com:4502'`

> **setter**
> 
> *read-only*

```
slURI.pathname
```
> **getter**
> 
> `sluri.pathname; // returns '/us/en/page.biz.baz.html'`

> **setter**
> 
> `sluri.pathname = '/fr/fr/example.html';`

```
slURI.resourcePath
```
> **getter**
> 
> `sluri.resourcePath; // returns '/us/en/page'`

> **setter**
> 
> *read-only*

```
slURI.extension
```
> **getter**
> 
> `sluri.extension; // returns 'html'`

> **setter** 
> 
> `sluri.extension = 'json';`

```
slURI.selectorString
```
> **getter**
> 
> `sluri.selectorString; // returns 'biz.baz'`

> **setter**
> 
> `sluri.selectorString = 'foo.bar';`

```
slURI.search
```
> **getter**
> 
> `sluri.search; // returns '?alpha=bravo&charlie=delta&echo'`

> **getter**
> 
> `sluri.search = '?foo=bar';`

```
slURI.suffix
```
> **getter**
> 
> `sluri.suffix; // returns '/foo/bar'`

> **setter**
> 
> `sluri.suffix = '/biz/baz';`

```
slURI.hash
```
> **getter**
> 
> `sluri.hash; // returns '#foxtrot'`

> **setter**
> 
> `sluri.hash = 'foo';`

```
slURI.href
```
> **getter**
> 
> `sluri.href; // returns 'http://user:pass@www.nateyolles.com:4502/us/en/page.biz.baz.html/foo/bar?alpha=bravo&charlie=delta&echo#foxtrot'`

> **setter**
> 
> `sluri.href = 'http://www.example.com/fr/fr/foo.html/bar/biz';`


```
slURI.toString()
```
> **returns {string}**
> 
> `sluri.toString(); // returns 'http://user:pass@www.nateyolles.com:4502/us/en/page.biz.baz.html/foo/bar?alpha=bravo&charlie=delta&echo#foxtrot'`

### slURISelectors

```
slURISelectors(selectorString)
```
Allows easy access to create, read, update and delete the selectors without having to resort to manual string manipulation.

Selectors are unique to *Apache Sling* and *Adobe Experience Manager*, as such there isn't an interface to implement. However, the *slURISelectors* API matches the *slURLSearchParams* API and *URLSearchParams* interface as closely as possible.

> **selectorString**
> 
> The selector string to be deconstructed and manipulated

```
slURI.selectors
```
> **getter**
> 
> `sluri.selectors; // returns instanceof slURISelectors`

> **setter**
> 
> *read-only*

```
slURI.selectors.toString()
```
> **returns {string}**
> 
> `sluri.selectors.toString(); // returns 'biz.baz'`

```
slURI.selectors.has(selector)
```
> **selector**
>
> The string to check the slURI object's selectors against

> **returns {boolean}**
> 
> `sluri.selectors.has('biz'); // returns true`

```
slURI.selectors.append(selector)
```
> **selector**
>
> The string to append to the slURI object's selectors

> `sluri.selectors.append('qux'); // sluri.selectorString === 'biz.baz.qux'`

```
slURI.selectors.delete(selector)
```
> **selector**
>
> The string to delete from the slURI object's selectors

> `sluri.selectors.delete('biz'); // sluri.selectorString === 'baz'`

```
slURI.selectors.values()
```
> **returns {array}**
> 
> `sluri.selectors.values(); // returns ['biz', 'baz']`

### slURISearchParams

```
slURISearchParams(searchString)
```
The *slURI* implementation of the *URLSearchParams* interface.

Allows easy access to create, read, update and delete querystring parameters without having to resort to manual string manipulation.

Handles multiple values for a given key in the querystring. There are many ways different web frameworks handle this. *slURISearchParams* takes the same approach as the *SearchParams* interface that it is implementing. An example of multiple values is: *?foo=red&bar=blue&foo=green*. Calling the *#get* method will return the first occurrence, while calling the *#getAll* method will return an array of all values. Calling the *#set* method with remove all values and create the new one. Calling *#delete* will remove all values. The *#append* method is how multiple values can be added to the querystring.

> **searchString**
> 
> The querystring to be deconstructed and manipulated

```
slURI.searchParams
```
> **getter**
> 
> `sluri.searchParams; // returns instanceof slURISearchParams`

> **setter**
> 
> *read-only*

```
slURI.searchParams.toString()
```
> **returns {string}**
> 
> `sluri.searchParams.toString(); // returns 'alpha=bravo&charlie=delta&echo'`

```
slURI.searchParams.has(key)
```
> **key**
>
> The parameter key to check against the querystring to see if it exists

> **returns {boolean}**
>
> `sluri.searchParams.has('alpha'); // returns true`

```
slURI.searchParams.get(key)
```
> **key**
>
> The parameter key to retrieve the querystring value

> **returns {string}**
>
> `sluri.searchParams.get('alpha'); // returns 'bravo'`

```
slURI.searchParams.getAll(key)
```
> **key**
>
> The parameter key to retrieve the querystring values

> **returns {array}**
>
>  `sluri.searchParams.getAll('alpha'); // returns ['bravo']`

```
slURI.searchParams.keys()
```
> **returns {array}**
>
> `sluri.searchParams.keys(); // returns ['alpha', 'charlie', 'echo']`

```
slURI.searchParams.values()
```
> **returns {array}**
>
>  `sluri.searchParams.values(); // returns ['bravo', 'delta', '']`

```
slURI.searchParams.set(key, value)
```
> **key**
>
> The parameter key to set in the querystring

> **value**
>
> The parameter value to set in the querystring for the key

> `sluri.searchParams.set('alpha', 'golf'); // sluri.search === '?alpha=golf&charlie=delta&echo='`

```
slURI.searchParams.delete(key)
```
> **key**
>
> The parameter key to delete from the querystring

> `sluri.searchParams.set('alpha'); // sluri.search === '?charlie=delta&echo='`
