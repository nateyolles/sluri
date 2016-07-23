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
// https://github.com/umdjs/umd/blob/master/templates/amdWeb.js
// Uses AMD or browser globals to create a module.

// If you want something that will also work in Node, see returnExports.js
// If you want to support other stricter CommonJS environments,
// or if you need to create a circular dependency, see commonJsStrict.js

// Defines a module "amdWeb" that depends on another module called "b".
// Note that the name of the module is implied by the file name. It is best
// if the file name and the exported global have matching names.

// If the 'b' module also uses this type of boilerplate, then
// in the browser, it will create a global .b that is used below.

// If you do not want to support the browser global path, then you
// can remove the `root` use and the passing of `this` as the first arg to
// the top function.
//Failed to construct 'URL': Invalid URL
//Failed to construct 'URL': Invalid base URL
//Failed to construct 'URL': 1 argument required, but only 0 present
// http://user:pass@www.nateyolles.com:4502/us/en/page.one.two.html/foo/bar?alpha=bravo&charlie#delta
//var slURI = new slURI('http://www.nateyolles.com/us/en/page.biz.baz.html/foo/bar?alpha=bravo&charlie=delta&echo#foxtrot');
/*
SLURI(urlString, [baseURLstring])
SLURI(urlString, baseURLobject)
*/
(function (root, factory) {
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
        EMPTY_STRING = '';

    /* 
     * PhantomJS does not support getting the username and password from a
     * location object.
     */
    var supportUserPass = (function() {
        var link = document.createElement('a');
        link.href = 'http://user:pass@www.foo.com';

        return link.username === 'user' && link.password === 'pass';
    })();

    var slURI = function(urlString, baseURLstring) {
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
            throw new TypeError("Failed to construct 'slURI': " +
                "Please use the 'new' operator, this DOM " +
                "object constructor cannot be called as a function.");
        }

        /* urlString parameter is required */
        if (arguments.length < MIN_ARGUMENTS) {
            throw new TypeError("Failed to construct 'URL': " + MIN_ARGUMENTS +
                " argument required, but only " + arguments.length + " present.");
        }

        /* urlString must be a String or have a href attribute (URL, slURI, window.location) */
        if (typeof urlString === 'string') {
            _parts = deconstructURLString(urlString);
        } else if  (urlString && urlString.href) {
            _parts = deconstructURLString(urlString.href);
        } else {
            throw new TypeError("Failed to construct 'URL': Invalid URL");
        }

        function deconstructURLString(urlString) {
            var urlRegex = /^(?:(?:(([^:\/#\?]+:)?(?:(?:\/\/)(?:(?:(?:([^:@\/#\?]+)(?:\:([^:@\/#\?]*))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((?:\/?(?:[^\/\?#]+\/+)*)(?:[^\?#]*)))?(\?[^#]+)?)(#.*)?/;

            var link,
                username,
                password,
                pathParts,
                resourcePath,
                selectorString,
                extension,
                suffix,
                matches;

            link = document.createElement('a');
            link.href = urlString;

            if (link.pathname) {
                pathParts = link.pathname.split('.');
                resourcePath = pathParts[0];
                selectorString = pathParts.slice(1, pathParts.length - 1).join('.');
                extension = pathParts[pathParts.length - 1].split('/')[0];
                suffix;

                if (pathParts.length >= 3) {
                    suffix = pathParts[pathParts.length - 1].split('/').slice(1).join('/')
                    suffix = suffix ? '/' + suffix : '';
                }
            }

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
                pathname : link.pathname,
                // resourcePath : resourcePath,
                selectorString : selectorString,
                extension : extension,
                suffix : suffix,
                search : link.search,
                hash : link.hash
            }
        }

        /**
         * Convert integer to IP address
         *
         * integerToIPAddress(910385503) = '54.67.97.95'
         * see: http://stackoverflow.com/a/8105740/3022863
         */
        function integerToIPAddress(num) {
            var d = num % 256;

            for (var i = 3; i > 0; i--) {
                num = Math.floor(num / 256);
                d = num % 256 + '.' + d;
            }

            return d;
        }

        function extend(a, b){
            for (var key in b)
                if (b.hasOwnProperty(key))
                    a[key] = b[key];
            return a;
        }

        Object.defineProperties(this, {
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

            'port': {
                enumerable : true,
                configurable : true,
                get: function() {
                    return _port || EMPTY_STRING;
                },
                set: function(value) {
                    //if (!isNaN(value)) {
                    if (value !== null && value !== undefined) {
                        if (value == EMPTY_STRING) {
                            _port = value;
                        } else if (typeof value === 'number' || /^\d+(\.\d+)?$/.test(value)) {
                            _port = EMPTY_STRING + parseInt(value, 10);
                        }
                    }
                }
            },

            'origin': {
                enumerable : true,
                configurable : true,
                get: function() {
                    return this.protocol + '//' + this.host;
                },
                set: function(value) {
                    /* read-only */
                }
            },

            'pathname': {
                enumerable : true,
                configurable : true,
                get: function() {
                    return _pathname || '/';
                },
                set: function(value) {
                    if (!null && !undefined) {
                        _pathname = value;
                    }
                }
            },

            'extension': {
                enumerable : true,
                configurable : true,
                get: function() {
                    return this.pathname === '/' ? EMPTY_STRING : this.pathname.substr(this.pathname.lastIndexOf('.') + 1);
                    //return this.pathname.substr(this.pathname.lastIndexOf('.') + 1) || EMPTY_STRING;
                },
                set: function(value) {
                    if (value && this.pathname && this.pathname.indexOf('.') !== -1) {
                        this.pathname = this.pathname.substr(0, this.pathname.lastIndexOf('.') + 1) + value;
                    }
                }
            },

            'selectorString': {
                enumerable : true,
                configurable : true,
                get: function() {
                    return this.selectors.values() ? this.selectors.values().join('.') : EMPTY_STRING;
                },
                set: function(value) {
                    if (value != null && value != undefined) {
                        this.selectors = new slURISelectors(value);
                    }
                }
            },

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

            'search': {
                enumerable : true,
                configurable : true,
                get: function() {
                    var value = _searchParams.toString()
                    return value ? '?' + value : EMPTY_STRING;
                },
                set: function(value) {
                    if (value != null && value != undefined) {
                        _searchParams = new slURISearchParams(value);
                    }
                }
            },

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
                    constructedHref.push(this.search);
                    constructedHref.push(this.hash);

                    return constructedHref.join('');
                },
                set: function(value) {
                    if (value) {
                        _parts = deconstructURLString(value);
                        temp(_parts);
                    }
                }
            }
        });

        function temp(_parts) {
            //extend(_self, _parts);
            _self.protocol = _parts.protocol;
            _self.username = _parts.username;
            _self.password = _parts.password;
            _self.hostname = _parts.hostname;
            _self.port = _parts.port;
            _self.pathname = _parts.pathname;
            _self.selectorString = _parts.selectorString;
            _self.suffix = _parts.suffix;
            _self.search = _parts.search;
            _self.hash = _parts.hash;
        }
        temp(_parts);
    };

    slURI.prototype.toString = function(){
        return this.href;
    };

    slURI.prototype.toLocaleString = function(){
        return this.href;
    };

    function slURISearchParams(searchString) {
        var _searchString,
            _searchStringSplit,
            _valueDictionary = {};

        if (searchString) {
            _searchString = (EMPTY_STRING + searchString).replace('?', '');
            _searchStringSplit = _searchString.split('&');

            for (var x = 0; x < _searchStringSplit.length; x++) {
                var split = _searchStringSplit[x].split('=');
                _valueDictionary[split[0]] = split[1] || EMPTY_STRING;
            }
        }

        this.toString = function() {
            var valueArray = [];

            for (var key in _valueDictionary) {
                if (_valueDictionary.hasOwnProperty(key)) {
                    valueArray.push(key + '=' + _valueDictionary[key]);
                }
            }

            return valueArray.length > 0 ? valueArray.join('&') : EMPTY_STRING;
        };

        this.toLocaleString = function(){
            return this.toString()
        };

        this.has = function(key) {
            return _valueDictionary[key] !== undefined;
        };

        this.get = function(key) {
            return _valueDictionary[key] !== undefined ? _valueDictionary[key] : null;
        };

        this.delete = function(key) {
            delete _valueDictionary[key];
        };

        this.append = function(key, value) {
            _valueDictionary[key] = value;
        };

        this.set = function(key, value) {
            _valueDictionary[key] = value;
        };

        this.keys = function() {
            return Object.keys(_valueDictionary);
        };

        this.values = function() {
            var valueArray = [];
            
            for (var key in _valueDictionary) {
               if (_valueDictionary.hasOwnProperty(key)) {
                  valueArray.push(_valueDictionary[key]);
               }
            }

            return valueArray;
        };

        this.getAll = function(key) {
            throw Error('not implemented yet');
        };
    }

    function slURISelectors(selectorString) {
        var _values = [];

        if (selectorString) {
            _values = selectorString.split('.');
        }

        this.toString = function() {
            return _values.join('.');
        }

        this.toLocaleString = function() {
            return this.toString();
        }

        this.has = function(selector) {
            return _values.indexOf(selector) !== -1;
        }

        this.append = function(selector) {
            _values.push(selector);
        }

        this.delete = function(selector) {
            var index = _values.indexOf(selector);

            if (index !== -1) {
                _values.splice(index, 1);
            }
        }

        this.values = function(selector) {
            return _values;
        }
    }

    return slURI;
}));
