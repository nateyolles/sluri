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

    var MIN_ARGUMENTS = 1;
    var EMPTY_STRING = '';

    var slURI = function(urlString, baseURLstring) {
        var self = this;

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

        /* deconstruct url */
        var parts;
        
        if (typeof urlString === 'string') {
            parts = document.createElement('a');
            parts.href = urlString;
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

        var extensionStart = parts.pathname.lastIndexOf('.');
        var pathnameAndSelector = parts.pathname.substring(0, extensionStart);  // "/us/en/page.my.selector"
        var extensionAndSuffix = parts.pathname.substring(extensionStart);      // ".html/foo/bar"
        var selector = pathnameAndSelector.substring(pathnameAndSelector.indexOf('.') + 1);
        var pathname = pathnameAndSelector.substring(0, pathnameAndSelector.indexOf('.'));
        var suffix = extensionAndSuffix.substring(extensionAndSuffix.indexOf('/'))
        var extension = extensionAndSuffix.substring(1, extensionAndSuffix.indexOf('/'))
        pathname += '.' + extension;


        var _protocol,
            _username,
            _password,
            _hostname,
            _port,
            //_extension,
            _searchParams,
            _hash;

        //var _hash = parts.hash || EMPTY_STRING;             //"#delta"
        //this.host = parts.host || EMPTY_STRING;             //"www.yahoo.com:4502";
        //this.hostname = parts.hostname || EMPTY_STRING;     //"www.yahoo.com";
        this.href = parts.href || EMPTY_STRING;             //"http://nate:yolles@www.yahoo.com:4502/page.html?alpha=bravo&charlie=#delta"
        //this.origin = "http://www.yahoo.com:4502"; //readonly
        //this.password = parts.password || EMPTY_STRING;     // "yolles";
        this.pathname = pathname || EMPTY_STRING;           //"/page.html";        "/us/en/page.my.selector.html/foo/bar"
        //var _port = parts.port || EMPTY_STRING;             //"4502";
        //this.protocol = parts.protocol || EMPTY_STRING;     //"http:";
        //this.search = parts.search || EMPTY_STRING;         //"?alpha=bravo&charlie="; 
        //this.searchParams = new slURISearchParams(this.search); //URLSearchParams
        //this.username = parts.username || EMPTY_STRING;      //"nate";
        this.suffix = suffix || EMPTY_STRING;               //"/foo/bar";
        //this.selectorString = selector || EMPTY_STRING;     //"foo.bar"
        this.selectors = new slURISelectors(selector);
        this.extension = extension || EMPTY_STRING;         //"html"

        Object.defineProperty(this, 'protocol', {
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
        });

        Object.defineProperty(this, 'username', {
            enumerable : true,
            configurable : true,
            get: function() {
                return _username || EMPTY_STRING;
            },
            set: function(value) {
                _username = EMPTY_STRING + value;
            }
        });

        Object.defineProperty(this, 'password', {
            enumerable : true,
            configurable : true,
            get: function() {
                return _password || EMPTY_STRING;
            },
            set: function(value) {
                _password = EMPTY_STRING + value;
            }
        });

        Object.defineProperty(this, 'hostname', {
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
        });

        Object.defineProperty(this, 'host', {
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
        });

        Object.defineProperty(this, 'port', {
            enumerable : true,
            configurable : true,
            get: function() {
                return _port || EMPTY_STRING;
            },
            set: function(value) {
                //if (!isNaN(value)) {
                if (typeof value === 'number' || /^\d+(\.\d+)?$/.test(value)) {
                    _port = EMPTY_STRING + parseInt(value, 10);
                }
            }
        });

        Object.defineProperty(this, 'origin', {
            enumerable : true,
            configurable : true,
            get: function() {
                return this.protocol + '//' + this.host;
            },
            set: function(value) {
                /* read-only */
            }
        });

        Object.defineProperty(this, 'extension', {
            enumerable : true,
            configurable : true,
            get: function() {
                console.log('in extension, pathname: ' + this.pathname);
                return (this.pathname && this.pathname.split('.')[1]) || EMPTY_STRING;
            },
            set: function(value) {
                if (value && this.pathname) {
                    this.pathname.replace('.' + this.extension, '.' + value);
                }
            }
        });

        Object.defineProperty(this, 'selectorString', {
            enumerable : true,
            configurable : true,
            get: function() {
                return this.selectors.values().join('.');
            },
            set: function(value) {
                this.selectors = new slURISelectors(value);
            }
        });

        Object.defineProperty(this, 'search', {
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
        });

        Object.defineProperty(this, 'searchParams', {
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
        });

        Object.defineProperty(this, 'hash', {
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
        });

        this.protocol = parts.protocol;
        this.username = parts.username;
        this.password = parts.password;
        this.hostname = parts.hostname;
        this.host = parts.host;
        this.port = parts.port;
        this.extension = parts.extension;
        this.search = parts.search;
        // set by search this.searchParams = new slURISearchParams(parts.search);
        this.hash = parts.hash;

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
            return toString()
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
        this._selectorString = selectorString;
        this._values = this._selectorString.split('.');
    }

    slURISelectors.prototype.toString = function() {
        return this._selectorString;
    }

    slURISelectors.prototype.toLocaleString = function() {
        return this._selectorString;
    }

    slURISelectors.prototype.has = function(selector) {
        return this._values.indexOf(selector) !== -1;
    }

    slURISelectors.prototype.append = function(selector) {
        this._values.push(selector);
    }

    slURISelectors.prototype.delete = function(selector) {
        var index = this._values.indexOf(selector);

        if (index !== -1) {
            this._values.splice(index, 1);
        }
    }

    slURISelectors.prototype.values = function(selector) {
        return this._values;
    }



    return slURI;
}));

//var slURI = new slURI('http://www.nateyolles.com/us/en/page.biz.baz.html/foo/bar?alpha=bravo&charlie=delta&echo#foxtrot');

// function Nate(a, b){
//     var b = function(){
//         console.log('bbb');
//     }
//     this.a = function(){
//         console.log('aaa');
//     }
//     this.bb = function(){
//         b();
//     }
// }

// function extend(a, b){
//     for (var key in b)
//         if (b.hasOwnProperty(key))
//             a[key] = b[key];
//     return a;
// }

// var myString = "something format_abc";
// var myRegexp = /(?:^|\s)format_(.*?)(?:\s|$)/g;
// var match = myRegexp.exec(myString);
// alert(match[1]);