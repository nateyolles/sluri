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
 * slURI is a client-side URI/URL manipulation library for Adobe Experience
 * Manager (AEM/CQ5) and Apache Sling. slURI is an implementation of the
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/URL|URL API} with
 * considerations for the unique URL structure of AEM/Sling applications.
 *
 * Example:
 * var sluri = new slURI('http://user:pass@www.nateyolles.com:4502/us/en/page.biz.baz.html/foo/bar?alpha=bravo&charlie=delta&echo#foxtrot');
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
 * sluri.selectors.constructor.name === 'slURISelectors'
 *     sluri.selectors.toString() === 'biz.baz'
 *     sluri.selectors.has('biz') === true
 *     sluri.selectors.append('qux')
 *     sluri.selectors.delete('biz')
 *     sluri.selectors.values() is ['baz', 'qux']
 * sluri.search === '?alpha=bravo&charlie=delta'
 * sluri.searchParams.constructor.name === 'slURISearchParams'
 *     sluri.searchParams.toString() === 'alpha=bravo&charlie=delta'
 *     sluri.searchParams.has('alpha') === true
 *     sluri.searchParams.get('alpha') === 'bravo'
 *     sluri.searchParams.getAll('alpha') === ['bravo']
 *     sluri.searchParams.keys() is ['alpha', 'charlie']
 *     sluri.searchParams.values() is ['bravo', 'delta']
 *     sluri.searchParams.set('alpha', 'echo')
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
 * var sluri = new slURI(fooString); // sluri.href === 'http://www.foo.com/us/en/foo.html'
 * var sluri = new slURI(fooURL); // sluri.href === 'http://www.foo.com/us/en/foo.html'
 * var sluri = new slURI(fooAnchor); // sluri.href === 'http://www.foo.com/us/en/foo.html'
 * var sluri = new slURI(window.location); // sluri.href === 'http://www.currentsite.com/'
 * var sluri = new slURI(barString, fooString); // sluri.href === 'http://www.foo.com/bar.html'
 * var sluri = new slURI(barString, fooURL); // sluri.href === 'http://www.foo.com/bar.html'
 * var sluri = new slURI(barString, fooAnchor); // sluri.href === 'http://www.foo.com/bar.html'
 * var sluri = new slURI(barString, window.location); // sluri.href ==='http://www.currentsite.com/bar.html'
 *
 * This script is in a UMD (Universal Module Definition) pattern allowing the
 * script to be used as a global or as an AMD (Asynchronous Module Definition)
 * module with the use of an AMD loader such as RequireJS or Almond.
 *
 * @module slURI
 * @author Nate Yolles <nate@nateyolles.com>
 * @copyright Nate Yolles 2016
 * @license Apache-2.0
 * @implements {URL}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/URL} for URL interface
 * @see {@link https://github.com/umdjs/umd/blob/master/templates/amdWeb.js} for UMD boilerplate
 */
(function (root, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else {
        // Browser globals
        root.slURI = factory();
    }
}(this, function() {
    'use strict';

    var MIN_ARGUMENTS = 1,
        EMPTY_STRING = '',
        ERROR_MESSAGE = 'Failed to construct \'URL\': Invalid URL';

    /**
     * Determine if the browser supports getting the username and password from
     * an HTMLAnchorElement of which PhantomJS does not.
     *
     * @private
     * @member {Boolean}
     * @todo Remove this function, write a PhantomJS polyfill, exclude this from
     *     the build, or change the base functionality from parsing with the DOM
     *     to using a regular expression.
     */
    var supportUserPass = (function() {
        var link = document.createElement('a');
        link.href = 'http://user:pass@www.foo.com';

        return link.username === 'user' && link.password === 'pass';
    })();

    /**
    * A module representing a Sling URI object.
    *
    * The first parameter is required and must be an absolute path. However, the
    * first parameter is permitted to be a relative path if the second parameter
    * is provided and contains a valid URL origin.
    *
    * @class
    * @alias module:slURI
    * @param {String|URL|slURI|Location|HTMLAnchorElement} The URL used to
    *     construct the slURI
    * @param {String|URL|slURI|Location|HTMLAnchorElement} The base URL used to
    *     construct the origin of the slURI if the urlString is a relative path
    * @throws {TypeError} if no arguments provided
    * @throws {TypeError} if URL cannot be constructed with a single parameter
    * @throws {TypeError} if URL cannot be constructed with the base parameter
    */
    var slURI = function(urlString, baseURL) {
        var _self = this,
            _parts,
            _protocol,
            _username,
            _password,
            _hostname,
            _port,
            _pathname,
            _selectors,
            _suffix,
            _searchParams,
            _hash;

        /* Force instantiation of a new object */
        if (!(this instanceof slURI)) {
            throw new TypeError('Failed to construct \'slURI\': ' +
                'Please use the \'new\' operator, this DOM ' +
                'object constructor cannot be called as a function.');
        }

        /* urlString parameter is required */
        if (arguments.length < MIN_ARGUMENTS) {
            throw new TypeError('Failed to construct \'URL\': ' + MIN_ARGUMENTS +
                ' argument required, but only ' + arguments.length + ' present.');
        }

        /*
         * urlString must be a String or a URL, slURI, window.location or
         * HTMLAnchorElement. If it's a String, it must start with a protocol.
         * @todo: clean this up
         */
        if (typeof urlString === 'string') {
            if (urlString.indexOf('/') === 0) {
                if (baseURL) {
                    var baseOrigin;
                    var baseHostname;

                    if (isURLObject(baseURL)) {
                        baseOrigin = baseURL.origin;
                    } else {
                        var deconstructedBaseURL = deconstructURLString(baseURL);
                        baseOrigin = deconstructedBaseURL.hostname && deconstructedBaseURL.origin;
                    }

                    if (baseOrigin) {
                        urlString = baseOrigin + urlString;
                        _parts = deconstructURLString(urlString);
                    } else {
                        throw new TypeError(ERROR_MESSAGE);
                    }
                } else {
                    throw new TypeError(ERROR_MESSAGE);
                }
            } else if (constructableURL(urlString)) {
                _parts = deconstructURLString(urlString);
            } else {
                throw new TypeError(ERROR_MESSAGE);
            }
        } else if (isURLObject(urlString)) {
            _parts = deconstructURLString(urlString.href);
        } else {
            throw new TypeError(ERROR_MESSAGE);
        }

        /**
         * Determines if a URL string is formatted in a way that it can become a
         * slURI. Essentially that means the string starts with a protocal such
         * as "http://".
         *
         * @private
         * @function
         * @param {String} the URL string to test
         * @returns {Boolean}
         */
        function constructableURL(href) {
            return /^\w+:\/\//.test(href);
        }

        /**
         * Determines if an object is a URL type of object such as Location,
         * HTMLAnchorElement, URL or slURI.
         *
         * @private
         * @function
         * @param {object} the object to test
         * @returns {Boolean}
         */
        function isURLObject(url) {
            return url instanceof Location ||
                    url instanceof slURI ||
                    url instanceof HTMLAnchorElement ||
                    (typeof URL !== 'undefined' && url instanceof URL);
        }

        /**
         * Deconstructs a URL string into individual URL parts such as protocol,
         * host, hostname, port, etc...as well as the addition of Sling URL
         * components such as resourcePath, selectorString, and suffix.
         *
         * @private
         * @function
         * @param {String} the URL string to deconstruct
         * @returns {object}
         */
        function deconstructURLString(urlString) {
            /**
             * The regex used to find the username and password from the URL
             * string.
             *
             * @todo Either remove when PhantomJS polyfill is created, simplify
             *     to only search for username and password, or expand to handle
             *     Sling URLs and remove the URL parsing with the DOM Anchor
             *     tag.
             */
            var urlRegex = /^(?:(?:(([^:\/#\?]+:)?(?:(?:\/\/)(?:(?:(?:([^:@\/#\?]+)(?:\:([^:@\/#\?]*))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((?:\/?(?:[^\/\?#]+\/+)*)(?:[^\?#]*)))?(\?[^#]+)?)(#.*)?/;

            var link,
                username,
                password,
                pathParts,
                matches;

            link = document.createElement('a');
            link.href = urlString;

            pathParts = deconstructPathname(link.pathname);

            /*
             * @todo Remove this function, write a PhantomJS polyfill, exclude
             *     this from the build, or change the base functionality from
             *     parsing with the DOM to using a regular expression.
             */
            if (supportUserPass) {
                username = link.username;
                password = link.password;
            } else {
                matches = urlRegex.exec(urlString);
                username = matches[3] || EMPTY_STRING;
                password = matches[4] || EMPTY_STRING;
            }

            return {
                protocol : link.protocol,
                username : username,
                password : password,
                hostname : link.host,
                port : link.port,
                origin: link.origin,
                pathname : pathParts.pathname,
                resourcePath : pathParts.resourcePath,
                selectorString : pathParts.selectorString,
                extension : pathParts.extension,
                suffix : pathParts.suffix,
                search : link.search,
                hash : link.hash
            };
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
         * @param {String} the href string to deconstruct
         * @returns {object}
         * @todo Decide on whether to retain URL string parsing through the DOM
         *     or replace this with a regular expression and matching groups.
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
         * Convert integer to IP address string.
         *
         * @function
         * @private
         * @example
         * // returns '54.67.97.95'
         * integerToIPAddress(910385503)
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
         * Extend and object with another object.
         *
         * @function
         * @private
         * @param {object} The base object
         * @param {object} The extension object
         * @returns {object} The extended base object
         */
        // function extend(a, b) {
        //     for (var key in b) {
        //         if (b.hasOwnProperty(key)) {
        //             a[key] = b[key];
        //         }
        //     }

        //     return a;
        // }

        /**
         * Define slURI getters and setters.
         *
         * The slURI object behaves the same as the URL object by accessing and
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
                    if (value && /^[A-Za-z-]+:?$/.test(value)) {
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
                    _username = EMPTY_STRING + value;
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
                    _password = EMPTY_STRING + value;
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
                            _hostname = value.split(':')[0];
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
                    return _pathname || '/';
                },
                set: function(value) {
                    var pathParts;

                    if (!null && !undefined) {
                        pathParts = deconstructPathname(value);
                        _pathname = pathParts.pathname;
                        this.selectorString = pathParts.selectorString;

                        if (pathParts.pathname && pathParts.pathname.indexOf('/') === -1) {
                            this.suffix = '';
                        }
                    }
                }
            },

            /**
             * Getter for the URL resourcePath which is the pathname without the
             * selectors or extension.
             *
             * @public
             * @member
             * @readonly
             * @returns {String}
             * @example
             * sluri.resourcePath; // returns '/us/en/page'
             */
            'resourcePath': {
                enumerable : true,
                configurable : true,
                get: function() {
                    return this.pathname.split('.')[0];
                },
                set: function() {
                    /* read-only */
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
                    return this.selectors.values() ? this.selectors.values().join('.') : EMPTY_STRING;
                },
                set: function(value) {
                    if (value !== null && value !== undefined) {
                        this.selectors = new slURISelectors(value);
                    }
                }
            },

            /**
             * Getter and setter for the URL selectors object.
             *
             * @public
             * @member
             * @returns {slURISelectors}
             * @example
             * sluri.selectors; // returns {}
             * sluri.selectors = new slURISelectors('biz.baz');
             */
            'selectors': {
                enumerable : true,
                configurable : true,
                get: function() {
                    return _selectors;
                },
                set: function(value) {
                    if (value instanceof slURISelectors) {
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
                    return this.pathname.indexOf('.') === -1 ? EMPTY_STRING : this.pathname.substr(this.pathname.lastIndexOf('.') + 1);
                },
                set: function(value) {
                    if (value && this.pathname && this.pathname.indexOf('.') !== -1) {
                        this.pathname = this.pathname.substr(0, this.pathname.lastIndexOf('.') + 1) + value;
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
                        _suffix = value;
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
                        _searchParams = new slURISearchParams(value);
                    }
                }
            },

            /**
             * Getter and setter for the URL searchParams object.
             *
             * @public
             * @member
             * @returns {slURISearchParams}
             * @example
             * sluri.searchParams; // returns {}
             * sluri.searchParams = new slURISearchParams('foo=bar&biz=baz'');
             */
            'searchParams': {
                enumerable : true,
                configurable : true,
                get: function() {
                    return _searchParams;
                },
                set: function(value) {
                    if (value instanceof slURISearchParams) {
                        _searchParams = value;
                    }
                }
            },

            /**
             * Getter and setter for the URL hash.
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
                        temp(_parts);
                    }
                }
            }
        });

        /*
         * Assign the deconstructed parts to internal properties.
         *
         * @todo clean this up
         */
        function temp(_parts) {
            //extend(_self, _parts);
            _self.protocol = _parts.protocol;
            _self.username = _parts.username;
            _self.password = _parts.password;
            _self.hostname = _parts.hostname;
            _self.port = _parts.port;
            _self.resourcePath = _parts.resourcePath;
            _pathname = _parts.pathname;
            _self.selectorString = _parts.selectorString;
            _self.suffix = _parts.suffix;
            _self.search = _parts.search;
            _self.hash = _parts.hash;
        }
        temp(_parts);
    };

    /**
     * Return the href as the String representation of the slURI object.
     *
     * @function
     * @public
     * @override
     */
    slURI.prototype.toString = function(){
        return this.href;
    };

    /**
     * Return the href as the String representation of the slURI object.
     *
     * @function
     * @public
     * @override
     * @see {@link toString}
     */
    slURI.prototype.toLocaleString = function(){
        return this.href;
    };

    /**
     * The slURI implementation of the URLSearchParams interface.
     *
     * Allows easy access to create, read, update and delete querystring
     * parameters without having to resort to manual string manipulation.
     *
     * Handles multiple values for a given key in the querystring. There are
     * many ways different web frameworks handle this. slURISearchParams takes
     * the same approach as the SearchParams interface that it is implementing.
     * An example of multiple values is: '?foo=red&bar=blue&foo=green'. Calling
     * the #get method will return the first occurance, while calling the
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
    function slURISearchParams(searchString) {
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
                valueArray.push(_valueDictionary[x].key + '=' + _valueDictionary[x].value);
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
     * such there isn't an interface to implement. However, the slURISelectors
     * API matches the slURLSearchParams API and URLSearchParams interface as
     * closely as possible.
     *
     * @class
     * @protected
     * @param {String} The selector string to be deconstructed and manipulated
     * @see {slURLSearchParams}
     */
    function slURISelectors(selectorString) {
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
            return _values.join('.');
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

    /* Make the slURI object public and instantiable. */
    return slURI;
}));
