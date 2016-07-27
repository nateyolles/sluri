# slURI: Sling URI Manipulation Library for AEM and Apache Sling

[![slURI Build Status](https://circleci.com/gh/nateyolles/sluri.svg?style=shield "slURI Build Status")](https://circleci.com/gh/nateyolles/sluri.svg?style=shield) [![slURI License](https://img.shields.io/badge/license-Apache_2.0-blue.svg?style=flat "slURI License")](https://github.com/nateyolles/sluri/blob/master/LICENSE)

slURI is a client-side URI/URL manipulation library for [Adobe Experience Manager](http://www.adobe.com/marketing-cloud/enterprise-content-management.html) (AEM/CQ5) and [Apache Sling](https://sling.apache.org/). slURI is an implementation of the URL API (see the [Mozilla Developer Network: URL documentation](https://developer.mozilla.org/en-US/docs/Web/API/URL)) with considerations for the unique URL structure of AEM and Sling applications.

An AEM/Sling URI could look something like `http://user:pass@www.nateyolles.com/us/en/page.foo.bar.html/biz/baz?a=alpha&b=bravo#charlie`. See the documentation for [Apache Sling URL decomposition](https://sling.apache.org/documentation/the-sling-engine/url-decomposition.html).

## Using slURI

slURI can be be used as a global or with [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) and an AMD loader such as [RequireJS](http://requirejs.org/) or [Almond](https://github.com/requirejs/almond).

### Bower

Install with [Bower](https://bower.io/):

```
bower install slURI
```

## URL API

slURI implements the URL API with a few additions and modification building upon the URL API to handle `selectors`, `suffixes`, `resourcePath` and `extensions`. slURI respects all `read-only` property definitions. The only alteration in this version is that the implementation of the `URLSearchParams` interface returns arrays rather than [Iterators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols).

Given:
```javascript
var sluri = new slURI('http://user:pass@www.nateyolles.com:4502/us/en/page.biz.baz.html/foo/bar?alpha=bravo&charlie=delta&echo#foxtrot');
```

---

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
Getter: `sluri.protocol; // returns 'http:'`

Setter: `sluri.protocol = 'https';`

```
slURI.username
```
Getter: `sluri.username; // returns 'user'`

Setter: `sluri.username = 'newuser';`

```
slURI.password
```
Getter: `sluri.password; // returns 'pass'`

Setter: `sluri.password = 'newpass';`

```
slURI.hostname
```
Getter: `sluri.hostname; // returns 'www.nateyolles.com'`

Setter: `sluri.hostname = 'www.example.com';`

```
slURI.port
```
Getter: `sluri.port; // returns '4502'`

Setter: `sluri.port = 4503;`

```
slURI.host
```
Getter: `sluri.host; // returns 'www.nateyolles.com:4502'`

Setter: `sluri.host = 'www.example.com:4503';`

```
slURI.origin
```
Getter: `sluri.origin; // returns 'http://www.nateyolles.com:4502'`

*read-only*

```
slURI.pathname
```
Getter: `sluri.pathname; // returns '/us/en/page.biz.baz.html'`

Setter: `sluri.pathname = '/fr/fr/example.html';`

```
slURI.resourcePath
```
Getter: `sluri.resourcePath; // returns '/us/en/page'`

*read-only*

```
slURI.extension
```
Getter: `sluri.extension; // returns 'html'`

Setter: `sluri.extension = 'json';`

```
slURI.selectorString
```
Getter: `sluri.selectorString; // returns 'biz.baz'`

Setter: `sluri.selectorString = 'foo.bar';`

```
slURI.search
```
Getter: `sluri.search; // returns '?alpha=bravo&charlie=delta&echo'`

Setter: `sluri.search = '?foo=bar';`

```
slURI.suffix
```
Getter: `sluri.suffix; // returns '/foo/bar'`

Setter: `sluri.suffix = '/biz/baz';`

```
slURI.hash
```
Getter: `sluri.hash; // returns '#foxtrot'`

Setter: `sluri.hash = 'foo';`

---

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
Getter: `sluri.selectors; // returns instanceof slURISelectors`

*read-only*

```
slURI.selectors.toString()
```
Returns: `sluri.selectors.toString(); // returns 'biz.baz'`

```
slURI.selectors.has(selector)
```
Returns: `sluri.selectors.has('biz'); // returns true`

```
slURI.selectors.append(selector)
```
Returns: `sluri.selectors.append('qux'); // sluri.selectorString === 'biz.baz.qux'`

```
slURI.selectors.delete(selector)
```
Returns: `sluri.selectors.delete('biz'); // sluri.selectorString === 'baz'`

```
slURI.selectors.values()
```
Returns: `sluri.selectors.values(); // returns ['biz', 'baz']`

---

```
slURISearchParams(searchString)
```
The *slURI* implementation of the *URLSearchParams* interface.

Allows easy access to create, read, update and delete querystring parameters without having to resort to manual string manipulation.

Handles multiple values for a given key in the querystring. There are many ways different web frameworks handle this. *slURISearchParams* takes the same approach as the *SearchParams* interface that it is implementing. An example of multiple values is: *?foo=red&bar=blue&foo=green*. Calling the *#get* method will return the first occurance, while calling the *#getAll* method will return an array of all values. Calling the *#set* method with remove all values and create the new one. Calling *#delete* will remove all values. The *#append* method is how multiple values can be added to the querystring.

> **searchString**
> 
> The querystring to be deconstructed and manipulated

```
slURI.searchParams
```
Getter: `sluri.searchParams; // returns instanceof slURISearchParams`

*read-only*

```
slURI.searchParams.toString()
```
Returns: `sluri.searchParams.toString(); // returns 'alpha=bravo&charlie=delta&echo'`

```
slURI.searchParams.has(key)
```
Returns: `sluri.searchParams.has('alpha'); // returns true

```
slURI.searchParams.get(key)
```
Returns: `sluri.searchParams.get('alpha'); // returns 'bravo'

```
slURI.searchParams.getAll(key)
```
Returns: `sluri.searchParams.getAll('alpha'); // returns ['bravo']

```
slURI.searchParams.keys()
```
Returns: `sluri.searchParams.keys(); // returns ['alpha', 'charlie', 'echo']

```
slURI.searchParams.values()
```
Returns: `sluri.searchParams.values(); // returns ['bravo', 'delta', '']

```
slURI.searchParams.set(key, value)
```
Returns: `sluri.searchParams.set('alpha', 'golf'); // sluri.search === '?alpha=golf&charlie=delta&echo='

```
slURI.searchParams.delete(key)
```
Returns: `sluri.searchParams.set('alpha'); // sluri.search === '?charlie=delta&echo='

## Browser Compatibility

Even though the URL API is listed as experimental, slURI does not depend on the browser's implementation of the API. slURI works on all modern browsers and Internet Explorer 9+.

## Tests

slURI tests are written with [Jasmine](http://jasmine.github.io/) and run on the PhantomJS headless browser. Tests are run with [CircleCI](https://circleci.com/)'s integration testing platform. Tests can be run locally with:

```
grunt test
```

## Build

Build slURI with:

```
grunt build
```
