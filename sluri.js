/* 
 * Copyright 2016 Nate Yolles
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * SLURI is a client-side URI/URL manipulation library for Adobe Experience
 * Manager (AEM/CQ5) and Apache Sling. SLURI is an implementation of the
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/URL|URL API} with
 * considerations for the unique URL structure of AEM/Sling applications.
 *
 * Example:
 * var sluri = new SLURI('http://user:pass@www.nateyolles.com:4502/us/en/page.biz.baz.html/foo/bar?alpha=bravo&charlie=delta&echo#foxtrot');
 * sluri.protocol === 'http:'
 * sluri.username === 'user'
 * sluri.password === 'pass'
 * sluri.hostname === 'www.nateyolles.com'
 * sluri.port === '4502'
 * sluri.host === 'www.nateyolles.com:4502'
 * sluri.origin === 'http://www.nateyolles.com:4502'
 * sluri.pathname === '/us/en/page.biz.baz.html'
 * sluri.resourcePath === '/us/en/page'
 * sluri.extension === 'html'
 * sluri.selectorString === 'biz.baz'
 * sluri.selectors.constructor.name === 'SLURISelectors'
 *     sluri.selectors.toString() === 'biz.baz'
 *     sluri.selectors.has('biz') === true
 *     sluri.selectors.append('qux')
 *     sluri.selectors.delete('biz')
 *     sluri.selectors.values() is ['baz', 'qux']
 * sluri.search === '?alpha=bravo&charlie=delta'
 * sluri.searchParams.constructor.name === 'SLURISearchParams'
 *     sluri.searchParams.toString() === 'alpha=bravo&charlie=delta'
 *     sluri.searchParams.has('alpha') === true
 *     sluri.searchParams.get('alpha') === 'bravo'
 *     sluri.searchParams.getAll('alpha') === ['bravo']
 *     sluri.searchParams.keys() is ['alpha', 'charlie', 'echo']
 *     sluri.searchParams.values() is ['bravo', 'delta', '']
 *     sluri.searchParams.set('alpha', 'golf')
 *     sluri.searchParams.delete('bravo')
 * sluri.suffx === '/foo/bar'
 * sluri.hash === '#foxtrot'
 *
 * Usage:
 * var sluri = new SLURI(urlString [, baseURL]);
 *
 * Where urlString and baseURL are either a String, URL, Location or
 * HTMLAnchorElement and baseURL is optional. For example:
 *
 * Given:
 * var fooString = 'http://www.foo.com/us/en/foo.html';
 * var barString = 'bar.html';
 * var fooURL = new URL('http://www.foo.com/us/en/page.html');
 * var fooAnchor = document.createElement('a);
 *     fooAnchor.href = 'http://www.foo.com/us/en/page.html';
 * window.location === 'http://www.currentsite.com';
 *
 * These are valid constructor calls:
 * var sluri = new SLURI(fooString); // sluri.href === 'http://www.foo.com/us/en/foo.html'
 * var sluri = new SLURI(fooURL); // sluri.href === 'http://www.foo.com/us/en/foo.html'
 * var sluri = new SLURI(fooAnchor); // sluri.href === 'http://www.foo.com/us/en/foo.html'
 * var sluri = new SLURI(window.location); // sluri.href === 'http://www.currentsite.com/'
 * var sluri = new SLURI(barString, fooString); // sluri.href === 'http://www.foo.com/bar.html'
 * var sluri = new SLURI(barString, fooURL); // sluri.href === 'http://www.foo.com/bar.html'
 * var sluri = new SLURI(barString, fooAnchor); // sluri.href === 'http://www.foo.com/bar.html'
 * var sluri = new SLURI(barString, window.location); // sluri.href ==='http://www.currentsite.com/bar.html'
 *
 * This script is in a UMD (Universal Module Definition) pattern allowing the
 * script to be used as a global, an AMD (Asynchronous Module Definition)
 * module with the use of an AMD loader such as RequireJS or Almond, or CommonJS
 * like environments such as Node.
 *
 * @module SLURI
 * @author Nate Yolles <nate@nateyolles.com>
 * @copyright Nate Yolles 2016
 * @license Apache-2.0
 * @implements {URL}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/URL} for URL interface
 * @see {@link https://github.com/umdjs/umd/blob/master/templates/returnExports.js} for UMD boilerplate
 */
