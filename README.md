# slURI: Sling URI Manipulation Library for AEM and Apache Sling

[![slURI Build Status](https://circleci.com/gh/nateyolles/sluri.svg?style=shield "slURI Build Status")](https://circleci.com/gh/nateyolles/sluri.svg?style=shield) [![slURI License](https://img.shields.io/badge/license-apache_2.0-blue.svg?style=flat "slURI License")](https://github.com/nateyolles/sluri/blob/master/LICENSE)

slURI is a client-side URI/URL manipulation library for [Adobe Experience Manager](http://www.adobe.com/marketing-cloud/enterprise-content-management.html) (AEM/CQ5) and [Apache Sling](https://sling.apache.org/). slURI is an implementation of the URL API (see the [Mozilla Developer Network: URL documentation](https://developer.mozilla.org/en-US/docs/Web/API/URL)) with considerations for the unique URL structure of AEM/Sling applications.

An AEM/Sling URI could look something like `http://user:pass@www.nateyolles.com/us/en/page.foo.bar.html/biz/baz?a=alpha&b=bravo#charlie`.

## URL API

slURI implements the URL API with a few additions and modification building upon the URL API to handle `selectors`, `suffixes`, and `extensions`. slURI respects all `read-only` property definitions. The only alteration in this version is that the implementation of the `URLSearchParams` interface returns arrays rather than [Iterators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols).

## Using slURI

slURI can be be used as a global or with [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) and [RequireJS](http://requirejs.org/)/[Almond](https://github.com/requirejs/almond).

Install with [Bower](https://bower.io/):

```
bower install slURI
```

## Browser Compatibility

Even though the URL API is listed as experimental, slURI does not depend on the browser's implementation of the API. slURI works on all modern browsers and Internet Explorer 9+.


## Tests

slURI tests are written with [Jasmine](http://jasmine.github.io/) and can be run with:

```
grunt test
```

## Build

Build slURI with:

```
grunt build
```