(function (root, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals
        root.SLURI = factory();
    }
}(this, function() {
    'use strict';

    var MIN_ARGUMENTS = 1,
        EMPTY_STRING = '',
        ERROR_MESSAGE = 'Failed to construct \'URL\': Invalid URL';

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
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI}
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

    /**
     * The SLURI implementation of the URLSearchParams interface.
     *
     * Allows easy access to create, read, update and delete querystring
     * parameters without having to resort to manual string manipulation.
     *
     * Encode the key-value pairs only on when toString is called so that keys
     * and values can be retrieved and set by the values as entered.
     *
     * Handles multiple values for a given key in the querystring. There are
     * many ways different web frameworks handle this. SLURISearchParams takes
     * the same approach as the SearchParams interface that it is implementing.
     * An example of multiple values is: '?foo=red&bar=blue&foo=green'. Calling
     * the #get method will return the first occurrence, while calling the
     * #getAll method will return an array of all values. Calling the #set
     * method with remove all values and create the new one. Calling #delete
     * will remove all values. The #append method is how multiple values can be
     * added to the querystring.
     *
     * @class
     * @protected
     * @param {String} The querystring to be deconstructed and manipulated
     * @implements {URLSearchParams}
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams|URLSearchParams}
     */
    function SLURISearchParams(searchString) {
        var _searchString,
            _searchStringSplit,

            /**
             * The internal array that backs the querystring.
             *
             * @private
             * @member
             */
            _valueDictionary = [];

        /*
         * Deconstruct the search string and store the key value pairs in the
         * array backing.
         */
        if (searchString) {
            _searchString = (EMPTY_STRING + searchString).replace('?', '');
            _searchStringSplit = _searchString.split('&');

            for (var x = 0; x < _searchStringSplit.length; x++) {
                var split = _searchStringSplit[x].split('=');
                _valueDictionary.push({key: split[0], value: split[1] || EMPTY_STRING});
            }
        }

        /**
         * Override the toString method to return a String representation of the
         * querystring parameters.
         * 
         * @function
         * @public
         * @overrides
         * @returns {String}
         * @example
         * sluri.searchParams.toString(); //returns 'foo=bar&biz=baz'
         */
        this.toString = function() {
            var valueArray = [];

            for (var x = 0; x < _valueDictionary.length; x++) {
                valueArray.push(fixedEncodeURIComponent(_valueDictionary[x].key) + 
                    '=' + fixedEncodeURIComponent(_valueDictionary[x].value));
            }

            return valueArray.length > 0 ? valueArray.join('&') : EMPTY_STRING;
        };

        /**
         * Override the toString method to return a String representation of the
         * querystring parameters.
         * 
         * @function
         * @public
         * @overrides
         * @returns {String}
         * @see {toString}
         * @example
         * sluri.searchParams.toString(); //returns 'foo=bar&biz=baz'
         */
        this.toLocaleString = function(){
            return this.toString();
        };

        /**
         * Determines if the querystring has a particular parameter.
         * 
         * @function
         * @public
         * @param {String} The parameter to check for
         * @returns {Boolean}
         * @example
         * sluri.searchParams.has('foo'); //returns true
         */
        this.has = function(key) {
            for (var x = 0; x < _valueDictionary.length; x++) {
                if (_valueDictionary[x].key === key) {
                    return true;
                }
            }

            return false;
        };

        /**
         * Gets the value for a given querystring parameter.
         * 
         * @function
         * @public
         * @param {String} The parameter to check for
         * @returns {String}
         * @example
         * sluri.searchParams.get('foo'); //returns 'bar'
         */
        this.get = function(key) {
            for (var x = 0; x < _valueDictionary.length; x++) {
                if (_valueDictionary[x].key === key) {
                    return _valueDictionary[x].value;
                }
            }

            return null;
        };

        /**
         * Gets all the values for a given querystring parameter.
         * 
         * @function
         * @public
         * @param {String} The parameter to check for
         * @returns {Array}
         * @example
         * sluri.searchParams.getAll('foo'); //returns ['bar', 'biz']
         */
        this.getAll = function(key) {
            var values = [];

            for (var x = 0; x < _valueDictionary.length; x++) {
                if (_valueDictionary[x].key === key) {
                    values.push(_valueDictionary[x].value);
                }
            }

            return values;
        };

        /**
         * Deletes the keys and values for a given querystring parameter.
         * 
         * @function
         * @public
         * @param {String} The parameter to delete
         * @example
         * sluri.searchParams.delete('foo');
         */
        this.delete = function(key) {
            for (var x = 0; x < _valueDictionary.length; x++) {
                if (_valueDictionary[x].key === key) {
                    _valueDictionary.splice(x, 1);
                }
            }
        };

        /**
         * Appends the key and value to the querystring.
         * 
         * @function
         * @public
         * @param {String} The parameter key to add
         * @param {String} The parameter value to add
         * @example
         * sluri.searchParams.append('foo', 'bar');
         */
        this.append = function(key, value) {
            _valueDictionary.push({key: key, value: value});
        };

        /**
         * Sets the key and value to the querystring parameter.
         *
         * Sets the first key found and removes the rest.
         * 
         * @function
         * @public
         * @param {String} The parameter key to add
         * @param {String} The parameter value to add
         * @example
         * sluri.searchParams.append('foo', 'bar');
         */
        this.set = function(key, value) {
            var found = 0;

            for (var x = 0; x < _valueDictionary.length; x++) {
                if (_valueDictionary[x].key === key) {
                    if (!found) {
                        _valueDictionary[x].value = value;
                    } else {
                        /* Remove all elements other than the first */
                        _valueDictionary.splice(x, 1);
                    }

                    found++;
                }
            }

            if (found === 0) {
                this.append(key, value);
            }
        };

        /**
         * Gets the keys in the querystring.
         * 
         * @function
         * @public
         * @returns {array}
         * @example
         * sluri.searchParams.keys(); // returns ['foo', 'bar']
         */
        this.keys = function() {
            var keyArray = [];

            for (var x = 0; x < _valueDictionary.length; x++) {
                keyArray.push(_valueDictionary[x].key);
            }

            return keyArray;
        };

        /**
         * Gets the values in the querystring.
         * 
         * @function
         * @public
         * @returns {array}
         * @example
         * sluri.searchParams.values(); // returns ['foo', 'bar']
         */
        this.values = function() {
            var valueArray = [];

            for (var x = 0; x < _valueDictionary.length; x++) {
                valueArray.push(_valueDictionary[x].value);
            }

            return valueArray;
        };
    }

    /**
     * Allows easy access to create, read, update and delete the selectors
     * without having to resort to manual string manipulation.
     *
     * Selectors are unique to Apache Sling and Adobe Experience Manager, as
     * such there isn't an interface to implement. However, the SLURISelectors
     * API matches the slURLSearchParams API and URLSearchParams interface as
     * closely as possible.
     *
     * @class
     * @protected
     * @param {String} The selector string to be deconstructed and manipulated
     * @see {slURLSearchParams}
     */
    function SLURISelectors(selectorString) {
        /**
         * The internal array that backs the selector string.
         *
         * @private
         * @member
         */
        var _values = [];

        /*
         * Deconstruct the selector string and store in the array backing.
         */
        if (selectorString) {
            _values = selectorString.split('.');
        }

        /**
         * Override the toString method to return a String representation of the
         * selectors.
         * 
         * @function
         * @public
         * @overrides
         * @returns {String}
         * @example
         * sluri.selectors.toString(); //returns 'foo.bar'
         */
        this.toString = function() {
            return fixedEncodeURI(_values.join('.'));
        };

        /**
         * Override the toString method to return a String representation of the
         * selectors.
         * 
         * @function
         * @public
         * @overrides
         * @returns {String}
         * @see {toString}
         * @example
         * sluri.searchParams.toString(); //returns 'foo.bar'
         */
        this.toLocaleString = function() {
            return this.toString();
        };

        /**
         * Determines if the URL contains the given selector.
         * 
         * @function
         * @public
         * @param {String} The selector to check for
         * @returns {Boolean}
         * @example
         * sluri.selectors.has('foo'); //returns true
         */
        this.has = function(selector) {
            return _values.indexOf(selector) !== -1;
        };

        /**
         * Appends a new selector to the URL.
         * 
         * @function
         * @public
         * @param {String} The selector to add
         * @example
         * sluri.selectors.append('foo');
         */
        this.append = function(selector) {
            _values.push(selector);
        };

        /**
         * Deletes a selector from the URL.
         * 
         * @function
         * @public
         * @param {String} The selector to delete
         * @example
         * sluri.selectors.delete('foo');
         */
        this.delete = function(selector) {
            var index = _values.indexOf(selector);

            if (index !== -1) {
                _values.splice(index, 1);
            }
        };

        /**
         * Gets the selectors as an array.
         * 
         * @function
         * @public
         * @returns {array}
         * @example
         * sluri.selectors.values(); // returns ['foo', 'bar']
         */
        this.values = function() {
            return _values;
        };
    }

    /**
    * A module representing a Sling URI object.
    *
    * The first parameter is required and must be an absolute path. However, the
    * first parameter is permitted to be a relative path if the second parameter
    * is provided and contains a valid URL origin.
    *
    * @class
    * @alias module:SLURI
    * @param {String|URL|SLURI|Location|HTMLAnchorElement} The URL used to
    *     construct the SLURI
    * @param {String|URL|SLURI|Location|HTMLAnchorElement} The base URL used to
    *     construct the origin of the SLURI if the urlString is a relative path
    * @throws {TypeError} if no arguments provided
    * @throws {TypeError} if URL cannot be constructed with a single parameter
    * @throws {TypeError} if URL cannot be constructed with the base parameter
    */
    var SLURI = function(urlString, baseURL) {
        var _self = this,
            _parts,
            _protocol,
            _username,
            _password,
            _hostname,
            _port,
            _resourcePath,
            _selectors,
            _extension,
            _suffix,
            _searchParams,
            _hash;

        /* Force instantiation of a new object */
        if (!(this instanceof SLURI)) {
            throw new TypeError('Failed to construct \'SLURI\': ' +
                'Please use the \'new\' operator, this DOM ' +
                'object constructor cannot be called as a function.');
        }

        /* urlString parameter is required */
        if (arguments.length < MIN_ARGUMENTS) {
            throw new TypeError('Failed to construct \'URL\': ' + MIN_ARGUMENTS +
                ' argument required, but only ' + arguments.length + ' present.');
        }

        /**
         * Determines if a URL string is formatted in a way that it can become a
         * SLURI. Essentially that means the string starts with a protocol such
         * as "http://".
         *
         * @private
         * @function
         * @param {String} the URL string to test
         * @returns {Boolean}
         * @see {@link https://url.spec.whatwg.org/#url-syntax}
         */
        function isValidProtocol(str) {
            return /^[a-zA-Z][a-zA-Z0-9+\.-]+:\/\//.test(str);
        }

        /**
         * Determines if an object is a URL type of object such as Location,
         * HTMLAnchorElement, URL or SLURI.
         *
         * Test if objects exist so that this can run in any browser or Node
         * environment.
         *
         * @private
         * @function
         * @param {object} the object to test
         * @returns {Boolean}
         */
        function isURLObject(url) {
            return url instanceof SLURI ||
                    (typeof Location !== 'undefined' && url instanceof Location) ||
                    (typeof HTMLAnchorElement !== 'undefined' && url instanceof HTMLAnchorElement) ||
                    (typeof URL !== 'undefined' && url instanceof URL);
        }

        /**
         * Convert integer to IP address string.
         *
         * @function
         * @private
         * @example
         * // returns '54.67.97.95'
         * integerToIPAddress(910385503)
         * @param {number} The integer to convert to an IP address
         * @returns {String} The IP Address converted from an integer
         * @see {@link http://stackoverflow.com/a/8105740/3022863}
         */
        function integerToIPAddress(num) {
            var d = num % 256;

            for (var i = 3; i > 0; i--) {
                num = Math.floor(num / 256);
                d = num % 256 + '.' + d;
            }

            return d;
        }

        /**
         * Deconstructs a pathname string into the individual URL pathname,
         * resourcePath, selectorString, extension, and suffix. Whereas the
         * traditional URL type objects (URL, Location, HTMLAnchorElement) would
         * combine all of these into the "pathname" property of their objects,
         * we want to break them apart for AEM/Sling type URLs.
         *
         * @private
         * @function
         * @param {string} the href string to deconstruct
         * @returns {object}
         */
        function deconstructPathname(href) {
            var pathParts,
                pathname = '/',
                resourcePath = '/',
                selectorString= '',
                extension = '',
                suffix = '';

            if (href) {
                /* Convert number to string */
                href = '' + href;

                /* Ensure pathname starts with a slash */
                if (href.indexOf('/') !== 0) {
                    href = '/' + href;
                }

                pathParts = href.split('.');
                resourcePath = pathParts[0];
                selectorString = pathParts.slice(1, pathParts.length - 1).join('.');
                extension = pathParts[pathParts.length - 1].split('/')[0];

                if (pathParts.length >= 2) {
                    suffix = pathParts[pathParts.length - 1].split('/').slice(1).join('/');
                    suffix = suffix ? '/' + suffix : '';
                    pathname = resourcePath + '.' + (selectorString && (selectorString + '.')) + extension;
                } else {
                    pathParts = href.split('/'); 
                    pathname = pathParts.length > 2 ? pathParts[1] : href;
                }
            }

            return {
                pathname : pathname,
                resourcePath : resourcePath,
                selectorString : selectorString,
                extension : extension,
                suffix : suffix
            };
        }

        /**
         * Deconstructs a URL string into individual URL parts such as protocol,
         * host, hostname, port, etc...as well as the addition of Sling URL
         * components such as resourcePath, selectorString, and suffix.
         *
         * The regular expression was modified from
         * {@link http://stackoverflow.com/a/24527267/3022863} in accordance
         * with RFC 3986 including the allowance of square brackets.
         *
         * pathname, selectorString, resourcePath, extension and suffix are
         * determined by string manipulation similar to how Apache Sling's
         * SlingRequestPathInfo does it.
         *
         * @private
         * @function
         * @param {String} the URL string to deconstruct
         * @returns {object}
         */
        function deconstructURLString(urlString) {
            var urlRegex,
                matches,
                origin,
                protocol,
                username,
                password,
                hostname,
                port,
                pathnameSelectorsSuffix,
                search,
                hash,
                pathnameParts;

            urlRegex = new RegExp(/^(?:(?:(([^:\/#\?]+:)?(?:(?:\/\/)(?:(?:(?:([^:@\/#\?]+)(?:\:([^:@\/#\?]*))?)@)?(([^:\/#\?]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((?:\/?(?:[^\/\?#]+\/+)*)(?:[^\?#]*)))?(\?[^#]+)?)(#.*)?/);
            matches = urlRegex.exec(urlString);
            origin = matches[1] || '';
            protocol = matches[2] || '';
            username = matches[3] || '';
            password = matches[4] || '';
            hostname = matches[6] || '';
            port = matches[7] || '';
            pathnameSelectorsSuffix = matches[8] || '';
            search = matches[9] || '';
            hash = matches[10] || '';

            pathnameParts = deconstructPathname(pathnameSelectorsSuffix);

            return {
                protocol : protocol,
                username : username,
                password : password,
                hostname : hostname,
                port : port,
                origin : origin,
                pathname : pathnameParts.pathname,
                resourcePath : pathnameParts.resourcePath,
                selectorString : pathnameParts.selectorString,
                extension : pathnameParts.extension,
                suffix : pathnameParts.suffix,
                search : search,
                hash : hash
            };
        }

        /**
         * Assign the deconstructed parts to internal properties.
         *
         * @param {object}
         */
        function asignPartsToSelf(parts) {
            _self.protocol = parts.protocol;
            _self.username = parts.username;
            _self.password = parts.password;
            _self.hostname = parts.hostname;
            _self.port = parts.port;
            _resourcePath = fixedEncodeURI(parts.resourcePath);
            _self.selectorString = parts.selectorString;
            _extension = fixedEncodeURI(parts.extension);
            _self.suffix = parts.suffix;
            _self.search = parts.search;
            _self.hash = parts.hash;
        }

        /**
         * Create the URL parts based on the instantiated object.
         *
         * urlString must be a String or a URL, SLURI, window.location or
         * HTMLAnchorElement. If it's a String, it must start with a protocol.
         *
         * @private
         * @function
         * @throws {TypeError} if not a valid URL
         * @todo: more checking for valid URL structures
         */
        function createParts() {
            var baseOrigin,
                deconstructedBaseURL;

            if (typeof urlString === 'string') {
                /*
                 * If path is relative, try to get the origin from the base,
                 * otherwise throw a TypeError.
                 */
                if (urlString.indexOf('/') === 0) {
                    if (baseURL) {
                        if (isURLObject(baseURL)) {
                            baseOrigin = baseURL.origin;
                        } else {
                            deconstructedBaseURL = deconstructURLString(baseURL);
                            baseOrigin = deconstructedBaseURL.hostname && deconstructedBaseURL.origin;
                        }

                        if (baseOrigin) {
                            urlString = baseOrigin + urlString;
                            _parts = deconstructURLString(urlString);
                        }
                    }
                } else if (isValidProtocol(urlString)) {
                    _parts = deconstructURLString(urlString);
                }
            } else if (isURLObject(urlString)) {
                _parts = deconstructURLString(urlString.href);
            }

            /* Could not deconstructURL */
            if (!_parts) {
                throw new TypeError(ERROR_MESSAGE);
            }
        }

        /**
         * Define SLURI getters and setters.
         *
         * The SLURI object behaves the same as the URL object by accessing and
         * setting properties rather than using functions.
         */
        Object.defineProperties(this, {
            /**
             * Getter and setter for the URL protocol.
             *
             * @public
             * @member
             * @returns {String}
             * @example
             * sluri.protocol; // returns 'http:'
             * sluri.protocol = 'https';
             */
            'protocol': {
                enumerable : true,
                configurable : true,
                get: function() {
                    return _protocol || EMPTY_STRING;
                },
                set: function(value) {
                    if (value && /^[a-zA-Z][a-zA-Z0-9+\.-]+:?$/.test(value)) {
                        _protocol = value.substr(-1) === ':' ? value : value + ':';
                    }
                }
            },

            /**
             * Getter and setter for the URL username.
             *
             * @public
             * @member
             * @returns {String}
             * @example
             * sluri.username; // returns 'myusername'
             * sluri.username = 'mynewusername';
             */
            'username': {
                enumerable : true,
                configurable : true,
                get: function() {
                    return _username || EMPTY_STRING;
                },
                set: function(value) {
                    _username = fixedEncodeURI(EMPTY_STRING + value);
                }
            },

            /**
             * Getter and setter for the URL password.
             *
             * @public
             * @member
             * @returns {String}
             * @example
             * sluri.password; // returns 'mypassword'
             * sluri.password = 'mypassword';
             */
            'password': {
                enumerable : true,
                configurable : true,
                get: function() {
                    return _password || EMPTY_STRING;
                },
                set: function(value) {
                    _password = fixedEncodeURI(EMPTY_STRING + value);
                }
            },

            /**
             * Getter and setter for the URL hostname.
             *
             * @public
             * @member
             * @returns {String}
             * @example
             * sluri.hostname; // returns 'www.mysite.com'
             * sluri.hostname = 'www.mynewsite.com';
             */
            'hostname': {
                enumerable : true,
                configurable : true,
                get: function() {
                    return _hostname || EMPTY_STRING;
                },
                set: function(value) {
                    if (value) {
                        if (!isNaN(value)) {
                            _hostname = integerToIPAddress(value);
                        } else {
                            /*
                             * Ignore the port number if it's trying to be set
                             * here.
                             */
                            _hostname = fixedEncodeURI(value.split(':')[0]);
                        }
                    }
                }
            },

            /**
             * Getter and setter for the URL host which is the hostname and port
             * number.
             *
             * @public
             * @member
             * @returns {String}
             * @example
             * sluri.host; // returns 'www.mysite.com:4502'
             * sluri.host = 'www.mynewsite.com:8080';
             */
            'host': {
                enumerable : true,
                configurable : true,
                get: function() {
                    var tempHost = _hostname || EMPTY_STRING;

                    if (_port) {
                        tempHost += ':' + _port;
                    }

                    return tempHost;
                },
                set: function(value) {
                    if (value) {
                        var parts = value.split(':'),
                            hostPart = parts[0],
                            portPart = parts[1];

                        this.hostname = hostPart;

                        if (portPart) {
                            this.port = portPart;
                        }
                    }
                }
            },

            /**
             * Getter and setter for the URL port.
             *
             * @public
             * @member
             * @returns {String}
             * @example
             * sluri.hostname; // returns '4502'
             * sluri.hostname = 8080;
             */
            'port': {
                enumerable : true,
                configurable : true,
                get: function() {
                    return _port || EMPTY_STRING;
                },
                set: function(value) {
                    if (value !== null && value !== undefined) {
                        if (value === EMPTY_STRING) {
                            _port = value;
                        } else if (typeof value === 'number' || /^\d+(\.\d+)?$/.test(value)) {
                            _port = EMPTY_STRING + parseInt(value, 10);
                        }
                    }
                }
            },

            /**
             * Getter for the URL origin which is the protocol, hostname and
             * port.
             *
             * @public
             * @member
             * @readonly
             * @returns {String}
             * @example
             * sluri.origin; // returns 'http://www.mysite.com:4502'
             */
            'origin': {
                enumerable : true,
                configurable : true,
                get: function() {
                    return this.protocol + '//' + this.host;
                },
                set: function() {
                    /* read-only */
                }
            },

            /**
             * Getter and setter for the URL pathname which includes the
             * resourcePath, selectors and extension. Defaults to '/'.
             *
             * @public
             * @member
             * @returns {String}
             * @example
             * sluri.pathname; // returns '/us/en/page.foo.bar.html'
             * sluri.pathname = '/fr/fr/page.html';
             */
            'pathname': {
                enumerable : true,
                configurable : true,
                get: function() {
                    var pathname;

                    if (_resourcePath && _resourcePath !== '/') {
                        pathname = _resourcePath;

                        if (this.selectorString) {
                            pathname += '.' + this.selectorString;
                        }

                        if (_extension) {
                            pathname += '.' + _extension;
                        }
                    }

                    return pathname || '/';
                },
                set: function(value) {
                    var pathParts;

                    if (!null && !undefined) {
                        pathParts = deconstructPathname(value);
                        _resourcePath = fixedEncodeURI(pathParts.resourcePath);
                        _extension = fixedEncodeURI(pathParts.extension);
                        this.selectorString = pathParts.selectorString;
                    }
                }
            },

            /**
             * Getter for the URL resourcePath which is the pathname without the
             * selectors or extension.
             *
             * @public
             * @member
             * @returns {String}
             * @example
             * sluri.resourcePath; // returns '/us/en/page'
             */
            'resourcePath': {
                enumerable : true,
                configurable : true,
                get: function() {
                    return _resourcePath;
                },
                set: function(value) {
                    if (value !== null && value !== undefined) {
                        _resourcePath = fixedEncodeURI(value);
                    }
                }
            },

            /**
             * Getter and setter for the URL selectorString.
             *
             * @public
             * @member
             * @returns {String}
             * @example
             * sluri.selectorString; // returns 'foo.bar'
             * sluri.selectorString = 'biz.baz';
             */
            'selectorString': {
                enumerable : true,
                configurable : true,
                get: function() {
                    return this.selectors.toString();
                },
                set: function(value) {
                    if (value !== null && value !== undefined) {
                        this.selectors = new SLURISelectors(value);
                    }
                }
            },

            /**
             * Getter and setter for the URL selectors object.
             *
             * @public
             * @member
             * @returns {SLURISelectors}
             * @example
             * sluri.selectors; // returns {}
             * sluri.selectors = new SLURISelectors('biz.baz');
             */
            'selectors': {
                enumerable : true,
                configurable : true,
                get: function() {
                    return _selectors;
                },
                set: function(value) {
                    if (value instanceof SLURISelectors) {
                        _selectors = value;
                    }
                }
            },

            /**
             * Getter and setter for the URL extension.
             *
             * @public
             * @member
             * @returns {String}
             * @example
             * sluri.extension // returns 'html'
             * sluri.extension = 'json';
             */
            'extension': {
                enumerable : true,
                configurable : true,
                get: function() {
                    return _extension || '';
                },
                set: function(value) {
                    /*
                     * If the pathname has an extension, do a replacement with
                     * the new value.
                     */
                    if (_extension && value) {
                        _extension = fixedEncodeURI(value);
                    }
                }
            },

            /**
             * Getter and setter for the URL suffix.
             *
             * @public
             * @member
             * @returns {String}
             * @example
             * sluri.suffix // returns '/foo/bar'
             * sluri.suffix = '/biz/baz';
             */
            'suffix': {
                enumerable : true,
                configurable : true,
                get: function() {
                    return _suffix;
                },
                set: function(value) {
                    if (value !== null && value !== undefined) {
                        _suffix = fixedEncodeURI(value);
                    }
                }
            },

            /**
             * Getter and setter for the URL search.
             *
             * @public
             * @member
             * @returns {String}
             * @example
             * sluri.search // returns '?alpha=bravo&charlie=delta'
             * sluri.search = 'foo=bar&biz=baz';
             */
            'search': {
                enumerable : true,
                configurable : true,
                get: function() {
                    var value = _searchParams.toString();
                    return value ? '?' + value : EMPTY_STRING;
                },
                set: function(value) {
                    if (value !== null && value !== undefined) {
                        _searchParams = new SLURISearchParams(value);
                    }
                }
            },

            /**
             * Getter and setter for the URL searchParams object.
             *
             * @public
             * @member
             * @returns {SLURISearchParams}
             * @example
             * sluri.searchParams; // returns {}
             * sluri.searchParams = new SLURISearchParams('foo=bar&biz=baz'');
             */
            'searchParams': {
                enumerable : true,
                configurable : true,
                get: function() {
                    return _searchParams;
                },
                set: function(value) {
                    if (value instanceof SLURISearchParams) {
                        _searchParams = value;
                    }
                }
            },

            /**
             * Getter and setter for the URL hash.
             *
             * Don't encode the hash value
             *
             * @public
             * @member
             * @returns {String}
             * @example
             * sluri.hash // returns '#foo'
             * sluri.hash = 'bar';
             */
            'hash': {
                enumerable : true,
                configurable : true,
                get: function() {
                    return _hash || EMPTY_STRING;
                },
                set: function(value) {
                    if (value) {
                        _hash = value.indexOf('#') === 0 ? value : '#' + value;
                    } else {
                        _hash = EMPTY_STRING;
                    }
                }
            },

            /**
             * Getter and setter for the URL href which is all the URL parts
             * together.
             *
             * @public
             * @member
             * @returns {String}
             * @example
             * sluri.href // returns 'http://user:pass@www.nateyolles.com:4502/us/en/page.biz.baz.html/foo/bar?alpha=bravo&charlie=delta&echo#foxtrot'
             * sluri.href = 'http://www.mysite.com/us/page.foo.html/foo/bar';
             */
            'href': {
                enumerable : true,
                configurable : true,
                get: function() {
                    var constructedHref = [];

                    constructedHref.push(this.protocol + '//');
                    constructedHref.push(this.username);
                    constructedHref.push(this.password && ':' + this.password);
                    constructedHref.push((this.username || this.password) && '@');
                    constructedHref.push(this.host);
                    constructedHref.push(this.pathname);
                    constructedHref.push(this.suffix);
                    constructedHref.push(this.search);
                    constructedHref.push(this.hash);

                    return constructedHref.join('');
                },
                set: function(value) {
                    /* Deconstruct the value the same as the constructor. */
                    if (value) {
                        _parts = deconstructURLString(value);
                        asignPartsToSelf(_parts);
                    }
                }
            }
        });

        /* Assign parts to self on instantiation */
        createParts();
        asignPartsToSelf(_parts);
    };

    /**
     * Return the href as the String representation of the SLURI object.
     *
     * @function
     * @public
     * @override
     */
    SLURI.prototype.toString = function(){
        return this.href;
    };

    /**
     * Return the href as the String representation of the SLURI object.
     *
     * @function
     * @public
     * @override
     * @see {@link toString}
     */
    SLURI.prototype.toLocaleString = function(){
        return this.href;
    };

    /* Make the SLURI object public and instantiable. */
    return SLURI;
}));
