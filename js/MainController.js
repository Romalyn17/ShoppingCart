/**
 * @license AngularJS v1.6.1
 * (c) 2010-2016 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window) {'use strict';


function minErr(module, ErrorConstructor) {
  ErrorConstructor = ErrorConstructor || Error;
  return function() {
    var SKIP_INDEXES = 2;

    var templateArgs = arguments,
      code = templateArgs[0],
      message = '[' + (module ? module + ':' : '') + code + '] ',
      template = templateArgs[1],
      paramPrefix, i;

    message += template.replace(/\{\d+\}/g, function(match) {
      var index = +match.slice(1, -1),
        shiftedIndex = index + SKIP_INDEXES;

      if (shiftedIndex < templateArgs.length) {
        return toDebugString(templateArgs[shiftedIndex]);
      }

      return match;
    });

    message += '\nhttp://errors.angularjs.org/1.6.1/' +
      (module ? module + '/' : '') + code;

    for (i = SKIP_INDEXES, paramPrefix = '?'; i < templateArgs.length; i++, paramPrefix = '&') {
      message += paramPrefix + 'p' + (i - SKIP_INDEXES) + '=' +
        encodeURIComponent(toDebugString(templateArgs[i]));
    }

    return new ErrorConstructor(message);
  };
}


var REGEX_STRING_REGEXP = /^\/(.+)\/([a-z]*)$/;

var VALIDITY_STATE_PROPERTY = 'validity';


var hasOwnProperty = Object.prototype.hasOwnProperty;


var lowercase = function(string) {return isString(string) ? string.toLowerCase() : string;};


var uppercase = function(string) {return isString(string) ? string.toUpperCase() : string;};


var manualLowercase = function(s) {
  return isString(s)
      ? s.replace(/[A-Z]/g, function(ch) {return String.fromCharCode(ch.charCodeAt(0) | 32);})
      : s;
};
var manualUppercase = function(s) {
  /* eslint-disable no-bitwise */
  return isString(s)
      ? s.replace(/[a-z]/g, function(ch) {return String.fromCharCode(ch.charCodeAt(0) & ~32);})
      : s;
};


if ('i' !== 'I'.toLowerCase()) {
  lowercase = manualLowercase;
  uppercase = manualUppercase;
}


var
    msie,             
    jqLite,           
    jQuery,           
    slice             = [].slice,
    splice            = [].splice,
    push              = [].push,
    toString          = Object.prototype.toString,
    getPrototypeOf    = Object.getPrototypeOf,
    ngMinErr          = minErr('ng'),

    /** @name angular */
    angular           = window.angular || (window.angular = {}),
    angularModule,
    uid               = 0;


msie = window.document.documentMode;

function isArrayLike(obj) {


  if (obj == null || isWindow(obj)) return false;

  if (isArray(obj) || isString(obj) || (jqLite && obj instanceof jqLite)) return true;

  
  var length = 'length' in Object(obj) && obj.length;

  
  return isNumber(length) &&
    (length >= 0 && ((length - 1) in obj || obj instanceof Array) || typeof obj.item === 'function');

}
function forEach(obj, iterator, context) {
  var key, length;
  if (obj) {
    if (isFunction(obj)) {
      for (key in obj) {
        if (key !== 'prototype' && key !== 'length' && key !== 'name' && obj.hasOwnProperty(key)) {
          iterator.call(context, obj[key], key, obj);
        }
      }
    } else if (isArray(obj) || isArrayLike(obj)) {
      var isPrimitive = typeof obj !== 'object';
      for (key = 0, length = obj.length; key < length; key++) {
        if (isPrimitive || key in obj) {
          iterator.call(context, obj[key], key, obj);
        }
      }
    } else if (obj.forEach && obj.forEach !== forEach) {
        obj.forEach(iterator, context, obj);
    } else if (isBlankObject(obj)) {
      
      for (key in obj) {
        iterator.call(context, obj[key], key, obj);
      }
    } else if (typeof obj.hasOwnProperty === 'function') {
      
      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          iterator.call(context, obj[key], key, obj);
        }
      }
    } else {
     
      for (key in obj) {
        if (hasOwnProperty.call(obj, key)) {
          iterator.call(context, obj[key], key, obj);
        }
      }
    }
  }
  return obj;
}

function forEachSorted(obj, iterator, context) {
  var keys = Object.keys(obj).sort();
  for (var i = 0; i < keys.length; i++) {
    iterator.call(context, obj[keys[i]], keys[i]);
  }
  return keys;
}
function reverseParams(iteratorFn) {
  return function(value, key) {iteratorFn(key, value);};
}
function nextUid() {
  return ++uid;
}
function setHashKey(obj, h) {
  if (h) {
    obj.$$hashKey = h;
  } else {
    delete obj.$$hashKey;
  }
}


function baseExtend(dst, objs, deep) {
  var h = dst.$$hashKey;

  for (var i = 0, ii = objs.length; i < ii; ++i) {
    var obj = objs[i];
    if (!isObject(obj) && !isFunction(obj)) continue;
    var keys = Object.keys(obj);
    for (var j = 0, jj = keys.length; j < jj; j++) {
      var key = keys[j];
      var src = obj[key];

      if (deep && isObject(src)) {
        if (isDate(src)) {
          dst[key] = new Date(src.valueOf());
        } else if (isRegExp(src)) {
          dst[key] = new RegExp(src);
        } else if (src.nodeName) {
          dst[key] = src.cloneNode(true);
        } else if (isElement(src)) {
          dst[key] = src.clone();
        } else {
          if (!isObject(dst[key])) dst[key] = isArray(src) ? [] : {};
          baseExtend(dst[key], [src], true);
        }
      } else {
        dst[key] = src;
      }
    }
  }

  setHashKey(dst, h);
  return dst;
}

function extend(dst) {
  return baseExtend(dst, slice.call(arguments, 1), false);
}

function merge(dst) {
  return baseExtend(dst, slice.call(arguments, 1), true);
}



function toInt(str) {
  return parseInt(str, 10);
}

var isNumberNaN = Number.isNaN || function isNumberNaN(num) {
  // eslint-disable-next-line no-self-compare
  return num !== num;
};


function inherit(parent, extra) {
  return extend(Object.create(parent), extra);
}

function noop() {}
noop.$inject = [];

function identity($) {return $;}
identity.$inject = [];


function valueFn(value) {return function valueRef() {return value;};}

function hasCustomToString(obj) {
  return isFunction(obj.toString) && obj.toString !== toString;
}


function isUndefined(value) {return typeof value === 'undefined';}


function isDefined(value) {return typeof value !== 'undefined';}


function isObject(value) {
  // http://jsperf.com/isobject4
  return value !== null && typeof value === 'object';
}

function isBlankObject(value) {
  return value !== null && typeof value === 'object' && !getPrototypeOf(value);
}

function isString(value) {return typeof value === 'string';}


function isNumber(value) {return typeof value === 'number';}

function isDate(value) {
  return toString.call(value) === '[object Date]';
}

var isArray = Array.isArray;

function isFunction(value) {return typeof value === 'function';}

function isRegExp(value) {
  return toString.call(value) === '[object RegExp]';
}

function isWindow(obj) {
  return obj && obj.window === obj;
}


function isScope(obj) {
  return obj && obj.$evalAsync && obj.$watch;
}


function isFile(obj) {
  return toString.call(obj) === '[object File]';
}


function isFormData(obj) {
  return toString.call(obj) === '[object FormData]';
}


function isBlob(obj) {
  return toString.call(obj) === '[object Blob]';
}


function isBoolean(value) {
  return typeof value === 'boolean';
}


function isPromiseLike(obj) {
  return obj && isFunction(obj.then);
}


var TYPED_ARRAY_REGEXP = /^\[object (?:Uint8|Uint8Clamped|Uint16|Uint32|Int8|Int16|Int32|Float32|Float64)Array]$/;
function isTypedArray(value) {
  return value && isNumber(value.length) && TYPED_ARRAY_REGEXP.test(toString.call(value));
}

function isArrayBuffer(obj) {
  return toString.call(obj) === '[object ArrayBuffer]';
}


var trim = function(value) {
  return isString(value) ? value.trim() : value;
};
var escapeForRegexp = function(s) {
  return s
    .replace(/([-()[\]{}+?*.$^|,:#<!\\])/g, '\\$1')
    // eslint-disable-next-line no-control-regex
    .replace(/\x08/g, '\\x08');
};

function isElement(node) {
  return !!(node &&
    (node.nodeName 
    || (node.prop && node.attr && node.find))); 
}

function makeMap(str) {
  var obj = {}, items = str.split(','), i;
  for (i = 0; i < items.length; i++) {
    obj[items[i]] = true;
  }
  return obj;
}


function nodeName_(element) {
  return lowercase(element.nodeName || (element[0] && element[0].nodeName));
}

function includes(array, obj) {
  return Array.prototype.indexOf.call(array, obj) !== -1;
}

function arrayRemove(array, value) {
  var index = array.indexOf(value);
  if (index >= 0) {
    array.splice(index, 1);
  }
  return index;
}


function copy(source, destination) {
  var stackSource = [];
  var stackDest = [];

  if (destination) {
    if (isTypedArray(destination) || isArrayBuffer(destination)) {
      throw ngMinErr('cpta', 'Can\'t copy! TypedArray destination cannot be mutated.');
    }
    if (source === destination) {
      throw ngMinErr('cpi', 'Can\'t copy! Source and destination are identical.');
    }

    if (isArray(destination)) {
      destination.length = 0;
    } else {
      forEach(destination, function(value, key) {
        if (key !== '$$hashKey') {
          delete destination[key];
        }
      });
    }

    stackSource.push(source);
    stackDest.push(destination);
    return copyRecurse(source, destination);
  }

  return copyElement(source);

  function copyRecurse(source, destination) {
    var h = destination.$$hashKey;
    var key;
    if (isArray(source)) {
      for (var i = 0, ii = source.length; i < ii; i++) {
        destination.push(copyElement(source[i]));
      }
    } else if (isBlankObject(source)) {
      // createMap() fast path --- Safe to avoid hasOwnProperty check because prototype chain is empty
      for (key in source) {
        destination[key] = copyElement(source[key]);
      }
    } else if (source && typeof source.hasOwnProperty === 'function') {
      // Slow path, which must rely on hasOwnProperty
      for (key in source) {
        if (source.hasOwnProperty(key)) {
          destination[key] = copyElement(source[key]);
        }
      }
    } else {
      // Slowest path --- hasOwnProperty can't be called as a method
      for (key in source) {
        if (hasOwnProperty.call(source, key)) {
          destination[key] = copyElement(source[key]);
        }
      }
    }
    setHashKey(destination, h);
    return destination;
  }

  function copyElement(source) {
    // Simple values
    if (!isObject(source)) {
      return source;
    }

    // Already copied values
    var index = stackSource.indexOf(source);
    if (index !== -1) {
      return stackDest[index];
    }

    if (isWindow(source) || isScope(source)) {
      throw ngMinErr('cpws',
        'Can\'t copy! Making copies of Window or Scope instances is not supported.');
    }

    var needsRecurse = false;
    var destination = copyType(source);

    if (destination === undefined) {
      destination = isArray(source) ? [] : Object.create(getPrototypeOf(source));
      needsRecurse = true;
    }

    stackSource.push(source);
    stackDest.push(destination);

    return needsRecurse
      ? copyRecurse(source, destination)
      : destination;
  }

  function copyType(source) {
    switch (toString.call(source)) {
      case '[object Int8Array]':
      case '[object Int16Array]':
      case '[object Int32Array]':
      case '[object Float32Array]':
      case '[object Float64Array]':
      case '[object Uint8Array]':
      case '[object Uint8ClampedArray]':
      case '[object Uint16Array]':
      case '[object Uint32Array]':
        return new source.constructor(copyElement(source.buffer), source.byteOffset, source.length);

      case '[object ArrayBuffer]':
        // Support: IE10
        if (!source.slice) {
          // If we're in this case we know the environment supports ArrayBuffer
          /* eslint-disable no-undef */
          var copied = new ArrayBuffer(source.byteLength);
          new Uint8Array(copied).set(new Uint8Array(source));
          /* eslint-enable */
          return copied;
        }
        return source.slice(0);

      case '[object Boolean]':
      case '[object Number]':
      case '[object String]':
      case '[object Date]':
        return new source.constructor(source.valueOf());

      case '[object RegExp]':
        var re = new RegExp(source.source, source.toString().match(/[^/]*$/)[0]);
        re.lastIndex = source.lastIndex;
        return re;

      case '[object Blob]':
        return new source.constructor([source], {type: source.type});
    }

    if (isFunction(source.cloneNode)) {
      return source.cloneNode(true);
    }
  }
}


/**
 * @ngdoc function
 * @name angular.equals
 * @module ng
 * @kind function
 *
 * @description
 * Determines if two objects or two values are equivalent. Supports value types, regular
 * expressions, arrays and objects.
 *
 * Two objects or values are considered equivalent if at least one of the following is true:
 *
 * * Both objects or values pass `===` comparison.
 * * Both objects or values are of the same type and all of their properties are equal by
 *   comparing them with `angular.equals`.
 * * Both values are NaN. (In JavaScript, NaN == NaN => false. But we consider two NaN as equal)
 * * Both values represent the same regular expression (In JavaScript,
 *   /abc/ == /abc/ => false. But we consider two regular expressions as equal when their textual
 *   representation matches).
 *
 * During a property comparison, properties of `function` type and properties with names
 * that begin with `$` are ignored.
 *
 * Scope and DOMWindow objects are being compared only by identify (`===`).
 *
 * @param {*} o1 Object or value to compare.
 * @param {*} o2 Object or value to compare.
 * @returns {boolean} True if arguments are equal.
 *
 * @example
   <example module="equalsExample" name="equalsExample">
     <file name="index.html">
      <div ng-controller="ExampleController">
        <form novalidate>
          <h3>User 1</h3>
          Name: <input type="text" ng-model="user1.name">
          Age: <input type="number" ng-model="user1.age">

          <h3>User 2</h3>
          Name: <input type="text" ng-model="user2.name">
          Age: <input type="number" ng-model="user2.age">

          <div>
            <br/>
            <input type="button" value="Compare" ng-click="compare()">
          </div>
          User 1: <pre>{{user1 | json}}</pre>
          User 2: <pre>{{user2 | json}}</pre>
          Equal: <pre>{{result}}</pre>
        </form>
      </div>
    </file>
    <file name="script.js">
        angular.module('equalsExample', []).controller('ExampleController', ['$scope', function($scope) {
          $scope.user1 = {};
          $scope.user2 = {};
          $scope.compare = function() {
            $scope.result = angular.equals($scope.user1, $scope.user2);
          };
        }]);
    </file>
  </example>
 */
function equals(o1, o2) {
  if (o1 === o2) return true;
  if (o1 === null || o2 === null) return false;
  // eslint-disable-next-line no-self-compare
  if (o1 !== o1 && o2 !== o2) return true; // NaN === NaN
  var t1 = typeof o1, t2 = typeof o2, length, key, keySet;
  if (t1 === t2 && t1 === 'object') {
    if (isArray(o1)) {
      if (!isArray(o2)) return false;
      if ((length = o1.length) === o2.length) {
        for (key = 0; key < length; key++) {
          if (!equals(o1[key], o2[key])) return false;
        }
        return true;
      }
    } else if (isDate(o1)) {
      if (!isDate(o2)) return false;
      return equals(o1.getTime(), o2.getTime());
    } else if (isRegExp(o1)) {
      if (!isRegExp(o2)) return false;
      return o1.toString() === o2.toString();
    } else {
      if (isScope(o1) || isScope(o2) || isWindow(o1) || isWindow(o2) ||
        isArray(o2) || isDate(o2) || isRegExp(o2)) return false;
      keySet = createMap();
      for (key in o1) {
        if (key.charAt(0) === '$' || isFunction(o1[key])) continue;
        if (!equals(o1[key], o2[key])) return false;
        keySet[key] = true;
      }
      for (key in o2) {
        if (!(key in keySet) &&
            key.charAt(0) !== '$' &&
            isDefined(o2[key]) &&
            !isFunction(o2[key])) return false;
      }
      return true;
    }
  }
  return false;
}

var csp = function() {
  if (!isDefined(csp.rules)) {


    var ngCspElement = (window.document.querySelector('[ng-csp]') ||
                    window.document.querySelector('[data-ng-csp]'));

    if (ngCspElement) {
      var ngCspAttribute = ngCspElement.getAttribute('ng-csp') ||
                    ngCspElement.getAttribute('data-ng-csp');
      csp.rules = {
        noUnsafeEval: !ngCspAttribute || (ngCspAttribute.indexOf('no-unsafe-eval') !== -1),
        noInlineStyle: !ngCspAttribute || (ngCspAttribute.indexOf('no-inline-style') !== -1)
      };
    } else {
      csp.rules = {
        noUnsafeEval: noUnsafeEval(),
        noInlineStyle: false
      };
    }
  }

  return csp.rules;

  function noUnsafeEval() {
    try {
      new Function('');
      return false;
    } catch (e) {
      return true;
    }
  }
};


var jq = function() {
  if (isDefined(jq.name_)) return jq.name_;
  var el;
  var i, ii = ngAttrPrefixes.length, prefix, name;
  for (i = 0; i < ii; ++i) {
    prefix = ngAttrPrefixes[i];
    el = window.document.querySelector('[' + prefix.replace(':', '\\:') + 'jq]');
    if (el) {
      name = el.getAttribute(prefix + 'jq');
      break;
    }
  }

  return (jq.name_ = name);
};

function concat(array1, array2, index) {
  return array1.concat(slice.call(array2, index));
}

function sliceArgs(args, startIndex) {
  return slice.call(args, startIndex || 0);
}

function bind(self, fn) {
  var curryArgs = arguments.length > 2 ? sliceArgs(arguments, 2) : [];
  if (isFunction(fn) && !(fn instanceof RegExp)) {
    return curryArgs.length
      ? function() {
          return arguments.length
            ? fn.apply(self, concat(curryArgs, arguments, 0))
            : fn.apply(self, curryArgs);
        }
      : function() {
          return arguments.length
            ? fn.apply(self, arguments)
            : fn.call(self);
        };
  } else {
    return fn;
  }
}


function toJsonReplacer(key, value) {
  var val = value;

  if (typeof key === 'string' && key.charAt(0) === '$' && key.charAt(1) === '$') {
    val = undefined;
  } else if (isWindow(value)) {
    val = '$WINDOW';
  } else if (value &&  window.document === value) {
    val = '$DOCUMENT';
  } else if (isScope(value)) {
    val = '$SCOPE';
  }

  return val;
}

function toJson(obj, pretty) {
  if (isUndefined(obj)) return undefined;
  if (!isNumber(pretty)) {
    pretty = pretty ? 2 : null;
  }
  return JSON.stringify(obj, toJsonReplacer, pretty);
}


function fromJson(json) {
  return isString(json)
      ? JSON.parse(json)
      : json;
}


var ALL_COLONS = /:/g;
function timezoneToOffset(timezone, fallback) {
  timezone = timezone.replace(ALL_COLONS, '');
  var requestedTimezoneOffset = Date.parse('Jan 01, 1970 00:00:00 ' + timezone) / 60000;
  return isNumberNaN(requestedTimezoneOffset) ? fallback : requestedTimezoneOffset;
}


function addDateMinutes(date, minutes) {
  date = new Date(date.getTime());
  date.setMinutes(date.getMinutes() + minutes);
  return date;
}


function convertTimezoneToLocal(date, timezone, reverse) {
  reverse = reverse ? -1 : 1;
  var dateTimezoneOffset = date.getTimezoneOffset();
  var timezoneOffset = timezoneToOffset(timezone, dateTimezoneOffset);
  return addDateMinutes(date, reverse * (timezoneOffset - dateTimezoneOffset));
}

function startingTag(element) {
  element = jqLite(element).clone();
  try {
    element.empty();
  } catch (e) {  }
  var elemHtml = jqLite('<div>').append(element).html();
  try {
    return element[0].nodeType === NODE_TYPE_TEXT ? lowercase(elemHtml) :
        elemHtml.
          match(/^(<[^>]+>)/)[1].
          replace(/^<([\w-]+)/, function(match, nodeName) {return '<' + lowercase(nodeName);});
  } catch (e) {
    return lowercase(elemHtml);
  }

}

function tryDecodeURIComponent(value) {
  try {
    return decodeURIComponent(value);
  } catch (e) {
  }
}

function parseKeyValue(/**string*/keyValue) {
  var obj = {};
  forEach((keyValue || '').split('&'), function(keyValue) {
    var splitPoint, key, val;
    if (keyValue) {
      key = keyValue = keyValue.replace(/\+/g,'%20');
      splitPoint = keyValue.indexOf('=');
      if (splitPoint !== -1) {
        key = keyValue.substring(0, splitPoint);
        val = keyValue.substring(splitPoint + 1);
      }
      key = tryDecodeURIComponent(key);
      if (isDefined(key)) {
        val = isDefined(val) ? tryDecodeURIComponent(val) : true;
        if (!hasOwnProperty.call(obj, key)) {
          obj[key] = val;
        } else if (isArray(obj[key])) {
          obj[key].push(val);
        } else {
          obj[key] = [obj[key],val];
        }
      }
    }
  });
  return obj;
}

function toKeyValue(obj) {
  var parts = [];
  forEach(obj, function(value, key) {
    if (isArray(value)) {
      forEach(value, function(arrayValue) {
        parts.push(encodeUriQuery(key, true) +
                   (arrayValue === true ? '' : '=' + encodeUriQuery(arrayValue, true)));
      });
    } else {
    parts.push(encodeUriQuery(key, true) +
               (value === true ? '' : '=' + encodeUriQuery(value, true)));
    }
  });
  return parts.length ? parts.join('&') : '';
}

function encodeUriSegment(val) {
  return encodeUriQuery(val, true).
             replace(/%26/gi, '&').
             replace(/%3D/gi, '=').
             replace(/%2B/gi, '+');
}
function encodeUriQuery(val, pctEncodeSpaces) {
  return encodeURIComponent(val).
             replace(/%40/gi, '@').
             replace(/%3A/gi, ':').
             replace(/%24/g, '$').
             replace(/%2C/gi, ',').
             replace(/%3B/gi, ';').
             replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'));
}

var ngAttrPrefixes = ['ng-', 'data-ng-', 'ng:', 'x-ng-'];

function getNgAttribute(element, ngAttr) {
  var attr, i, ii = ngAttrPrefixes.length;
  for (i = 0; i < ii; ++i) {
    attr = ngAttrPrefixes[i] + ngAttr;
    if (isString(attr = element.getAttribute(attr))) {
      return attr;
    }
  }
  return null;
}

function allowAutoBootstrap(document) {
  if (!document.currentScript) {
    return true;
  }
  var src = document.currentScript.getAttribute('src');
  var link = document.createElement('a');
  link.href = src;
  if (document.location.origin === link.origin) {
    return true;
  }
  switch (link.protocol) {
    case 'http:':
    case 'https:':
    case 'ftp:':
    case 'blob:':
    case 'file:':
    case 'data:':
      return true;
    default:
      return false;
  }
}
var isAutoBootstrapAllowed = allowAutoBootstrap(window.document);


function angularInit(element, bootstrap) {
  var appElement,
      module,
      config = {};

  forEach(ngAttrPrefixes, function(prefix) {
    var name = prefix + 'app';

    if (!appElement && element.hasAttribute && element.hasAttribute(name)) {
      appElement = element;
      module = element.getAttribute(name);
    }
  });
  forEach(ngAttrPrefixes, function(prefix) {
    var name = prefix + 'app';
    var candidate;

    if (!appElement && (candidate = element.querySelector('[' + name.replace(':', '\\:') + ']'))) {
      appElement = candidate;
      module = candidate.getAttribute(name);
    }
  });
  if (appElement) {
    if (!isAutoBootstrapAllowed) {
      window.console.error('Angular: disabling automatic bootstrap. <script> protocol indicates ' +
          'an extension, document.location.href does not match.');
      return;
    }
    config.strictDi = getNgAttribute(appElement, 'strict-di') !== null;
    bootstrap(appElement, module ? [module] : [], config);
  }
}

function bootstrap(element, modules, config) {
  if (!isObject(config)) config = {};
  var defaultConfig = {
    strictDi: false
  };
  config = extend(defaultConfig, config);
  var doBootstrap = function() {
    element = jqLite(element);

    if (element.injector()) {
      var tag = (element[0] === window.document) ? 'document' : startingTag(element);

      throw ngMinErr(
          'btstrpd',
          'App already bootstrapped with this element \'{0}\'',
          tag.replace(/</,'&lt;').replace(/>/,'&gt;'));
    }

    modules = modules || [];
    modules.unshift(['$provide', function($provide) {
      $provide.value('$rootElement', element);
    }]);

    if (config.debugInfoEnabled) {
      modules.push(['$compileProvider', function($compileProvider) {
        $compileProvider.debugInfoEnabled(true);
      }]);
    }

    modules.unshift('ng');
    var injector = createInjector(modules, config.strictDi);
    injector.invoke(['$rootScope', '$rootElement', '$compile', '$injector',
       function bootstrapApply(scope, element, compile, injector) {
        scope.$apply(function() {
          element.data('$injector', injector);
          compile(element)(scope);
        });
      }]
    );
    return injector;
  };

  var NG_ENABLE_DEBUG_INFO = /^NG_ENABLE_DEBUG_INFO!/;
  var NG_DEFER_BOOTSTRAP = /^NG_DEFER_BOOTSTRAP!/;

  if (window && NG_ENABLE_DEBUG_INFO.test(window.name)) {
    config.debugInfoEnabled = true;
    window.name = window.name.replace(NG_ENABLE_DEBUG_INFO, '');
  }

  if (window && !NG_DEFER_BOOTSTRAP.test(window.name)) {
    return doBootstrap();
  }

  window.name = window.name.replace(NG_DEFER_BOOTSTRAP, '');
  angular.resumeBootstrap = function(extraModules) {
    forEach(extraModules, function(module) {
      modules.push(module);
    });
    return doBootstrap();
  };

  if (isFunction(angular.resumeDeferredBootstrap)) {
    angular.resumeDeferredBootstrap();
  }
}
function reloadWithDebugInfo() {
  window.name = 'NG_ENABLE_DEBUG_INFO!' + window.name;
  window.location.reload();
}


function getTestability(rootElement) {
  var injector = angular.element(rootElement).injector();
  if (!injector) {
    throw ngMinErr('test',
      'no injector found for element argument to getTestability');
  }
  return injector.get('$$testability');
}

var SNAKE_CASE_REGEXP = /[A-Z]/g;
function snake_case(name, separator) {
  separator = separator || '_';
  return name.replace(SNAKE_CASE_REGEXP, function(letter, pos) {
    return (pos ? separator : '') + letter.toLowerCase();
  });
}

var bindJQueryFired = false;
function bindJQuery() {
  var originalCleanData;

  if (bindJQueryFired) {
    return;
  }


  var jqName = jq();
  jQuery = isUndefined(jqName) ? window.jQuery :   
           !jqName             ? undefined     :   
                                 window[jqName];   

  if (jQuery && jQuery.fn.on) {
    jqLite = jQuery;
    extend(jQuery.fn, {
      scope: JQLitePrototype.scope,
      isolateScope: JQLitePrototype.isolateScope,
      controller: JQLitePrototype.controller,
      injector: JQLitePrototype.injector,
      inheritedData: JQLitePrototype.inheritedData
    });

   
    originalCleanData = jQuery.cleanData;
    jQuery.cleanData = function(elems) {
      var events;
      for (var i = 0, elem; (elem = elems[i]) != null; i++) {
        events = jQuery._data(elem, 'events');
        if (events && events.$destroy) {
          jQuery(elem).triggerHandler('$destroy');
        }
      }
      originalCleanData(elems);
    };
  } else {
    jqLite = JQLite;
  }

  angular.element = jqLite;


  bindJQueryFired = true;
}


function assertArg(arg, name, reason) {
  if (!arg) {
    throw ngMinErr('areq', 'Argument \'{0}\' is {1}', (name || '?'), (reason || 'required'));
  }
  return arg;
}

function assertArgFn(arg, name, acceptArrayAnnotation) {
  if (acceptArrayAnnotation && isArray(arg)) {
      arg = arg[arg.length - 1];
  }

  assertArg(isFunction(arg), name, 'not a function, got ' +
      (arg && typeof arg === 'object' ? arg.constructor.name || 'Object' : typeof arg));
  return arg;
}


function assertNotHasOwnProperty(name, context) {
  if (name === 'hasOwnProperty') {
    throw ngMinErr('badname', 'hasOwnProperty is not a valid {0} name', context);
  }
}


function getter(obj, path, bindFnToScope) {
  if (!path) return obj;
  var keys = path.split('.');
  var key;
  var lastInstance = obj;
  var len = keys.length;

  for (var i = 0; i < len; i++) {
    key = keys[i];
    if (obj) {
      obj = (lastInstance = obj)[key];
    }
  }
  if (!bindFnToScope && isFunction(obj)) {
    return bind(lastInstance, obj);
  }
  return obj;
}


function getBlockNodes(nodes) {

  var node = nodes[0];
  var endNode = nodes[nodes.length - 1];
  var blockNodes;

  for (var i = 1; node !== endNode && (node = node.nextSibling); i++) {
    if (blockNodes || nodes[i] !== node) {
      if (!blockNodes) {
        blockNodes = jqLite(slice.call(nodes, 0, i));
      }
      blockNodes.push(node);
    }
  }

  return blockNodes || nodes;
}

function createMap() {
  return Object.create(null);
}

function stringify(value) {
  if (value == null) { 
    return '';
  }
  switch (typeof value) {
    case 'string':
      break;
    case 'number':
      value = '' + value;
      break;
    default:
      if (hasCustomToString(value) && !isArray(value) && !isDate(value)) {
        value = value.toString();
      } else {
        value = toJson(value);
      }
  }

  return value;
}

var NODE_TYPE_ELEMENT = 1;
var NODE_TYPE_ATTRIBUTE = 2;
var NODE_TYPE_TEXT = 3;
var NODE_TYPE_COMMENT = 8;
var NODE_TYPE_DOCUMENT = 9;
var NODE_TYPE_DOCUMENT_FRAGMENT = 11;


function setupModuleLoader(window) {

  var $injectorMinErr = minErr('$injector');
  var ngMinErr = minErr('ng');

  function ensure(obj, name, factory) {
    return obj[name] || (obj[name] = factory());
  }

  var angular = ensure(window, 'angular', Object);


  angular.$$minErr = angular.$$minErr || minErr;

  return ensure(angular, 'module', function() {
  
    var modules = {};

    
    return function module(name, requires, configFn) {
      var assertNotHasOwnProperty = function(name, context) {
        if (name === 'hasOwnProperty') {
          throw ngMinErr('badname', 'hasOwnProperty is not a valid {0} name', context);
        }
      };

      assertNotHasOwnProperty(name, 'module');
      if (requires && modules.hasOwnProperty(name)) {
        modules[name] = null;
      }
      return ensure(modules, name, function() {
        if (!requires) {
          throw $injectorMinErr('nomod', 'Module \'{0}\' is not available! You either misspelled ' +
             'the module name or forgot to load it. If registering a module ensure that you ' +
             'specify the dependencies as the second argument.', name);
        }

        var invokeQueue = [];


        var configBlocks = [];


        var runBlocks = [];

        var config = invokeLater('$injector', 'invoke', 'push', configBlocks);

    
        var moduleInstance = {
         
          _invokeQueue: invokeQueue,
          _configBlocks: configBlocks,
          _runBlocks: runBlocks,


          requires: requires,
          name: name,
          provider: invokeLaterAndSetModuleName('$provide', 'provider'),

          factory: invokeLaterAndSetModuleName('$provide', 'factory'),

          service: invokeLaterAndSetModuleName('$provide', 'service'),

          value: invokeLater('$provide', 'value'),

          constant: invokeLater('$provide', 'constant', 'unshift'),

          decorator: invokeLaterAndSetModuleName('$provide', 'decorator', configBlocks),

          animation: invokeLaterAndSetModuleName('$animateProvider', 'register'),

          filter: invokeLaterAndSetModuleName('$filterProvider', 'register'),

          controller: invokeLaterAndSetModuleName('$controllerProvider', 'register'),

          directive: invokeLaterAndSetModuleName('$compileProvider', 'directive'),

          component: invokeLaterAndSetModuleName('$compileProvider', 'component'),
        
          config: config,

          run: function(block) {
            runBlocks.push(block);
            return this;
          }
        };

        if (configFn) {
          config(configFn);
        }

        return moduleInstance;

        function invokeLater(provider, method, insertMethod, queue) {
          if (!queue) queue = invokeQueue;
          return function() {
            queue[insertMethod || 'push']([provider, method, arguments]);
            return moduleInstance;
          };
        }

        function invokeLaterAndSetModuleName(provider, method, queue) {
          if (!queue) queue = invokeQueue;
          return function(recipeName, factoryFunction) {
            if (factoryFunction && isFunction(factoryFunction)) factoryFunction.$$moduleName = name;
            queue.push([provider, method, arguments]);
            return moduleInstance;
          };
        }
      });
    };
  });

}

function shallowCopy(src, dst) {
  if (isArray(src)) {
    dst = dst || [];

    for (var i = 0, ii = src.length; i < ii; i++) {
      dst[i] = src[i];
    }
  } else if (isObject(src)) {
    dst = dst || {};

    for (var key in src) {
      if (!(key.charAt(0) === '$' && key.charAt(1) === '$')) {
        dst[key] = src[key];
      }
    }
  }

  return dst || src;
}

function serializeObject(obj) {
  var seen = [];

  return JSON.stringify(obj, function(key, val) {
    val = toJsonReplacer(key, val);
    if (isObject(val)) {

      if (seen.indexOf(val) >= 0) return '...';

      seen.push(val);
    }
    return val;
  });
}

function toDebugString(obj) {
  if (typeof obj === 'function') {
    return obj.toString().replace(/ \{[\s\S]*$/, '');
  } else if (isUndefined(obj)) {
    return 'undefined';
  } else if (typeof obj !== 'string') {
    return serializeObject(obj);
  }
  return obj;
}


var version = {
  full: '1.6.1',
  major: 1,
  minor: 6,
  dot: 1,
  codeName: 'promise-rectification'
};


function publishExternalAPI(angular) {
  extend(angular, {
    'bootstrap': bootstrap,
    'copy': copy,
    'extend': extend,
    'merge': merge,
    'equals': equals,
    'element': jqLite,
    'forEach': forEach,
    'injector': createInjector,
    'noop': noop,
    'bind': bind,
    'toJson': toJson,
    'fromJson': fromJson,
    'identity': identity,
    'isUndefined': isUndefined,
    'isDefined': isDefined,
    'isString': isString,
    'isFunction': isFunction,
    'isObject': isObject,
    'isNumber': isNumber,
    'isElement': isElement,
    'isArray': isArray,
    'version': version,
    'isDate': isDate,
    'lowercase': lowercase,
    'uppercase': uppercase,
    'callbacks': {$$counter: 0},
    'getTestability': getTestability,
    'reloadWithDebugInfo': reloadWithDebugInfo,
    '$$minErr': minErr,
    '$$csp': csp,
    '$$encodeUriSegment': encodeUriSegment,
    '$$encodeUriQuery': encodeUriQuery,
    '$$stringify': stringify
  });

  angularModule = setupModuleLoader(window);

  angularModule('ng', ['ngLocale'], ['$provide',
    function ngModule($provide) {
      $provide.provider({
        $$sanitizeUri: $$SanitizeUriProvider
      });
      $provide.provider('$compile', $CompileProvider).
        directive({
            a: htmlAnchorDirective,
            input: inputDirective,
            textarea: inputDirective,
            form: formDirective,
            script: scriptDirective,
            select: selectDirective,
            option: optionDirective,
            ngBind: ngBindDirective,
            ngBindHtml: ngBindHtmlDirective,
            ngBindTemplate: ngBindTemplateDirective,
            ngClass: ngClassDirective,
            ngClassEven: ngClassEvenDirective,
            ngClassOdd: ngClassOddDirective,
            ngCloak: ngCloakDirective,
            ngController: ngControllerDirective,
            ngForm: ngFormDirective,
            ngHide: ngHideDirective,
            ngIf: ngIfDirective,
            ngInclude: ngIncludeDirective,
            ngInit: ngInitDirective,
            ngNonBindable: ngNonBindableDirective,
            ngPluralize: ngPluralizeDirective,
            ngRepeat: ngRepeatDirective,
            ngShow: ngShowDirective,
            ngStyle: ngStyleDirective,
            ngSwitch: ngSwitchDirective,
            ngSwitchWhen: ngSwitchWhenDirective,
            ngSwitchDefault: ngSwitchDefaultDirective,
            ngOptions: ngOptionsDirective,
            ngTransclude: ngTranscludeDirective,
            ngModel: ngModelDirective,
            ngList: ngListDirective,
            ngChange: ngChangeDirective,
            pattern: patternDirective,
            ngPattern: patternDirective,
            required: requiredDirective,
            ngRequired: requiredDirective,
            minlength: minlengthDirective,
            ngMinlength: minlengthDirective,
            maxlength: maxlengthDirective,
            ngMaxlength: maxlengthDirective,
            ngValue: ngValueDirective,
            ngModelOptions: ngModelOptionsDirective
        }).
        directive({
          ngInclude: ngIncludeFillContentDirective
        }).
        directive(ngAttributeAliasDirectives).
        directive(ngEventDirectives);
      $provide.provider({
        $anchorScroll: $AnchorScrollProvider,
        $animate: $AnimateProvider,
        $animateCss: $CoreAnimateCssProvider,
        $$animateJs: $$CoreAnimateJsProvider,
        $$animateQueue: $$CoreAnimateQueueProvider,
        $$AnimateRunner: $$AnimateRunnerFactoryProvider,
        $$animateAsyncRun: $$AnimateAsyncRunFactoryProvider,
        $browser: $BrowserProvider,
        $cacheFactory: $CacheFactoryProvider,
        $controller: $ControllerProvider,
        $document: $DocumentProvider,
        $$isDocumentHidden: $$IsDocumentHiddenProvider,
        $exceptionHandler: $ExceptionHandlerProvider,
        $filter: $FilterProvider,
        $$forceReflow: $$ForceReflowProvider,
        $interpolate: $InterpolateProvider,
        $interval: $IntervalProvider,
        $http: $HttpProvider,
        $httpParamSerializer: $HttpParamSerializerProvider,
        $httpParamSerializerJQLike: $HttpParamSerializerJQLikeProvider,
        $httpBackend: $HttpBackendProvider,
        $xhrFactory: $xhrFactoryProvider,
        $jsonpCallbacks: $jsonpCallbacksProvider,
        $location: $LocationProvider,
        $log: $LogProvider,
        $parse: $ParseProvider,
        $rootScope: $RootScopeProvider,
        $q: $QProvider,
        $$q: $$QProvider,
        $sce: $SceProvider,
        $sceDelegate: $SceDelegateProvider,
        $sniffer: $SnifferProvider,
        $templateCache: $TemplateCacheProvider,
        $templateRequest: $TemplateRequestProvider,
        $$testability: $$TestabilityProvider,
        $timeout: $TimeoutProvider,
        $window: $WindowProvider,
        $$rAF: $$RAFProvider,
        $$jqLite: $$jqLiteProvider,
        $$HashMap: $$HashMapProvider,
        $$cookieReader: $$CookieReaderProvider
      });
    }
  ]);
}

JQLite.expando = 'ng339';

var jqCache = JQLite.cache = {},
    jqId = 1;


JQLite._data = function(node) {
 
  return this.cache[node[this.expando]] || {};
};

function jqNextId() { return ++jqId; }


var DASH_LOWERCASE_REGEXP = /-([a-z])/g;
var MS_HACK_REGEXP = /^-ms-/;
var MOUSE_EVENT_MAP = { mouseleave: 'mouseout', mouseenter: 'mouseover' };
var jqLiteMinErr = minErr('jqLite');


function cssKebabToCamel(name) {
    return kebabToCamel(name.replace(MS_HACK_REGEXP, 'ms-'));
}

function fnCamelCaseReplace(all, letter) {
  return letter.toUpperCase();
}


function kebabToCamel(name) {
  return name
    .replace(DASH_LOWERCASE_REGEXP, fnCamelCaseReplace);
}

var SINGLE_TAG_REGEXP = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/;
var HTML_REGEXP = /<|&#?\w+;/;
var TAG_NAME_REGEXP = /<([\w:-]+)/;
var XHTML_TAG_REGEXP = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi;

var wrapMap = {
  'option': [1, '<select multiple="multiple">', '</select>'],

  'thead': [1, '<table>', '</table>'],
  'col': [2, '<table><colgroup>', '</colgroup></table>'],
  'tr': [2, '<table><tbody>', '</tbody></table>'],
  'td': [3, '<table><tbody><tr>', '</tr></tbody></table>'],
  '_default': [0, '', '']
};

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;


function jqLiteIsTextNode(html) {
  return !HTML_REGEXP.test(html);
}

function jqLiteAcceptsData(node) {
  
  var nodeType = node.nodeType;
  return nodeType === NODE_TYPE_ELEMENT || !nodeType || nodeType === NODE_TYPE_DOCUMENT;
}

function jqLiteHasData(node) {
  for (var key in jqCache[node.ng339]) {
    return true;
  }
  return false;
}

function jqLiteCleanData(nodes) {
  for (var i = 0, ii = nodes.length; i < ii; i++) {
    jqLiteRemoveData(nodes[i]);
  }
}

function jqLiteBuildFragment(html, context) {
  var tmp, tag, wrap,
      fragment = context.createDocumentFragment(),
      nodes = [], i;

  if (jqLiteIsTextNode(html)) {
  
    nodes.push(context.createTextNode(html));
  } else {
    
    tmp = fragment.appendChild(context.createElement('div'));
    tag = (TAG_NAME_REGEXP.exec(html) || ['', ''])[1].toLowerCase();
    wrap = wrapMap[tag] || wrapMap._default;
    tmp.innerHTML = wrap[1] + html.replace(XHTML_TAG_REGEXP, '<$1></$2>') + wrap[2];

    
    i = wrap[0];
    while (i--) {
      tmp = tmp.lastChild;
    }

    nodes = concat(nodes, tmp.childNodes);

    tmp = fragment.firstChild;
    tmp.textContent = '';
  }


  fragment.textContent = '';
  fragment.innerHTML = ''; 
  forEach(nodes, function(node) {
    fragment.appendChild(node);
  });

  return fragment;
}

function jqLiteParseHTML(html, context) {
  context = context || window.document;
  var parsed;

  if ((parsed = SINGLE_TAG_REGEXP.exec(html))) {
    return [context.createElement(parsed[1])];
  }

  if ((parsed = jqLiteBuildFragment(html, context))) {
    return parsed.childNodes;
  }

  return [];
}

function jqLiteWrapNode(node, wrapper) {
  var parent = node.parentNode;

  if (parent) {
    parent.replaceChild(wrapper, node);
  }

  wrapper.appendChild(node);
}



var jqLiteContains = window.Node.prototype.contains || /** @this */ function(arg) {
 
  return !!(this.compareDocumentPosition(arg) & 16);
};


function JQLite(element) {
  if (element instanceof JQLite) {
    return element;
  }

  var argIsString;

  if (isString(element)) {
    element = trim(element);
    argIsString = true;
  }
  if (!(this instanceof JQLite)) {
    if (argIsString && element.charAt(0) !== '<') {
      throw jqLiteMinErr('nosel', 'Looking up elements via selectors is not supported by jqLite! See: http://docs.angularjs.org/api/angular.element');
    }
    return new JQLite(element);
  }

  if (argIsString) {
    jqLiteAddNodes(this, jqLiteParseHTML(element));
  } else if (isFunction(element)) {
    jqLiteReady(element);
  } else {
    jqLiteAddNodes(this, element);
  }
}

function jqLiteClone(element) {
  return element.cloneNode(true);
}

function jqLiteDealoc(element, onlyDescendants) {
  if (!onlyDescendants) jqLiteRemoveData(element);

  if (element.querySelectorAll) {
    var descendants = element.querySelectorAll('*');
    for (var i = 0, l = descendants.length; i < l; i++) {
      jqLiteRemoveData(descendants[i]);
    }
  }
}

function jqLiteOff(element, type, fn, unsupported) {
  if (isDefined(unsupported)) throw jqLiteMinErr('offargs', 'jqLite#off() does not support the `selector` argument');

  var expandoStore = jqLiteExpandoStore(element);
  var events = expandoStore && expandoStore.events;
  var handle = expandoStore && expandoStore.handle;

  if (!handle) return; //no listeners registered

  if (!type) {
    for (type in events) {
      if (type !== '$destroy') {
        element.removeEventListener(type, handle);
      }
      delete events[type];
    }
  } else {

    var removeHandler = function(type) {
      var listenerFns = events[type];
      if (isDefined(fn)) {
        arrayRemove(listenerFns || [], fn);
      }
      if (!(isDefined(fn) && listenerFns && listenerFns.length > 0)) {
        element.removeEventListener(type, handle);
        delete events[type];
      }
    };

    forEach(type.split(' '), function(type) {
      removeHandler(type);
      if (MOUSE_EVENT_MAP[type]) {
        removeHandler(MOUSE_EVENT_MAP[type]);
      }
    });
  }
}

function jqLiteRemoveData(element, name) {
  var expandoId = element.ng339;
  var expandoStore = expandoId && jqCache[expandoId];

  if (expandoStore) {
    if (name) {
      delete expandoStore.data[name];
      return;
    }

    if (expandoStore.handle) {
      if (expandoStore.events.$destroy) {
        expandoStore.handle({}, '$destroy');
      }
      jqLiteOff(element);
    }
    delete jqCache[expandoId];
    element.ng339 = undefined; 
  }
}


function jqLiteExpandoStore(element, createIfNecessary) {
  var expandoId = element.ng339,
      expandoStore = expandoId && jqCache[expandoId];

  if (createIfNecessary && !expandoStore) {
    element.ng339 = expandoId = jqNextId();
    expandoStore = jqCache[expandoId] = {events: {}, data: {}, handle: undefined};
  }

  return expandoStore;
}


function jqLiteData(element, key, value) {
  if (jqLiteAcceptsData(element)) {
    var prop;

    var isSimpleSetter = isDefined(value);
    var isSimpleGetter = !isSimpleSetter && key && !isObject(key);
    var massGetter = !key;
    var expandoStore = jqLiteExpandoStore(element, !isSimpleGetter);
    var data = expandoStore && expandoStore.data;

    if (isSimpleSetter) { 
      data[kebabToCamel(key)] = value;
    } else {
      if (massGetter) {  
        return data;
      } else {
        if (isSimpleGetter) { 
        
          return data && data[kebabToCamel(key)];
        } else { 
          for (prop in key) {
            data[kebabToCamel(prop)] = key[prop];
          }
        }
      }
    }
  }
}

function jqLiteHasClass(element, selector) {
  if (!element.getAttribute) return false;
  return ((' ' + (element.getAttribute('class') || '') + ' ').replace(/[\n\t]/g, ' ').
      indexOf(' ' + selector + ' ') > -1);
}

function jqLiteRemoveClass(element, cssClasses) {
  if (cssClasses && element.setAttribute) {
    forEach(cssClasses.split(' '), function(cssClass) {
      element.setAttribute('class', trim(
          (' ' + (element.getAttribute('class') || '') + ' ')
          .replace(/[\n\t]/g, ' ')
          .replace(' ' + trim(cssClass) + ' ', ' '))
      );
    });
  }
}

function jqLiteAddClass(element, cssClasses) {
  if (cssClasses && element.setAttribute) {
    var existingClasses = (' ' + (element.getAttribute('class') || '') + ' ')
                            .replace(/[\n\t]/g, ' ');

    forEach(cssClasses.split(' '), function(cssClass) {
      cssClass = trim(cssClass);
      if (existingClasses.indexOf(' ' + cssClass + ' ') === -1) {
        existingClasses += cssClass + ' ';
      }
    });

    element.setAttribute('class', trim(existingClasses));
  }
}


function jqLiteAddNodes(root, elements) {


  if (elements) {

 
    if (elements.nodeType) {
      root[root.length++] = elements;
    } else {
      var length = elements.length;

   
      if (typeof length === 'number' && elements.window !== elements) {
        if (length) {
          for (var i = 0; i < length; i++) {
            root[root.length++] = elements[i];
          }
        }
      } else {
        root[root.length++] = elements;
      }
    }
  }
}


function jqLiteController(element, name) {
  return jqLiteInheritedData(element, '$' + (name || 'ngController') + 'Controller');
}

function jqLiteInheritedData(element, name, value) {

 
  if (element.nodeType === NODE_TYPE_DOCUMENT) {
    element = element.documentElement;
  }
  var names = isArray(name) ? name : [name];

  while (element) {
    for (var i = 0, ii = names.length; i < ii; i++) {
      if (isDefined(value = jqLite.data(element, names[i]))) return value;
    }

  
    element = element.parentNode || (element.nodeType === NODE_TYPE_DOCUMENT_FRAGMENT && element.host);
  }
}

function jqLiteEmpty(element) {
  jqLiteDealoc(element, true);
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function jqLiteRemove(element, keepData) {
  if (!keepData) jqLiteDealoc(element);
  var parent = element.parentNode;
  if (parent) parent.removeChild(element);
}


function jqLiteDocumentLoaded(action, win) {
  win = win || window;
  if (win.document.readyState === 'complete') {
 
    win.setTimeout(action);
  } else {
    
    jqLite(win).on('load', action);
  }
}

function jqLiteReady(fn) {
  function trigger() {
    window.document.removeEventListener('DOMContentLoaded', trigger);
    window.removeEventListener('load', trigger);
    fn();
  }


  if (window.document.readyState === 'complete') {
    window.setTimeout(fn);
  } else {
   
    window.document.addEventListener('DOMContentLoaded', trigger);

   
    window.addEventListener('load', trigger);
  }
}


var JQLitePrototype = JQLite.prototype = {
  ready: jqLiteReady,
  toString: function() {
    var value = [];
    forEach(this, function(e) { value.push('' + e);});
    return '[' + value.join(', ') + ']';
  },

  eq: function(index) {
      return (index >= 0) ? jqLite(this[index]) : jqLite(this[this.length + index]);
  },

  length: 0,
  push: push,
  sort: [].sort,
  splice: [].splice
};


var BOOLEAN_ATTR = {};
forEach('multiple,selected,checked,disabled,readOnly,required,open'.split(','), function(value) {
  BOOLEAN_ATTR[lowercase(value)] = value;
});
var BOOLEAN_ELEMENTS = {};
forEach('input,select,option,textarea,button,form,details'.split(','), function(value) {
  BOOLEAN_ELEMENTS[value] = true;
});
var ALIASED_ATTR = {
  'ngMinlength': 'minlength',
  'ngMaxlength': 'maxlength',
  'ngMin': 'min',
  'ngMax': 'max',
  'ngPattern': 'pattern',
  'ngStep': 'step'
};

function getBooleanAttrName(element, name) {
 
  var booleanAttr = BOOLEAN_ATTR[name.toLowerCase()];


  return booleanAttr && BOOLEAN_ELEMENTS[nodeName_(element)] && booleanAttr;
}

function getAliasedAttrName(name) {
  return ALIASED_ATTR[name];
}

forEach({
  data: jqLiteData,
  removeData: jqLiteRemoveData,
  hasData: jqLiteHasData,
  cleanData: jqLiteCleanData
}, function(fn, name) {
  JQLite[name] = fn;
});

forEach({
  data: jqLiteData,
  inheritedData: jqLiteInheritedData,

  scope: function(element) {
    return jqLite.data(element, '$scope') || jqLiteInheritedData(element.parentNode || element, ['$isolateScope', '$scope']);
  },

  isolateScope: function(element) {
  
    return jqLite.data(element, '$isolateScope') || jqLite.data(element, '$isolateScopeNoTemplate');
  },

  controller: jqLiteController,

  injector: function(element) {
    return jqLiteInheritedData(element, '$injector');
  },

  removeAttr: function(element, name) {
    element.removeAttribute(name);
  },

  hasClass: jqLiteHasClass,

  css: function(element, name, value) {
    name = cssKebabToCamel(name);

    if (isDefined(value)) {
      element.style[name] = value;
    } else {
      return element.style[name];
    }
  },

  attr: function(element, name, value) {
    var ret;
    var nodeType = element.nodeType;
    if (nodeType === NODE_TYPE_TEXT || nodeType === NODE_TYPE_ATTRIBUTE || nodeType === NODE_TYPE_COMMENT ||
      !element.getAttribute) {
      return;
    }

    var lowercasedName = lowercase(name);
    var isBooleanAttr = BOOLEAN_ATTR[lowercasedName];

    if (isDefined(value)) {
      // setter

      if (value === null || (value === false && isBooleanAttr)) {
        element.removeAttribute(name);
      } else {
        element.setAttribute(name, isBooleanAttr ? lowercasedName : value);
      }
    } else {
      // getter

      ret = element.getAttribute(name);

      if (isBooleanAttr && ret !== null) {
        ret = lowercasedName;
      }
    
      return ret === null ? undefined : ret;
    }
  },

  prop: function(element, name, value) {
    if (isDefined(value)) {
      element[name] = value;
    } else {
      return element[name];
    }
  },

  text: (function() {
    getText.$dv = '';
    return getText;

    function getText(element, value) {
      if (isUndefined(value)) {
        var nodeType = element.nodeType;
        return (nodeType === NODE_TYPE_ELEMENT || nodeType === NODE_TYPE_TEXT) ? element.textContent : '';
      }
      element.textContent = value;
    }
  })(),

  val: function(element, value) {
    if (isUndefined(value)) {
      if (element.multiple && nodeName_(element) === 'select') {
        var result = [];
        forEach(element.options, function(option) {
          if (option.selected) {
            result.push(option.value || option.text);
          }
        });
        return result;
      }
      return element.value;
    }
    element.value = value;
  },

  html: function(element, value) {
    if (isUndefined(value)) {
      return element.innerHTML;
    }
    jqLiteDealoc(element, true);
    element.innerHTML = value;
  },

  empty: jqLiteEmpty
}, function(fn, name) {

  JQLite.prototype[name] = function(arg1, arg2) {
    var i, key;
    var nodeCount = this.length;

   
    if (fn !== jqLiteEmpty &&
        (isUndefined((fn.length === 2 && (fn !== jqLiteHasClass && fn !== jqLiteController)) ? arg1 : arg2))) {
      if (isObject(arg1)) {

    
        for (i = 0; i < nodeCount; i++) {
          if (fn === jqLiteData) {
  
            fn(this[i], arg1);
          } else {
            for (key in arg1) {
              fn(this[i], key, arg1[key]);
            }
          }
        }

        return this;
      } else {

        var value = fn.$dv;
   
        var jj = (isUndefined(value)) ? Math.min(nodeCount, 1) : nodeCount;
        for (var j = 0; j < jj; j++) {
          var nodeValue = fn(this[j], arg1, arg2);
          value = value ? value + nodeValue : nodeValue;
        }
        return value;
      }
    } else {
  
      for (i = 0; i < nodeCount; i++) {
        fn(this[i], arg1, arg2);
      }

      return this;
    }
  };
});

function createEventHandler(element, events) {
  var eventHandler = function(event, type) {

    event.isDefaultPrevented = function() {
      return event.defaultPrevented;
    };

    var eventFns = events[type || event.type];
    var eventFnsLength = eventFns ? eventFns.length : 0;

    if (!eventFnsLength) return;

    if (isUndefined(event.immediatePropagationStopped)) {
      var originalStopImmediatePropagation = event.stopImmediatePropagation;
      event.stopImmediatePropagation = function() {
        event.immediatePropagationStopped = true;

        if (event.stopPropagation) {
          event.stopPropagation();
        }

        if (originalStopImmediatePropagation) {
          originalStopImmediatePropagation.call(event);
        }
      };
    }

    event.isImmediatePropagationStopped = function() {
      return event.immediatePropagationStopped === true;
    };


    var handlerWrapper = eventFns.specialHandlerWrapper || defaultHandlerWrapper;


    if ((eventFnsLength > 1)) {
      eventFns = shallowCopy(eventFns);
    }

    for (var i = 0; i < eventFnsLength; i++) {
      if (!event.isImmediatePropagationStopped()) {
        handlerWrapper(element, event, eventFns[i]);
      }
    }
  };



  eventHandler.elem = element;
  return eventHandler;
}

function defaultHandlerWrapper(element, event, handler) {
  handler.call(element, event);
}

function specialMouseHandlerWrapper(target, event, handler) {

  var related = event.relatedTarget;

  if (!related || (related !== target && !jqLiteContains.call(target, related))) {
    handler.call(target, event);
  }
}


forEach({
  removeData: jqLiteRemoveData,

  on: function jqLiteOn(element, type, fn, unsupported) {
    if (isDefined(unsupported)) throw jqLiteMinErr('onargs', 'jqLite#on() does not support the `selector` or `eventData` parameters');


    if (!jqLiteAcceptsData(element)) {
      return;
    }

    var expandoStore = jqLiteExpandoStore(element, true);
    var events = expandoStore.events;
    var handle = expandoStore.handle;

    if (!handle) {
      handle = expandoStore.handle = createEventHandler(element, events);
    }

   
    var types = type.indexOf(' ') >= 0 ? type.split(' ') : [type];
    var i = types.length;

    var addHandler = function(type, specialHandlerWrapper, noEventListener) {
      var eventFns = events[type];

      if (!eventFns) {
        eventFns = events[type] = [];
        eventFns.specialHandlerWrapper = specialHandlerWrapper;
        if (type !== '$destroy' && !noEventListener) {
          element.addEventListener(type, handle);
        }
      }

      eventFns.push(fn);
    };

    while (i--) {
      type = types[i];
      if (MOUSE_EVENT_MAP[type]) {
        addHandler(MOUSE_EVENT_MAP[type], specialMouseHandlerWrapper);
        addHandler(type, undefined, true);
      } else {
        addHandler(type);
      }
    }
  },

  off: jqLiteOff,

  one: function(element, type, fn) {
    element = jqLite(element);


    element.on(type, function onFn() {
      element.off(type, fn);
      element.off(type, onFn);
    });
    element.on(type, fn);
  },

  replaceWith: function(element, replaceNode) {
    var index, parent = element.parentNode;
    jqLiteDealoc(element);
    forEach(new JQLite(replaceNode), function(node) {
      if (index) {
        parent.insertBefore(node, index.nextSibling);
      } else {
        parent.replaceChild(node, element);
      }
      index = node;
    });
  },

  children: function(element) {
    var children = [];
    forEach(element.childNodes, function(element) {
      if (element.nodeType === NODE_TYPE_ELEMENT) {
        children.push(element);
      }
    });
    return children;
  },

  contents: function(element) {
    return element.contentDocument || element.childNodes || [];
  },

  append: function(element, node) {
    var nodeType = element.nodeType;
    if (nodeType !== NODE_TYPE_ELEMENT && nodeType !== NODE_TYPE_DOCUMENT_FRAGMENT) return;

    node = new JQLite(node);

    for (var i = 0, ii = node.length; i < ii; i++) {
      var child = node[i];
      element.appendChild(child);
    }
  },

  prepend: function(element, node) {
    if (element.nodeType === NODE_TYPE_ELEMENT) {
      var index = element.firstChild;
      forEach(new JQLite(node), function(child) {
        element.insertBefore(child, index);
      });
    }
  },

  wrap: function(element, wrapNode) {
    jqLiteWrapNode(element, jqLite(wrapNode).eq(0).clone()[0]);
  },

  remove: jqLiteRemove,

  detach: function(element) {
    jqLiteRemove(element, true);
  },

  after: function(element, newElement) {
    var index = element, parent = element.parentNode;

    if (parent) {
      newElement = new JQLite(newElement);

      for (var i = 0, ii = newElement.length; i < ii; i++) {
        var node = newElement[i];
        parent.insertBefore(node, index.nextSibling);
        index = node;
      }
    }
  },

  addClass: jqLiteAddClass,
  removeClass: jqLiteRemoveClass,

  toggleClass: function(element, selector, condition) {
    if (selector) {
      forEach(selector.split(' '), function(className) {
        var classCondition = condition;
        if (isUndefined(classCondition)) {
          classCondition = !jqLiteHasClass(element, className);
        }
        (classCondition ? jqLiteAddClass : jqLiteRemoveClass)(element, className);
      });
    }
  },

  parent: function(element) {
    var parent = element.parentNode;
    return parent && parent.nodeType !== NODE_TYPE_DOCUMENT_FRAGMENT ? parent : null;
  },

  next: function(element) {
    return element.nextElementSibling;
  },

  find: function(element, selector) {
    if (element.getElementsByTagName) {
      return element.getElementsByTagName(selector);
    } else {
      return [];
    }
  },

  clone: jqLiteClone,

  triggerHandler: function(element, event, extraParameters) {

    var dummyEvent, eventFnsCopy, handlerArgs;
    var eventName = event.type || event;
    var expandoStore = jqLiteExpandoStore(element);
    var events = expandoStore && expandoStore.events;
    var eventFns = events && events[eventName];

    if (eventFns) {
      // Create a dummy event to pass to the handlers
      dummyEvent = {
        preventDefault: function() { this.defaultPrevented = true; },
        isDefaultPrevented: function() { return this.defaultPrevented === true; },
        stopImmediatePropagation: function() { this.immediatePropagationStopped = true; },
        isImmediatePropagationStopped: function() { return this.immediatePropagationStopped === true; },
        stopPropagation: noop,
        type: eventName,
        target: element
      };

  
      if (event.type) {
        dummyEvent = extend(dummyEvent, event);
      }

  
      eventFnsCopy = shallowCopy(eventFns);
      handlerArgs = extraParameters ? [dummyEvent].concat(extraParameters) : [dummyEvent];

      forEach(eventFnsCopy, function(fn) {
        if (!dummyEvent.isImmediatePropagationStopped()) {
          fn.apply(element, handlerArgs);
        }
      });
    }
  }
}, function(fn, name) {

  JQLite.prototype[name] = function(arg1, arg2, arg3) {
    var value;

    for (var i = 0, ii = this.length; i < ii; i++) {
      if (isUndefined(value)) {
        value = fn(this[i], arg1, arg2, arg3);
        if (isDefined(value)) {
  
          value = jqLite(value);
        }
      } else {
        jqLiteAddNodes(value, fn(this[i], arg1, arg2, arg3));
      }
    }
    return isDefined(value) ? value : this;
  };
});


JQLite.prototype.bind = JQLite.prototype.on;
JQLite.prototype.unbind = JQLite.prototype.off;


function $$jqLiteProvider() {
  this.$get = function $$jqLite() {
    return extend(JQLite, {
      hasClass: function(node, classes) {
        if (node.attr) node = node[0];
        return jqLiteHasClass(node, classes);
      },
      addClass: function(node, classes) {
        if (node.attr) node = node[0];
        return jqLiteAddClass(node, classes);
      },
      removeClass: function(node, classes) {
        if (node.attr) node = node[0];
        return jqLiteRemoveClass(node, classes);
      }
    });
  };
}


function hashKey(obj, nextUidFn) {
  var key = obj && obj.$$hashKey;

  if (key) {
    if (typeof key === 'function') {
      key = obj.$$hashKey();
    }
    return key;
  }

  var objType = typeof obj;
  if (objType === 'function' || (objType === 'object' && obj !== null)) {
    key = obj.$$hashKey = objType + ':' + (nextUidFn || nextUid)();
  } else {
    key = objType + ':' + obj;
  }

  return key;
}


function HashMap(array, isolatedUid) {
  if (isolatedUid) {
    var uid = 0;
    this.nextUid = function() {
      return ++uid;
    };
  }
  forEach(array, this.put, this);
}
HashMap.prototype = {
 
  put: function(key, value) {
    this[hashKey(key, this.nextUid)] = value;
  },

 
  get: function(key) {
    return this[hashKey(key, this.nextUid)];
  },


  remove: function(key) {
    var value = this[key = hashKey(key, this.nextUid)];
    delete this[key];
    return value;
  }
};

var $$HashMapProvider = [/** @this */function() {
  this.$get = [function() {
    return HashMap;
  }];
}];

var ARROW_ARG = /^([^(]+?)=>/;
var FN_ARGS = /^[^(]*\(\s*([^)]*)\)/m;
var FN_ARG_SPLIT = /,/;
var FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var $injectorMinErr = minErr('$injector');

function stringifyFn(fn) {
  return Function.prototype.toString.call(fn) + ' ';
}

function extractArgs(fn) {
  var fnText = stringifyFn(fn).replace(STRIP_COMMENTS, ''),
      args = fnText.match(ARROW_ARG) || fnText.match(FN_ARGS);
  return args;
}

function anonFn(fn) {

  var args = extractArgs(fn);
  if (args) {
    return 'function(' + (args[1] || '').replace(/[\s\r\n]+/, ' ') + ')';
  }
  return 'fn';
}

function annotate(fn, strictDi, name) {
  var $inject,
      argDecl,
      last;

  if (typeof fn === 'function') {
    if (!($inject = fn.$inject)) {
      $inject = [];
      if (fn.length) {
        if (strictDi) {
          if (!isString(name) || !name) {
            name = fn.name || anonFn(fn);
          }
          throw $injectorMinErr('strictdi',
            '{0} is not using explicit annotation and cannot be invoked in strict mode', name);
        }
        argDecl = extractArgs(fn);
        forEach(argDecl[1].split(FN_ARG_SPLIT), function(arg) {
          arg.replace(FN_ARG, function(all, underscore, name) {
            $inject.push(name);
          });
        });
      }
      fn.$inject = $inject;
    }
  } else if (isArray(fn)) {
    last = fn.length - 1;
    assertArgFn(fn[last], 'fn');
    $inject = fn.slice(0, last);
  } else {
    assertArgFn(fn, 'fn', true);
  }
  return $inject;
}


function createInjector(modulesToLoad, strictDi) {
  strictDi = (strictDi === true);
  var INSTANTIATING = {},
      providerSuffix = 'Provider',
      path = [],
      loadedModules = new HashMap([], true),
      providerCache = {
        $provide: {
            provider: supportObject(provider),
            factory: supportObject(factory),
            service: supportObject(service),
            value: supportObject(value),
            constant: supportObject(constant),
            decorator: decorator
          }
      },
      providerInjector = (providerCache.$injector =
          createInternalInjector(providerCache, function(serviceName, caller) {
            if (angular.isString(caller)) {
              path.push(caller);
            }
            throw $injectorMinErr('unpr', 'Unknown provider: {0}', path.join(' <- '));
          })),
      instanceCache = {},
      protoInstanceInjector =
          createInternalInjector(instanceCache, function(serviceName, caller) {
            var provider = providerInjector.get(serviceName + providerSuffix, caller);
            return instanceInjector.invoke(
                provider.$get, provider, undefined, serviceName);
          }),
      instanceInjector = protoInstanceInjector;

  providerCache['$injector' + providerSuffix] = { $get: valueFn(protoInstanceInjector) };
  var runBlocks = loadModules(modulesToLoad);
  instanceInjector = protoInstanceInjector.get('$injector');
  instanceInjector.strictDi = strictDi;
  forEach(runBlocks, function(fn) { if (fn) instanceInjector.invoke(fn); });

  return instanceInjector;



  function supportObject(delegate) {
    return function(key, value) {
      if (isObject(key)) {
        forEach(key, reverseParams(delegate));
      } else {
        return delegate(key, value);
      }
    };
  }

  function provider(name, provider_) {
    assertNotHasOwnProperty(name, 'service');
    if (isFunction(provider_) || isArray(provider_)) {
      provider_ = providerInjector.instantiate(provider_);
    }
    if (!provider_.$get) {
      throw $injectorMinErr('pget', 'Provider \'{0}\' must define $get factory method.', name);
    }
    return (providerCache[name + providerSuffix] = provider_);
  }

  function enforceReturnValue(name, factory) {
    return /** @this */ function enforcedReturnValue() {
      var result = instanceInjector.invoke(factory, this);
      if (isUndefined(result)) {
        throw $injectorMinErr('undef', 'Provider \'{0}\' must return a value from $get factory method.', name);
      }
      return result;
    };
  }

  function factory(name, factoryFn, enforce) {
    return provider(name, {
      $get: enforce !== false ? enforceReturnValue(name, factoryFn) : factoryFn
    });
  }

  function service(name, constructor) {
    return factory(name, ['$injector', function($injector) {
      return $injector.instantiate(constructor);
    }]);
  }

  function value(name, val) { return factory(name, valueFn(val), false); }

  function constant(name, value) {
    assertNotHasOwnProperty(name, 'constant');
    providerCache[name] = value;
    instanceCache[name] = value;
  }

  function decorator(serviceName, decorFn) {
    var origProvider = providerInjector.get(serviceName + providerSuffix),
        orig$get = origProvider.$get;

    origProvider.$get = function() {
      var origInstance = instanceInjector.invoke(orig$get, origProvider);
      return instanceInjector.invoke(decorFn, null, {$delegate: origInstance});
    };
  }


  function loadModules(modulesToLoad) {
    assertArg(isUndefined(modulesToLoad) || isArray(modulesToLoad), 'modulesToLoad', 'not an array');
    var runBlocks = [], moduleFn;
    forEach(modulesToLoad, function(module) {
      if (loadedModules.get(module)) return;
      loadedModules.put(module, true);

      function runInvokeQueue(queue) {
        var i, ii;
        for (i = 0, ii = queue.length; i < ii; i++) {
          var invokeArgs = queue[i],
              provider = providerInjector.get(invokeArgs[0]);

          provider[invokeArgs[1]].apply(provider, invokeArgs[2]);
        }
      }

      try {
        if (isString(module)) {
          moduleFn = angularModule(module);
          runBlocks = runBlocks.concat(loadModules(moduleFn.requires)).concat(moduleFn._runBlocks);
          runInvokeQueue(moduleFn._invokeQueue);
          runInvokeQueue(moduleFn._configBlocks);
        } else if (isFunction(module)) {
            runBlocks.push(providerInjector.invoke(module));
        } else if (isArray(module)) {
            runBlocks.push(providerInjector.invoke(module));
        } else {
          assertArgFn(module, 'module');
        }
      } catch (e) {
        if (isArray(module)) {
          module = module[module.length - 1];
        }
        if (e.message && e.stack && e.stack.indexOf(e.message) === -1) {

          e = e.message + '\n' + e.stack;
        }
        throw $injectorMinErr('modulerr', 'Failed to instantiate module {0} due to:\n{1}',
                  module, e.stack || e.message || e);
      }
    });
    return runBlocks;
  }



  function createInternalInjector(cache, factory) {

    function getService(serviceName, caller) {
      if (cache.hasOwnProperty(serviceName)) {
        if (cache[serviceName] === INSTANTIATING) {
          throw $injectorMinErr('cdep', 'Circular dependency found: {0}',
                    serviceName + ' <- ' + path.join(' <- '));
        }
        return cache[serviceName];
      } else {
        try {
          path.unshift(serviceName);
          cache[serviceName] = INSTANTIATING;
          cache[serviceName] = factory(serviceName, caller);
          return cache[serviceName];
        } catch (err) {
          if (cache[serviceName] === INSTANTIATING) {
            delete cache[serviceName];
          }
          throw err;
        } finally {
          path.shift();
        }
      }
    }


    function injectionArgs(fn, locals, serviceName) {
      var args = [],
          $inject = createInjector.$$annotate(fn, strictDi, serviceName);

      for (var i = 0, length = $inject.length; i < length; i++) {
        var key = $inject[i];
        if (typeof key !== 'string') {
          throw $injectorMinErr('itkn',
                  'Incorrect injection token! Expected service name as string, got {0}', key);
        }
        args.push(locals && locals.hasOwnProperty(key) ? locals[key] :
                                                         getService(key, serviceName));
      }
      return args;
    }

    function isClass(func) {

      if (msie || typeof func !== 'function') {
        return false;
      }
      var result = func.$$ngIsClass;
      if (!isBoolean(result)) {

        result = func.$$ngIsClass = /^(?:class\b|constructor\()/.test(stringifyFn(func));
      }
      return result;
    }

    function invoke(fn, self, locals, serviceName) {
      if (typeof locals === 'string') {
        serviceName = locals;
        locals = null;
      }

      var args = injectionArgs(fn, locals, serviceName);
      if (isArray(fn)) {
        fn = fn[fn.length - 1];
      }

      if (!isClass(fn)) {

        return fn.apply(self, args);
      } else {
        args.unshift(null);
        return new (Function.prototype.bind.apply(fn, args))();
      }
    }


    function instantiate(Type, locals, serviceName) {

      var ctor = (isArray(Type) ? Type[Type.length - 1] : Type);
      var args = injectionArgs(Type, locals, serviceName);

      args.unshift(null);
      return new (Function.prototype.bind.apply(ctor, args))();
    }


    return {
      invoke: invoke,
      instantiate: instantiate,
      get: getService,
      annotate: createInjector.$$annotate,
      has: function(name) {
        return providerCache.hasOwnProperty(name + providerSuffix) || cache.hasOwnProperty(name);
      }
    };
  }
}

createInjector.$$annotate = annotate;

function $AnchorScrollProvider() {

  var autoScrollingEnabled = true;

 
  this.disableAutoScrolling = function() {
    autoScrollingEnabled = false;
  };

  this.$get = ['$window', '$location', '$rootScope', function($window, $location, $rootScope) {
    var document = $window.document;


    function getFirstAnchor(list) {
      var result = null;
      Array.prototype.some.call(list, function(element) {
        if (nodeName_(element) === 'a') {
          result = element;
          return true;
        }
      });
      return result;
    }

    function getYOffset() {

      var offset = scroll.yOffset;

      if (isFunction(offset)) {
        offset = offset();
      } else if (isElement(offset)) {
        var elem = offset[0];
        var style = $window.getComputedStyle(elem);
        if (style.position !== 'fixed') {
          offset = 0;
        } else {
          offset = elem.getBoundingClientRect().bottom;
        }
      } else if (!isNumber(offset)) {
        offset = 0;
      }

      return offset;
    }

    function scrollTo(elem) {
      if (elem) {
        elem.scrollIntoView();

        var offset = getYOffset();

        if (offset) {
          var elemTop = elem.getBoundingClientRect().top;
          $window.scrollBy(0, elemTop - offset);
        }
      } else {
        $window.scrollTo(0, 0);
      }
    }

    function scroll(hash) {

      hash = isString(hash) ? hash : isNumber(hash) ? hash.toString() : $location.hash();
      var elm;


      if (!hash) scrollTo(null);


      else if ((elm = document.getElementById(hash))) scrollTo(elm);


      else if ((elm = getFirstAnchor(document.getElementsByName(hash)))) scrollTo(elm);


      else if (hash === 'top') scrollTo(null);
    }

    if (autoScrollingEnabled) {
      $rootScope.$watch(function autoScrollWatch() {return $location.hash();},
        function autoScrollWatchAction(newVal, oldVal) {

          if (newVal === oldVal && newVal === '') return;

          jqLiteDocumentLoaded(function() {
            $rootScope.$evalAsync(scroll);
          });
        });
    }

    return scroll;
  }];
}

var $animateMinErr = minErr('$animate');
var ELEMENT_NODE = 1;
var NG_ANIMATE_CLASSNAME = 'ng-animate';

function mergeClasses(a,b) {
  if (!a && !b) return '';
  if (!a) return b;
  if (!b) return a;
  if (isArray(a)) a = a.join(' ');
  if (isArray(b)) b = b.join(' ');
  return a + ' ' + b;
}

function extractElementNode(element) {
  for (var i = 0; i < element.length; i++) {
    var elm = element[i];
    if (elm.nodeType === ELEMENT_NODE) {
      return elm;
    }
  }
}

function splitClasses(classes) {
  if (isString(classes)) {
    classes = classes.split(' ');
  }

 
  var obj = createMap();
  forEach(classes, function(klass) {
    // sometimes the split leaves empty string values
    // incase extra spaces were applied to the options
    if (klass.length) {
      obj[klass] = true;
    }
  });
  return obj;
}


function prepareAnimateOptions(options) {
  return isObject(options)
      ? options
      : {};
}

var $$CoreAnimateJsProvider = /** @this */ function() {
  this.$get = noop;
};


var $$CoreAnimateQueueProvider = /** @this */ function() {
  var postDigestQueue = new HashMap();
  var postDigestElements = [];

  this.$get = ['$$AnimateRunner', '$rootScope',
       function($$AnimateRunner,   $rootScope) {
    return {
      enabled: noop,
      on: noop,
      off: noop,
      pin: noop,

      push: function(element, event, options, domOperation) {
        if (domOperation) {
          domOperation();
        }

        options = options || {};
        if (options.from) {
          element.css(options.from);
        }
        if (options.to) {
          element.css(options.to);
        }

        if (options.addClass || options.removeClass) {
          addRemoveClassesPostDigest(element, options.addClass, options.removeClass);
        }

        var runner = new $$AnimateRunner();


        runner.complete();
        return runner;
      }
    };


    function updateData(data, classes, value) {
      var changed = false;
      if (classes) {
        classes = isString(classes) ? classes.split(' ') :
                  isArray(classes) ? classes : [];
        forEach(classes, function(className) {
          if (className) {
            changed = true;
            data[className] = value;
          }
        });
      }
      return changed;
    }

    function handleCSSClassChanges() {
      forEach(postDigestElements, function(element) {
        var data = postDigestQueue.get(element);
        if (data) {
          var existing = splitClasses(element.attr('class'));
          var toAdd = '';
          var toRemove = '';
          forEach(data, function(status, className) {
            var hasClass = !!existing[className];
            if (status !== hasClass) {
              if (status) {
                toAdd += (toAdd.length ? ' ' : '') + className;
              } else {
                toRemove += (toRemove.length ? ' ' : '') + className;
              }
            }
          });

          forEach(element, function(elm) {
            if (toAdd) {
              jqLiteAddClass(elm, toAdd);
            }
            if (toRemove) {
              jqLiteRemoveClass(elm, toRemove);
            }
          });
          postDigestQueue.remove(element);
        }
      });
      postDigestElements.length = 0;
    }


    function addRemoveClassesPostDigest(element, add, remove) {
      var data = postDigestQueue.get(element) || {};

      var classesAdded = updateData(data, add, true);
      var classesRemoved = updateData(data, remove, false);

      if (classesAdded || classesRemoved) {

        postDigestQueue.put(element, data);
        postDigestElements.push(element);

        if (postDigestElements.length === 1) {
          $rootScope.$$postDigest(handleCSSClassChanges);
        }
      }
    }
  }];
};


var $AnimateProvider = ['$provide', /** @this */ function($provide) {
  var provider = this;

  this.$$registeredAnimations = Object.create(null);

 
  this.register = function(name, factory) {
    if (name && name.charAt(0) !== '.') {
      throw $animateMinErr('notcsel', 'Expecting class selector starting with \'.\' got \'{0}\'.', name);
    }

    var key = name + '-animation';
    provider.$$registeredAnimations[name.substr(1)] = key;
    $provide.factory(key, factory);
  };

  
  this.classNameFilter = function(expression) {
    if (arguments.length === 1) {
      this.$$classNameFilter = (expression instanceof RegExp) ? expression : null;
      if (this.$$classNameFilter) {
        var reservedRegex = new RegExp('(\\s+|\\/)' + NG_ANIMATE_CLASSNAME + '(\\s+|\\/)');
        if (reservedRegex.test(this.$$classNameFilter.toString())) {
          throw $animateMinErr('nongcls','$animateProvider.classNameFilter(regex) prohibits accepting a regex value which matches/contains the "{0}" CSS class.', NG_ANIMATE_CLASSNAME);
        }
      }
    }
    return this.$$classNameFilter;
  };

  this.$get = ['$$animateQueue', function($$animateQueue) {
    function domInsert(element, parentElement, afterElement) {
     
      if (afterElement) {
        var afterNode = extractElementNode(afterElement);
        if (afterNode && !afterNode.parentNode && !afterNode.previousElementSibling) {
          afterElement = null;
        }
      }
      if (afterElement) {
        afterElement.after(element);
      } else {
        parentElement.prepend(element);
      }
    }

   
    return {
   
      on: $$animateQueue.on,

      off: $$animateQueue.off,

      pin: $$animateQueue.pin,

      enabled: $$animateQueue.enabled,

      cancel: function(runner) {
        if (runner.end) {
          runner.end();
        }
      },

    
      enter: function(element, parent, after, options) {
        parent = parent && jqLite(parent);
        after = after && jqLite(after);
        parent = parent || after.parent();
        domInsert(element, parent, after);
        return $$animateQueue.push(element, 'enter', prepareAnimateOptions(options));
      },

     
      move: function(element, parent, after, options) {
        parent = parent && jqLite(parent);
        after = after && jqLite(after);
        parent = parent || after.parent();
        domInsert(element, parent, after);
        return $$animateQueue.push(element, 'move', prepareAnimateOptions(options));
      },

     
      leave: function(element, options) {
        return $$animateQueue.push(element, 'leave', prepareAnimateOptions(options), function() {
          element.remove();
        });
      },

     
      addClass: function(element, className, options) {
        options = prepareAnimateOptions(options);
        options.addClass = mergeClasses(options.addclass, className);
        return $$animateQueue.push(element, 'addClass', options);
      },

      
      removeClass: function(element, className, options) {
        options = prepareAnimateOptions(options);
        options.removeClass = mergeClasses(options.removeClass, className);
        return $$animateQueue.push(element, 'removeClass', options);
      },

     
      setClass: function(element, add, remove, options) {
        options = prepareAnimateOptions(options);
        options.addClass = mergeClasses(options.addClass, add);
        options.removeClass = mergeClasses(options.removeClass, remove);
        return $$animateQueue.push(element, 'setClass', options);
      },

     
      animate: function(element, from, to, className, options) {
        options = prepareAnimateOptions(options);
        options.from = options.from ? extend(options.from, from) : from;
        options.to   = options.to   ? extend(options.to, to)     : to;

        className = className || 'ng-inline-animate';
        options.tempClasses = mergeClasses(options.tempClasses, className);
        return $$animateQueue.push(element, 'animate', options);
      }
    };
  }];
}];

var $$AnimateAsyncRunFactoryProvider = /** @this */ function() {
  this.$get = ['$$rAF', function($$rAF) {
    var waitQueue = [];

    function waitForTick(fn) {
      waitQueue.push(fn);
      if (waitQueue.length > 1) return;
      $$rAF(function() {
        for (var i = 0; i < waitQueue.length; i++) {
          waitQueue[i]();
        }
        waitQueue = [];
      });
    }

    return function() {
      var passed = false;
      waitForTick(function() {
        passed = true;
      });
      return function(callback) {
        if (passed) {
          callback();
        } else {
          waitForTick(callback);
        }
      };
    };
  }];
};

var $$AnimateRunnerFactoryProvider = /** @this */ function() {
  this.$get = ['$q', '$sniffer', '$$animateAsyncRun', '$$isDocumentHidden', '$timeout',
       function($q,   $sniffer,   $$animateAsyncRun,   $$isDocumentHidden,   $timeout) {

    var INITIAL_STATE = 0;
    var DONE_PENDING_STATE = 1;
    var DONE_COMPLETE_STATE = 2;

    AnimateRunner.chain = function(chain, callback) {
      var index = 0;

      next();
      function next() {
        if (index === chain.length) {
          callback(true);
          return;
        }

        chain[index](function(response) {
          if (response === false) {
            callback(false);
            return;
          }
          index++;
          next();
        });
      }
    };

    AnimateRunner.all = function(runners, callback) {
      var count = 0;
      var status = true;
      forEach(runners, function(runner) {
        runner.done(onProgress);
      });

      function onProgress(response) {
        status = status && response;
        if (++count === runners.length) {
          callback(status);
        }
      }
    };

    function AnimateRunner(host) {
      this.setHost(host);

      var rafTick = $$animateAsyncRun();
      var timeoutTick = function(fn) {
        $timeout(fn, 0, false);
      };

      this._doneCallbacks = [];
      this._tick = function(fn) {
        if ($$isDocumentHidden()) {
          timeoutTick(fn);
        } else {
          rafTick(fn);
        }
      };
      this._state = 0;
    }

    AnimateRunner.prototype = {
      setHost: function(host) {
        this.host = host || {};
      },

      done: function(fn) {
        if (this._state === DONE_COMPLETE_STATE) {
          fn();
        } else {
          this._doneCallbacks.push(fn);
        }
      },

      progress: noop,

      getPromise: function() {
        if (!this.promise) {
          var self = this;
          this.promise = $q(function(resolve, reject) {
            self.done(function(status) {
              if (status === false) {
                reject();
              } else {
                resolve();
              }
            });
          });
        }
        return this.promise;
      },

      then: function(resolveHandler, rejectHandler) {
        return this.getPromise().then(resolveHandler, rejectHandler);
      },

      'catch': function(handler) {
        return this.getPromise()['catch'](handler);
      },

      'finally': function(handler) {
        return this.getPromise()['finally'](handler);
      },

      pause: function() {
        if (this.host.pause) {
          this.host.pause();
        }
      },

      resume: function() {
        if (this.host.resume) {
          this.host.resume();
        }
      },

      end: function() {
        if (this.host.end) {
          this.host.end();
        }
        this._resolve(true);
      },

      cancel: function() {
        if (this.host.cancel) {
          this.host.cancel();
        }
        this._resolve(false);
      },

      complete: function(response) {
        var self = this;
        if (self._state === INITIAL_STATE) {
          self._state = DONE_PENDING_STATE;
          self._tick(function() {
            self._resolve(response);
          });
        }
      },

      _resolve: function(response) {
        if (this._state !== DONE_COMPLETE_STATE) {
          forEach(this._doneCallbacks, function(fn) {
            fn(response);
          });
          this._doneCallbacks.length = 0;
          this._state = DONE_COMPLETE_STATE;
        }
      }
    };

    return AnimateRunner;
  }];
};

var $CoreAnimateCssProvider = function() {
  this.$get = ['$$rAF', '$q', '$$AnimateRunner', function($$rAF, $q, $$AnimateRunner) {

    return function(element, initialOptions) {
   
      var options = initialOptions || {};
      if (!options.$$prepared) {
        options = copy(options);
      }
      if (options.cleanupStyles) {
        options.from = options.to = null;
      }

      if (options.from) {
        element.css(options.from);
        options.from = null;
      }

      var closed, runner = new $$AnimateRunner();
      return {
        start: run,
        end: run
      };

      function run() {
        $$rAF(function() {
          applyAnimationContents();
          if (!closed) {
            runner.complete();
          }
          closed = true;
        });
        return runner;
      }

      function applyAnimationContents() {
        if (options.addClass) {
          element.addClass(options.addClass);
          options.addClass = null;
        }
        if (options.removeClass) {
          element.removeClass(options.removeClass);
          options.removeClass = null;
        }
        if (options.to) {
          element.css(options.to);
          options.to = null;
        }
      }
    };
  }];
};

function Browser(window, document, $log, $sniffer) {
  var self = this,
      location = window.location,
      history = window.history,
      setTimeout = window.setTimeout,
      clearTimeout = window.clearTimeout,
      pendingDeferIds = {};

  self.isMock = false;

  var outstandingRequestCount = 0;
  var outstandingRequestCallbacks = [];

 
  self.$$completeOutstandingRequest = completeOutstandingRequest;
  self.$$incOutstandingRequestCount = function() { outstandingRequestCount++; };

 
  function completeOutstandingRequest(fn) {
    try {
      fn.apply(null, sliceArgs(arguments, 1));
    } finally {
      outstandingRequestCount--;
      if (outstandingRequestCount === 0) {
        while (outstandingRequestCallbacks.length) {
          try {
            outstandingRequestCallbacks.pop()();
          } catch (e) {
            $log.error(e);
          }
        }
      }
    }
  }

  function getHash(url) {
    var index = url.indexOf('#');
    return index === -1 ? '' : url.substr(index);
  }

 
  self.notifyWhenNoOutstandingRequests = function(callback) {
    if (outstandingRequestCount === 0) {
      callback();
    } else {
      outstandingRequestCallbacks.push(callback);
    }
  };



  var cachedState, lastHistoryState,
      lastBrowserUrl = location.href,
      baseElement = document.find('base'),
      pendingLocation = null,
      getCurrentState = !$sniffer.history ? noop : function getCurrentState() {
        try {
          return history.state;
        } catch (e) {
  
        }
      };

  cacheState();
  lastHistoryState = cachedState;

  self.url = function(url, replace, state) {

    if (isUndefined(state)) {
      state = null;
    }

   
    if (location !== window.location) location = window.location;
    if (history !== window.history) history = window.history;

  
    if (url) {
      var sameState = lastHistoryState === state;

      if (lastBrowserUrl === url && (!$sniffer.history || sameState)) {
        return self;
      }
      var sameBase = lastBrowserUrl && stripHash(lastBrowserUrl) === stripHash(url);
      lastBrowserUrl = url;
      lastHistoryState = state;
     
      if ($sniffer.history && (!sameBase || !sameState)) {
        history[replace ? 'replaceState' : 'pushState'](state, '', url);
        cacheState();
 
        lastHistoryState = cachedState;
      } else {
        if (!sameBase) {
          pendingLocation = url;
        }
        if (replace) {
          location.replace(url);
        } else if (!sameBase) {
          location.href = url;
        } else {
          location.hash = getHash(url);
        }
        if (location.href !== url) {
          pendingLocation = url;
        }
      }
      if (pendingLocation) {
        pendingLocation = url;
      }
      return self;
    // getter
    } else {
     
      return pendingLocation || location.href.replace(/%27/g,'\'');
    }
  };

  
  self.state = function() {
    return cachedState;
  };

  var urlChangeListeners = [],
      urlChangeInit = false;

  function cacheStateAndFireUrlChange() {
    pendingLocation = null;
    cacheState();
    fireUrlChange();
  }

 
  var lastCachedState = null;
  function cacheState() {
 
    cachedState = getCurrentState();
    cachedState = isUndefined(cachedState) ? null : cachedState;

 
    if (equals(cachedState, lastCachedState)) {
      cachedState = lastCachedState;
    }
    lastCachedState = cachedState;
  }

  function fireUrlChange() {
    if (lastBrowserUrl === self.url() && lastHistoryState === cachedState) {
      return;
    }

    lastBrowserUrl = self.url();
    lastHistoryState = cachedState;
    forEach(urlChangeListeners, function(listener) {
      listener(self.url(), cachedState);
    });
  }

  
  self.onUrlChange = function(callback) {

    if (!urlChangeInit) {
     
      if ($sniffer.history) jqLite(window).on('popstate', cacheStateAndFireUrlChange);

      jqLite(window).on('hashchange', cacheStateAndFireUrlChange);

      urlChangeInit = true;
    }

    urlChangeListeners.push(callback);
    return callback;
  };

 
  self.$$applicationDestroyed = function() {
    jqLite(window).off('hashchange popstate', cacheStateAndFireUrlChange);
  };

 
  self.$$checkUrlChange = fireUrlChange;

  
  self.baseHref = function() {
    var href = baseElement.attr('href');
    return href ? href.replace(/^(https?:)?\/\/[^/]*/, '') : '';
  };

 
  self.defer = function(fn, delay) {
    var timeoutId;
    outstandingRequestCount++;
    timeoutId = setTimeout(function() {
      delete pendingDeferIds[timeoutId];
      completeOutstandingRequest(fn);
    }, delay || 0);
    pendingDeferIds[timeoutId] = true;
    return timeoutId;
  };


  
  self.defer.cancel = function(deferId) {
    if (pendingDeferIds[deferId]) {
      delete pendingDeferIds[deferId];
      clearTimeout(deferId);
      completeOutstandingRequest(noop);
      return true;
    }
    return false;
  };

}


function $BrowserProvider() {
  this.$get = ['$window', '$log', '$sniffer', '$document',
      function($window, $log, $sniffer, $document) {
        return new Browser($window, $document, $log, $sniffer);
      }];
}


function $CacheFactoryProvider() {

  this.$get = function() {
    var caches = {};

    function cacheFactory(cacheId, options) {
      if (cacheId in caches) {
        throw minErr('$cacheFactory')('iid', 'CacheId \'{0}\' is already taken!', cacheId);
      }

      var size = 0,
          stats = extend({}, options, {id: cacheId}),
          data = createMap(),
          capacity = (options && options.capacity) || Number.MAX_VALUE,
          lruHash = createMap(),
          freshEnd = null,
          staleEnd = null;

      
      return (caches[cacheId] = {

        
        put: function(key, value) {
          if (isUndefined(value)) return;
          if (capacity < Number.MAX_VALUE) {
            var lruEntry = lruHash[key] || (lruHash[key] = {key: key});

            refresh(lruEntry);
          }

          if (!(key in data)) size++;
          data[key] = value;

          if (size > capacity) {
            this.remove(staleEnd.key);
          }

          return value;
        },

       
        get: function(key) {
          if (capacity < Number.MAX_VALUE) {
            var lruEntry = lruHash[key];

            if (!lruEntry) return;

            refresh(lruEntry);
          }

          return data[key];
        },


       
        remove: function(key) {
          if (capacity < Number.MAX_VALUE) {
            var lruEntry = lruHash[key];

            if (!lruEntry) return;

            if (lruEntry === freshEnd) freshEnd = lruEntry.p;
            if (lruEntry === staleEnd) staleEnd = lruEntry.n;
            link(lruEntry.n,lruEntry.p);

            delete lruHash[key];
          }

          if (!(key in data)) return;

          delete data[key];
          size--;
        },


     
        removeAll: function() {
          data = createMap();
          size = 0;
          lruHash = createMap();
          freshEnd = staleEnd = null;
        },


       
        destroy: function() {
          data = null;
          stats = null;
          lruHash = null;
          delete caches[cacheId];
        },


        
        info: function() {
          return extend({}, stats, {size: size});
        }
      });


     
      function refresh(entry) {
        if (entry !== freshEnd) {
          if (!staleEnd) {
            staleEnd = entry;
          } else if (staleEnd === entry) {
            staleEnd = entry.n;
          }

          link(entry.n, entry.p);
          link(entry, freshEnd);
          freshEnd = entry;
          freshEnd.n = null;
        }
      }


     
      function link(nextEntry, prevEntry) {
        if (nextEntry !== prevEntry) {
          if (nextEntry) nextEntry.p = prevEntry; //p stands for previous, 'prev' didn't minify
          if (prevEntry) prevEntry.n = nextEntry; //n stands for next, 'next' didn't minify
        }
      }
    }


 
    cacheFactory.info = function() {
      var info = {};
      forEach(caches, function(cache, cacheId) {
        info[cacheId] = cache.info();
      });
      return info;
    };


    cacheFactory.get = function(cacheId) {
      return caches[cacheId];
    };


    return cacheFactory;
  };
}


function $TemplateCacheProvider() {
  this.$get = ['$cacheFactory', function($cacheFactory) {
    return $cacheFactory('templates');
  }];
}


var $compileMinErr = minErr('$compile');

function UNINITIALIZED_VALUE() {}
var _UNINITIALIZED_VALUE = new UNINITIALIZED_VALUE();


$CompileProvider.$inject = ['$provide', '$$sanitizeUriProvider'];

function $CompileProvider($provide, $$sanitizeUriProvider) {
  var hasDirectives = {},
      Suffix = 'Directive',
      COMMENT_DIRECTIVE_REGEXP = /^\s*directive:\s*([\w-]+)\s+(.*)$/,
      CLASS_DIRECTIVE_REGEXP = /(([\w-]+)(?::([^;]+))?;?)/,
      ALL_OR_NOTHING_ATTRS = makeMap('ngSrc,ngSrcset,src,srcset'),
      REQUIRE_PREFIX_REGEXP = /^(?:(\^\^?)?(\?)?(\^\^?)?)?/;

  var EVENT_HANDLER_ATTR_REGEXP = /^(on[a-z]+|formaction)$/;
  var bindingCache = createMap();

  function parseIsolateBindings(scope, directiveName, isController) {
    var LOCAL_REGEXP = /^\s*([@&<]|=(\*?))(\??)\s*(\w*)\s*$/;

    var bindings = createMap();

    forEach(scope, function(definition, scopeName) {
      if (definition in bindingCache) {
        bindings[scopeName] = bindingCache[definition];
        return;
      }
      var match = definition.match(LOCAL_REGEXP);

      if (!match) {
        throw $compileMinErr('iscp',
            'Invalid {3} for directive \'{0}\'.' +
            ' Definition: {... {1}: \'{2}\' ...}',
            directiveName, scopeName, definition,
            (isController ? 'controller bindings definition' :
            'isolate scope definition'));
      }

      bindings[scopeName] = {
        mode: match[1][0],
        collection: match[2] === '*',
        optional: match[3] === '?',
        attrName: match[4] || scopeName
      };
      if (match[4]) {
        bindingCache[definition] = bindings[scopeName];
      }
    });

    return bindings;
  }

  function parseDirectiveBindings(directive, directiveName) {
    var bindings = {
      isolateScope: null,
      bindToController: null
    };
    if (isObject(directive.scope)) {
      if (directive.bindToController === true) {
        bindings.bindToController = parseIsolateBindings(directive.scope,
                                                         directiveName, true);
        bindings.isolateScope = {};
      } else {
        bindings.isolateScope = parseIsolateBindings(directive.scope,
                                                     directiveName, false);
      }
    }
    if (isObject(directive.bindToController)) {
      bindings.bindToController =
          parseIsolateBindings(directive.bindToController, directiveName, true);
    }
    if (bindings.bindToController && !directive.controller) {

      throw $compileMinErr('noctrl',
            'Cannot bind to controller without directive \'{0}\'s controller.',
            directiveName);
    }
    return bindings;
  }

  function assertValidDirectiveName(name) {
    var letter = name.charAt(0);
    if (!letter || letter !== lowercase(letter)) {
      throw $compileMinErr('baddir', 'Directive/Component name \'{0}\' is invalid. The first character must be a lowercase letter', name);
    }
    if (name !== name.trim()) {
      throw $compileMinErr('baddir',
            'Directive/Component name \'{0}\' is invalid. The name should not contain leading or trailing whitespaces',
            name);
    }
  }

  function getDirectiveRequire(directive) {
    var require = directive.require || (directive.controller && directive.name);

    if (!isArray(require) && isObject(require)) {
      forEach(require, function(value, key) {
        var match = value.match(REQUIRE_PREFIX_REGEXP);
        var name = value.substring(match[0].length);
        if (!name) require[key] = match[0] + key;
      });
    }

    return require;
  }

  function getDirectiveRestrict(restrict, name) {
    if (restrict && !(isString(restrict) && /[EACM]/.test(restrict))) {
      throw $compileMinErr('badrestrict',
          'Restrict property \'{0}\' of directive \'{1}\' is invalid',
          restrict,
          name);
    }

    return restrict || 'EA';
  }

 
  this.directive = function registerDirective(name, directiveFactory) {
    assertArg(name, 'name');
    assertNotHasOwnProperty(name, 'directive');
    if (isString(name)) {
      assertValidDirectiveName(name);
      assertArg(directiveFactory, 'directiveFactory');
      if (!hasDirectives.hasOwnProperty(name)) {
        hasDirectives[name] = [];
        $provide.factory(name + Suffix, ['$injector', '$exceptionHandler',
          function($injector, $exceptionHandler) {
            var directives = [];
            forEach(hasDirectives[name], function(directiveFactory, index) {
              try {
                var directive = $injector.invoke(directiveFactory);
                if (isFunction(directive)) {
                  directive = { compile: valueFn(directive) };
                } else if (!directive.compile && directive.link) {
                  directive.compile = valueFn(directive.link);
                }
                directive.priority = directive.priority || 0;
                directive.index = index;
                directive.name = directive.name || name;
                directive.require = getDirectiveRequire(directive);
                directive.restrict = getDirectiveRestrict(directive.restrict, name);
                directive.$$moduleName = directiveFactory.$$moduleName;
                directives.push(directive);
              } catch (e) {
                $exceptionHandler(e);
              }
            });
            return directives;
          }]);
      }
      hasDirectives[name].push(directiveFactory);
    } else {
      forEach(name, reverseParams(registerDirective));
    }
    return this;
  };

  
  this.component = function registerComponent(name, options) {
    var controller = options.controller || function() {};

    function factory($injector) {
      function makeInjectable(fn) {
        if (isFunction(fn) || isArray(fn)) {
          return /** @this */ function(tElement, tAttrs) {
            return $injector.invoke(fn, this, {$element: tElement, $attrs: tAttrs});
          };
        } else {
          return fn;
        }
      }

      var template = (!options.template && !options.templateUrl ? '' : options.template);
      var ddo = {
        controller: controller,
        controllerAs: identifierForController(options.controller) || options.controllerAs || '$ctrl',
        template: makeInjectable(template),
        templateUrl: makeInjectable(options.templateUrl),
        transclude: options.transclude,
        scope: {},
        bindToController: options.bindings || {},
        restrict: 'E',
        require: options.require
      };

      forEach(options, function(val, key) {
        if (key.charAt(0) === '$') ddo[key] = val;
      });

      return ddo;
    }

    forEach(options, function(val, key) {
      if (key.charAt(0) === '$') {
        factory[key] = val;

        if (isFunction(controller)) controller[key] = val;
      }
    });

    factory.$inject = ['$injector'];

    return this.directive(name, factory);
  };


  
  this.aHrefSanitizationWhitelist = function(regexp) {
    if (isDefined(regexp)) {
      $$sanitizeUriProvider.aHrefSanitizationWhitelist(regexp);
      return this;
    } else {
      return $$sanitizeUriProvider.aHrefSanitizationWhitelist();
    }
  };


 
  this.imgSrcSanitizationWhitelist = function(regexp) {
    if (isDefined(regexp)) {
      $$sanitizeUriProvider.imgSrcSanitizationWhitelist(regexp);
      return this;
    } else {
      return $$sanitizeUriProvider.imgSrcSanitizationWhitelist();
    }
  };

  
  var debugInfoEnabled = true;
  this.debugInfoEnabled = function(enabled) {
    if (isDefined(enabled)) {
      debugInfoEnabled = enabled;
      return this;
    }
    return debugInfoEnabled;
  };

  
  var preAssignBindingsEnabled = false;
  this.preAssignBindingsEnabled = function(enabled) {
    if (isDefined(enabled)) {
      preAssignBindingsEnabled = enabled;
      return this;
    }
    return preAssignBindingsEnabled;
  };


  var TTL = 10;
  
  this.onChangesTtl = function(value) {
    if (arguments.length) {
      TTL = value;
      return this;
    }
    return TTL;
  };

  var commentDirectivesEnabledConfig = true;
  
  this.commentDirectivesEnabled = function(value) {
    if (arguments.length) {
      commentDirectivesEnabledConfig = value;
      return this;
    }
    return commentDirectivesEnabledConfig;
  };


  var cssClassDirectivesEnabledConfig = true;
 
  this.cssClassDirectivesEnabled = function(value) {
    if (arguments.length) {
      cssClassDirectivesEnabledConfig = value;
      return this;
    }
    return cssClassDirectivesEnabledConfig;
  };

  this.$get = [
            '$injector', '$interpolate', '$exceptionHandler', '$templateRequest', '$parse',
            '$controller', '$rootScope', '$sce', '$animate', '$$sanitizeUri',
    function($injector,   $interpolate,   $exceptionHandler,   $templateRequest,   $parse,
             $controller,   $rootScope,   $sce,   $animate,   $$sanitizeUri) {

    var SIMPLE_ATTR_NAME = /^\w/;
    var specialAttrHolder = window.document.createElement('div');


    var commentDirectivesEnabled = commentDirectivesEnabledConfig;
    var cssClassDirectivesEnabled = cssClassDirectivesEnabledConfig;


    var onChangesTtl = TTL;
    
    var onChangesQueue;

   
    function flushOnChangesQueue() {
      try {
        if (!(--onChangesTtl)) {
     
          onChangesQueue = undefined;
          throw $compileMinErr('infchng', '{0} $onChanges() iterations reached. Aborting!\n', TTL);
        }

        $rootScope.$apply(function() {
          var errors = [];
          for (var i = 0, ii = onChangesQueue.length; i < ii; ++i) {
            try {
              onChangesQueue[i]();
            } catch (e) {
              errors.push(e);
            }
          }

          onChangesQueue = undefined;
          if (errors.length) {
            throw errors;
          }
        });
      } finally {
        onChangesTtl++;
      }
    }


    function Attributes(element, attributesToCopy) {
      if (attributesToCopy) {
        var keys = Object.keys(attributesToCopy);
        var i, l, key;

        for (i = 0, l = keys.length; i < l; i++) {
          key = keys[i];
          this[key] = attributesToCopy[key];
        }
      } else {
        this.$attr = {};
      }

      this.$$element = element;
    }

    Attributes.prototype = {
     
      $normalize: directiveNormalize,


      $addClass: function(classVal) {
        if (classVal && classVal.length > 0) {
          $animate.addClass(this.$$element, classVal);
        }
      },

      
      $removeClass: function(classVal) {
        if (classVal && classVal.length > 0) {
          $animate.removeClass(this.$$element, classVal);
        }
      },

      
      $updateClass: function(newClasses, oldClasses) {
        var toAdd = tokenDifference(newClasses, oldClasses);
        if (toAdd && toAdd.length) {
          $animate.addClass(this.$$element, toAdd);
        }

        var toRemove = tokenDifference(oldClasses, newClasses);
        if (toRemove && toRemove.length) {
          $animate.removeClass(this.$$element, toRemove);
        }
      },

    
      $set: function(key, value, writeAttr, attrName) {
       

        var node = this.$$element[0],
            booleanKey = getBooleanAttrName(node, key),
            aliasedKey = getAliasedAttrName(key),
            observer = key,
            nodeName;

        if (booleanKey) {
          this.$$element.prop(key, value);
          attrName = booleanKey;
        } else if (aliasedKey) {
          this[aliasedKey] = value;
          observer = aliasedKey;
        }

        this[key] = value;

        // translate normalized key to actual key
        if (attrName) {
          this.$attr[key] = attrName;
        } else {
          attrName = this.$attr[key];
          if (!attrName) {
            this.$attr[key] = attrName = snake_case(key, '-');
          }
        }

        nodeName = nodeName_(this.$$element);

        if ((nodeName === 'a' && (key === 'href' || key === 'xlinkHref')) ||
            (nodeName === 'img' && key === 'src')) {

          this[key] = value = $$sanitizeUri(value, key === 'src');
        } else if (nodeName === 'img' && key === 'srcset' && isDefined(value)) {
 
          var result = '';

 
          var trimmedSrcset = trim(value);

          var srcPattern = /(\s+\d+x\s*,|\s+\d+w\s*,|\s+,|,\s+)/;
          var pattern = /\s/.test(trimmedSrcset) ? srcPattern : /(,)/;


          var rawUris = trimmedSrcset.split(pattern);


          var nbrUrisWith2parts = Math.floor(rawUris.length / 2);
          for (var i = 0; i < nbrUrisWith2parts; i++) {
            var innerIdx = i * 2;

            result += $$sanitizeUri(trim(rawUris[innerIdx]), true);

            result += (' ' + trim(rawUris[innerIdx + 1]));
          }


          var lastTuple = trim(rawUris[i * 2]).split(/\s/);


          result += $$sanitizeUri(trim(lastTuple[0]), true);


          if (lastTuple.length === 2) {
            result += (' ' + trim(lastTuple[1]));
          }
          this[key] = value = result;
        }

        if (writeAttr !== false) {
          if (value === null || isUndefined(value)) {
            this.$$element.removeAttr(attrName);
          } else {
            if (SIMPLE_ATTR_NAME.test(attrName)) {
              this.$$element.attr(attrName, value);
            } else {
              setSpecialAttr(this.$$element[0], attrName, value);
            }
          }
        }

        // fire observers
        var $$observers = this.$$observers;
        if ($$observers) {
          forEach($$observers[observer], function(fn) {
            try {
              fn(value);
            } catch (e) {
              $exceptionHandler(e);
            }
          });
        }
      },

      $observe: function(key, fn) {
        var attrs = this,
            $$observers = (attrs.$$observers || (attrs.$$observers = createMap())),
            listeners = ($$observers[key] || ($$observers[key] = []));

        listeners.push(fn);
        $rootScope.$evalAsync(function() {
          if (!listeners.$$inter && attrs.hasOwnProperty(key) && !isUndefined(attrs[key])) {

            fn(attrs[key]);
          }
        });

        return function() {
          arrayRemove(listeners, fn);
        };
      }
    };

    function setSpecialAttr(element, attrName, value) {
    
      specialAttrHolder.innerHTML = '<span ' + attrName + '>';
      var attributes = specialAttrHolder.firstChild.attributes;
      var attribute = attributes[0];
   
      attributes.removeNamedItem(attribute.name);
      attribute.value = value;
      element.attributes.setNamedItem(attribute);
    }

    function safeAddClass($element, className) {
      try {
        $element.addClass(className);
      } catch (e) {

      }
    }


    var startSymbol = $interpolate.startSymbol(),
        endSymbol = $interpolate.endSymbol(),
        denormalizeTemplate = (startSymbol === '{{' && endSymbol  === '}}')
            ? identity
            : function denormalizeTemplate(template) {
              return template.replace(/\{\{/g, startSymbol).replace(/}}/g, endSymbol);
        },
        NG_ATTR_BINDING = /^ngAttr[A-Z]/;
    var MULTI_ELEMENT_DIR_RE = /^(.+)Start$/;

    compile.$$addBindingInfo = debugInfoEnabled ? function $$addBindingInfo($element, binding) {
      var bindings = $element.data('$binding') || [];

      if (isArray(binding)) {
        bindings = bindings.concat(binding);
      } else {
        bindings.push(binding);
      }

      $element.data('$binding', bindings);
    } : noop;

    compile.$$addBindingClass = debugInfoEnabled ? function $$addBindingClass($element) {
      safeAddClass($element, 'ng-binding');
    } : noop;

    compile.$$addScopeInfo = debugInfoEnabled ? function $$addScopeInfo($element, scope, isolated, noTemplate) {
      var dataName = isolated ? (noTemplate ? '$isolateScopeNoTemplate' : '$isolateScope') : '$scope';
      $element.data(dataName, scope);
    } : noop;

    compile.$$addScopeClass = debugInfoEnabled ? function $$addScopeClass($element, isolated) {
      safeAddClass($element, isolated ? 'ng-isolate-scope' : 'ng-scope');
    } : noop;

    compile.$$createComment = function(directiveName, comment) {
      var content = '';
      if (debugInfoEnabled) {
        content = ' ' + (directiveName || '') + ': ';
        if (comment) content += comment + ' ';
      }
      return window.document.createComment(content);
    };

    return compile;

  

    function compile($compileNodes, transcludeFn, maxPriority, ignoreDirective,
                        previousCompileContext) {
      if (!($compileNodes instanceof jqLite)) {

        $compileNodes = jqLite($compileNodes);
      }
      var compositeLinkFn =
              compileNodes($compileNodes, transcludeFn, $compileNodes,
                           maxPriority, ignoreDirective, previousCompileContext);
      compile.$$addScopeClass($compileNodes);
      var namespace = null;
      return function publicLinkFn(scope, cloneConnectFn, options) {
        if (!$compileNodes) {
          throw $compileMinErr('multilink', 'This element has already been linked.');
        }
        assertArg(scope, 'scope');

        if (previousCompileContext && previousCompileContext.needsNewScope) {
        
          scope = scope.$parent.$new();
        }

        options = options || {};
        var parentBoundTranscludeFn = options.parentBoundTranscludeFn,
          transcludeControllers = options.transcludeControllers,
          futureParentElement = options.futureParentElement;

      
        if (parentBoundTranscludeFn && parentBoundTranscludeFn.$$boundTransclude) {
          parentBoundTranscludeFn = parentBoundTranscludeFn.$$boundTransclude;
        }

        if (!namespace) {
          namespace = detectNamespaceForChildElements(futureParentElement);
        }
        var $linkNode;
        if (namespace !== 'html') {
    
          $linkNode = jqLite(
            wrapTemplate(namespace, jqLite('<div>').append($compileNodes).html())
          );
        } else if (cloneConnectFn) {
   
          $linkNode = JQLitePrototype.clone.call($compileNodes);
        } else {
          $linkNode = $compileNodes;
        }

        if (transcludeControllers) {
          for (var controllerName in transcludeControllers) {
            $linkNode.data('$' + controllerName + 'Controller', transcludeControllers[controllerName].instance);
          }
        }

        compile.$$addScopeInfo($linkNode, scope);

        if (cloneConnectFn) cloneConnectFn($linkNode, scope);
        if (compositeLinkFn) compositeLinkFn(scope, $linkNode, $linkNode, parentBoundTranscludeFn);

        if (!cloneConnectFn) {
          $compileNodes = compositeLinkFn = null;
        }
        return $linkNode;
      };
    }

    function detectNamespaceForChildElements(parentElement) {

      var node = parentElement && parentElement[0];
      if (!node) {
        return 'html';
      } else {
        return nodeName_(node) !== 'foreignobject' && toString.call(node).match(/SVG/) ? 'svg' : 'html';
      }
    }

  
    function compileNodes(nodeList, transcludeFn, $rootElement, maxPriority, ignoreDirective,
                            previousCompileContext) {
      var linkFns = [],
  
          notLiveList = isArray(nodeList) || (nodeList instanceof jqLite),
          attrs, directives, nodeLinkFn, childNodes, childLinkFn, linkFnFound, nodeLinkFnFound;


      for (var i = 0; i < nodeList.length; i++) {
        attrs = new Attributes();

     
        if (msie === 11) {
          mergeConsecutiveTextNodes(nodeList, i, notLiveList);
        }

    
        directives = collectDirectives(nodeList[i], [], attrs, i === 0 ? maxPriority : undefined,
                                        ignoreDirective);

        nodeLinkFn = (directives.length)
            ? applyDirectivesToNode(directives, nodeList[i], attrs, transcludeFn, $rootElement,
                                      null, [], [], previousCompileContext)
            : null;

        if (nodeLinkFn && nodeLinkFn.scope) {
          compile.$$addScopeClass(attrs.$$element);
        }

        childLinkFn = (nodeLinkFn && nodeLinkFn.terminal ||
                      !(childNodes = nodeList[i].childNodes) ||
                      !childNodes.length)
            ? null
            : compileNodes(childNodes,
                 nodeLinkFn ? (
                  (nodeLinkFn.transcludeOnThisElement || !nodeLinkFn.templateOnThisElement)
                     && nodeLinkFn.transclude) : transcludeFn);

        if (nodeLinkFn || childLinkFn) {
          linkFns.push(i, nodeLinkFn, childLinkFn);
          linkFnFound = true;
          nodeLinkFnFound = nodeLinkFnFound || nodeLinkFn;
        }

        //use the previous context only for the first element in the virtual group
        previousCompileContext = null;
      }


      return linkFnFound ? compositeLinkFn : null;

      function compositeLinkFn(scope, nodeList, $rootElement, parentBoundTranscludeFn) {
        var nodeLinkFn, childLinkFn, node, childScope, i, ii, idx, childBoundTranscludeFn;
        var stableNodeList;


        if (nodeLinkFnFound) {
   
          var nodeListLength = nodeList.length;
          stableNodeList = new Array(nodeListLength);


          for (i = 0; i < linkFns.length; i += 3) {
            idx = linkFns[i];
            stableNodeList[idx] = nodeList[idx];
          }
        } else {
          stableNodeList = nodeList;
        }

        for (i = 0, ii = linkFns.length; i < ii;) {
          node = stableNodeList[linkFns[i++]];
          nodeLinkFn = linkFns[i++];
          childLinkFn = linkFns[i++];

          if (nodeLinkFn) {
            if (nodeLinkFn.scope) {
              childScope = scope.$new();
              compile.$$addScopeInfo(jqLite(node), childScope);
            } else {
              childScope = scope;
            }

            if (nodeLinkFn.transcludeOnThisElement) {
              childBoundTranscludeFn = createBoundTranscludeFn(
                  scope, nodeLinkFn.transclude, parentBoundTranscludeFn);

            } else if (!nodeLinkFn.templateOnThisElement && parentBoundTranscludeFn) {
              childBoundTranscludeFn = parentBoundTranscludeFn;

            } else if (!parentBoundTranscludeFn && transcludeFn) {
              childBoundTranscludeFn = createBoundTranscludeFn(scope, transcludeFn);

            } else {
              childBoundTranscludeFn = null;
            }

            nodeLinkFn(childLinkFn, childScope, node, $rootElement, childBoundTranscludeFn);

          } else if (childLinkFn) {
            childLinkFn(scope, node.childNodes, undefined, parentBoundTranscludeFn);
          }
        }
      }
    }

    function mergeConsecutiveTextNodes(nodeList, idx, notLiveList) {
      var node = nodeList[idx];
      var parent = node.parentNode;
      var sibling;

      if (node.nodeType !== NODE_TYPE_TEXT) {
        return;
      }

      while (true) {
        sibling = parent ? node.nextSibling : nodeList[idx + 1];
        if (!sibling || sibling.nodeType !== NODE_TYPE_TEXT) {
          break;
        }

        node.nodeValue = node.nodeValue + sibling.nodeValue;

        if (sibling.parentNode) {
          sibling.parentNode.removeChild(sibling);
        }
        if (notLiveList && sibling === nodeList[idx + 1]) {
          nodeList.splice(idx + 1, 1);
        }
      }
    }

    function createBoundTranscludeFn(scope, transcludeFn, previousBoundTranscludeFn) {
      function boundTranscludeFn(transcludedScope, cloneFn, controllers, futureParentElement, containingScope) {

        if (!transcludedScope) {
          transcludedScope = scope.$new(false, containingScope);
          transcludedScope.$$transcluded = true;
        }

        return transcludeFn(transcludedScope, cloneFn, {
          parentBoundTranscludeFn: previousBoundTranscludeFn,
          transcludeControllers: controllers,
          futureParentElement: futureParentElement
        });
      }

      var boundSlots = boundTranscludeFn.$$slots = createMap();
      for (var slotName in transcludeFn.$$slots) {
        if (transcludeFn.$$slots[slotName]) {
          boundSlots[slotName] = createBoundTranscludeFn(scope, transcludeFn.$$slots[slotName], previousBoundTranscludeFn);
        } else {
          boundSlots[slotName] = null;
        }
      }

      return boundTranscludeFn;
    }

  
    function collectDirectives(node, directives, attrs, maxPriority, ignoreDirective) {
      var nodeType = node.nodeType,
          attrsMap = attrs.$attr,
          match,
          nodeName,
          className;

      switch (nodeType) {
        case NODE_TYPE_ELEMENT: /* Element */

          nodeName = nodeName_(node);

    
          addDirective(directives,
              directiveNormalize(nodeName), 'E', maxPriority, ignoreDirective);

  
          for (var attr, name, nName, ngAttrName, value, isNgAttr, nAttrs = node.attributes,
                   j = 0, jj = nAttrs && nAttrs.length; j < jj; j++) {
            var attrStartName = false;
            var attrEndName = false;

            attr = nAttrs[j];
            name = attr.name;
            value = attr.value;


            ngAttrName = directiveNormalize(name);
            isNgAttr = NG_ATTR_BINDING.test(ngAttrName);
            if (isNgAttr) {
              name = name.replace(PREFIX_REGEXP, '')
                .substr(8).replace(/_(.)/g, function(match, letter) {
                  return letter.toUpperCase();
                });
            }

            var multiElementMatch = ngAttrName.match(MULTI_ELEMENT_DIR_RE);
            if (multiElementMatch && directiveIsMultiElement(multiElementMatch[1])) {
              attrStartName = name;
              attrEndName = name.substr(0, name.length - 5) + 'end';
              name = name.substr(0, name.length - 6);
            }

            nName = directiveNormalize(name.toLowerCase());
            attrsMap[nName] = name;
            if (isNgAttr || !attrs.hasOwnProperty(nName)) {
                attrs[nName] = value;
                if (getBooleanAttrName(node, nName)) {
                  attrs[nName] = true; // presence means true
                }
            }
            addAttrInterpolateDirective(node, directives, value, nName, isNgAttr);
            addDirective(directives, nName, 'A', maxPriority, ignoreDirective, attrStartName,
                          attrEndName);
          }

          if (nodeName === 'input' && node.getAttribute('type') === 'hidden') {
  
            node.setAttribute('autocomplete', 'off');
          }


          if (!cssClassDirectivesEnabled) break;
          className = node.className;
          if (isObject(className)) {
              // Maybe SVGAnimatedString
              className = className.animVal;
          }
          if (isString(className) && className !== '') {
            while ((match = CLASS_DIRECTIVE_REGEXP.exec(className))) {
              nName = directiveNormalize(match[2]);
              if (addDirective(directives, nName, 'C', maxPriority, ignoreDirective)) {
                attrs[nName] = trim(match[3]);
              }
              className = className.substr(match.index + match[0].length);
            }
          }
          break;
        case NODE_TYPE_TEXT: /* Text Node */
          addTextInterpolateDirective(directives, node.nodeValue);
          break;
        case NODE_TYPE_COMMENT: /* Comment */
          if (!commentDirectivesEnabled) break;
          collectCommentDirectives(node, directives, attrs, maxPriority, ignoreDirective);
          break;
      }

      directives.sort(byPriority);
      return directives;
    }

    function collectCommentDirectives(node, directives, attrs, maxPriority, ignoreDirective) {

      try {
        var match = COMMENT_DIRECTIVE_REGEXP.exec(node.nodeValue);
        if (match) {
          var nName = directiveNormalize(match[1]);
          if (addDirective(directives, nName, 'M', maxPriority, ignoreDirective)) {
            attrs[nName] = trim(match[2]);
          }
        }
      } catch (e) {
 
      }
    }

   
    function groupScan(node, attrStart, attrEnd) {
      var nodes = [];
      var depth = 0;
      if (attrStart && node.hasAttribute && node.hasAttribute(attrStart)) {
        do {
          if (!node) {
            throw $compileMinErr('uterdir',
                      'Unterminated attribute, found \'{0}\' but no matching \'{1}\' found.',
                      attrStart, attrEnd);
          }
          if (node.nodeType === NODE_TYPE_ELEMENT) {
            if (node.hasAttribute(attrStart)) depth++;
            if (node.hasAttribute(attrEnd)) depth--;
          }
          nodes.push(node);
          node = node.nextSibling;
        } while (depth > 0);
      } else {
        nodes.push(node);
      }

      return jqLite(nodes);
    }

   
    function groupElementsLinkFnWrapper(linkFn, attrStart, attrEnd) {
      return function groupedElementsLink(scope, element, attrs, controllers, transcludeFn) {
        element = groupScan(element[0], attrStart, attrEnd);
        return linkFn(scope, element, attrs, controllers, transcludeFn);
      };
    }

   
    function compilationGenerator(eager, $compileNodes, transcludeFn, maxPriority, ignoreDirective, previousCompileContext) {
      var compiled;

      if (eager) {
        return compile($compileNodes, transcludeFn, maxPriority, ignoreDirective, previousCompileContext);
      }
      return /** @this */ function lazyCompilation() {
        if (!compiled) {
          compiled = compile($compileNodes, transcludeFn, maxPriority, ignoreDirective, previousCompileContext);

        
          $compileNodes = transcludeFn = previousCompileContext = null;
        }
        return compiled.apply(this, arguments);
      };
    }

    
    function applyDirectivesToNode(directives, compileNode, templateAttrs, transcludeFn,
                                   jqCollection, originalReplaceDirective, preLinkFns, postLinkFns,
                                   previousCompileContext) {
      previousCompileContext = previousCompileContext || {};

      var terminalPriority = -Number.MAX_VALUE,
          newScopeDirective = previousCompileContext.newScopeDirective,
          controllerDirectives = previousCompileContext.controllerDirectives,
          newIsolateScopeDirective = previousCompileContext.newIsolateScopeDirective,
          templateDirective = previousCompileContext.templateDirective,
          nonTlbTranscludeDirective = previousCompileContext.nonTlbTranscludeDirective,
          hasTranscludeDirective = false,
          hasTemplate = false,
          hasElementTranscludeDirective = previousCompileContext.hasElementTranscludeDirective,
          $compileNode = templateAttrs.$$element = jqLite(compileNode),
          directive,
          directiveName,
          $template,
          replaceDirective = originalReplaceDirective,
          childTranscludeFn = transcludeFn,
          linkFn,
          didScanForMultipleTransclusion = false,
          mightHaveMultipleTransclusionError = false,
          directiveValue;


      for (var i = 0, ii = directives.length; i < ii; i++) {
        directive = directives[i];
        var attrStart = directive.$$start;
        var attrEnd = directive.$$end;


        if (attrStart) {
          $compileNode = groupScan(compileNode, attrStart, attrEnd);
        }
        $template = undefined;

        if (terminalPriority > directive.priority) {
          break; 
        }

        directiveValue = directive.scope;

        if (directiveValue) {

         
          if (!directive.templateUrl) {
            if (isObject(directiveValue)) {
           
              assertNoDuplicate('new/isolated scope', newIsolateScopeDirective || newScopeDirective,
                                directive, $compileNode);
              newIsolateScopeDirective = directive;
            } else {
           
              assertNoDuplicate('new/isolated scope', newIsolateScopeDirective, directive,
                                $compileNode);
            }
          }

          newScopeDirective = newScopeDirective || directive;
        }

        directiveName = directive.name;

     
        if (!didScanForMultipleTransclusion && ((directive.replace && (directive.templateUrl || directive.template))
            || (directive.transclude && !directive.$$tlb))) {
                var candidateDirective;

                for (var scanningIndex = i + 1; (candidateDirective = directives[scanningIndex++]);) {
                    if ((candidateDirective.transclude && !candidateDirective.$$tlb)
                        || (candidateDirective.replace && (candidateDirective.templateUrl || candidateDirective.template))) {
                        mightHaveMultipleTransclusionError = true;
                        break;
                    }
                }

                didScanForMultipleTransclusion = true;
        }

        if (!directive.templateUrl && directive.controller) {
          controllerDirectives = controllerDirectives || createMap();
          assertNoDuplicate('\'' + directiveName + '\' controller',
              controllerDirectives[directiveName], directive, $compileNode);
          controllerDirectives[directiveName] = directive;
        }

        directiveValue = directive.transclude;

        if (directiveValue) {
          hasTranscludeDirective = true;

        
          if (!directive.$$tlb) {
            assertNoDuplicate('transclusion', nonTlbTranscludeDirective, directive, $compileNode);
            nonTlbTranscludeDirective = directive;
          }

          if (directiveValue === 'element') {
            hasElementTranscludeDirective = true;
            terminalPriority = directive.priority;
            $template = $compileNode;
            $compileNode = templateAttrs.$$element =
                jqLite(compile.$$createComment(directiveName, templateAttrs[directiveName]));
            compileNode = $compileNode[0];
            replaceWith(jqCollection, sliceArgs($template), compileNode);

            $template[0].$$parentNode = $template[0].parentNode;

            childTranscludeFn = compilationGenerator(mightHaveMultipleTransclusionError, $template, transcludeFn, terminalPriority,
                                        replaceDirective && replaceDirective.name, {
                                       
                                          nonTlbTranscludeDirective: nonTlbTranscludeDirective
                                        });
          } else {

            var slots = createMap();

            if (!isObject(directiveValue)) {
              $template = jqLite(jqLiteClone(compileNode)).contents();
            } else {

           
              $template = [];

              var slotMap = createMap();
              var filledSlots = createMap();

            
              forEach(directiveValue, function(elementSelector, slotName) {
             
                var optional = (elementSelector.charAt(0) === '?');
                elementSelector = optional ? elementSelector.substring(1) : elementSelector;

                slotMap[elementSelector] = slotName;

            
                slots[slotName] = null;

                filledSlots[slotName] = optional;
              });

   
              forEach($compileNode.contents(), function(node) {
                var slotName = slotMap[directiveNormalize(nodeName_(node))];
                if (slotName) {
                  filledSlots[slotName] = true;
                  slots[slotName] = slots[slotName] || [];
                  slots[slotName].push(node);
                } else {
                  $template.push(node);
                }
              });

   
              forEach(filledSlots, function(filled, slotName) {
                if (!filled) {
                  throw $compileMinErr('reqslot', 'Required transclusion slot `{0}` was not filled.', slotName);
                }
              });

              for (var slotName in slots) {
                if (slots[slotName]) {
        
                  slots[slotName] = compilationGenerator(mightHaveMultipleTransclusionError, slots[slotName], transcludeFn);
                }
              }
            }

            $compileNode.empty(); // clear contents
            childTranscludeFn = compilationGenerator(mightHaveMultipleTransclusionError, $template, transcludeFn, undefined,
                undefined, { needsNewScope: directive.$$isolateScope || directive.$$newScope});
            childTranscludeFn.$$slots = slots;
          }
        }

        if (directive.template) {
          hasTemplate = true;
          assertNoDuplicate('template', templateDirective, directive, $compileNode);
          templateDirective = directive;

          directiveValue = (isFunction(directive.template))
              ? directive.template($compileNode, templateAttrs)
              : directive.template;

          directiveValue = denormalizeTemplate(directiveValue);

          if (directive.replace) {
            replaceDirective = directive;
            if (jqLiteIsTextNode(directiveValue)) {
              $template = [];
            } else {
              $template = removeComments(wrapTemplate(directive.templateNamespace, trim(directiveValue)));
            }
            compileNode = $template[0];

            if ($template.length !== 1 || compileNode.nodeType !== NODE_TYPE_ELEMENT) {
              throw $compileMinErr('tplrt',
                  'Template for directive \'{0}\' must have exactly one root element. {1}',
                  directiveName, '');
            }

            replaceWith(jqCollection, $compileNode, compileNode);

            var newTemplateAttrs = {$attr: {}};

            var templateDirectives = collectDirectives(compileNode, [], newTemplateAttrs);
            var unprocessedDirectives = directives.splice(i + 1, directives.length - (i + 1));

            if (newIsolateScopeDirective || newScopeDirective) {

              markDirectiveScope(templateDirectives, newIsolateScopeDirective, newScopeDirective);
            }
            directives = directives.concat(templateDirectives).concat(unprocessedDirectives);
            mergeTemplateAttributes(templateAttrs, newTemplateAttrs);

            ii = directives.length;
          } else {
            $compileNode.html(directiveValue);
          }
        }

        if (directive.templateUrl) {
          hasTemplate = true;
          assertNoDuplicate('template', templateDirective, directive, $compileNode);
          templateDirective = directive;

          if (directive.replace) {
            replaceDirective = directive;
          }

          // eslint-disable-next-line no-func-assign
          nodeLinkFn = compileTemplateUrl(directives.splice(i, directives.length - i), $compileNode,
              templateAttrs, jqCollection, hasTranscludeDirective && childTranscludeFn, preLinkFns, postLinkFns, {
                controllerDirectives: controllerDirectives,
                newScopeDirective: (newScopeDirective !== directive) && newScopeDirective,
                newIsolateScopeDirective: newIsolateScopeDirective,
                templateDirective: templateDirective,
                nonTlbTranscludeDirective: nonTlbTranscludeDirective
              });
          ii = directives.length;
        } else if (directive.compile) {
          try {
            linkFn = directive.compile($compileNode, templateAttrs, childTranscludeFn);
            var context = directive.$$originalDirective || directive;
            if (isFunction(linkFn)) {
              addLinkFns(null, bind(context, linkFn), attrStart, attrEnd);
            } else if (linkFn) {
              addLinkFns(bind(context, linkFn.pre), bind(context, linkFn.post), attrStart, attrEnd);
            }
          } catch (e) {
            $exceptionHandler(e, startingTag($compileNode));
          }
        }

        if (directive.terminal) {
          nodeLinkFn.terminal = true;
          terminalPriority = Math.max(terminalPriority, directive.priority);
        }

      }

      nodeLinkFn.scope = newScopeDirective && newScopeDirective.scope === true;
      nodeLinkFn.transcludeOnThisElement = hasTranscludeDirective;
      nodeLinkFn.templateOnThisElement = hasTemplate;
      nodeLinkFn.transclude = childTranscludeFn;

      previousCompileContext.hasElementTranscludeDirective = hasElementTranscludeDirective;

  
      return nodeLinkFn;

 

      function addLinkFns(pre, post, attrStart, attrEnd) {
        if (pre) {
          if (attrStart) pre = groupElementsLinkFnWrapper(pre, attrStart, attrEnd);
          pre.require = directive.require;
          pre.directiveName = directiveName;
          if (newIsolateScopeDirective === directive || directive.$$isolateScope) {
            pre = cloneAndAnnotateFn(pre, {isolateScope: true});
          }
          preLinkFns.push(pre);
        }
        if (post) {
          if (attrStart) post = groupElementsLinkFnWrapper(post, attrStart, attrEnd);
          post.require = directive.require;
          post.directiveName = directiveName;
          if (newIsolateScopeDirective === directive || directive.$$isolateScope) {
            post = cloneAndAnnotateFn(post, {isolateScope: true});
          }
          postLinkFns.push(post);
        }
      }

      function nodeLinkFn(childLinkFn, scope, linkNode, $rootElement, boundTranscludeFn) {
        var i, ii, linkFn, isolateScope, controllerScope, elementControllers, transcludeFn, $element,
            attrs, scopeBindingInfo;

        if (compileNode === linkNode) {
          attrs = templateAttrs;
          $element = templateAttrs.$$element;
        } else {
          $element = jqLite(linkNode);
          attrs = new Attributes($element, templateAttrs);
        }

        controllerScope = scope;
        if (newIsolateScopeDirective) {
          isolateScope = scope.$new(true);
        } else if (newScopeDirective) {
          controllerScope = scope.$parent;
        }

        if (boundTranscludeFn) {

          transcludeFn = controllersBoundTransclude;
          transcludeFn.$$boundTransclude = boundTranscludeFn;

          transcludeFn.isSlotFilled = function(slotName) {
            return !!boundTranscludeFn.$$slots[slotName];
          };
        }

        if (controllerDirectives) {
          elementControllers = setupControllers($element, attrs, transcludeFn, controllerDirectives, isolateScope, scope, newIsolateScopeDirective);
        }

        if (newIsolateScopeDirective) {
          // Initialize isolate scope bindings for new isolate scope directive.
          compile.$$addScopeInfo($element, isolateScope, true, !(templateDirective && (templateDirective === newIsolateScopeDirective ||
              templateDirective === newIsolateScopeDirective.$$originalDirective)));
          compile.$$addScopeClass($element, true);
          isolateScope.$$isolateBindings =
              newIsolateScopeDirective.$$isolateBindings;
          scopeBindingInfo = initializeDirectiveBindings(scope, attrs, isolateScope,
                                        isolateScope.$$isolateBindings,
                                        newIsolateScopeDirective);
          if (scopeBindingInfo.removeWatches) {
            isolateScope.$on('$destroy', scopeBindingInfo.removeWatches);
          }
        }


        for (var name in elementControllers) {
          var controllerDirective = controllerDirectives[name];
          var controller = elementControllers[name];
          var bindings = controllerDirective.$$bindings.bindToController;

          if (preAssignBindingsEnabled) {
            if (bindings) {
              controller.bindingInfo =
                initializeDirectiveBindings(controllerScope, attrs, controller.instance, bindings, controllerDirective);
            } else {
              controller.bindingInfo = {};
            }

            var controllerResult = controller();
            if (controllerResult !== controller.instance) {

              controller.instance = controllerResult;
              $element.data('$' + controllerDirective.name + 'Controller', controllerResult);
              if (controller.bindingInfo.removeWatches) {
                controller.bindingInfo.removeWatches();
              }
              controller.bindingInfo =
                initializeDirectiveBindings(controllerScope, attrs, controller.instance, bindings, controllerDirective);
            }
          } else {
            controller.instance = controller();
            $element.data('$' + controllerDirective.name + 'Controller', controller.instance);
            controller.bindingInfo =
              initializeDirectiveBindings(controllerScope, attrs, controller.instance, bindings, controllerDirective);
          }
        }


        forEach(controllerDirectives, function(controllerDirective, name) {
          var require = controllerDirective.require;
          if (controllerDirective.bindToController && !isArray(require) && isObject(require)) {
            extend(elementControllers[name].instance, getControllers(name, require, $element, elementControllers));
          }
        });


        forEach(elementControllers, function(controller) {
          var controllerInstance = controller.instance;
          if (isFunction(controllerInstance.$onChanges)) {
            try {
              controllerInstance.$onChanges(controller.bindingInfo.initialChanges);
            } catch (e) {
              $exceptionHandler(e);
            }
          }
          if (isFunction(controllerInstance.$onInit)) {
            try {
              controllerInstance.$onInit();
            } catch (e) {
              $exceptionHandler(e);
            }
          }
          if (isFunction(controllerInstance.$doCheck)) {
            controllerScope.$watch(function() { controllerInstance.$doCheck(); });
            controllerInstance.$doCheck();
          }
          if (isFunction(controllerInstance.$onDestroy)) {
            controllerScope.$on('$destroy', function callOnDestroyHook() {
              controllerInstance.$onDestroy();
            });
          }
        });

        // PRELINKING
        for (i = 0, ii = preLinkFns.length; i < ii; i++) {
          linkFn = preLinkFns[i];
          invokeLinkFn(linkFn,
              linkFn.isolateScope ? isolateScope : scope,
              $element,
              attrs,
              linkFn.require && getControllers(linkFn.directiveName, linkFn.require, $element, elementControllers),
              transcludeFn
          );
        }


        var scopeToChild = scope;
        if (newIsolateScopeDirective && (newIsolateScopeDirective.template || newIsolateScopeDirective.templateUrl === null)) {
          scopeToChild = isolateScope;
        }
        if (childLinkFn) {
          childLinkFn(scopeToChild, linkNode.childNodes, undefined, boundTranscludeFn);
        }

        // POSTLINKING
        for (i = postLinkFns.length - 1; i >= 0; i--) {
          linkFn = postLinkFns[i];
          invokeLinkFn(linkFn,
              linkFn.isolateScope ? isolateScope : scope,
              $element,
              attrs,
              linkFn.require && getControllers(linkFn.directiveName, linkFn.require, $element, elementControllers),
              transcludeFn
          );
        }


        forEach(elementControllers, function(controller) {
          var controllerInstance = controller.instance;
          if (isFunction(controllerInstance.$postLink)) {
            controllerInstance.$postLink();
          }
        });


        function controllersBoundTransclude(scope, cloneAttachFn, futureParentElement, slotName) {
          var transcludeControllers;
          // No scope passed in:
          if (!isScope(scope)) {
            slotName = futureParentElement;
            futureParentElement = cloneAttachFn;
            cloneAttachFn = scope;
            scope = undefined;
          }

          if (hasElementTranscludeDirective) {
            transcludeControllers = elementControllers;
          }
          if (!futureParentElement) {
            futureParentElement = hasElementTranscludeDirective ? $element.parent() : $element;
          }
          if (slotName) {

            var slotTranscludeFn = boundTranscludeFn.$$slots[slotName];
            if (slotTranscludeFn) {
              return slotTranscludeFn(scope, cloneAttachFn, transcludeControllers, futureParentElement, scopeToChild);
            } else if (isUndefined(slotTranscludeFn)) {
              throw $compileMinErr('noslot',
               'No parent directive that requires a transclusion with slot name "{0}". ' +
               'Element: {1}',
               slotName, startingTag($element));
            }
          } else {
            return boundTranscludeFn(scope, cloneAttachFn, transcludeControllers, futureParentElement, scopeToChild);
          }
        }
      }
    }

    function getControllers(directiveName, require, $element, elementControllers) {
      var value;

      if (isString(require)) {
        var match = require.match(REQUIRE_PREFIX_REGEXP);
        var name = require.substring(match[0].length);
        var inheritType = match[1] || match[3];
        var optional = match[2] === '?';


        if (inheritType === '^^') {
          $element = $element.parent();

        } else {
          value = elementControllers && elementControllers[name];
          value = value && value.instance;
        }

        if (!value) {
          var dataName = '$' + name + 'Controller';
          value = inheritType ? $element.inheritedData(dataName) : $element.data(dataName);
        }

        if (!value && !optional) {
          throw $compileMinErr('ctreq',
              'Controller \'{0}\', required by directive \'{1}\', can\'t be found!',
              name, directiveName);
        }
      } else if (isArray(require)) {
        value = [];
        for (var i = 0, ii = require.length; i < ii; i++) {
          value[i] = getControllers(directiveName, require[i], $element, elementControllers);
        }
      } else if (isObject(require)) {
        value = {};
        forEach(require, function(controller, property) {
          value[property] = getControllers(directiveName, controller, $element, elementControllers);
        });
      }

      return value || null;
    }

    function setupControllers($element, attrs, transcludeFn, controllerDirectives, isolateScope, scope, newIsolateScopeDirective) {
      var elementControllers = createMap();
      for (var controllerKey in controllerDirectives) {
        var directive = controllerDirectives[controllerKey];
        var locals = {
          $scope: directive === newIsolateScopeDirective || directive.$$isolateScope ? isolateScope : scope,
          $element: $element,
          $attrs: attrs,
          $transclude: transcludeFn
        };

        var controller = directive.controller;
        if (controller === '@') {
          controller = attrs[directive.name];
        }

        var controllerInstance = $controller(controller, locals, true, directive.controllerAs);


        elementControllers[directive.name] = controllerInstance;
        $element.data('$' + directive.name + 'Controller', controllerInstance.instance);
      }
      return elementControllers;
    }


    function markDirectiveScope(directives, isolateScope, newScope) {
      for (var j = 0, jj = directives.length; j < jj; j++) {
        directives[j] = inherit(directives[j], {$$isolateScope: isolateScope, $$newScope: newScope});
      }
    }

   
    function addDirective(tDirectives, name, location, maxPriority, ignoreDirective, startAttrName,
                          endAttrName) {
      if (name === ignoreDirective) return null;
      var match = null;
      if (hasDirectives.hasOwnProperty(name)) {
        for (var directive, directives = $injector.get(name + Suffix),
            i = 0, ii = directives.length; i < ii; i++) {
          directive = directives[i];
          if ((isUndefined(maxPriority) || maxPriority > directive.priority) &&
               directive.restrict.indexOf(location) !== -1) {
            if (startAttrName) {
              directive = inherit(directive, {$$start: startAttrName, $$end: endAttrName});
            }
            if (!directive.$$bindings) {
              var bindings = directive.$$bindings =
                  parseDirectiveBindings(directive, directive.name);
              if (isObject(bindings.isolateScope)) {
                directive.$$isolateBindings = bindings.isolateScope;
              }
            }
            tDirectives.push(directive);
            match = directive;
          }
        }
      }
      return match;
    }


 
    function directiveIsMultiElement(name) {
      if (hasDirectives.hasOwnProperty(name)) {
        for (var directive, directives = $injector.get(name + Suffix),
            i = 0, ii = directives.length; i < ii; i++) {
          directive = directives[i];
          if (directive.multiElement) {
            return true;
          }
        }
      }
      return false;
    }


    function mergeTemplateAttributes(dst, src) {
      var srcAttr = src.$attr,
          dstAttr = dst.$attr;

      // reapply the old attributes to the new element
      forEach(dst, function(value, key) {
        if (key.charAt(0) !== '$') {
          if (src[key] && src[key] !== value) {
            if (value.length) {
              value += (key === 'style' ? ';' : ' ') + src[key];
            } else {
              value = src[key];
            }
          }
          dst.$set(key, value, true, srcAttr[key]);
        }
      });

      forEach(src, function(value, key) {

        if (!dst.hasOwnProperty(key) && key.charAt(0) !== '$') {
          dst[key] = value;

          if (key !== 'class' && key !== 'style') {
            dstAttr[key] = srcAttr[key];
          }
        }
      });
    }


    function compileTemplateUrl(directives, $compileNode, tAttrs,
        $rootElement, childTranscludeFn, preLinkFns, postLinkFns, previousCompileContext) {
      var linkQueue = [],
          afterTemplateNodeLinkFn,
          afterTemplateChildLinkFn,
          beforeTemplateCompileNode = $compileNode[0],
          origAsyncDirective = directives.shift(),
          derivedSyncDirective = inherit(origAsyncDirective, {
            templateUrl: null, transclude: null, replace: null, $$originalDirective: origAsyncDirective
          }),
          templateUrl = (isFunction(origAsyncDirective.templateUrl))
              ? origAsyncDirective.templateUrl($compileNode, tAttrs)
              : origAsyncDirective.templateUrl,
          templateNamespace = origAsyncDirective.templateNamespace;

      $compileNode.empty();

      $templateRequest(templateUrl)
        .then(function(content) {
          var compileNode, tempTemplateAttrs, $template, childBoundTranscludeFn;

          content = denormalizeTemplate(content);

          if (origAsyncDirective.replace) {
            if (jqLiteIsTextNode(content)) {
              $template = [];
            } else {
              $template = removeComments(wrapTemplate(templateNamespace, trim(content)));
            }
            compileNode = $template[0];

            if ($template.length !== 1 || compileNode.nodeType !== NODE_TYPE_ELEMENT) {
              throw $compileMinErr('tplrt',
                  'Template for directive \'{0}\' must have exactly one root element. {1}',
                  origAsyncDirective.name, templateUrl);
            }

            tempTemplateAttrs = {$attr: {}};
            replaceWith($rootElement, $compileNode, compileNode);
            var templateDirectives = collectDirectives(compileNode, [], tempTemplateAttrs);

            if (isObject(origAsyncDirective.scope)) {
              markDirectiveScope(templateDirectives, true);
            }
            directives = templateDirectives.concat(directives);
            mergeTemplateAttributes(tAttrs, tempTemplateAttrs);
          } else {
            compileNode = beforeTemplateCompileNode;
            $compileNode.html(content);
          }

          directives.unshift(derivedSyncDirective);

          afterTemplateNodeLinkFn = applyDirectivesToNode(directives, compileNode, tAttrs,
              childTranscludeFn, $compileNode, origAsyncDirective, preLinkFns, postLinkFns,
              previousCompileContext);
          forEach($rootElement, function(node, i) {
            if (node === compileNode) {
              $rootElement[i] = $compileNode[0];
            }
          });
          afterTemplateChildLinkFn = compileNodes($compileNode[0].childNodes, childTranscludeFn);

          while (linkQueue.length) {
            var scope = linkQueue.shift(),
                beforeTemplateLinkNode = linkQueue.shift(),
                linkRootElement = linkQueue.shift(),
                boundTranscludeFn = linkQueue.shift(),
                linkNode = $compileNode[0];

            if (scope.$$destroyed) continue;

            if (beforeTemplateLinkNode !== beforeTemplateCompileNode) {
              var oldClasses = beforeTemplateLinkNode.className;

              if (!(previousCompileContext.hasElementTranscludeDirective &&
                  origAsyncDirective.replace)) {

                linkNode = jqLiteClone(compileNode);
              }
              replaceWith(linkRootElement, jqLite(beforeTemplateLinkNode), linkNode);

  
              safeAddClass(jqLite(linkNode), oldClasses);
            }
            if (afterTemplateNodeLinkFn.transcludeOnThisElement) {
              childBoundTranscludeFn = createBoundTranscludeFn(scope, afterTemplateNodeLinkFn.transclude, boundTranscludeFn);
            } else {
              childBoundTranscludeFn = boundTranscludeFn;
            }
            afterTemplateNodeLinkFn(afterTemplateChildLinkFn, scope, linkNode, $rootElement,
              childBoundTranscludeFn);
          }
          linkQueue = null;
        }).catch(function(error) {
          if (error instanceof Error) {
            $exceptionHandler(error);
          }
        }).catch(noop);

      return function delayedNodeLinkFn(ignoreChildLinkFn, scope, node, rootElement, boundTranscludeFn) {
        var childBoundTranscludeFn = boundTranscludeFn;
        if (scope.$$destroyed) return;
        if (linkQueue) {
          linkQueue.push(scope,
                         node,
                         rootElement,
                         childBoundTranscludeFn);
        } else {
          if (afterTemplateNodeLinkFn.transcludeOnThisElement) {
            childBoundTranscludeFn = createBoundTranscludeFn(scope, afterTemplateNodeLinkFn.transclude, boundTranscludeFn);
          }
          afterTemplateNodeLinkFn(afterTemplateChildLinkFn, scope, node, rootElement, childBoundTranscludeFn);
        }
      };
    }



    function byPriority(a, b) {
      var diff = b.priority - a.priority;
      if (diff !== 0) return diff;
      if (a.name !== b.name) return (a.name < b.name) ? -1 : 1;
      return a.index - b.index;
    }

    function assertNoDuplicate(what, previousDirective, directive, element) {

      function wrapModuleNameIfDefined(moduleName) {
        return moduleName ?
          (' (module: ' + moduleName + ')') :
          '';
      }

      if (previousDirective) {
        throw $compileMinErr('multidir', 'Multiple directives [{0}{1}, {2}{3}] asking for {4} on: {5}',
            previousDirective.name, wrapModuleNameIfDefined(previousDirective.$$moduleName),
            directive.name, wrapModuleNameIfDefined(directive.$$moduleName), what, startingTag(element));
      }
    }


    function addTextInterpolateDirective(directives, text) {
      var interpolateFn = $interpolate(text, true);
      if (interpolateFn) {
        directives.push({
          priority: 0,
          compile: function textInterpolateCompileFn(templateNode) {
            var templateNodeParent = templateNode.parent(),
                hasCompileParent = !!templateNodeParent.length;


            if (hasCompileParent) compile.$$addBindingClass(templateNodeParent);

            return function textInterpolateLinkFn(scope, node) {
              var parent = node.parent();
              if (!hasCompileParent) compile.$$addBindingClass(parent);
              compile.$$addBindingInfo(parent, interpolateFn.expressions);
              scope.$watch(interpolateFn, function interpolateFnWatchAction(value) {
                node[0].nodeValue = value;
              });
            };
          }
        });
      }
    }


    function wrapTemplate(type, template) {
      type = lowercase(type || 'html');
      switch (type) {
      case 'svg':
      case 'math':
        var wrapper = window.document.createElement('div');
        wrapper.innerHTML = '<' + type + '>' + template + '</' + type + '>';
        return wrapper.childNodes[0].childNodes;
      default:
        return template;
      }
    }


    function getTrustedContext(node, attrNormalizedName) {
      if (attrNormalizedName === 'srcdoc') {
        return $sce.HTML;
      }
      var tag = nodeName_(node);

      if (attrNormalizedName === 'src' || attrNormalizedName === 'ngSrc') {
        if (['img', 'video', 'audio', 'source', 'track'].indexOf(tag) === -1) {
          return $sce.RESOURCE_URL;
        }
      // maction[xlink:href] can source SVG.  It's not limited to <maction>.
      } else if (attrNormalizedName === 'xlinkHref' ||
          (tag === 'form' && attrNormalizedName === 'action') ||
          // links can be stylesheets or imports, which can run script in the current origin
          (tag === 'link' && attrNormalizedName === 'href')
      ) {
        return $sce.RESOURCE_URL;
      }
    }


    function addAttrInterpolateDirective(node, directives, value, name, isNgAttr) {
      var trustedContext = getTrustedContext(node, name);
      var mustHaveExpression = !isNgAttr;
      var allOrNothing = ALL_OR_NOTHING_ATTRS[name] || isNgAttr;

      var interpolateFn = $interpolate(value, mustHaveExpression, trustedContext, allOrNothing);

 
      if (!interpolateFn) return;

      if (name === 'multiple' && nodeName_(node) === 'select') {
        throw $compileMinErr('selmulti',
            'Binding to the \'multiple\' attribute is not supported. Element: {0}',
            startingTag(node));
      }

      if (EVENT_HANDLER_ATTR_REGEXP.test(name)) {
        throw $compileMinErr('nodomevents',
            'Interpolations for HTML DOM event attributes are disallowed.  Please use the ' +
                'ng- versions (such as ng-click instead of onclick) instead.');
      }

      directives.push({
        priority: 100,
        compile: function() {
            return {
              pre: function attrInterpolatePreLinkFn(scope, element, attr) {
                var $$observers = (attr.$$observers || (attr.$$observers = createMap()));


                var newValue = attr[name];
                if (newValue !== value) {

                  interpolateFn = newValue && $interpolate(newValue, true, trustedContext, allOrNothing);
                  value = newValue;
                }


                if (!interpolateFn) return;


                attr[name] = interpolateFn(scope);

                ($$observers[name] || ($$observers[name] = [])).$$inter = true;
                (attr.$$observers && attr.$$observers[name].$$scope || scope).
                  $watch(interpolateFn, function interpolateFnWatchAction(newValue, oldValue) {

                    if (name === 'class' && newValue !== oldValue) {
                      attr.$updateClass(newValue, oldValue);
                    } else {
                      attr.$set(name, newValue);
                    }
                  });
              }
            };
          }
      });
    }


    function replaceWith($rootElement, elementsToRemove, newNode) {
      var firstElementToRemove = elementsToRemove[0],
          removeCount = elementsToRemove.length,
          parent = firstElementToRemove.parentNode,
          i, ii;

      if ($rootElement) {
        for (i = 0, ii = $rootElement.length; i < ii; i++) {
          if ($rootElement[i] === firstElementToRemove) {
            $rootElement[i++] = newNode;
            for (var j = i, j2 = j + removeCount - 1,
                     jj = $rootElement.length;
                 j < jj; j++, j2++) {
              if (j2 < jj) {
                $rootElement[j] = $rootElement[j2];
              } else {
                delete $rootElement[j];
              }
            }
            $rootElement.length -= removeCount - 1;

            if ($rootElement.context === firstElementToRemove) {
              $rootElement.context = newNode;
            }
            break;
          }
        }
      }

      if (parent) {
        parent.replaceChild(newNode, firstElementToRemove);
      }


      var fragment = window.document.createDocumentFragment();
      for (i = 0; i < removeCount; i++) {
        fragment.appendChild(elementsToRemove[i]);
      }

      if (jqLite.hasData(firstElementToRemove)) {

        jqLite.data(newNode, jqLite.data(firstElementToRemove));


        jqLite(firstElementToRemove).off('$destroy');
      }


      jqLite.cleanData(fragment.querySelectorAll('*'));


      for (i = 1; i < removeCount; i++) {
        delete elementsToRemove[i];
      }
      elementsToRemove[0] = newNode;
      elementsToRemove.length = 1;
    }


    function cloneAndAnnotateFn(fn, annotation) {
      return extend(function() { return fn.apply(null, arguments); }, fn, annotation);
    }


    function invokeLinkFn(linkFn, scope, $element, attrs, controllers, transcludeFn) {
      try {
        linkFn(scope, $element, attrs, controllers, transcludeFn);
      } catch (e) {
        $exceptionHandler(e, startingTag($element));
      }
    }


    // Set up $watches for isolate scope and controller bindings.
    function initializeDirectiveBindings(scope, attrs, destination, bindings, directive) {
      var removeWatchCollection = [];
      var initialChanges = {};
      var changes;
      forEach(bindings, function initializeBinding(definition, scopeName) {
        var attrName = definition.attrName,
        optional = definition.optional,
        mode = definition.mode, // @, =, <, or &
        lastValue,
        parentGet, parentSet, compare, removeWatch;

        switch (mode) {

          case '@':
            if (!optional && !hasOwnProperty.call(attrs, attrName)) {
              destination[scopeName] = attrs[attrName] = undefined;
            }
            removeWatch = attrs.$observe(attrName, function(value) {
              if (isString(value) || isBoolean(value)) {
                var oldValue = destination[scopeName];
                recordChanges(scopeName, value, oldValue);
                destination[scopeName] = value;
              }
            });
            attrs.$$observers[attrName].$$scope = scope;
            lastValue = attrs[attrName];
            if (isString(lastValue)) {

              destination[scopeName] = $interpolate(lastValue)(scope);
            } else if (isBoolean(lastValue)) {

              destination[scopeName] = lastValue;
            }
            initialChanges[scopeName] = new SimpleChange(_UNINITIALIZED_VALUE, destination[scopeName]);
            removeWatchCollection.push(removeWatch);
            break;

          case '=':
            if (!hasOwnProperty.call(attrs, attrName)) {
              if (optional) break;
              attrs[attrName] = undefined;
            }
            if (optional && !attrs[attrName]) break;

            parentGet = $parse(attrs[attrName]);
            if (parentGet.literal) {
              compare = equals;
            } else {
              // eslint-disable-next-line no-self-compare
              compare = function simpleCompare(a, b) { return a === b || (a !== a && b !== b); };
            }
            parentSet = parentGet.assign || function() {
              // reset the change, or we will throw this exception on every $digest
              lastValue = destination[scopeName] = parentGet(scope);
              throw $compileMinErr('nonassign',
                  'Expression \'{0}\' in attribute \'{1}\' used with directive \'{2}\' is non-assignable!',
                  attrs[attrName], attrName, directive.name);
            };
            lastValue = destination[scopeName] = parentGet(scope);
            var parentValueWatch = function parentValueWatch(parentValue) {
              if (!compare(parentValue, destination[scopeName])) {
                // we are out of sync and need to copy
                if (!compare(parentValue, lastValue)) {
                  // parent changed and it has precedence
                  destination[scopeName] = parentValue;
                } else {
                  // if the parent can be assigned then do so
                  parentSet(scope, parentValue = destination[scopeName]);
                }
              }
              lastValue = parentValue;
              return lastValue;
            };
            parentValueWatch.$stateful = true;
            if (definition.collection) {
              removeWatch = scope.$watchCollection(attrs[attrName], parentValueWatch);
            } else {
              removeWatch = scope.$watch($parse(attrs[attrName], parentValueWatch), null, parentGet.literal);
            }
            removeWatchCollection.push(removeWatch);
            break;

          case '<':
            if (!hasOwnProperty.call(attrs, attrName)) {
              if (optional) break;
              attrs[attrName] = undefined;
            }
            if (optional && !attrs[attrName]) break;

            parentGet = $parse(attrs[attrName]);
            var deepWatch = parentGet.literal;

            var initialValue = destination[scopeName] = parentGet(scope);
            initialChanges[scopeName] = new SimpleChange(_UNINITIALIZED_VALUE, destination[scopeName]);

            removeWatch = scope.$watch(parentGet, function parentValueWatchAction(newValue, oldValue) {
              if (oldValue === newValue) {
                if (oldValue === initialValue || (deepWatch && equals(oldValue, initialValue))) {
                  return;
                }
                oldValue = initialValue;
              }
              recordChanges(scopeName, newValue, oldValue);
              destination[scopeName] = newValue;
            }, deepWatch);

            removeWatchCollection.push(removeWatch);
            break;

          case '&':

            parentGet = attrs.hasOwnProperty(attrName) ? $parse(attrs[attrName]) : noop;

   
            if (parentGet === noop && optional) break;

            destination[scopeName] = function(locals) {
              return parentGet(scope, locals);
            };
            break;
        }
      });

      function recordChanges(key, currentValue, previousValue) {
        if (isFunction(destination.$onChanges) && currentValue !== previousValue &&

            (currentValue === currentValue || previousValue === previousValue)) {

          if (!onChangesQueue) {
            scope.$$postDigest(flushOnChangesQueue);
            onChangesQueue = [];
          }

          if (!changes) {
            changes = {};
            onChangesQueue.push(triggerOnChangesHook);
          }
 
          if (changes[key]) {
            previousValue = changes[key].previousValue;
          }
      
          changes[key] = new SimpleChange(previousValue, currentValue);
        }
      }

      function triggerOnChangesHook() {
        destination.$onChanges(changes);
        // Now clear the changes so that we schedule onChanges when more changes arrive
        changes = undefined;
      }

      return {
        initialChanges: initialChanges,
        removeWatches: removeWatchCollection.length && function removeWatches() {
          for (var i = 0, ii = removeWatchCollection.length; i < ii; ++i) {
            removeWatchCollection[i]();
          }
        }
      };
    }
  }];
}

function SimpleChange(previous, current) {
  this.previousValue = previous;
  this.currentValue = current;
}
SimpleChange.prototype.isFirstChange = function() { return this.previousValue === _UNINITIALIZED_VALUE; };


var PREFIX_REGEXP = /^((?:x|data)[:\-_])/i;
var SPECIAL_CHARS_REGEXP = /[:\-_]+(.)/g;

/**
 * Converts all accepted directives format into proper directive name.
 * @param name Name to normalize
 */
function directiveNormalize(name) {
  return name
    .replace(PREFIX_REGEXP, '')
    .replace(SPECIAL_CHARS_REGEXP, fnCamelCaseReplace);
}

/**
 * @ngdoc type
 * @name $compile.directive.Attributes
 *
 * @description
 * A shared object between directive compile / linking functions which contains normalized DOM
 * element attributes. The values reflect current binding state `{{ }}`. The normalization is
 * needed since all of these are treated as equivalent in Angular:
 *
 * ```
 *    <span ng:bind="a" ng-bind="a" data-ng-bind="a" x-ng-bind="a">
 * ```
 */

/**
 * @ngdoc property
 * @name $compile.directive.Attributes#$attr
 *
 * @description
 * A map of DOM element attribute names to the normalized name. This is
 * needed to do reverse lookup from normalized name back to actual name.
 */


/**
 * @ngdoc method
 * @name $compile.directive.Attributes#$set
 * @kind function
 *
 * @description
 * Set DOM element attribute value.
 *
 *
 * @param {string} name Normalized element attribute name of the property to modify. The name is
 *          reverse-translated using the {@link ng.$compile.directive.Attributes#$attr $attr}
 *          property to the original name.
 * @param {string} value Value to set the attribute to. The value can be an interpolated string.
 */



/**
 * Closure compiler type information
 */

function nodesetLinkingFn(
  /* angular.Scope */ scope,
  /* NodeList */ nodeList,
  /* Element */ rootElement,
  /* function(Function) */ boundTranscludeFn
) {}

function directiveLinkingFn(
  /* nodesetLinkingFn */ nodesetLinkingFn,
  /* angular.Scope */ scope,
  /* Node */ node,
  /* Element */ rootElement,
  /* function(Function) */ boundTranscludeFn
) {}

function tokenDifference(str1, str2) {
  var values = '',
      tokens1 = str1.split(/\s+/),
      tokens2 = str2.split(/\s+/);

  outer:
  for (var i = 0; i < tokens1.length; i++) {
    var token = tokens1[i];
    for (var j = 0; j < tokens2.length; j++) {
      if (token === tokens2[j]) continue outer;
    }
    values += (values.length > 0 ? ' ' : '') + token;
  }
  return values;
}

function removeComments(jqNodes) {
  jqNodes = jqLite(jqNodes);
  var i = jqNodes.length;

  if (i <= 1) {
    return jqNodes;
  }

  while (i--) {
    var node = jqNodes[i];
    if (node.nodeType === NODE_TYPE_COMMENT ||
       (node.nodeType === NODE_TYPE_TEXT && node.nodeValue.trim() === '')) {
         splice.call(jqNodes, i, 1);
    }
  }
  return jqNodes;
}

var $controllerMinErr = minErr('$controller');


var CNTRL_REG = /^(\S+)(\s+as\s+([\w$]+))?$/;
function identifierForController(controller, ident) {
  if (ident && isString(ident)) return ident;
  if (isString(controller)) {
    var match = CNTRL_REG.exec(controller);
    if (match) return match[3];
  }
}


/**
 * @ngdoc provider
 * @name $controllerProvider
 * @this
 *
 * @description
 * The {@link ng.$controller $controller service} is used by Angular to create new
 * controllers.
 *
 * This provider allows controller registration via the
 * {@link ng.$controllerProvider#register register} method.
 */
function $ControllerProvider() {
  var controllers = {},
      globals = false;

  /**
   * @ngdoc method
   * @name $controllerProvider#has
   * @param {string} name Controller name to check.
   */
  this.has = function(name) {
    return controllers.hasOwnProperty(name);
  };

  /**
   * @ngdoc method
   * @name $controllerProvider#register
   * @param {string|Object} name Controller name, or an object map of controllers where the keys are
   *    the names and the values are the constructors.
   * @param {Function|Array} constructor Controller constructor fn (optionally decorated with DI
   *    annotations in the array notation).
   */
  this.register = function(name, constructor) {
    assertNotHasOwnProperty(name, 'controller');
    if (isObject(name)) {
      extend(controllers, name);
    } else {
      controllers[name] = constructor;
    }
  };

  /**
   * @ngdoc method
   * @name $controllerProvider#allowGlobals
   * @description If called, allows `$controller` to find controller constructors on `window`
   *
   * @deprecated
   * sinceVersion="v1.3.0"
   * removeVersion="v1.7.0"
   * This method of finding controllers has been deprecated.
   */
  this.allowGlobals = function() {
    globals = true;
  };


  this.$get = ['$injector', '$window', function($injector, $window) {

   
    return function $controller(expression, locals, later, ident) {
   
      var instance, match, constructor, identifier;
      later = later === true;
      if (ident && isString(ident)) {
        identifier = ident;
      }

      if (isString(expression)) {
        match = expression.match(CNTRL_REG);
        if (!match) {
          throw $controllerMinErr('ctrlfmt',
            'Badly formed controller string \'{0}\'. ' +
            'Must match `__name__ as __id__` or `__name__`.', expression);
        }
        constructor = match[1];
        identifier = identifier || match[3];
        expression = controllers.hasOwnProperty(constructor)
            ? controllers[constructor]
            : getter(locals.$scope, constructor, true) ||
                (globals ? getter($window, constructor, true) : undefined);

        if (!expression) {
          throw $controllerMinErr('ctrlreg',
            'The controller with the name \'{0}\' is not registered.', constructor);
        }

        assertArgFn(expression, constructor, true);
      }

      if (later) {
        // Instantiate controller later:
        // This machinery is used to create an instance of the object before calling the
        // controller's constructor itself.
        //
        // This allows properties to be added to the controller before the constructor is
        // invoked. Primarily, this is used for isolate scope bindings in $compile.
        //
        // This feature is not intended for use by applications, and is thus not documented
        // publicly.
        // Object creation: http://jsperf.com/create-constructor/2
        var controllerPrototype = (isArray(expression) ?
          expression[expression.length - 1] : expression).prototype;
        instance = Object.create(controllerPrototype || null);

        if (identifier) {
          addIdentifier(locals, identifier, instance, constructor || expression.name);
        }

        return extend(function $controllerInit() {
          var result = $injector.invoke(expression, instance, locals, constructor);
          if (result !== instance && (isObject(result) || isFunction(result))) {
            instance = result;
            if (identifier) {
              // If result changed, re-assign controllerAs value to scope.
              addIdentifier(locals, identifier, instance, constructor || expression.name);
            }
          }
          return instance;
        }, {
          instance: instance,
          identifier: identifier
        });
      }

      instance = $injector.instantiate(expression, locals, constructor);

      if (identifier) {
        addIdentifier(locals, identifier, instance, constructor || expression.name);
      }

      return instance;
    };

    function addIdentifier(locals, identifier, instance, name) {
      if (!(locals && isObject(locals.$scope))) {
        throw minErr('$controller')('noscp',
          'Cannot export controller \'{0}\' as \'{1}\'! No $scope object provided via `locals`.',
          name, identifier);
      }

      locals.$scope[identifier] = instance;
    }
  }];
}

/**
 * @ngdoc service
 * @name $document
 * @requires $window
 * @this
 *
 * @description
 * A {@link angular.element jQuery or jqLite} wrapper for the browser's `window.document` object.
 *
 * @example
   <example module="documentExample" name="document">
     <file name="index.html">
       <div ng-controller="ExampleController">
         <p>$document title: <b ng-bind="title"></b></p>
         <p>window.document title: <b ng-bind="windowTitle"></b></p>
       </div>
     </file>
     <file name="script.js">
       angular.module('documentExample', [])
         .controller('ExampleController', ['$scope', '$document', function($scope, $document) {
           $scope.title = $document[0].title;
           $scope.windowTitle = angular.element(window.document)[0].title;
         }]);
     </file>
   </example>
 */
function $DocumentProvider() {
  this.$get = ['$window', function(window) {
    return jqLite(window.document);
  }];
}


/**
 * @private
 * @this
 * Listens for document visibility change and makes the current status accessible.
 */
function $$IsDocumentHiddenProvider() {
  this.$get = ['$document', '$rootScope', function($document, $rootScope) {
    var doc = $document[0];
    var hidden = doc && doc.hidden;

    $document.on('visibilitychange', changeListener);

    $rootScope.$on('$destroy', function() {
      $document.off('visibilitychange', changeListener);
    });

    function changeListener() {
      hidden = doc.hidden;
    }

    return function() {
      return hidden;
    };
  }];
}

/**
 * @ngdoc service
 * @name $exceptionHandler
 * @requires ng.$log
 * @this
 *
 * @description
 * Any uncaught exception in angular expressions is delegated to this service.
 * The default implementation simply delegates to `$log.error` which logs it into
 * the browser console.
 *
 * In unit tests, if `angular-mocks.js` is loaded, this service is overridden by
 * {@link ngMock.$exceptionHandler mock $exceptionHandler} which aids in testing.
 *
 * ## Example:
 *
 * The example below will overwrite the default `$exceptionHandler` in order to (a) log uncaught
 * errors to the backend for later inspection by the developers and (b) to use `$log.warn()` instead
 * of `$log.error()`.
 *
 * ```js
 *   angular.
 *     module('exceptionOverwrite', []).
 *     factory('$exceptionHandler', ['$log', 'logErrorsToBackend', function($log, logErrorsToBackend) {
 *       return function myExceptionHandler(exception, cause) {
 *         logErrorsToBackend(exception, cause);
 *         $log.warn(exception, cause);
 *       };
 *     }]);
 * ```
 *
 * <hr />
 * Note, that code executed in event-listeners (even those registered using jqLite's `on`/`bind`
 * methods) does not delegate exceptions to the {@link ng.$exceptionHandler $exceptionHandler}
 * (unless executed during a digest).
 *
 * If you wish, you can manually delegate exceptions, e.g.
 * `try { ... } catch(e) { $exceptionHandler(e); }`
 *
 * @param {Error} exception Exception associated with the error.
 * @param {string=} cause Optional information about the context in which
 *       the error was thrown.
 *
 */
function $ExceptionHandlerProvider() {
  this.$get = ['$log', function($log) {
    return function(exception, cause) {
      $log.error.apply($log, arguments);
    };
  }];
}

var $$ForceReflowProvider = /** @this */ function() {
  this.$get = ['$document', function($document) {
    return function(domNode) {
  
      if (domNode) {
        if (!domNode.nodeType && domNode instanceof jqLite) {
          domNode = domNode[0];
        }
      } else {
        domNode = $document[0].body;
      }
      return domNode.offsetWidth + 1;
    };
  }];
};

var APPLICATION_JSON = 'application/json';
var CONTENT_TYPE_APPLICATION_JSON = {'Content-Type': APPLICATION_JSON + ';charset=utf-8'};
var JSON_START = /^\[|^\{(?!\{)/;
var JSON_ENDS = {
  '[': /]$/,
  '{': /}$/
};
var JSON_PROTECTION_PREFIX = /^\)]\}',?\n/;
var $httpMinErr = minErr('$http');

function serializeValue(v) {
  if (isObject(v)) {
    return isDate(v) ? v.toISOString() : toJson(v);
  }
  return v;
}



function $HttpParamSerializerProvider() {
 
  this.$get = function() {
    return function ngParamSerializer(params) {
      if (!params) return '';
      var parts = [];
      forEachSorted(params, function(value, key) {
        if (value === null || isUndefined(value)) return;
        if (isArray(value)) {
          forEach(value, function(v) {
            parts.push(encodeUriQuery(key)  + '=' + encodeUriQuery(serializeValue(v)));
          });
        } else {
          parts.push(encodeUriQuery(key) + '=' + encodeUriQuery(serializeValue(value)));
        }
      });

      return parts.join('&');
    };
  };
}


function $HttpParamSerializerJQLikeProvider() {
 
  this.$get = function() {
    return function jQueryLikeParamSerializer(params) {
      if (!params) return '';
      var parts = [];
      serialize(params, '', true);
      return parts.join('&');

      function serialize(toSerialize, prefix, topLevel) {
        if (toSerialize === null || isUndefined(toSerialize)) return;
        if (isArray(toSerialize)) {
          forEach(toSerialize, function(value, index) {
            serialize(value, prefix + '[' + (isObject(value) ? index : '') + ']');
          });
        } else if (isObject(toSerialize) && !isDate(toSerialize)) {
          forEachSorted(toSerialize, function(value, key) {
            serialize(value, prefix +
                (topLevel ? '' : '[') +
                key +
                (topLevel ? '' : ']'));
          });
        } else {
          parts.push(encodeUriQuery(prefix) + '=' + encodeUriQuery(serializeValue(toSerialize)));
        }
      }
    };
  };
}

function defaultHttpResponseTransform(data, headers) {
  if (isString(data)) {

    var tempData = data.replace(JSON_PROTECTION_PREFIX, '').trim();

    if (tempData) {
      var contentType = headers('Content-Type');
      if ((contentType && (contentType.indexOf(APPLICATION_JSON) === 0)) || isJsonLike(tempData)) {
        data = fromJson(tempData);
      }
    }
  }

  return data;
}

function isJsonLike(str) {
    var jsonStart = str.match(JSON_START);
    return jsonStart && JSON_ENDS[jsonStart[0]].test(str);
}


function parseHeaders(headers) {
  var parsed = createMap(), i;

  function fillInParsed(key, val) {
    if (key) {
      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
    }
  }

  if (isString(headers)) {
    forEach(headers.split('\n'), function(line) {
      i = line.indexOf(':');
      fillInParsed(lowercase(trim(line.substr(0, i))), trim(line.substr(i + 1)));
    });
  } else if (isObject(headers)) {
    forEach(headers, function(headerVal, headerKey) {
      fillInParsed(lowercase(headerKey), trim(headerVal));
    });
  }

  return parsed;
}


function headersGetter(headers) {
  var headersObj;

  return function(name) {
    if (!headersObj) headersObj =  parseHeaders(headers);

    if (name) {
      var value = headersObj[lowercase(name)];
      if (value === undefined) {
        value = null;
      }
      return value;
    }

    return headersObj;
  };
}



function transformData(data, headers, status, fns) {
  if (isFunction(fns)) {
    return fns(data, headers, status);
  }

  forEach(fns, function(fn) {
    data = fn(data, headers, status);
  });

  return data;
}


function isSuccess(status) {
  return 200 <= status && status < 300;
}



function $HttpProvider() {
 
  var defaults = this.defaults = {

    transformResponse: [defaultHttpResponseTransform],


    transformRequest: [function(d) {
      return isObject(d) && !isFile(d) && !isBlob(d) && !isFormData(d) ? toJson(d) : d;
    }],


    headers: {
      common: {
        'Accept': 'application/json, text/plain, */*'
      },
      post:   shallowCopy(CONTENT_TYPE_APPLICATION_JSON),
      put:    shallowCopy(CONTENT_TYPE_APPLICATION_JSON),
      patch:  shallowCopy(CONTENT_TYPE_APPLICATION_JSON)
    },

    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',

    paramSerializer: '$httpParamSerializer',

    jsonpCallbackParam: 'callback'
  };

  var useApplyAsync = false;
 
  this.useApplyAsync = function(value) {
    if (isDefined(value)) {
      useApplyAsync = !!value;
      return this;
    }
    return useApplyAsync;
  };

  var interceptorFactories = this.interceptors = [];

  this.$get = ['$browser', '$httpBackend', '$$cookieReader', '$cacheFactory', '$rootScope', '$q', '$injector', '$sce',
      function($browser, $httpBackend, $$cookieReader, $cacheFactory, $rootScope, $q, $injector, $sce) {

    var defaultCache = $cacheFactory('$http');

    var reversedInterceptors = [];

    forEach(interceptorFactories, function(interceptorFactory) {
      reversedInterceptors.unshift(isString(interceptorFactory)
          ? $injector.get(interceptorFactory) : $injector.invoke(interceptorFactory));
    });

  
    function $http(requestConfig) {

      if (!isObject(requestConfig)) {
        throw minErr('$http')('badreq', 'Http request configuration must be an object.  Received: {0}', requestConfig);
      }

      if (!isString($sce.valueOf(requestConfig.url))) {
        throw minErr('$http')('badreq', 'Http request configuration url must be a string or a $sce trusted object.  Received: {0}', requestConfig.url);
      }

      var config = extend({
        method: 'get',
        transformRequest: defaults.transformRequest,
        transformResponse: defaults.transformResponse,
        paramSerializer: defaults.paramSerializer,
        jsonpCallbackParam: defaults.jsonpCallbackParam
      }, requestConfig);

      config.headers = mergeHeaders(requestConfig);
      config.method = uppercase(config.method);
      config.paramSerializer = isString(config.paramSerializer) ?
          $injector.get(config.paramSerializer) : config.paramSerializer;

      $browser.$$incOutstandingRequestCount();

      var requestInterceptors = [];
      var responseInterceptors = [];
      var promise = $q.resolve(config);


      forEach(reversedInterceptors, function(interceptor) {
        if (interceptor.request || interceptor.requestError) {
          requestInterceptors.unshift(interceptor.request, interceptor.requestError);
        }
        if (interceptor.response || interceptor.responseError) {
          responseInterceptors.push(interceptor.response, interceptor.responseError);
        }
      });

      promise = chainInterceptors(promise, requestInterceptors);
      promise = promise.then(serverRequest);
      promise = chainInterceptors(promise, responseInterceptors);
      promise = promise.finally(completeOutstandingRequest);

      return promise;


      function chainInterceptors(promise, interceptors) {
        for (var i = 0, ii = interceptors.length; i < ii;) {
          var thenFn = interceptors[i++];
          var rejectFn = interceptors[i++];

          promise = promise.then(thenFn, rejectFn);
        }

        interceptors.length = 0;

        return promise;
      }

      function completeOutstandingRequest() {
        $browser.$$completeOutstandingRequest(noop);
      }

      function executeHeaderFns(headers, config) {
        var headerContent, processedHeaders = {};

        forEach(headers, function(headerFn, header) {
          if (isFunction(headerFn)) {
            headerContent = headerFn(config);
            if (headerContent != null) {
              processedHeaders[header] = headerContent;
            }
          } else {
            processedHeaders[header] = headerFn;
          }
        });

        return processedHeaders;
      }

      function mergeHeaders(config) {
        var defHeaders = defaults.headers,
            reqHeaders = extend({}, config.headers),
            defHeaderName, lowercaseDefHeaderName, reqHeaderName;

        defHeaders = extend({}, defHeaders.common, defHeaders[lowercase(config.method)]);


        defaultHeadersIteration:
        for (defHeaderName in defHeaders) {
          lowercaseDefHeaderName = lowercase(defHeaderName);

          for (reqHeaderName in reqHeaders) {
            if (lowercase(reqHeaderName) === lowercaseDefHeaderName) {
              continue defaultHeadersIteration;
            }
          }

          reqHeaders[defHeaderName] = defHeaders[defHeaderName];
        }

        // execute if header value is a function for merged headers
        return executeHeaderFns(reqHeaders, shallowCopy(config));
      }

      function serverRequest(config) {
        var headers = config.headers;
        var reqData = transformData(config.data, headersGetter(headers), undefined, config.transformRequest);


        if (isUndefined(reqData)) {
          forEach(headers, function(value, header) {
            if (lowercase(header) === 'content-type') {
              delete headers[header];
            }
          });
        }

        if (isUndefined(config.withCredentials) && !isUndefined(defaults.withCredentials)) {
          config.withCredentials = defaults.withCredentials;
        }

        return sendReq(config, reqData).then(transformResponse, transformResponse);
      }

      function transformResponse(response) {

        var resp = extend({}, response);
        resp.data = transformData(response.data, response.headers, response.status,
                                  config.transformResponse);
        return (isSuccess(response.status))
          ? resp
          : $q.reject(resp);
      }
    }

    $http.pendingRequests = [];

  
    createShortMethodsWithData('post', 'put', 'patch');

       
    $http.defaults = defaults;


    return $http;


    function createShortMethods(names) {
      forEach(arguments, function(name) {
        $http[name] = function(url, config) {
          return $http(extend({}, config || {}, {
            method: name,
            url: url
          }));
        };
      });
    }


    function createShortMethodsWithData(name) {
      forEach(arguments, function(name) {
        $http[name] = function(url, data, config) {
          return $http(extend({}, config || {}, {
            method: name,
            url: url,
            data: data
          }));
        };
      });
    }


    function sendReq(config, reqData) {
      var deferred = $q.defer(),
          promise = deferred.promise,
          cache,
          cachedResp,
          reqHeaders = config.headers,
          isJsonp = lowercase(config.method) === 'jsonp',
          url = config.url;

      if (isJsonp) {
     
        url = $sce.getTrustedResourceUrl(url);
      } else if (!isString(url)) {

        url = $sce.valueOf(url);
      }

      url = buildUrl(url, config.paramSerializer(config.params));

      if (isJsonp) {

        url = sanitizeJsonpCallbackParam(url, config.jsonpCallbackParam);
      }

      $http.pendingRequests.push(config);
      promise.then(removePendingReq, removePendingReq);

      if ((config.cache || defaults.cache) && config.cache !== false &&
          (config.method === 'GET' || config.method === 'JSONP')) {
        cache = isObject(config.cache) ? config.cache
              : isObject(defaults.cache) ? defaults.cache
              : defaultCache;
      }

      if (cache) {
        cachedResp = cache.get(url);
        if (isDefined(cachedResp)) {
          if (isPromiseLike(cachedResp)) {

            cachedResp.then(resolvePromiseWithResult, resolvePromiseWithResult);
          } else {
            // serving from cache
            if (isArray(cachedResp)) {
              resolvePromise(cachedResp[1], cachedResp[0], shallowCopy(cachedResp[2]), cachedResp[3]);
            } else {
              resolvePromise(cachedResp, 200, {}, 'OK');
            }
          }
        } else {
 
          cache.put(url, promise);
        }
      }



      if (isUndefined(cachedResp)) {
        var xsrfValue = urlIsSameOrigin(config.url)
            ? $$cookieReader()[config.xsrfCookieName || defaults.xsrfCookieName]
            : undefined;
        if (xsrfValue) {
          reqHeaders[(config.xsrfHeaderName || defaults.xsrfHeaderName)] = xsrfValue;
        }

        $httpBackend(config.method, url, reqData, done, reqHeaders, config.timeout,
            config.withCredentials, config.responseType,
            createApplyHandlers(config.eventHandlers),
            createApplyHandlers(config.uploadEventHandlers));
      }

      return promise;

      function createApplyHandlers(eventHandlers) {
        if (eventHandlers) {
          var applyHandlers = {};
          forEach(eventHandlers, function(eventHandler, key) {
            applyHandlers[key] = function(event) {
              if (useApplyAsync) {
                $rootScope.$applyAsync(callEventHandler);
              } else if ($rootScope.$$phase) {
                callEventHandler();
              } else {
                $rootScope.$apply(callEventHandler);
              }

              function callEventHandler() {
                eventHandler(event);
              }
            };
          });
          return applyHandlers;
        }
      }


      
      function done(status, response, headersString, statusText) {
        if (cache) {
          if (isSuccess(status)) {
            cache.put(url, [status, response, parseHeaders(headersString), statusText]);
          } else {
            // remove promise from the cache
            cache.remove(url);
          }
        }

        function resolveHttpPromise() {
          resolvePromise(response, status, headersString, statusText);
        }

        if (useApplyAsync) {
          $rootScope.$applyAsync(resolveHttpPromise);
        } else {
          resolveHttpPromise();
          if (!$rootScope.$$phase) $rootScope.$apply();
        }
      }


      function resolvePromise(response, status, headers, statusText) {
   
        status = status >= -1 ? status : 0;

        (isSuccess(status) ? deferred.resolve : deferred.reject)({
          data: response,
          status: status,
          headers: headersGetter(headers),
          config: config,
          statusText: statusText
        });
      }

      function resolvePromiseWithResult(result) {
        resolvePromise(result.data, result.status, shallowCopy(result.headers()), result.statusText);
      }

      function removePendingReq() {
        var idx = $http.pendingRequests.indexOf(config);
        if (idx !== -1) $http.pendingRequests.splice(idx, 1);
      }
    }


    function buildUrl(url, serializedParams) {
      if (serializedParams.length > 0) {
        url += ((url.indexOf('?') === -1) ? '?' : '&') + serializedParams;
      }
      return url;
    }

    function sanitizeJsonpCallbackParam(url, key) {
      if (/[&?][^=]+=JSON_CALLBACK/.test(url)) {
        // Throw if the url already contains a reference to JSON_CALLBACK
        throw $httpMinErr('badjsonp', 'Illegal use of JSON_CALLBACK in url, "{0}"', url);
      }

      var callbackParamRegex = new RegExp('[&?]' + key + '=');
      if (callbackParamRegex.test(url)) {
        // Throw if the callback param was already provided
        throw $httpMinErr('badjsonp', 'Illegal use of callback param, "{0}", in url, "{1}"', key, url);
      }

      // Add in the JSON_CALLBACK callback param value
      url += ((url.indexOf('?') === -1) ? '?' : '&') + key + '=JSON_CALLBACK';

      return url;
    }
  }];
}


function $xhrFactoryProvider() {
  this.$get = function() {
    return function createXhr() {
      return new window.XMLHttpRequest();
    };
  };
}


function $HttpBackendProvider() {
  this.$get = ['$browser', '$jsonpCallbacks', '$document', '$xhrFactory', function($browser, $jsonpCallbacks, $document, $xhrFactory) {
    return createHttpBackend($browser, $xhrFactory, $browser.defer, $jsonpCallbacks, $document[0]);
  }];
}

function createHttpBackend($browser, createXhr, $browserDefer, callbacks, rawDocument) {

  return function(method, url, post, callback, headers, timeout, withCredentials, responseType, eventHandlers, uploadEventHandlers) {
    url = url || $browser.url();

    if (lowercase(method) === 'jsonp') {
      var callbackPath = callbacks.createCallback(url);
      var jsonpDone = jsonpReq(url, callbackPath, function(status, text) {

        var response = (status === 200) && callbacks.getResponse(callbackPath);
        completeRequest(callback, status, response, '', text);
        callbacks.removeCallback(callbackPath);
      });
    } else {

      var xhr = createXhr(method, url);

      xhr.open(method, url, true);
      forEach(headers, function(value, key) {
        if (isDefined(value)) {
            xhr.setRequestHeader(key, value);
        }
      });

      xhr.onload = function requestLoaded() {
        var statusText = xhr.statusText || '';

      
        var response = ('response' in xhr) ? xhr.response : xhr.responseText;

     
        var status = xhr.status === 1223 ? 204 : xhr.status;

     
        if (status === 0) {
          status = response ? 200 : urlResolve(url).protocol === 'file' ? 404 : 0;
        }

        completeRequest(callback,
            status,
            response,
            xhr.getAllResponseHeaders(),
            statusText);
      };

      var requestError = function() {
  
        completeRequest(callback, -1, null, null, '');
      };

      xhr.onerror = requestError;
      xhr.onabort = requestError;
      xhr.ontimeout = requestError;

      forEach(eventHandlers, function(value, key) {
          xhr.addEventListener(key, value);
      });

      forEach(uploadEventHandlers, function(value, key) {
        xhr.upload.addEventListener(key, value);
      });

      if (withCredentials) {
        xhr.withCredentials = true;
      }

      if (responseType) {
        try {
          xhr.responseType = responseType;
        } catch (e) {
        
          if (responseType !== 'json') {
            throw e;
          }
        }
      }

      xhr.send(isUndefined(post) ? null : post);
    }

    if (timeout > 0) {
      var timeoutId = $browserDefer(timeoutRequest, timeout);
    } else if (isPromiseLike(timeout)) {
      timeout.then(timeoutRequest);
    }


    function timeoutRequest() {
      if (jsonpDone) {
        jsonpDone();
      }
      if (xhr) {
        xhr.abort();
      }
    }

    function completeRequest(callback, status, response, headersString, statusText) {

      if (isDefined(timeoutId)) {
        $browserDefer.cancel(timeoutId);
      }
      jsonpDone = xhr = null;

      callback(status, response, headersString, statusText);
    }
  };

  function jsonpReq(url, callbackPath, done) {
    url = url.replace('JSON_CALLBACK', callbackPath);

    var script = rawDocument.createElement('script'), callback = null;
    script.type = 'text/javascript';
    script.src = url;
    script.async = true;

    callback = function(event) {
      script.removeEventListener('load', callback);
      script.removeEventListener('error', callback);
      rawDocument.body.removeChild(script);
      script = null;
      var status = -1;
      var text = 'unknown';

      if (event) {
        if (event.type === 'load' && !callbacks.wasCalled(callbackPath)) {
          event = { type: 'error' };
        }
        text = event.type;
        status = event.type === 'error' ? 404 : 200;
      }

      if (done) {
        done(status, text);
      }
    };

    script.addEventListener('load', callback);
    script.addEventListener('error', callback);
    rawDocument.body.appendChild(script);
    return callback;
  }
}

var $interpolateMinErr = angular.$interpolateMinErr = minErr('$interpolate');
$interpolateMinErr.throwNoconcat = function(text) {
  throw $interpolateMinErr('noconcat',
      'Error while interpolating: {0}\nStrict Contextual Escaping disallows ' +
      'interpolations that concatenate multiple expressions when a trusted value is ' +
      'required.  See http://docs.angularjs.org/api/ng.$sce', text);
};

$interpolateMinErr.interr = function(text, err) {
  return $interpolateMinErr('interr', 'Can\'t interpolate: {0}\n{1}', text, err.toString());
};


function $InterpolateProvider() {
  var startSymbol = '{{';
  var endSymbol = '}}';

  this.startSymbol = function(value) {
    if (value) {
      startSymbol = value;
      return this;
    } else {
      return startSymbol;
    }
  };

  
  this.endSymbol = function(value) {
    if (value) {
      endSymbol = value;
      return this;
    } else {
      return endSymbol;
    }
  };


  this.$get = ['$parse', '$exceptionHandler', '$sce', function($parse, $exceptionHandler, $sce) {
    var startSymbolLength = startSymbol.length,
        endSymbolLength = endSymbol.length,
        escapedStartRegexp = new RegExp(startSymbol.replace(/./g, escape), 'g'),
        escapedEndRegexp = new RegExp(endSymbol.replace(/./g, escape), 'g');

    function escape(ch) {
      return '\\\\\\' + ch;
    }

    function unescapeText(text) {
      return text.replace(escapedStartRegexp, startSymbol).
        replace(escapedEndRegexp, endSymbol);
    }


    function constantWatchDelegate(scope, listener, objectEquality, constantInterp) {
      var unwatch = scope.$watch(function constantInterpolateWatch(scope) {
        unwatch();
        return constantInterp(scope);
      }, listener, objectEquality);
      return unwatch;
    }

   
    function $interpolate(text, mustHaveExpression, trustedContext, allOrNothing) {

      if (!text.length || text.indexOf(startSymbol) === -1) {
        var constantInterp;
        if (!mustHaveExpression) {
          var unescapedText = unescapeText(text);
          constantInterp = valueFn(unescapedText);
          constantInterp.exp = text;
          constantInterp.expressions = [];
          constantInterp.$$watchDelegate = constantWatchDelegate;
        }
        return constantInterp;
      }

      allOrNothing = !!allOrNothing;
      var startIndex,
          endIndex,
          index = 0,
          expressions = [],
          parseFns = [],
          textLength = text.length,
          exp,
          concat = [],
          expressionPositions = [];

      while (index < textLength) {
        if (((startIndex = text.indexOf(startSymbol, index)) !== -1) &&
             ((endIndex = text.indexOf(endSymbol, startIndex + startSymbolLength)) !== -1)) {
          if (index !== startIndex) {
            concat.push(unescapeText(text.substring(index, startIndex)));
          }
          exp = text.substring(startIndex + startSymbolLength, endIndex);
          expressions.push(exp);
          parseFns.push($parse(exp, parseStringifyInterceptor));
          index = endIndex + endSymbolLength;
          expressionPositions.push(concat.length);
          concat.push('');
        } else {
          // we did not find an interpolation, so we have to add the remainder to the separators array
          if (index !== textLength) {
            concat.push(unescapeText(text.substring(index)));
          }
          break;
        }
      }

      
      if (trustedContext && concat.length > 1) {
          $interpolateMinErr.throwNoconcat(text);
      }

      if (!mustHaveExpression || expressions.length) {
        var compute = function(values) {
          for (var i = 0, ii = expressions.length; i < ii; i++) {
            if (allOrNothing && isUndefined(values[i])) return;
            concat[expressionPositions[i]] = values[i];
          }
          return concat.join('');
        };

        var getValue = function(value) {
          return trustedContext ?
            $sce.getTrusted(trustedContext, value) :
            $sce.valueOf(value);
        };

        return extend(function interpolationFn(context) {
            var i = 0;
            var ii = expressions.length;
            var values = new Array(ii);

            try {
              for (; i < ii; i++) {
                values[i] = parseFns[i](context);
              }

              return compute(values);
            } catch (err) {
              $exceptionHandler($interpolateMinErr.interr(text, err));
            }

          }, {
    
          exp: text,
          expressions: expressions,
          $$watchDelegate: function(scope, listener) {
            var lastValue;
            return scope.$watchGroup(parseFns, /** @this */ function interpolateFnWatcher(values, oldValues) {
              var currValue = compute(values);
              if (isFunction(listener)) {
                listener.call(this, currValue, values !== oldValues ? lastValue : currValue, scope);
              }
              lastValue = currValue;
            });
          }
        });
      }

      function parseStringifyInterceptor(value) {
        try {
          value = getValue(value);
          return allOrNothing && !isDefined(value) ? value : stringify(value);
        } catch (err) {
          $exceptionHandler($interpolateMinErr.interr(text, err));
        }
      }
    }


  
    $interpolate.startSymbol = function() {
      return startSymbol;
    };


  
    $interpolate.endSymbol = function() {
      return endSymbol;
    };

    return $interpolate;
  }];
}

/** @this */
function $IntervalProvider() {
  this.$get = ['$rootScope', '$window', '$q', '$$q', '$browser',
       function($rootScope,   $window,   $q,   $$q,   $browser) {
    var intervals = {};


    function interval(fn, delay, count, invokeApply) {
      var hasParams = arguments.length > 4,
          args = hasParams ? sliceArgs(arguments, 4) : [],
          setInterval = $window.setInterval,
          clearInterval = $window.clearInterval,
          iteration = 0,
          skipApply = (isDefined(invokeApply) && !invokeApply),
          deferred = (skipApply ? $$q : $q).defer(),
          promise = deferred.promise;

      count = isDefined(count) ? count : 0;

      promise.$$intervalId = setInterval(function tick() {
        if (skipApply) {
          $browser.defer(callback);
        } else {
          $rootScope.$evalAsync(callback);
        }
        deferred.notify(iteration++);

        if (count > 0 && iteration >= count) {
          deferred.resolve(iteration);
          clearInterval(promise.$$intervalId);
          delete intervals[promise.$$intervalId];
        }

        if (!skipApply) $rootScope.$apply();

      }, delay);

      intervals[promise.$$intervalId] = deferred;

      return promise;

      function callback() {
        if (!hasParams) {
          fn(iteration);
        } else {
          fn.apply(null, args);
        }
      }
    }


    interval.cancel = function(promise) {
      if (promise && promise.$$intervalId in intervals) {
  
        intervals[promise.$$intervalId].promise.catch(noop);
        intervals[promise.$$intervalId].reject('canceled');
        $window.clearInterval(promise.$$intervalId);
        delete intervals[promise.$$intervalId];
        return true;
      }
      return false;
    };

    return interval;
  }];
}


var $jsonpCallbacksProvider = /** @this */ function() {
  this.$get = ['$window', function($window) {
    var callbacks = $window.angular.callbacks;
    var callbackMap = {};

    function createCallback(callbackId) {
      var callback = function(data) {
        callback.data = data;
        callback.called = true;
      };
      callback.id = callbackId;
      return callback;
    }

    return {
      
      createCallback: function(url) {
        var callbackId = '_' + (callbacks.$$counter++).toString(36);
        var callbackPath = 'angular.callbacks.' + callbackId;
        var callback = createCallback(callbackId);
        callbackMap[callbackPath] = callbacks[callbackId] = callback;
        return callbackPath;
      },
    
      wasCalled: function(callbackPath) {
        return callbackMap[callbackPath].called;
      },
     
      getResponse: function(callbackPath) {
        return callbackMap[callbackPath].data;
      },
     
      removeCallback: function(callbackPath) {
        var callback = callbackMap[callbackPath];
        delete callbacks[callback.id];
        delete callbackMap[callbackPath];
      }
    };
  }];
};



var PATH_MATCH = /^([^?#]*)(\?([^#]*))?(#(.*))?$/,
    DEFAULT_PORTS = {'http': 80, 'https': 443, 'ftp': 21};
var $locationMinErr = minErr('$location');



function encodePath(path) {
  var segments = path.split('/'),
      i = segments.length;

  while (i--) {
    segments[i] = encodeUriSegment(segments[i]);
  }

  return segments.join('/');
}

function parseAbsoluteUrl(absoluteUrl, locationObj) {
  var parsedUrl = urlResolve(absoluteUrl);

  locationObj.$$protocol = parsedUrl.protocol;
  locationObj.$$host = parsedUrl.hostname;
  locationObj.$$port = toInt(parsedUrl.port) || DEFAULT_PORTS[parsedUrl.protocol] || null;
}

var DOUBLE_SLASH_REGEX = /^\s*[\\/]{2,}/;
function parseAppUrl(url, locationObj) {

  if (DOUBLE_SLASH_REGEX.test(url)) {
    throw $locationMinErr('badpath', 'Invalid url "{0}".', url);
  }

  var prefixed = (url.charAt(0) !== '/');
  if (prefixed) {
    url = '/' + url;
  }
  var match = urlResolve(url);
  locationObj.$$path = decodeURIComponent(prefixed && match.pathname.charAt(0) === '/' ?
      match.pathname.substring(1) : match.pathname);
  locationObj.$$search = parseKeyValue(match.search);
  locationObj.$$hash = decodeURIComponent(match.hash);


  if (locationObj.$$path && locationObj.$$path.charAt(0) !== '/') {
    locationObj.$$path = '/' + locationObj.$$path;
  }
}

function startsWith(str, search) {
  return str.slice(0, search.length) === search;
}


function stripBaseUrl(base, url) {
  if (startsWith(url, base)) {
    return url.substr(base.length);
  }
}


function stripHash(url) {
  var index = url.indexOf('#');
  return index === -1 ? url : url.substr(0, index);
}

function trimEmptyHash(url) {
  return url.replace(/(#.+)|#$/, '$1');
}


function stripFile(url) {
  return url.substr(0, stripHash(url).lastIndexOf('/') + 1);
}

/* return the server only (scheme://host:port) */
function serverBase(url) {
  return url.substring(0, url.indexOf('/', url.indexOf('//') + 2));
}



function LocationHtml5Url(appBase, appBaseNoFile, basePrefix) {
  this.$$html5 = true;
  basePrefix = basePrefix || '';
  parseAbsoluteUrl(appBase, this);


 
  this.$$parse = function(url) {
    var pathUrl = stripBaseUrl(appBaseNoFile, url);
    if (!isString(pathUrl)) {
      throw $locationMinErr('ipthprfx', 'Invalid url "{0}", missing path prefix "{1}".', url,
          appBaseNoFile);
    }

    parseAppUrl(pathUrl, this);

    if (!this.$$path) {
      this.$$path = '/';
    }

    this.$$compose();
  };

  
  this.$$compose = function() {
    var search = toKeyValue(this.$$search),
        hash = this.$$hash ? '#' + encodeUriSegment(this.$$hash) : '';

    this.$$url = encodePath(this.$$path) + (search ? '?' + search : '') + hash;
    this.$$absUrl = appBaseNoFile + this.$$url.substr(1); // first char is always '/'
  };

  this.$$parseLinkUrl = function(url, relHref) {
    if (relHref && relHref[0] === '#') {
    
      this.hash(relHref.slice(1));
      return true;
    }
    var appUrl, prevAppUrl;
    var rewrittenUrl;


    if (isDefined(appUrl = stripBaseUrl(appBase, url))) {
      prevAppUrl = appUrl;
      if (basePrefix && isDefined(appUrl = stripBaseUrl(basePrefix, appUrl))) {
        rewrittenUrl = appBaseNoFile + (stripBaseUrl('/', appUrl) || appUrl);
      } else {
        rewrittenUrl = appBase + prevAppUrl;
      }
    } else if (isDefined(appUrl = stripBaseUrl(appBaseNoFile, url))) {
      rewrittenUrl = appBaseNoFile + appUrl;
    } else if (appBaseNoFile === url + '/') {
      rewrittenUrl = appBaseNoFile;
    }
    if (rewrittenUrl) {
      this.$$parse(rewrittenUrl);
    }
    return !!rewrittenUrl;
  };
}


function LocationHashbangUrl(appBase, appBaseNoFile, hashPrefix) {

  parseAbsoluteUrl(appBase, this);


 
  this.$$parse = function(url) {
    var withoutBaseUrl = stripBaseUrl(appBase, url) || stripBaseUrl(appBaseNoFile, url);
    var withoutHashUrl;

    if (!isUndefined(withoutBaseUrl) && withoutBaseUrl.charAt(0) === '#') {

    
      withoutHashUrl = stripBaseUrl(hashPrefix, withoutBaseUrl);
      if (isUndefined(withoutHashUrl)) {
        // There was no hashbang prefix so we just have a hash fragment
        withoutHashUrl = withoutBaseUrl;
      }

    } else {
   
      if (this.$$html5) {
        withoutHashUrl = withoutBaseUrl;
      } else {
        withoutHashUrl = '';
        if (isUndefined(withoutBaseUrl)) {
          appBase = url;
          this.replace();
        }
      }
    }

    parseAppUrl(withoutHashUrl, this);

    this.$$path = removeWindowsDriveName(this.$$path, withoutHashUrl, appBase);

    this.$$compose();

   
    function removeWindowsDriveName(path, url, base) {
    
      var windowsFilePathExp = /^\/[A-Z]:(\/.*)/;

      var firstPathSegmentMatch;

   
      if (startsWith(url, base)) {
        url = url.replace(base, '');
      }

   
      if (windowsFilePathExp.exec(url)) {
        return path;
      }

      firstPathSegmentMatch = windowsFilePathExp.exec(path);
      return firstPathSegmentMatch ? firstPathSegmentMatch[1] : path;
    }
  };

 
  this.$$compose = function() {
    var search = toKeyValue(this.$$search),
        hash = this.$$hash ? '#' + encodeUriSegment(this.$$hash) : '';

    this.$$url = encodePath(this.$$path) + (search ? '?' + search : '') + hash;
    this.$$absUrl = appBase + (this.$$url ? hashPrefix + this.$$url : '');
  };

  this.$$parseLinkUrl = function(url, relHref) {
    if (stripHash(appBase) === stripHash(url)) {
      this.$$parse(url);
      return true;
    }
    return false;
  };
}



function LocationHashbangInHtml5Url(appBase, appBaseNoFile, hashPrefix) {
  this.$$html5 = true;
  LocationHashbangUrl.apply(this, arguments);

  this.$$parseLinkUrl = function(url, relHref) {
    if (relHref && relHref[0] === '#') {
  
      this.hash(relHref.slice(1));
      return true;
    }

    var rewrittenUrl;
    var appUrl;

    if (appBase === stripHash(url)) {
      rewrittenUrl = url;
    } else if ((appUrl = stripBaseUrl(appBaseNoFile, url))) {
      rewrittenUrl = appBase + hashPrefix + appUrl;
    } else if (appBaseNoFile === url + '/') {
      rewrittenUrl = appBaseNoFile;
    }
    if (rewrittenUrl) {
      this.$$parse(rewrittenUrl);
    }
    return !!rewrittenUrl;
  };

  this.$$compose = function() {
    var search = toKeyValue(this.$$search),
        hash = this.$$hash ? '#' + encodeUriSegment(this.$$hash) : '';

    this.$$url = encodePath(this.$$path) + (search ? '?' + search : '') + hash;
    // include hashPrefix in $$absUrl when $$url is empty so IE9 does not reload page because of removal of '#'
    this.$$absUrl = appBase + hashPrefix + this.$$url;
  };

}


var locationPrototype = {

  $$absUrl:'',

  $$html5: false,

 
  $$replace: false,

 
  absUrl: locationGetter('$$absUrl'),

  
  url: function(url) {
    if (isUndefined(url)) {
      return this.$$url;
    }

    var match = PATH_MATCH.exec(url);
    if (match[1] || url === '') this.path(decodeURIComponent(match[1]));
    if (match[2] || match[1] || url === '') this.search(match[3] || '');
    this.hash(match[5] || '');

    return this;
  },

 
  protocol: locationGetter('$$protocol'),

  
  host: locationGetter('$$host'),

 
  port: locationGetter('$$port'),

 
  path: locationGetterSetter('$$path', function(path) {
    path = path !== null ? path.toString() : '';
    return path.charAt(0) === '/' ? path : '/' + path;
  }),

  
  search: function(search, paramValue) {
    switch (arguments.length) {
      case 0:
        return this.$$search;
      case 1:
        if (isString(search) || isNumber(search)) {
          search = search.toString();
          this.$$search = parseKeyValue(search);
        } else if (isObject(search)) {
          search = copy(search, {});
          // remove object undefined or null properties
          forEach(search, function(value, key) {
            if (value == null) delete search[key];
          });

          this.$$search = search;
        } else {
          throw $locationMinErr('isrcharg',
              'The first argument of the `$location#search()` call must be a string or an object.');
        }
        break;
      default:
        if (isUndefined(paramValue) || paramValue === null) {
          delete this.$$search[search];
        } else {
          this.$$search[search] = paramValue;
        }
    }

    this.$$compose();
    return this;
  },

  
  hash: locationGetterSetter('$$hash', function(hash) {
    return hash !== null ? hash.toString() : '';
  }),

 
  replace: function() {
    this.$$replace = true;
    return this;
  }
};

forEach([LocationHashbangInHtml5Url, LocationHashbangUrl, LocationHtml5Url], function(Location) {
  Location.prototype = Object.create(locationPrototype);

  Location.prototype.state = function(state) {
    if (!arguments.length) {
      return this.$$state;
    }

    if (Location !== LocationHtml5Url || !this.$$html5) {
      throw $locationMinErr('nostate', 'History API state support is available only ' +
        'in HTML5 mode and only in browsers supporting HTML5 History API');
    }
 
    this.$$state = isUndefined(state) ? null : state;

    return this;
  };
});


function locationGetter(property) {
  return /** @this */ function() {
    return this[property];
  };
}


function locationGetterSetter(property, preprocess) {
  return /** @this */ function(value) {
    if (isUndefined(value)) {
      return this[property];
    }

    this[property] = preprocess(value);
    this.$$compose();

    return this;
  };
}



function $LocationProvider() {
  var hashPrefix = '!',
      html5Mode = {
        enabled: false,
        requireBase: true,
        rewriteLinks: true
      };

 
  this.hashPrefix = function(prefix) {
    if (isDefined(prefix)) {
      hashPrefix = prefix;
      return this;
    } else {
      return hashPrefix;
    }
  };

  
  this.html5Mode = function(mode) {
    if (isBoolean(mode)) {
      html5Mode.enabled = mode;
      return this;
    } else if (isObject(mode)) {

      if (isBoolean(mode.enabled)) {
        html5Mode.enabled = mode.enabled;
      }

      if (isBoolean(mode.requireBase)) {
        html5Mode.requireBase = mode.requireBase;
      }

      if (isBoolean(mode.rewriteLinks) || isString(mode.rewriteLinks)) {
        html5Mode.rewriteLinks = mode.rewriteLinks;
      }

      return this;
    } else {
      return html5Mode;
    }
  };


  this.$get = ['$rootScope', '$browser', '$sniffer', '$rootElement', '$window',
      function($rootScope, $browser, $sniffer, $rootElement, $window) {
    var $location,
        LocationMode,
        baseHref = $browser.baseHref(), // if base[href] is undefined, it defaults to ''
        initialUrl = $browser.url(),
        appBase;

    if (html5Mode.enabled) {
      if (!baseHref && html5Mode.requireBase) {
        throw $locationMinErr('nobase',
          '$location in HTML5 mode requires a <base> tag to be present!');
      }
      appBase = serverBase(initialUrl) + (baseHref || '/');
      LocationMode = $sniffer.history ? LocationHtml5Url : LocationHashbangInHtml5Url;
    } else {
      appBase = stripHash(initialUrl);
      LocationMode = LocationHashbangUrl;
    }
    var appBaseNoFile = stripFile(appBase);

    $location = new LocationMode(appBase, appBaseNoFile, '#' + hashPrefix);
    $location.$$parseLinkUrl(initialUrl, initialUrl);

    $location.$$state = $browser.state();

    var IGNORE_URI_REGEXP = /^\s*(javascript|mailto):/i;

    function setBrowserUrlWithFallback(url, replace, state) {
      var oldUrl = $location.url();
      var oldState = $location.$$state;
      try {
        $browser.url(url, replace, state);

     
        $location.$$state = $browser.state();
      } catch (e) {
   
        $location.url(oldUrl);
        $location.$$state = oldState;

        throw e;
      }
    }

    $rootElement.on('click', function(event) {
      var rewriteLinks = html5Mode.rewriteLinks;
   

      if (!rewriteLinks || event.ctrlKey || event.metaKey || event.shiftKey || event.which === 2 || event.button === 2) return;

      var elm = jqLite(event.target);

      // traverse the DOM up to find first A tag
      while (nodeName_(elm[0]) !== 'a') {
        // ignore rewriting if no A tag (reached root element, or no parent - removed from document)
        if (elm[0] === $rootElement[0] || !(elm = elm.parent())[0]) return;
      }

      if (isString(rewriteLinks) && isUndefined(elm.attr(rewriteLinks))) return;

      var absHref = elm.prop('href');
   
      var relHref = elm.attr('href') || elm.attr('xlink:href');

      if (isObject(absHref) && absHref.toString() === '[object SVGAnimatedString]') {
     
        absHref = urlResolve(absHref.animVal).href;
      }

    
      if (IGNORE_URI_REGEXP.test(absHref)) return;

      if (absHref && !elm.attr('target') && !event.isDefaultPrevented()) {
        if ($location.$$parseLinkUrl(absHref, relHref)) {
        
          event.preventDefault();
   
          if ($location.absUrl() !== $browser.url()) {
            $rootScope.$apply();
      
            $window.angular['ff-684208-preventDefault'] = true;
          }
        }
      }
    });


  
    if (trimEmptyHash($location.absUrl()) !== trimEmptyHash(initialUrl)) {
      $browser.url($location.absUrl(), true);
    }

    var initializing = true;

 
    $browser.onUrlChange(function(newUrl, newState) {

      if (!startsWith(newUrl, appBaseNoFile)) {
        $window.location.href = newUrl;
        return;
      }

      $rootScope.$evalAsync(function() {
        var oldUrl = $location.absUrl();
        var oldState = $location.$$state;
        var defaultPrevented;
        newUrl = trimEmptyHash(newUrl);
        $location.$$parse(newUrl);
        $location.$$state = newState;

        defaultPrevented = $rootScope.$broadcast('$locationChangeStart', newUrl, oldUrl,
            newState, oldState).defaultPrevented;

        
        if ($location.absUrl() !== newUrl) return;

        if (defaultPrevented) {
          $location.$$parse(oldUrl);
          $location.$$state = oldState;
          setBrowserUrlWithFallback(oldUrl, false, oldState);
        } else {
          initializing = false;
          afterLocationChange(oldUrl, oldState);
        }
      });
      if (!$rootScope.$$phase) $rootScope.$digest();
    });

    // update browser
    $rootScope.$watch(function $locationWatch() {
      var oldUrl = trimEmptyHash($browser.url());
      var newUrl = trimEmptyHash($location.absUrl());
      var oldState = $browser.state();
      var currentReplace = $location.$$replace;
      var urlOrStateChanged = oldUrl !== newUrl ||
        ($location.$$html5 && $sniffer.history && oldState !== $location.$$state);

      if (initializing || urlOrStateChanged) {
        initializing = false;

        $rootScope.$evalAsync(function() {
          var newUrl = $location.absUrl();
          var defaultPrevented = $rootScope.$broadcast('$locationChangeStart', newUrl, oldUrl,
              $location.$$state, oldState).defaultPrevented;

          if ($location.absUrl() !== newUrl) return;

          if (defaultPrevented) {
            $location.$$parse(oldUrl);
            $location.$$state = oldState;
          } else {
            if (urlOrStateChanged) {
              setBrowserUrlWithFallback(newUrl, currentReplace,
                                        oldState === $location.$$state ? null : $location.$$state);
            }
            afterLocationChange(oldUrl, oldState);
          }
        });
      }

      $location.$$replace = false;

    });

    return $location;

    function afterLocationChange(oldUrl, oldState) {
      $rootScope.$broadcast('$locationChangeSuccess', $location.absUrl(), oldUrl,
        $location.$$state, oldState);
    }
}];
}


function $LogProvider() {
  var debug = true,
      self = this;


  this.debugEnabled = function(flag) {
    if (isDefined(flag)) {
      debug = flag;
    return this;
    } else {
      return debug;
    }
  };

  this.$get = ['$window', function($window) {
    return {
  
      log: consoleLog('log'),

      info: consoleLog('info'),

      warn: consoleLog('warn'),

  
      error: consoleLog('error'),


      debug: (function() {
        var fn = consoleLog('debug');

        return function() {
          if (debug) {
            fn.apply(self, arguments);
          }
        };
      })()
    };

    function formatError(arg) {
      if (arg instanceof Error) {
        if (arg.stack) {
          arg = (arg.message && arg.stack.indexOf(arg.message) === -1)
              ? 'Error: ' + arg.message + '\n' + arg.stack
              : arg.stack;
        } else if (arg.sourceURL) {
          arg = arg.message + '\n' + arg.sourceURL + ':' + arg.line;
        }
      }
      return arg;
    }

    function consoleLog(type) {
      var console = $window.console || {},
          logFn = console[type] || console.log || noop,
          hasApply = false;

    
      try {
        hasApply = !!logFn.apply;
      } catch (e) { /* empty */ }

      if (hasApply) {
        return function() {
          var args = [];
          forEach(arguments, function(arg) {
            args.push(formatError(arg));
          });
          return logFn.apply(console, args);
        };
      }


      return function(arg1, arg2) {
        logFn(arg1, arg2 == null ? '' : arg2);
      };
    }
  }];
}


var $parseMinErr = minErr('$parse');

var objectValueOf = {}.constructor.prototype.valueOf;



function getStringValue(name) {

  return name + '';
}


var OPERATORS = createMap();
forEach('+ - * / % === !== == != < > <= >= && || ! = |'.split(' '), function(operator) { OPERATORS[operator] = true; });
var ESCAPE = {'n':'\n', 'f':'\f', 'r':'\r', 't':'\t', 'v':'\v', '\'':'\'', '"':'"'};


var Lexer = function Lexer(options) {
  this.options = options;
};

Lexer.prototype = {
  constructor: Lexer,

  lex: function(text) {
    this.text = text;
    this.index = 0;
    this.tokens = [];

    while (this.index < this.text.length) {
      var ch = this.text.charAt(this.index);
      if (ch === '"' || ch === '\'') {
        this.readString(ch);
      } else if (this.isNumber(ch) || ch === '.' && this.isNumber(this.peek())) {
        this.readNumber();
      } else if (this.isIdentifierStart(this.peekMultichar())) {
        this.readIdent();
      } else if (this.is(ch, '(){}[].,;:?')) {
        this.tokens.push({index: this.index, text: ch});
        this.index++;
      } else if (this.isWhitespace(ch)) {
        this.index++;
      } else {
        var ch2 = ch + this.peek();
        var ch3 = ch2 + this.peek(2);
        var op1 = OPERATORS[ch];
        var op2 = OPERATORS[ch2];
        var op3 = OPERATORS[ch3];
        if (op1 || op2 || op3) {
          var token = op3 ? ch3 : (op2 ? ch2 : ch);
          this.tokens.push({index: this.index, text: token, operator: true});
          this.index += token.length;
        } else {
          this.throwError('Unexpected next character ', this.index, this.index + 1);
        }
      }
    }
    return this.tokens;
  },

  is: function(ch, chars) {
    return chars.indexOf(ch) !== -1;
  },

  peek: function(i) {
    var num = i || 1;
    return (this.index + num < this.text.length) ? this.text.charAt(this.index + num) : false;
  },

  isNumber: function(ch) {
    return ('0' <= ch && ch <= '9') && typeof ch === 'string';
  },

  isWhitespace: function(ch) {
    // IE treats non-breaking space as \u00A0
    return (ch === ' ' || ch === '\r' || ch === '\t' ||
            ch === '\n' || ch === '\v' || ch === '\u00A0');
  },

  isIdentifierStart: function(ch) {
    return this.options.isIdentifierStart ?
        this.options.isIdentifierStart(ch, this.codePointAt(ch)) :
        this.isValidIdentifierStart(ch);
  },

  isValidIdentifierStart: function(ch) {
    return ('a' <= ch && ch <= 'z' ||
            'A' <= ch && ch <= 'Z' ||
            '_' === ch || ch === '$');
  },

  isIdentifierContinue: function(ch) {
    return this.options.isIdentifierContinue ?
        this.options.isIdentifierContinue(ch, this.codePointAt(ch)) :
        this.isValidIdentifierContinue(ch);
  },

  isValidIdentifierContinue: function(ch, cp) {
    return this.isValidIdentifierStart(ch, cp) || this.isNumber(ch);
  },

  codePointAt: function(ch) {
    if (ch.length === 1) return ch.charCodeAt(0);
    // eslint-disable-next-line no-bitwise
    return (ch.charCodeAt(0) << 10) + ch.charCodeAt(1) - 0x35FDC00;
  },

  peekMultichar: function() {
    var ch = this.text.charAt(this.index);
    var peek = this.peek();
    if (!peek) {
      return ch;
    }
    var cp1 = ch.charCodeAt(0);
    var cp2 = peek.charCodeAt(0);
    if (cp1 >= 0xD800 && cp1 <= 0xDBFF && cp2 >= 0xDC00 && cp2 <= 0xDFFF) {
      return ch + peek;
    }
    return ch;
  },

  isExpOperator: function(ch) {
    return (ch === '-' || ch === '+' || this.isNumber(ch));
  },

  throwError: function(error, start, end) {
    end = end || this.index;
    var colStr = (isDefined(start)
            ? 's ' + start +  '-' + this.index + ' [' + this.text.substring(start, end) + ']'
            : ' ' + end);
    throw $parseMinErr('lexerr', 'Lexer Error: {0} at column{1} in expression [{2}].',
        error, colStr, this.text);
  },

  readNumber: function() {
    var number = '';
    var start = this.index;
    while (this.index < this.text.length) {
      var ch = lowercase(this.text.charAt(this.index));
      if (ch === '.' || this.isNumber(ch)) {
        number += ch;
      } else {
        var peekCh = this.peek();
        if (ch === 'e' && this.isExpOperator(peekCh)) {
          number += ch;
        } else if (this.isExpOperator(ch) &&
            peekCh && this.isNumber(peekCh) &&
            number.charAt(number.length - 1) === 'e') {
          number += ch;
        } else if (this.isExpOperator(ch) &&
            (!peekCh || !this.isNumber(peekCh)) &&
            number.charAt(number.length - 1) === 'e') {
          this.throwError('Invalid exponent');
        } else {
          break;
        }
      }
      this.index++;
    }
    this.tokens.push({
      index: start,
      text: number,
      constant: true,
      value: Number(number)
    });
  },

  readIdent: function() {
    var start = this.index;
    this.index += this.peekMultichar().length;
    while (this.index < this.text.length) {
      var ch = this.peekMultichar();
      if (!this.isIdentifierContinue(ch)) {
        break;
      }
      this.index += ch.length;
    }
    this.tokens.push({
      index: start,
      text: this.text.slice(start, this.index),
      identifier: true
    });
  },

  readString: function(quote) {
    var start = this.index;
    this.index++;
    var string = '';
    var rawString = quote;
    var escape = false;
    while (this.index < this.text.length) {
      var ch = this.text.charAt(this.index);
      rawString += ch;
      if (escape) {
        if (ch === 'u') {
          var hex = this.text.substring(this.index + 1, this.index + 5);
          if (!hex.match(/[\da-f]{4}/i)) {
            this.throwError('Invalid unicode escape [\\u' + hex + ']');
          }
          this.index += 4;
          string += String.fromCharCode(parseInt(hex, 16));
        } else {
          var rep = ESCAPE[ch];
          string = string + (rep || ch);
        }
        escape = false;
      } else if (ch === '\\') {
        escape = true;
      } else if (ch === quote) {
        this.index++;
        this.tokens.push({
          index: start,
          text: rawString,
          constant: true,
          value: string
        });
        return;
      } else {
        string += ch;
      }
      this.index++;
    }
    this.throwError('Unterminated quote', start);
  }
};

var AST = function AST(lexer, options) {
  this.lexer = lexer;
  this.options = options;
};

AST.Program = 'Program';
AST.ExpressionStatement = 'ExpressionStatement';
AST.AssignmentExpression = 'AssignmentExpression';
AST.ConditionalExpression = 'ConditionalExpression';
AST.LogicalExpression = 'LogicalExpression';
AST.BinaryExpression = 'BinaryExpression';
AST.UnaryExpression = 'UnaryExpression';
AST.CallExpression = 'CallExpression';
AST.MemberExpression = 'MemberExpression';
AST.Identifier = 'Identifier';
AST.Literal = 'Literal';
AST.ArrayExpression = 'ArrayExpression';
AST.Property = 'Property';
AST.ObjectExpression = 'ObjectExpression';
AST.ThisExpression = 'ThisExpression';
AST.LocalsExpression = 'LocalsExpression';

// Internal use only
AST.NGValueParameter = 'NGValueParameter';

AST.prototype = {
  ast: function(text) {
    this.text = text;
    this.tokens = this.lexer.lex(text);

    var value = this.program();

    if (this.tokens.length !== 0) {
      this.throwError('is an unexpected token', this.tokens[0]);
    }

    return value;
  },

  program: function() {
    var body = [];
    while (true) {
      if (this.tokens.length > 0 && !this.peek('}', ')', ';', ']'))
        body.push(this.expressionStatement());
      if (!this.expect(';')) {
        return { type: AST.Program, body: body};
      }
    }
  },

  expressionStatement: function() {
    return { type: AST.ExpressionStatement, expression: this.filterChain() };
  },

  filterChain: function() {
    var left = this.expression();
    while (this.expect('|')) {
      left = this.filter(left);
    }
    return left;
  },

  expression: function() {
    return this.assignment();
  },

  assignment: function() {
    var result = this.ternary();
    if (this.expect('=')) {
      if (!isAssignable(result)) {
        throw $parseMinErr('lval', 'Trying to assign a value to a non l-value');
      }

      result = { type: AST.AssignmentExpression, left: result, right: this.assignment(), operator: '='};
    }
    return result;
  },

  ternary: function() {
    var test = this.logicalOR();
    var alternate;
    var consequent;
    if (this.expect('?')) {
      alternate = this.expression();
      if (this.consume(':')) {
        consequent = this.expression();
        return { type: AST.ConditionalExpression, test: test, alternate: alternate, consequent: consequent};
      }
    }
    return test;
  },

  logicalOR: function() {
    var left = this.logicalAND();
    while (this.expect('||')) {
      left = { type: AST.LogicalExpression, operator: '||', left: left, right: this.logicalAND() };
    }
    return left;
  },

  logicalAND: function() {
    var left = this.equality();
    while (this.expect('&&')) {
      left = { type: AST.LogicalExpression, operator: '&&', left: left, right: this.equality()};
    }
    return left;
  },

  equality: function() {
    var left = this.relational();
    var token;
    while ((token = this.expect('==','!=','===','!=='))) {
      left = { type: AST.BinaryExpression, operator: token.text, left: left, right: this.relational() };
    }
    return left;
  },

  relational: function() {
    var left = this.additive();
    var token;
    while ((token = this.expect('<', '>', '<=', '>='))) {
      left = { type: AST.BinaryExpression, operator: token.text, left: left, right: this.additive() };
    }
    return left;
  },

  additive: function() {
    var left = this.multiplicative();
    var token;
    while ((token = this.expect('+','-'))) {
      left = { type: AST.BinaryExpression, operator: token.text, left: left, right: this.multiplicative() };
    }
    return left;
  },

  multiplicative: function() {
    var left = this.unary();
    var token;
    while ((token = this.expect('*','/','%'))) {
      left = { type: AST.BinaryExpression, operator: token.text, left: left, right: this.unary() };
    }
    return left;
  },

  unary: function() {
    var token;
    if ((token = this.expect('+', '-', '!'))) {
      return { type: AST.UnaryExpression, operator: token.text, prefix: true, argument: this.unary() };
    } else {
      return this.primary();
    }
  },

  primary: function() {
    var primary;
    if (this.expect('(')) {
      primary = this.filterChain();
      this.consume(')');
    } else if (this.expect('[')) {
      primary = this.arrayDeclaration();
    } else if (this.expect('{')) {
      primary = this.object();
    } else if (this.selfReferential.hasOwnProperty(this.peek().text)) {
      primary = copy(this.selfReferential[this.consume().text]);
    } else if (this.options.literals.hasOwnProperty(this.peek().text)) {
      primary = { type: AST.Literal, value: this.options.literals[this.consume().text]};
    } else if (this.peek().identifier) {
      primary = this.identifier();
    } else if (this.peek().constant) {
      primary = this.constant();
    } else {
      this.throwError('not a primary expression', this.peek());
    }

    var next;
    while ((next = this.expect('(', '[', '.'))) {
      if (next.text === '(') {
        primary = {type: AST.CallExpression, callee: primary, arguments: this.parseArguments() };
        this.consume(')');
      } else if (next.text === '[') {
        primary = { type: AST.MemberExpression, object: primary, property: this.expression(), computed: true };
        this.consume(']');
      } else if (next.text === '.') {
        primary = { type: AST.MemberExpression, object: primary, property: this.identifier(), computed: false };
      } else {
        this.throwError('IMPOSSIBLE');
      }
    }
    return primary;
  },

  filter: function(baseExpression) {
    var args = [baseExpression];
    var result = {type: AST.CallExpression, callee: this.identifier(), arguments: args, filter: true};

    while (this.expect(':')) {
      args.push(this.expression());
    }

    return result;
  },

  parseArguments: function() {
    var args = [];
    if (this.peekToken().text !== ')') {
      do {
        args.push(this.filterChain());
      } while (this.expect(','));
    }
    return args;
  },

  identifier: function() {
    var token = this.consume();
    if (!token.identifier) {
      this.throwError('is not a valid identifier', token);
    }
    return { type: AST.Identifier, name: token.text };
  },

  constant: function() {
    // TODO check that it is a constant
    return { type: AST.Literal, value: this.consume().value };
  },

  arrayDeclaration: function() {
    var elements = [];
    if (this.peekToken().text !== ']') {
      do {
        if (this.peek(']')) {
          // Support trailing commas per ES5.1.
          break;
        }
        elements.push(this.expression());
      } while (this.expect(','));
    }
    this.consume(']');

    return { type: AST.ArrayExpression, elements: elements };
  },

  object: function() {
    var properties = [], property;
    if (this.peekToken().text !== '}') {
      do {
        if (this.peek('}')) {
          // Support trailing commas per ES5.1.
          break;
        }
        property = {type: AST.Property, kind: 'init'};
        if (this.peek().constant) {
          property.key = this.constant();
          property.computed = false;
          this.consume(':');
          property.value = this.expression();
        } else if (this.peek().identifier) {
          property.key = this.identifier();
          property.computed = false;
          if (this.peek(':')) {
            this.consume(':');
            property.value = this.expression();
          } else {
            property.value = property.key;
          }
        } else if (this.peek('[')) {
          this.consume('[');
          property.key = this.expression();
          this.consume(']');
          property.computed = true;
          this.consume(':');
          property.value = this.expression();
        } else {
          this.throwError('invalid key', this.peek());
        }
        properties.push(property);
      } while (this.expect(','));
    }
    this.consume('}');

    return {type: AST.ObjectExpression, properties: properties };
  },

  throwError: function(msg, token) {
    throw $parseMinErr('syntax',
        'Syntax Error: Token \'{0}\' {1} at column {2} of the expression [{3}] starting at [{4}].',
          token.text, msg, (token.index + 1), this.text, this.text.substring(token.index));
  },

  consume: function(e1) {
    if (this.tokens.length === 0) {
      throw $parseMinErr('ueoe', 'Unexpected end of expression: {0}', this.text);
    }

    var token = this.expect(e1);
    if (!token) {
      this.throwError('is unexpected, expecting [' + e1 + ']', this.peek());
    }
    return token;
  },

  peekToken: function() {
    if (this.tokens.length === 0) {
      throw $parseMinErr('ueoe', 'Unexpected end of expression: {0}', this.text);
    }
    return this.tokens[0];
  },

  peek: function(e1, e2, e3, e4) {
    return this.peekAhead(0, e1, e2, e3, e4);
  },

  peekAhead: function(i, e1, e2, e3, e4) {
    if (this.tokens.length > i) {
      var token = this.tokens[i];
      var t = token.text;
      if (t === e1 || t === e2 || t === e3 || t === e4 ||
          (!e1 && !e2 && !e3 && !e4)) {
        return token;
      }
    }
    return false;
  },

  expect: function(e1, e2, e3, e4) {
    var token = this.peek(e1, e2, e3, e4);
    if (token) {
      this.tokens.shift();
      return token;
    }
    return false;
  },

  selfReferential: {
    'this': {type: AST.ThisExpression },
    '$locals': {type: AST.LocalsExpression }
  }
};

function ifDefined(v, d) {
  return typeof v !== 'undefined' ? v : d;
}

function plusFn(l, r) {
  if (typeof l === 'undefined') return r;
  if (typeof r === 'undefined') return l;
  return l + r;
}

function isStateless($filter, filterName) {
  var fn = $filter(filterName);
  return !fn.$stateful;
}

function findConstantAndWatchExpressions(ast, $filter) {
  var allConstants;
  var argsToWatch;
  var isStatelessFilter;
  switch (ast.type) {
  case AST.Program:
    allConstants = true;
    forEach(ast.body, function(expr) {
      findConstantAndWatchExpressions(expr.expression, $filter);
      allConstants = allConstants && expr.expression.constant;
    });
    ast.constant = allConstants;
    break;
  case AST.Literal:
    ast.constant = true;
    ast.toWatch = [];
    break;
  case AST.UnaryExpression:
    findConstantAndWatchExpressions(ast.argument, $filter);
    ast.constant = ast.argument.constant;
    ast.toWatch = ast.argument.toWatch;
    break;
  case AST.BinaryExpression:
    findConstantAndWatchExpressions(ast.left, $filter);
    findConstantAndWatchExpressions(ast.right, $filter);
    ast.constant = ast.left.constant && ast.right.constant;
    ast.toWatch = ast.left.toWatch.concat(ast.right.toWatch);
    break;
  case AST.LogicalExpression:
    findConstantAndWatchExpressions(ast.left, $filter);
    findConstantAndWatchExpressions(ast.right, $filter);
    ast.constant = ast.left.constant && ast.right.constant;
    ast.toWatch = ast.constant ? [] : [ast];
    break;
  case AST.ConditionalExpression:
    findConstantAndWatchExpressions(ast.test, $filter);
    findConstantAndWatchExpressions(ast.alternate, $filter);
    findConstantAndWatchExpressions(ast.consequent, $filter);
    ast.constant = ast.test.constant && ast.alternate.constant && ast.consequent.constant;
    ast.toWatch = ast.constant ? [] : [ast];
    break;
  case AST.Identifier:
    ast.constant = false;
    ast.toWatch = [ast];
    break;
  case AST.MemberExpression:
    findConstantAndWatchExpressions(ast.object, $filter);
    if (ast.computed) {
      findConstantAndWatchExpressions(ast.property, $filter);
    }
    ast.constant = ast.object.constant && (!ast.computed || ast.property.constant);
    ast.toWatch = [ast];
    break;
  case AST.CallExpression:
    isStatelessFilter = ast.filter ? isStateless($filter, ast.callee.name) : false;
    allConstants = isStatelessFilter;
    argsToWatch = [];
    forEach(ast.arguments, function(expr) {
      findConstantAndWatchExpressions(expr, $filter);
      allConstants = allConstants && expr.constant;
      if (!expr.constant) {
        argsToWatch.push.apply(argsToWatch, expr.toWatch);
      }
    });
    ast.constant = allConstants;
    ast.toWatch = isStatelessFilter ? argsToWatch : [ast];
    break;
  case AST.AssignmentExpression:
    findConstantAndWatchExpressions(ast.left, $filter);
    findConstantAndWatchExpressions(ast.right, $filter);
    ast.constant = ast.left.constant && ast.right.constant;
    ast.toWatch = [ast];
    break;
  case AST.ArrayExpression:
    allConstants = true;
    argsToWatch = [];
    forEach(ast.elements, function(expr) {
      findConstantAndWatchExpressions(expr, $filter);
      allConstants = allConstants && expr.constant;
      if (!expr.constant) {
        argsToWatch.push.apply(argsToWatch, expr.toWatch);
      }
    });
    ast.constant = allConstants;
    ast.toWatch = argsToWatch;
    break;
  case AST.ObjectExpression:
    allConstants = true;
    argsToWatch = [];
    forEach(ast.properties, function(property) {
      findConstantAndWatchExpressions(property.value, $filter);
      allConstants = allConstants && property.value.constant && !property.computed;
      if (!property.value.constant) {
        argsToWatch.push.apply(argsToWatch, property.value.toWatch);
      }
    });
    ast.constant = allConstants;
    ast.toWatch = argsToWatch;
    break;
  case AST.ThisExpression:
    ast.constant = false;
    ast.toWatch = [];
    break;
  case AST.LocalsExpression:
    ast.constant = false;
    ast.toWatch = [];
    break;
  }
}

function getInputs(body) {
  if (body.length !== 1) return;
  var lastExpression = body[0].expression;
  var candidate = lastExpression.toWatch;
  if (candidate.length !== 1) return candidate;
  return candidate[0] !== lastExpression ? candidate : undefined;
}

function isAssignable(ast) {
  return ast.type === AST.Identifier || ast.type === AST.MemberExpression;
}

function assignableAST(ast) {
  if (ast.body.length === 1 && isAssignable(ast.body[0].expression)) {
    return {type: AST.AssignmentExpression, left: ast.body[0].expression, right: {type: AST.NGValueParameter}, operator: '='};
  }
}

function isLiteral(ast) {
  return ast.body.length === 0 ||
      ast.body.length === 1 && (
      ast.body[0].expression.type === AST.Literal ||
      ast.body[0].expression.type === AST.ArrayExpression ||
      ast.body[0].expression.type === AST.ObjectExpression);
}

function isConstant(ast) {
  return ast.constant;
}

function ASTCompiler(astBuilder, $filter) {
  this.astBuilder = astBuilder;
  this.$filter = $filter;
}

ASTCompiler.prototype = {
  compile: function(expression) {
    var self = this;
    var ast = this.astBuilder.ast(expression);
    this.state = {
      nextId: 0,
      filters: {},
      fn: {vars: [], body: [], own: {}},
      assign: {vars: [], body: [], own: {}},
      inputs: []
    };
    findConstantAndWatchExpressions(ast, self.$filter);
    var extra = '';
    var assignable;
    this.stage = 'assign';
    if ((assignable = assignableAST(ast))) {
      this.state.computing = 'assign';
      var result = this.nextId();
      this.recurse(assignable, result);
      this.return_(result);
      extra = 'fn.assign=' + this.generateFunction('assign', 's,v,l');
    }
    var toWatch = getInputs(ast.body);
    self.stage = 'inputs';
    forEach(toWatch, function(watch, key) {
      var fnKey = 'fn' + key;
      self.state[fnKey] = {vars: [], body: [], own: {}};
      self.state.computing = fnKey;
      var intoId = self.nextId();
      self.recurse(watch, intoId);
      self.return_(intoId);
      self.state.inputs.push(fnKey);
      watch.watchId = key;
    });
    this.state.computing = 'fn';
    this.stage = 'main';
    this.recurse(ast);
    var fnString =
  
      '"' + this.USE + ' ' + this.STRICT + '";\n' +
      this.filterPrefix() +
      'var fn=' + this.generateFunction('fn', 's,l,a,i') +
      extra +
      this.watchFns() +
      'return fn;';

    // eslint-disable-next-line no-new-func
    var fn = (new Function('$filter',
        'getStringValue',
        'ifDefined',
        'plus',
        fnString))(
          this.$filter,
          getStringValue,
          ifDefined,
          plusFn);
    this.state = this.stage = undefined;
    fn.literal = isLiteral(ast);
    fn.constant = isConstant(ast);
    return fn;
  },

  USE: 'use',

  STRICT: 'strict',

  watchFns: function() {
    var result = [];
    var fns = this.state.inputs;
    var self = this;
    forEach(fns, function(name) {
      result.push('var ' + name + '=' + self.generateFunction(name, 's'));
    });
    if (fns.length) {
      result.push('fn.inputs=[' + fns.join(',') + '];');
    }
    return result.join('');
  },

  generateFunction: function(name, params) {
    return 'function(' + params + '){' +
        this.varsPrefix(name) +
        this.body(name) +
        '};';
  },

  filterPrefix: function() {
    var parts = [];
    var self = this;
    forEach(this.state.filters, function(id, filter) {
      parts.push(id + '=$filter(' + self.escape(filter) + ')');
    });
    if (parts.length) return 'var ' + parts.join(',') + ';';
    return '';
  },

  varsPrefix: function(section) {
    return this.state[section].vars.length ? 'var ' + this.state[section].vars.join(',') + ';' : '';
  },

  body: function(section) {
    return this.state[section].body.join('');
  },

  recurse: function(ast, intoId, nameId, recursionFn, create, skipWatchIdCheck) {
    var left, right, self = this, args, expression, computed;
    recursionFn = recursionFn || noop;
    if (!skipWatchIdCheck && isDefined(ast.watchId)) {
      intoId = intoId || this.nextId();
      this.if_('i',
        this.lazyAssign(intoId, this.computedMember('i', ast.watchId)),
        this.lazyRecurse(ast, intoId, nameId, recursionFn, create, true)
      );
      return;
    }
    switch (ast.type) {
    case AST.Program:
      forEach(ast.body, function(expression, pos) {
        self.recurse(expression.expression, undefined, undefined, function(expr) { right = expr; });
        if (pos !== ast.body.length - 1) {
          self.current().body.push(right, ';');
        } else {
          self.return_(right);
        }
      });
      break;
    case AST.Literal:
      expression = this.escape(ast.value);
      this.assign(intoId, expression);
      recursionFn(intoId || expression);
      break;
    case AST.UnaryExpression:
      this.recurse(ast.argument, undefined, undefined, function(expr) { right = expr; });
      expression = ast.operator + '(' + this.ifDefined(right, 0) + ')';
      this.assign(intoId, expression);
      recursionFn(expression);
      break;
    case AST.BinaryExpression:
      this.recurse(ast.left, undefined, undefined, function(expr) { left = expr; });
      this.recurse(ast.right, undefined, undefined, function(expr) { right = expr; });
      if (ast.operator === '+') {
        expression = this.plus(left, right);
      } else if (ast.operator === '-') {
        expression = this.ifDefined(left, 0) + ast.operator + this.ifDefined(right, 0);
      } else {
        expression = '(' + left + ')' + ast.operator + '(' + right + ')';
      }
      this.assign(intoId, expression);
      recursionFn(expression);
      break;
    case AST.LogicalExpression:
      intoId = intoId || this.nextId();
      self.recurse(ast.left, intoId);
      self.if_(ast.operator === '&&' ? intoId : self.not(intoId), self.lazyRecurse(ast.right, intoId));
      recursionFn(intoId);
      break;
    case AST.ConditionalExpression:
      intoId = intoId || this.nextId();
      self.recurse(ast.test, intoId);
      self.if_(intoId, self.lazyRecurse(ast.alternate, intoId), self.lazyRecurse(ast.consequent, intoId));
      recursionFn(intoId);
      break;
    case AST.Identifier:
      intoId = intoId || this.nextId();
      if (nameId) {
        nameId.context = self.stage === 'inputs' ? 's' : this.assign(this.nextId(), this.getHasOwnProperty('l', ast.name) + '?l:s');
        nameId.computed = false;
        nameId.name = ast.name;
      }
      self.if_(self.stage === 'inputs' || self.not(self.getHasOwnProperty('l', ast.name)),
        function() {
          self.if_(self.stage === 'inputs' || 's', function() {
            if (create && create !== 1) {
              self.if_(
                self.isNull(self.nonComputedMember('s', ast.name)),
                self.lazyAssign(self.nonComputedMember('s', ast.name), '{}'));
            }
            self.assign(intoId, self.nonComputedMember('s', ast.name));
          });
        }, intoId && self.lazyAssign(intoId, self.nonComputedMember('l', ast.name))
        );
      recursionFn(intoId);
      break;
    case AST.MemberExpression:
      left = nameId && (nameId.context = this.nextId()) || this.nextId();
      intoId = intoId || this.nextId();
      self.recurse(ast.object, left, undefined, function() {
        self.if_(self.notNull(left), function() {
          if (ast.computed) {
            right = self.nextId();
            self.recurse(ast.property, right);
            self.getStringValue(right);
            if (create && create !== 1) {
              self.if_(self.not(self.computedMember(left, right)), self.lazyAssign(self.computedMember(left, right), '{}'));
            }
            expression = self.computedMember(left, right);
            self.assign(intoId, expression);
            if (nameId) {
              nameId.computed = true;
              nameId.name = right;
            }
          } else {
            if (create && create !== 1) {
              self.if_(self.isNull(self.nonComputedMember(left, ast.property.name)), self.lazyAssign(self.nonComputedMember(left, ast.property.name), '{}'));
            }
            expression = self.nonComputedMember(left, ast.property.name);
            self.assign(intoId, expression);
            if (nameId) {
              nameId.computed = false;
              nameId.name = ast.property.name;
            }
          }
        }, function() {
          self.assign(intoId, 'undefined');
        });
        recursionFn(intoId);
      }, !!create);
      break;
    case AST.CallExpression:
      intoId = intoId || this.nextId();
      if (ast.filter) {
        right = self.filter(ast.callee.name);
        args = [];
        forEach(ast.arguments, function(expr) {
          var argument = self.nextId();
          self.recurse(expr, argument);
          args.push(argument);
        });
        expression = right + '(' + args.join(',') + ')';
        self.assign(intoId, expression);
        recursionFn(intoId);
      } else {
        right = self.nextId();
        left = {};
        args = [];
        self.recurse(ast.callee, right, left, function() {
          self.if_(self.notNull(right), function() {
            forEach(ast.arguments, function(expr) {
              self.recurse(expr, ast.constant ? undefined : self.nextId(), undefined, function(argument) {
                args.push(argument);
              });
            });
            if (left.name) {
              expression = self.member(left.context, left.name, left.computed) + '(' + args.join(',') + ')';
            } else {
              expression = right + '(' + args.join(',') + ')';
            }
            self.assign(intoId, expression);
          }, function() {
            self.assign(intoId, 'undefined');
          });
          recursionFn(intoId);
        });
      }
      break;
    case AST.AssignmentExpression:
      right = this.nextId();
      left = {};
      this.recurse(ast.left, undefined, left, function() {
        self.if_(self.notNull(left.context), function() {
          self.recurse(ast.right, right);
          expression = self.member(left.context, left.name, left.computed) + ast.operator + right;
          self.assign(intoId, expression);
          recursionFn(intoId || expression);
        });
      }, 1);
      break;
    case AST.ArrayExpression:
      args = [];
      forEach(ast.elements, function(expr) {
        self.recurse(expr, ast.constant ? undefined : self.nextId(), undefined, function(argument) {
          args.push(argument);
        });
      });
      expression = '[' + args.join(',') + ']';
      this.assign(intoId, expression);
      recursionFn(intoId || expression);
      break;
    case AST.ObjectExpression:
      args = [];
      computed = false;
      forEach(ast.properties, function(property) {
        if (property.computed) {
          computed = true;
        }
      });
      if (computed) {
        intoId = intoId || this.nextId();
        this.assign(intoId, '{}');
        forEach(ast.properties, function(property) {
          if (property.computed) {
            left = self.nextId();
            self.recurse(property.key, left);
          } else {
            left = property.key.type === AST.Identifier ?
                       property.key.name :
                       ('' + property.key.value);
          }
          right = self.nextId();
          self.recurse(property.value, right);
          self.assign(self.member(intoId, left, property.computed), right);
        });
      } else {
        forEach(ast.properties, function(property) {
          self.recurse(property.value, ast.constant ? undefined : self.nextId(), undefined, function(expr) {
            args.push(self.escape(
                property.key.type === AST.Identifier ? property.key.name :
                  ('' + property.key.value)) +
                ':' + expr);
          });
        });
        expression = '{' + args.join(',') + '}';
        this.assign(intoId, expression);
      }
      recursionFn(intoId || expression);
      break;
    case AST.ThisExpression:
      this.assign(intoId, 's');
      recursionFn(intoId || 's');
      break;
    case AST.LocalsExpression:
      this.assign(intoId, 'l');
      recursionFn(intoId || 'l');
      break;
    case AST.NGValueParameter:
      this.assign(intoId, 'v');
      recursionFn(intoId || 'v');
      break;
    }
  },

  getHasOwnProperty: function(element, property) {
    var key = element + '.' + property;
    var own = this.current().own;
    if (!own.hasOwnProperty(key)) {
      own[key] = this.nextId(false, element + '&&(' + this.escape(property) + ' in ' + element + ')');
    }
    return own[key];
  },

  assign: function(id, value) {
    if (!id) return;
    this.current().body.push(id, '=', value, ';');
    return id;
  },

  filter: function(filterName) {
    if (!this.state.filters.hasOwnProperty(filterName)) {
      this.state.filters[filterName] = this.nextId(true);
    }
    return this.state.filters[filterName];
  },

  ifDefined: function(id, defaultValue) {
    return 'ifDefined(' + id + ',' + this.escape(defaultValue) + ')';
  },

  plus: function(left, right) {
    return 'plus(' + left + ',' + right + ')';
  },

  return_: function(id) {
    this.current().body.push('return ', id, ';');
  },

  if_: function(test, alternate, consequent) {
    if (test === true) {
      alternate();
    } else {
      var body = this.current().body;
      body.push('if(', test, '){');
      alternate();
      body.push('}');
      if (consequent) {
        body.push('else{');
        consequent();
        body.push('}');
      }
    }
  },

  not: function(expression) {
    return '!(' + expression + ')';
  },

  isNull: function(expression) {
    return expression + '==null';
  },

  notNull: function(expression) {
    return expression + '!=null';
  },

  nonComputedMember: function(left, right) {
    var SAFE_IDENTIFIER = /^[$_a-zA-Z][$_a-zA-Z0-9]*$/;
    var UNSAFE_CHARACTERS = /[^$_a-zA-Z0-9]/g;
    if (SAFE_IDENTIFIER.test(right)) {
      return left + '.' + right;
    } else {
      return left  + '["' + right.replace(UNSAFE_CHARACTERS, this.stringEscapeFn) + '"]';
    }
  },

  computedMember: function(left, right) {
    return left + '[' + right + ']';
  },

  member: function(left, right, computed) {
    if (computed) return this.computedMember(left, right);
    return this.nonComputedMember(left, right);
  },

  getStringValue: function(item) {
    this.assign(item, 'getStringValue(' + item + ')');
  },

  lazyRecurse: function(ast, intoId, nameId, recursionFn, create, skipWatchIdCheck) {
    var self = this;
    return function() {
      self.recurse(ast, intoId, nameId, recursionFn, create, skipWatchIdCheck);
    };
  },

  lazyAssign: function(id, value) {
    var self = this;
    return function() {
      self.assign(id, value);
    };
  },

  stringEscapeRegex: /[^ a-zA-Z0-9]/g,

  stringEscapeFn: function(c) {
    return '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4);
  },

  escape: function(value) {
    if (isString(value)) return '\'' + value.replace(this.stringEscapeRegex, this.stringEscapeFn) + '\'';
    if (isNumber(value)) return value.toString();
    if (value === true) return 'true';
    if (value === false) return 'false';
    if (value === null) return 'null';
    if (typeof value === 'undefined') return 'undefined';

    throw $parseMinErr('esc', 'IMPOSSIBLE');
  },

  nextId: function(skip, init) {
    var id = 'v' + (this.state.nextId++);
    if (!skip) {
      this.current().vars.push(id + (init ? '=' + init : ''));
    }
    return id;
  },

  current: function() {
    return this.state[this.state.computing];
  }
};


function ASTInterpreter(astBuilder, $filter) {
  this.astBuilder = astBuilder;
  this.$filter = $filter;
}

ASTInterpreter.prototype = {
  compile: function(expression) {
    var self = this;
    var ast = this.astBuilder.ast(expression);
    findConstantAndWatchExpressions(ast, self.$filter);
    var assignable;
    var assign;
    if ((assignable = assignableAST(ast))) {
      assign = this.recurse(assignable);
    }
    var toWatch = getInputs(ast.body);
    var inputs;
    if (toWatch) {
      inputs = [];
      forEach(toWatch, function(watch, key) {
        var input = self.recurse(watch);
        watch.input = input;
        inputs.push(input);
        watch.watchId = key;
      });
    }
    var expressions = [];
    forEach(ast.body, function(expression) {
      expressions.push(self.recurse(expression.expression));
    });
    var fn = ast.body.length === 0 ? noop :
             ast.body.length === 1 ? expressions[0] :
             function(scope, locals) {
               var lastValue;
               forEach(expressions, function(exp) {
                 lastValue = exp(scope, locals);
               });
               return lastValue;
             };
    if (assign) {
      fn.assign = function(scope, value, locals) {
        return assign(scope, locals, value);
      };
    }
    if (inputs) {
      fn.inputs = inputs;
    }
    fn.literal = isLiteral(ast);
    fn.constant = isConstant(ast);
    return fn;
  },

  recurse: function(ast, context, create) {
    var left, right, self = this, args;
    if (ast.input) {
      return this.inputs(ast.input, ast.watchId);
    }
    switch (ast.type) {
    case AST.Literal:
      return this.value(ast.value, context);
    case AST.UnaryExpression:
      right = this.recurse(ast.argument);
      return this['unary' + ast.operator](right, context);
    case AST.BinaryExpression:
      left = this.recurse(ast.left);
      right = this.recurse(ast.right);
      return this['binary' + ast.operator](left, right, context);
    case AST.LogicalExpression:
      left = this.recurse(ast.left);
      right = this.recurse(ast.right);
      return this['binary' + ast.operator](left, right, context);
    case AST.ConditionalExpression:
      return this['ternary?:'](
        this.recurse(ast.test),
        this.recurse(ast.alternate),
        this.recurse(ast.consequent),
        context
      );
    case AST.Identifier:
      return self.identifier(ast.name, context, create);
    case AST.MemberExpression:
      left = this.recurse(ast.object, false, !!create);
      if (!ast.computed) {
        right = ast.property.name;
      }
      if (ast.computed) right = this.recurse(ast.property);
      return ast.computed ?
        this.computedMember(left, right, context, create) :
        this.nonComputedMember(left, right, context, create);
    case AST.CallExpression:
      args = [];
      forEach(ast.arguments, function(expr) {
        args.push(self.recurse(expr));
      });
      if (ast.filter) right = this.$filter(ast.callee.name);
      if (!ast.filter) right = this.recurse(ast.callee, true);
      return ast.filter ?
        function(scope, locals, assign, inputs) {
          var values = [];
          for (var i = 0; i < args.length; ++i) {
            values.push(args[i](scope, locals, assign, inputs));
          }
          var value = right.apply(undefined, values, inputs);
          return context ? {context: undefined, name: undefined, value: value} : value;
        } :
        function(scope, locals, assign, inputs) {
          var rhs = right(scope, locals, assign, inputs);
          var value;
          if (rhs.value != null) {
            var values = [];
            for (var i = 0; i < args.length; ++i) {
              values.push(args[i](scope, locals, assign, inputs));
            }
            value = rhs.value.apply(rhs.context, values);
          }
          return context ? {value: value} : value;
        };
    case AST.AssignmentExpression:
      left = this.recurse(ast.left, true, 1);
      right = this.recurse(ast.right);
      return function(scope, locals, assign, inputs) {
        var lhs = left(scope, locals, assign, inputs);
        var rhs = right(scope, locals, assign, inputs);
        lhs.context[lhs.name] = rhs;
        return context ? {value: rhs} : rhs;
      };
    case AST.ArrayExpression:
      args = [];
      forEach(ast.elements, function(expr) {
        args.push(self.recurse(expr));
      });
      return function(scope, locals, assign, inputs) {
        var value = [];
        for (var i = 0; i < args.length; ++i) {
          value.push(args[i](scope, locals, assign, inputs));
        }
        return context ? {value: value} : value;
      };
    case AST.ObjectExpression:
      args = [];
      forEach(ast.properties, function(property) {
        if (property.computed) {
          args.push({key: self.recurse(property.key),
                     computed: true,
                     value: self.recurse(property.value)
          });
        } else {
          args.push({key: property.key.type === AST.Identifier ?
                          property.key.name :
                          ('' + property.key.value),
                     computed: false,
                     value: self.recurse(property.value)
          });
        }
      });
      return function(scope, locals, assign, inputs) {
        var value = {};
        for (var i = 0; i < args.length; ++i) {
          if (args[i].computed) {
            value[args[i].key(scope, locals, assign, inputs)] = args[i].value(scope, locals, assign, inputs);
          } else {
            value[args[i].key] = args[i].value(scope, locals, assign, inputs);
          }
        }
        return context ? {value: value} : value;
      };
    case AST.ThisExpression:
      return function(scope) {
        return context ? {value: scope} : scope;
      };
    case AST.LocalsExpression:
      return function(scope, locals) {
        return context ? {value: locals} : locals;
      };
    case AST.NGValueParameter:
      return function(scope, locals, assign) {
        return context ? {value: assign} : assign;
      };
    }
  },

  'unary+': function(argument, context) {
    return function(scope, locals, assign, inputs) {
      var arg = argument(scope, locals, assign, inputs);
      if (isDefined(arg)) {
        arg = +arg;
      } else {
        arg = 0;
      }
      return context ? {value: arg} : arg;
    };
  },
  'unary-': function(argument, context) {
    return function(scope, locals, assign, inputs) {
      var arg = argument(scope, locals, assign, inputs);
      if (isDefined(arg)) {
        arg = -arg;
      } else {
        arg = -0;
      }
      return context ? {value: arg} : arg;
    };
  },
  'unary!': function(argument, context) {
    return function(scope, locals, assign, inputs) {
      var arg = !argument(scope, locals, assign, inputs);
      return context ? {value: arg} : arg;
    };
  },
  'binary+': function(left, right, context) {
    return function(scope, locals, assign, inputs) {
      var lhs = left(scope, locals, assign, inputs);
      var rhs = right(scope, locals, assign, inputs);
      var arg = plusFn(lhs, rhs);
      return context ? {value: arg} : arg;
    };
  },
  'binary-': function(left, right, context) {
    return function(scope, locals, assign, inputs) {
      var lhs = left(scope, locals, assign, inputs);
      var rhs = right(scope, locals, assign, inputs);
      var arg = (isDefined(lhs) ? lhs : 0) - (isDefined(rhs) ? rhs : 0);
      return context ? {value: arg} : arg;
    };
  },
  'binary*': function(left, right, context) {
    return function(scope, locals, assign, inputs) {
      var arg = left(scope, locals, assign, inputs) * right(scope, locals, assign, inputs);
      return context ? {value: arg} : arg;
    };
  },
  'binary/': function(left, right, context) {
    return function(scope, locals, assign, inputs) {
      var arg = left(scope, locals, assign, inputs) / right(scope, locals, assign, inputs);
      return context ? {value: arg} : arg;
    };
  },
  'binary%': function(left, right, context) {
    return function(scope, locals, assign, inputs) {
      var arg = left(scope, locals, assign, inputs) % right(scope, locals, assign, inputs);
      return context ? {value: arg} : arg;
    };
  },
  'binary===': function(left, right, context) {
    return function(scope, locals, assign, inputs) {
      var arg = left(scope, locals, assign, inputs) === right(scope, locals, assign, inputs);
      return context ? {value: arg} : arg;
    };
  },
  'binary!==': function(left, right, context) {
    return function(scope, locals, assign, inputs) {
      var arg = left(scope, locals, assign, inputs) !== right(scope, locals, assign, inputs);
      return context ? {value: arg} : arg;
    };
  },
  'binary==': function(left, right, context) {
    return function(scope, locals, assign, inputs) {
      // eslint-disable-next-line eqeqeq
      var arg = left(scope, locals, assign, inputs) == right(scope, locals, assign, inputs);
      return context ? {value: arg} : arg;
    };
  },
  'binary!=': function(left, right, context) {
    return function(scope, locals, assign, inputs) {
      // eslint-disable-next-line eqeqeq
      var arg = left(scope, locals, assign, inputs) != right(scope, locals, assign, inputs);
      return context ? {value: arg} : arg;
    };
  },
  'binary<': function(left, right, context) {
    return function(scope, locals, assign, inputs) {
      var arg = left(scope, locals, assign, inputs) < right(scope, locals, assign, inputs);
      return context ? {value: arg} : arg;
    };
  },
  'binary>': function(left, right, context) {
    return function(scope, locals, assign, inputs) {
      var arg = left(scope, locals, assign, inputs) > right(scope, locals, assign, inputs);
      return context ? {value: arg} : arg;
    };
  },
  'binary<=': function(left, right, context) {
    return function(scope, locals, assign, inputs) {
      var arg = left(scope, locals, assign, inputs) <= right(scope, locals, assign, inputs);
      return context ? {value: arg} : arg;
    };
  },
  'binary>=': function(left, right, context) {
    return function(scope, locals, assign, inputs) {
      var arg = left(scope, locals, assign, inputs) >= right(scope, locals, assign, inputs);
      return context ? {value: arg} : arg;
    };
  },
  'binary&&': function(left, right, context) {
    return function(scope, locals, assign, inputs) {
      var arg = left(scope, locals, assign, inputs) && right(scope, locals, assign, inputs);
      return context ? {value: arg} : arg;
    };
  },
  'binary||': function(left, right, context) {
    return function(scope, locals, assign, inputs) {
      var arg = left(scope, locals, assign, inputs) || right(scope, locals, assign, inputs);
      return context ? {value: arg} : arg;
    };
  },
  'ternary?:': function(test, alternate, consequent, context) {
    return function(scope, locals, assign, inputs) {
      var arg = test(scope, locals, assign, inputs) ? alternate(scope, locals, assign, inputs) : consequent(scope, locals, assign, inputs);
      return context ? {value: arg} : arg;
    };
  },
  value: function(value, context) {
    return function() { return context ? {context: undefined, name: undefined, value: value} : value; };
  },
  identifier: function(name, context, create) {
    return function(scope, locals, assign, inputs) {
      var base = locals && (name in locals) ? locals : scope;
      if (create && create !== 1 && base && base[name] == null) {
        base[name] = {};
      }
      var value = base ? base[name] : undefined;
      if (context) {
        return {context: base, name: name, value: value};
      } else {
        return value;
      }
    };
  },
  computedMember: function(left, right, context, create) {
    return function(scope, locals, assign, inputs) {
      var lhs = left(scope, locals, assign, inputs);
      var rhs;
      var value;
      if (lhs != null) {
        rhs = right(scope, locals, assign, inputs);
        rhs = getStringValue(rhs);
        if (create && create !== 1) {
          if (lhs && !(lhs[rhs])) {
            lhs[rhs] = {};
          }
        }
        value = lhs[rhs];
      }
      if (context) {
        return {context: lhs, name: rhs, value: value};
      } else {
        return value;
      }
    };
  },
  nonComputedMember: function(left, right, context, create) {
    return function(scope, locals, assign, inputs) {
      var lhs = left(scope, locals, assign, inputs);
      if (create && create !== 1) {
        if (lhs && lhs[right] == null) {
          lhs[right] = {};
        }
      }
      var value = lhs != null ? lhs[right] : undefined;
      if (context) {
        return {context: lhs, name: right, value: value};
      } else {
        return value;
      }
    };
  },
  inputs: function(input, watchId) {
    return function(scope, value, locals, inputs) {
      if (inputs) return inputs[watchId];
      return input(scope, value, locals);
    };
  }
};

/**
 * @constructor
 */
var Parser = function Parser(lexer, $filter, options) {
  this.lexer = lexer;
  this.$filter = $filter;
  this.options = options;
  this.ast = new AST(lexer, options);
  this.astCompiler = options.csp ? new ASTInterpreter(this.ast, $filter) :
                                   new ASTCompiler(this.ast, $filter);
};

Parser.prototype = {
  constructor: Parser,

  parse: function(text) {
    return this.astCompiler.compile(text);
  }
};

function getValueOf(value) {
  return isFunction(value.valueOf) ? value.valueOf() : objectValueOf.call(value);
}

function $ParseProvider() {
  var cache = createMap();
  var literals = {
    'true': true,
    'false': false,
    'null': null,
    'undefined': undefined
  };
  var identStart, identContinue;

  this.addLiteral = function(literalName, literalValue) {
    literals[literalName] = literalValue;
  };

 
  this.setIdentifierFns = function(identifierStart, identifierContinue) {
    identStart = identifierStart;
    identContinue = identifierContinue;
    return this;
  };

  this.$get = ['$filter', function($filter) {
    var noUnsafeEval = csp().noUnsafeEval;
    var $parseOptions = {
          csp: noUnsafeEval,
          literals: copy(literals),
          isIdentifierStart: isFunction(identStart) && identStart,
          isIdentifierContinue: isFunction(identContinue) && identContinue
        };
    return $parse;

    function $parse(exp, interceptorFn) {
      var parsedExpression, oneTime, cacheKey;

      switch (typeof exp) {
        case 'string':
          exp = exp.trim();
          cacheKey = exp;

          parsedExpression = cache[cacheKey];

          if (!parsedExpression) {
            if (exp.charAt(0) === ':' && exp.charAt(1) === ':') {
              oneTime = true;
              exp = exp.substring(2);
            }
            var lexer = new Lexer($parseOptions);
            var parser = new Parser(lexer, $filter, $parseOptions);
            parsedExpression = parser.parse(exp);
            if (parsedExpression.constant) {
              parsedExpression.$$watchDelegate = constantWatchDelegate;
            } else if (oneTime) {
              parsedExpression.$$watchDelegate = parsedExpression.literal ?
                  oneTimeLiteralWatchDelegate : oneTimeWatchDelegate;
            } else if (parsedExpression.inputs) {
              parsedExpression.$$watchDelegate = inputsWatchDelegate;
            }
            cache[cacheKey] = parsedExpression;
          }
          return addInterceptor(parsedExpression, interceptorFn);

        case 'function':
          return addInterceptor(exp, interceptorFn);

        default:
          return addInterceptor(noop, interceptorFn);
      }
    }

    function expressionInputDirtyCheck(newValue, oldValueOfValue) {

      if (newValue == null || oldValueOfValue == null) { // null/undefined
        return newValue === oldValueOfValue;
      }

      if (typeof newValue === 'object') {

        newValue = getValueOf(newValue);

        if (typeof newValue === 'object') {
   
          return false;
        }

      }

      return newValue === oldValueOfValue || (newValue !== newValue && oldValueOfValue !== oldValueOfValue);
    }

    function inputsWatchDelegate(scope, listener, objectEquality, parsedExpression, prettyPrintExpression) {
      var inputExpressions = parsedExpression.inputs;
      var lastResult;

      if (inputExpressions.length === 1) {
        var oldInputValueOf = expressionInputDirtyCheck; // init to something unique so that equals check fails
        inputExpressions = inputExpressions[0];
        return scope.$watch(function expressionInputWatch(scope) {
          var newInputValue = inputExpressions(scope);
          if (!expressionInputDirtyCheck(newInputValue, oldInputValueOf)) {
            lastResult = parsedExpression(scope, undefined, undefined, [newInputValue]);
            oldInputValueOf = newInputValue && getValueOf(newInputValue);
          }
          return lastResult;
        }, listener, objectEquality, prettyPrintExpression);
      }

      var oldInputValueOfValues = [];
      var oldInputValues = [];
      for (var i = 0, ii = inputExpressions.length; i < ii; i++) {
        oldInputValueOfValues[i] = expressionInputDirtyCheck; // init to something unique so that equals check fails
        oldInputValues[i] = null;
      }

      return scope.$watch(function expressionInputsWatch(scope) {
        var changed = false;

        for (var i = 0, ii = inputExpressions.length; i < ii; i++) {
          var newInputValue = inputExpressions[i](scope);
          if (changed || (changed = !expressionInputDirtyCheck(newInputValue, oldInputValueOfValues[i]))) {
            oldInputValues[i] = newInputValue;
            oldInputValueOfValues[i] = newInputValue && getValueOf(newInputValue);
          }
        }

        if (changed) {
          lastResult = parsedExpression(scope, undefined, undefined, oldInputValues);
        }

        return lastResult;
      }, listener, objectEquality, prettyPrintExpression);
    }

    function oneTimeWatchDelegate(scope, listener, objectEquality, parsedExpression, prettyPrintExpression) {
      var unwatch, lastValue;
      if (parsedExpression.inputs) {
        unwatch = inputsWatchDelegate(scope, oneTimeListener, objectEquality, parsedExpression, prettyPrintExpression);
      } else {
        unwatch = scope.$watch(oneTimeWatch, oneTimeListener, objectEquality);
      }
      return unwatch;

      function oneTimeWatch(scope) {
        return parsedExpression(scope);
      }
      function oneTimeListener(value, old, scope) {
        lastValue = value;
        if (isFunction(listener)) {
          listener(value, old, scope);
        }
        if (isDefined(value)) {
          scope.$$postDigest(function() {
            if (isDefined(lastValue)) {
              unwatch();
            }
          });
        }
      }
    }

    function oneTimeLiteralWatchDelegate(scope, listener, objectEquality, parsedExpression) {
      var unwatch, lastValue;
      unwatch = scope.$watch(function oneTimeWatch(scope) {
        return parsedExpression(scope);
      }, function oneTimeListener(value, old, scope) {
        lastValue = value;
        if (isFunction(listener)) {
          listener(value, old, scope);
        }
        if (isAllDefined(value)) {
          scope.$$postDigest(function() {
            if (isAllDefined(lastValue)) unwatch();
          });
        }
      }, objectEquality);

      return unwatch;

      function isAllDefined(value) {
        var allDefined = true;
        forEach(value, function(val) {
          if (!isDefined(val)) allDefined = false;
        });
        return allDefined;
      }
    }

    function constantWatchDelegate(scope, listener, objectEquality, parsedExpression) {
      var unwatch = scope.$watch(function constantWatch(scope) {
        unwatch();
        return parsedExpression(scope);
      }, listener, objectEquality);
      return unwatch;
    }

    function addInterceptor(parsedExpression, interceptorFn) {
      if (!interceptorFn) return parsedExpression;
      var watchDelegate = parsedExpression.$$watchDelegate;
      var useInputs = false;

      var regularWatch =
          watchDelegate !== oneTimeLiteralWatchDelegate &&
          watchDelegate !== oneTimeWatchDelegate;

      var fn = regularWatch ? function regularInterceptedExpression(scope, locals, assign, inputs) {
        var value = useInputs && inputs ? inputs[0] : parsedExpression(scope, locals, assign, inputs);
        return interceptorFn(value, scope, locals);
      } : function oneTimeInterceptedExpression(scope, locals, assign, inputs) {
        var value = parsedExpression(scope, locals, assign, inputs);
        var result = interceptorFn(value, scope, locals);
        // we only return the interceptor's result if the
        // initial value is defined (for bind-once)
        return isDefined(value) ? result : value;
      };

      // Propagate $$watchDelegates other then inputsWatchDelegate
      useInputs = !parsedExpression.inputs;
      if (parsedExpression.$$watchDelegate &&
          parsedExpression.$$watchDelegate !== inputsWatchDelegate) {
        fn.$$watchDelegate = parsedExpression.$$watchDelegate;
        fn.inputs = parsedExpression.inputs;
      } else if (!interceptorFn.$stateful) {
        // If there is an interceptor, but no watchDelegate then treat the interceptor like
        // we treat filters - it is assumed to be a pure function unless flagged with $stateful
        fn.$$watchDelegate = inputsWatchDelegate;
        fn.inputs = parsedExpression.inputs ? parsedExpression.inputs : [parsedExpression];
      }

      return fn;
    }
  }];
}

/**
 * @ngdoc service
 * @name $q
 * @requires $rootScope
 *
 * @description
 * A service that helps you run functions asynchronously, and use their return values (or exceptions)
 * when they are done processing.
 *
 * This is a [Promises/A+](https://promisesaplus.com/)-compliant implementation of promises/deferred
 * objects inspired by [Kris Kowal's Q](https://github.com/kriskowal/q).
 *
 * $q can be used in two fashions --- one which is more similar to Kris Kowal's Q or jQuery's Deferred
 * implementations, and the other which resembles ES6 (ES2015) promises to some degree.
 *
 * # $q constructor
 *
 * The streamlined ES6 style promise is essentially just using $q as a constructor which takes a `resolver`
 * function as the first argument. This is similar to the native Promise implementation from ES6,
 * see [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).
 *
 * While the constructor-style use is supported, not all of the supporting methods from ES6 promises are
 * available yet.
 *
 * It can be used like so:
 *
 * ```js
 *   // for the purpose of this example let's assume that variables `$q` and `okToGreet`
 *   // are available in the current lexical scope (they could have been injected or passed in).
 *
 *   function asyncGreet(name) {
 *     // perform some asynchronous operation, resolve or reject the promise when appropriate.
 *     return $q(function(resolve, reject) {
 *       setTimeout(function() {
 *         if (okToGreet(name)) {
 *           resolve('Hello, ' + name + '!');
 *         } else {
 *           reject('Greeting ' + name + ' is not allowed.');
 *         }
 *       }, 1000);
 *     });
 *   }
 *
 *   var promise = asyncGreet('Robin Hood');
 *   promise.then(function(greeting) {
 *     alert('Success: ' + greeting);
 *   }, function(reason) {
 *     alert('Failed: ' + reason);
 *   });
 * ```
 *
 * Note: progress/notify callbacks are not currently supported via the ES6-style interface.
 *
 * Note: unlike ES6 behavior, an exception thrown in the constructor function will NOT implicitly reject the promise.
 *
 * However, the more traditional CommonJS-style usage is still available, and documented below.
 *
 * [The CommonJS Promise proposal](http://wiki.commonjs.org/wiki/Promises) describes a promise as an
 * interface for interacting with an object that represents the result of an action that is
 * performed asynchronously, and may or may not be finished at any given point in time.
 *
 * From the perspective of dealing with error handling, deferred and promise APIs are to
 * asynchronous programming what `try`, `catch` and `throw` keywords are to synchronous programming.
 *
 * ```js
 *   // for the purpose of this example let's assume that variables `$q` and `okToGreet`
 *   // are available in the current lexical scope (they could have been injected or passed in).
 *
 *   function asyncGreet(name) {
 *     var deferred = $q.defer();
 *
 *     setTimeout(function() {
 *       deferred.notify('About to greet ' + name + '.');
 *
 *       if (okToGreet(name)) {
 *         deferred.resolve('Hello, ' + name + '!');
 *       } else {
 *         deferred.reject('Greeting ' + name + ' is not allowed.');
 *       }
 *     }, 1000);
 *
 *     return deferred.promise;
 *   }
 *
 *   var promise = asyncGreet('Robin Hood');
 *   promise.then(function(greeting) {
 *     alert('Success: ' + greeting);
 *   }, function(reason) {
 *     alert('Failed: ' + reason);
 *   }, function(update) {
 *     alert('Got notification: ' + update);
 *   });
 * ```
 *
 * At first it might not be obvious why this extra complexity is worth the trouble. The payoff
 * comes in the way of guarantees that promise and deferred APIs make, see
 * https://github.com/kriskowal/uncommonjs/blob/master/promises/specification.md.
 *
 * Additionally the promise api allows for composition that is very hard to do with the
 * traditional callback ([CPS](http://en.wikipedia.org/wiki/Continuation-passing_style)) approach.
 * For more on this please see the [Q documentation](https://github.com/kriskowal/q) especially the
 * section on serial or parallel joining of promises.
 *
 * # The Deferred API
 *
 * A new instance of deferred is constructed by calling `$q.defer()`.
 *
 * The purpose of the deferred object is to expose the associated Promise instance as well as APIs
 * that can be used for signaling the successful or unsuccessful completion, as well as the status
 * of the task.
 *
 * **Methods**
 *
 * - `resolve(value)` ??? resolves the derived promise with the `value`. If the value is a rejection
 *   constructed via `$q.reject`, the promise will be rejected instead.
 * - `reject(reason)` ??? rejects the derived promise with the `reason`. This is equivalent to
 *   resolving it with a rejection constructed via `$q.reject`.
 * - `notify(value)` - provides updates on the status of the promise's execution. This may be called
 *   multiple times before the promise is either resolved or rejected.
 *
 * **Properties**
 *
 * - promise ??? `{Promise}` ??? promise object associated with this deferred.
 *
 *
 * # The Promise API
 *
 * A new promise instance is created when a deferred instance is created and can be retrieved by
 * calling `deferred.promise`.
 *
 * The purpose of the promise object is to allow for interested parties to get access to the result
 * of the deferred task when it completes.
 *
 * **Methods**
 *
 * - `then(successCallback, [errorCallback], [notifyCallback])` ??? regardless of when the promise was or
 *   will be resolved or rejected, `then` calls one of the success or error callbacks asynchronously
 *   as soon as the result is available. The callbacks are called with a single argument: the result
 *   or rejection reason. Additionally, the notify callback may be called zero or more times to
 *   provide a progress indication, before the promise is resolved or rejected.
 *
 *   This method *returns a new promise* which is resolved or rejected via the return value of the
 *   `successCallback`, `errorCallback` (unless that value is a promise, in which case it is resolved
 *   with the value which is resolved in that promise using
 *   [promise chaining](http://www.html5rocks.com/en/tutorials/es6/promises/#toc-promises-queues)).
 *   It also notifies via the return value of the `notifyCallback` method. The promise cannot be
 *   resolved or rejected from the notifyCallback method. The errorCallback and notifyCallback
 *   arguments are optional.
 *
 * - `catch(errorCallback)` ??? shorthand for `promise.then(null, errorCallback)`
 *
 * - `finally(callback, notifyCallback)` ??? allows you to observe either the fulfillment or rejection of a promise,
 *   but to do so without modifying the final value. This is useful to release resources or do some
 *   clean-up that needs to be done whether the promise was rejected or resolved. See the [full
 *   specification](https://github.com/kriskowal/q/wiki/API-Reference#promisefinallycallback) for
 *   more information.
 *
 * # Chaining promises
 *
 * Because calling the `then` method of a promise returns a new derived promise, it is easily
 * possible to create a chain of promises:
 *
 * ```js
 *   promiseB = promiseA.then(function(result) {
 *     return result + 1;
 *   });
 *
 *   // promiseB will be resolved immediately after promiseA is resolved and its value
 *   // will be the result of promiseA incremented by 1
 * ```
 *
 * It is possible to create chains of any length and since a promise can be resolved with another
 * promise (which will defer its resolution further), it is possible to pause/defer resolution of
 * the promises at any point in the chain. This makes it possible to implement powerful APIs like
 * $http's response interceptors.
 *
 *
 * # Differences between Kris Kowal's Q and $q
 *
 *  There are two main differences:
 *
 * - $q is integrated with the {@link ng.$rootScope.Scope} Scope model observation
 *   mechanism in angular, which means faster propagation of resolution or rejection into your
 *   models and avoiding unnecessary browser repaints, which would result in flickering UI.
 * - Q has many more features than $q, but that comes at a cost of bytes. $q is tiny, but contains
 *   all the important functionality needed for common async tasks.
 *
 * # Testing
 *
 *  ```js
 *    it('should simulate promise', inject(function($q, $rootScope) {
 *      var deferred = $q.defer();
 *      var promise = deferred.promise;
 *      var resolvedValue;
 *
 *      promise.then(function(value) { resolvedValue = value; });
 *      expect(resolvedValue).toBeUndefined();
 *
 *      // Simulate resolving of promise
 *      deferred.resolve(123);
 *      // Note that the 'then' function does not get called synchronously.
 *      // This is because we want the promise API to always be async, whether or not
 *      // it got called synchronously or asynchronously.
 *      expect(resolvedValue).toBeUndefined();
 *
 *      // Propagate promise resolution to 'then' functions using $apply().
 *      $rootScope.$apply();
 *      expect(resolvedValue).toEqual(123);
 *    }));
 *  ```
 *
 * @param {function(function, function)} resolver Function which is responsible for resolving or
 *   rejecting the newly created promise. The first parameter is a function which resolves the
 *   promise, the second parameter is a function which rejects the promise.
 *
 * @returns {Promise} The newly created promise.
 */
/**
 * @ngdoc provider
 * @name $qProvider
 * @this
 *
 * @description
 */
function $QProvider() {
  var errorOnUnhandledRejections = true;
  this.$get = ['$rootScope', '$exceptionHandler', function($rootScope, $exceptionHandler) {
    return qFactory(function(callback) {
      $rootScope.$evalAsync(callback);
    }, $exceptionHandler, errorOnUnhandledRejections);
  }];

  /**
   * @ngdoc method
   * @name $qProvider#errorOnUnhandledRejections
   * @kind function
   *
   * @description
   * Retrieves or overrides whether to generate an error when a rejected promise is not handled.
   * This feature is enabled by default.
   *
   * @param {boolean=} value Whether to generate an error when a rejected promise is not handled.
   * @returns {boolean|ng.$qProvider} Current value when called without a new value or self for
   *    chaining otherwise.
   */
  this.errorOnUnhandledRejections = function(value) {
    if (isDefined(value)) {
      errorOnUnhandledRejections = value;
      return this;
    } else {
      return errorOnUnhandledRejections;
    }
  };
}

/** @this */
function $$QProvider() {
  var errorOnUnhandledRejections = true;
  this.$get = ['$browser', '$exceptionHandler', function($browser, $exceptionHandler) {
    return qFactory(function(callback) {
      $browser.defer(callback);
    }, $exceptionHandler, errorOnUnhandledRejections);
  }];

  this.errorOnUnhandledRejections = function(value) {
    if (isDefined(value)) {
      errorOnUnhandledRejections = value;
      return this;
    } else {
      return errorOnUnhandledRejections;
    }
  };
}

/**
 * Constructs a promise manager.
 *
 * @param {function(function)} nextTick Function for executing functions in the next turn.
 * @param {function(...*)} exceptionHandler Function into which unexpected exceptions are passed for
 *     debugging purposes.
 @ param {=boolean} errorOnUnhandledRejections Whether an error should be generated on unhandled
 *     promises rejections.
 * @returns {object} Promise manager.
 */
function qFactory(nextTick, exceptionHandler, errorOnUnhandledRejections) {
  var $qMinErr = minErr('$q', TypeError);
  var queueSize = 0;
  var checkQueue = [];

  /**
   * @ngdoc method
   * @name ng.$q#defer
   * @kind function
   *
   * @description
   * Creates a `Deferred` object which represents a task which will finish in the future.
   *
   * @returns {Deferred} Returns a new instance of deferred.
   */
  function defer() {
    return new Deferred();
  }

  function Deferred() {
    var promise = this.promise = new Promise();
    //Non prototype methods necessary to support unbound execution :/
    this.resolve = function(val) { resolvePromise(promise, val); };
    this.reject = function(reason) { rejectPromise(promise, reason); };
    this.notify = function(progress) { notifyPromise(promise, progress); };
  }


  function Promise() {
    this.$$state = { status: 0 };
  }

  extend(Promise.prototype, {
    then: function(onFulfilled, onRejected, progressBack) {
      if (isUndefined(onFulfilled) && isUndefined(onRejected) && isUndefined(progressBack)) {
        return this;
      }
      var result = new Promise();

      this.$$state.pending = this.$$state.pending || [];
      this.$$state.pending.push([result, onFulfilled, onRejected, progressBack]);
      if (this.$$state.status > 0) scheduleProcessQueue(this.$$state);

      return result;
    },

    'catch': function(callback) {
      return this.then(null, callback);
    },

    'finally': function(callback, progressBack) {
      return this.then(function(value) {
        return handleCallback(value, resolve, callback);
      }, function(error) {
        return handleCallback(error, reject, callback);
      }, progressBack);
    }
  });

  function processQueue(state) {
    var fn, promise, pending;

    pending = state.pending;
    state.processScheduled = false;
    state.pending = undefined;
    try {
      for (var i = 0, ii = pending.length; i < ii; ++i) {
        state.pur = true;
        promise = pending[i][0];
        fn = pending[i][state.status];
        try {
          if (isFunction(fn)) {
            resolvePromise(promise, fn(state.value));
          } else if (state.status === 1) {
            resolvePromise(promise, state.value);
          } else {
            rejectPromise(promise, state.value);
          }
        } catch (e) {
          rejectPromise(promise, e);
        }
      }
    } finally {
      --queueSize;
      if (errorOnUnhandledRejections && queueSize === 0) {
        nextTick(processChecks);
      }
    }
  }

  function processChecks() {
    // eslint-disable-next-line no-unmodified-loop-condition
    while (!queueSize && checkQueue.length) {
      var toCheck = checkQueue.shift();
      if (!toCheck.pur) {
        toCheck.pur = true;
        var errorMessage = 'Possibly unhandled rejection: ' + toDebugString(toCheck.value);
        if (toCheck.value instanceof Error) {
          exceptionHandler(toCheck.value, errorMessage);
        } else {
          exceptionHandler(errorMessage);
        }
      }
    }
  }

  function scheduleProcessQueue(state) {
    if (errorOnUnhandledRejections && !state.pending && state.status === 2 && !state.pur) {
      if (queueSize === 0 && checkQueue.length === 0) {
        nextTick(processChecks);
      }
      checkQueue.push(state);
    }
    if (state.processScheduled || !state.pending) return;
    state.processScheduled = true;
    ++queueSize;
    nextTick(function() { processQueue(state); });
  }

  function resolvePromise(promise, val) {
    if (promise.$$state.status) return;
    if (val === promise) {
      $$reject(promise, $qMinErr(
        'qcycle',
        'Expected promise to be resolved with value other than itself \'{0}\'',
        val));
    } else {
      $$resolve(promise, val);
    }

  }

  function $$resolve(promise, val) {
    var then;
    var done = false;
    try {
      if (isObject(val) || isFunction(val)) then = val.then;
      if (isFunction(then)) {
        promise.$$state.status = -1;
        then.call(val, doResolve, doReject, doNotify);
      } else {
        promise.$$state.value = val;
        promise.$$state.status = 1;
        scheduleProcessQueue(promise.$$state);
      }
    } catch (e) {
      doReject(e);
    }

    function doResolve(val) {
      if (done) return;
      done = true;
      $$resolve(promise, val);
    }
    function doReject(val) {
      if (done) return;
      done = true;
      $$reject(promise, val);
    }
    function doNotify(progress) {
      notifyPromise(promise, progress);
    }
  }

  function rejectPromise(promise, reason) {
    if (promise.$$state.status) return;
    $$reject(promise, reason);
  }

  function $$reject(promise, reason) {
    promise.$$state.value = reason;
    promise.$$state.status = 2;
    scheduleProcessQueue(promise.$$state);
  }

  function notifyPromise(promise, progress) {
    var callbacks = promise.$$state.pending;

    if ((promise.$$state.status <= 0) && callbacks && callbacks.length) {
      nextTick(function() {
        var callback, result;
        for (var i = 0, ii = callbacks.length; i < ii; i++) {
          result = callbacks[i][0];
          callback = callbacks[i][3];
          try {
            notifyPromise(result, isFunction(callback) ? callback(progress) : progress);
          } catch (e) {
            exceptionHandler(e);
          }
        }
      });
    }
  }

  /**
   * @ngdoc method
   * @name $q#reject
   * @kind function
   *
   * @description
   * Creates a promise that is resolved as rejected with the specified `reason`. This api should be
   * used to forward rejection in a chain of promises. If you are dealing with the last promise in
   * a promise chain, you don't need to worry about it.
   *
   * When comparing deferreds/promises to the familiar behavior of try/catch/throw, think of
   * `reject` as the `throw` keyword in JavaScript. This also means that if you "catch" an error via
   * a promise error callback and you want to forward the error to the promise derived from the
   * current promise, you have to "rethrow" the error by returning a rejection constructed via
   * `reject`.
   *
   * ```js
   *   promiseB = promiseA.then(function(result) {
   *     // success: do something and resolve promiseB
   *     //          with the old or a new result
   *     return result;
   *   }, function(reason) {
   *     // error: handle the error if possible and
   *     //        resolve promiseB with newPromiseOrValue,
   *     //        otherwise forward the rejection to promiseB
   *     if (canHandle(reason)) {
   *      // handle the error and recover
   *      return newPromiseOrValue;
   *     }
   *     return $q.reject(reason);
   *   });
   * ```
   *
   * @param {*} reason Constant, message, exception or an object representing the rejection reason.
   * @returns {Promise} Returns a promise that was already resolved as rejected with the `reason`.
   */
  function reject(reason) {
    var result = new Promise();
    rejectPromise(result, reason);
    return result;
  }

  function handleCallback(value, resolver, callback) {
    var callbackOutput = null;
    try {
      if (isFunction(callback)) callbackOutput = callback();
    } catch (e) {
      return reject(e);
    }
    if (isPromiseLike(callbackOutput)) {
      return callbackOutput.then(function() {
        return resolver(value);
      }, reject);
    } else {
      return resolver(value);
    }
  }

  /**
   * @ngdoc method
   * @name $q#when
   * @kind function
   *
   * @description
   * Wraps an object that might be a value or a (3rd party) then-able promise into a $q promise.
   * This is useful when you are dealing with an object that might or might not be a promise, or if
   * the promise comes from a source that can't be trusted.
   *
   * @param {*} value Value or a promise
   * @param {Function=} successCallback
   * @param {Function=} errorCallback
   * @param {Function=} progressCallback
   * @returns {Promise} Returns a promise of the passed value or promise
   */


  function when(value, callback, errback, progressBack) {
    var result = new Promise();
    resolvePromise(result, value);
    return result.then(callback, errback, progressBack);
  }

  /**
   * @ngdoc method
   * @name $q#resolve
   * @kind function
   *
   * @description
   * Alias of {@link ng.$q#when when} to maintain naming consistency with ES6.
   *
   * @param {*} value Value or a promise
   * @param {Function=} successCallback
   * @param {Function=} errorCallback
   * @param {Function=} progressCallback
   * @returns {Promise} Returns a promise of the passed value or promise
   */
  var resolve = when;

  /**
   * @ngdoc method
   * @name $q#all
   * @kind function
   *
   * @description
   * Combines multiple promises into a single promise that is resolved when all of the input
   * promises are resolved.
   *
   * @param {Array.<Promise>|Object.<Promise>} promises An array or hash of promises.
   * @returns {Promise} Returns a single promise that will be resolved with an array/hash of values,
   *   each value corresponding to the promise at the same index/key in the `promises` array/hash.
   *   If any of the promises is resolved with a rejection, this resulting promise will be rejected
   *   with the same rejection value.
   */

  function all(promises) {
    var result = new Promise(),
        counter = 0,
        results = isArray(promises) ? [] : {};

    forEach(promises, function(promise, key) {
      counter++;
      when(promise).then(function(value) {
        results[key] = value;
        if (!(--counter)) resolvePromise(result, results);
      }, function(reason) {
        rejectPromise(result, reason);
      });
    });

    if (counter === 0) {
      resolvePromise(result, results);
    }

    return result;
  }

  /**
   * @ngdoc method
   * @name $q#race
   * @kind function
   *
   * @description
   * Returns a promise that resolves or rejects as soon as one of those promises
   * resolves or rejects, with the value or reason from that promise.
   *
   * @param {Array.<Promise>|Object.<Promise>} promises An array or hash of promises.
   * @returns {Promise} a promise that resolves or rejects as soon as one of the `promises`
   * resolves or rejects, with the value or reason from that promise.
   */

  function race(promises) {
    var deferred = defer();

    forEach(promises, function(promise) {
      when(promise).then(deferred.resolve, deferred.reject);
    });

    return deferred.promise;
  }

  function $Q(resolver) {
    if (!isFunction(resolver)) {
      throw $qMinErr('norslvr', 'Expected resolverFn, got \'{0}\'', resolver);
    }

    var promise = new Promise();

    function resolveFn(value) {
      resolvePromise(promise, value);
    }

    function rejectFn(reason) {
      rejectPromise(promise, reason);
    }

    resolver(resolveFn, rejectFn);

    return promise;
  }

  // Let's make the instanceof operator work for promises, so that
  // `new $q(fn) instanceof $q` would evaluate to true.
  $Q.prototype = Promise.prototype;

  $Q.defer = defer;
  $Q.reject = reject;
  $Q.when = when;
  $Q.resolve = resolve;
  $Q.all = all;
  $Q.race = race;

  return $Q;
}

/** @this */
function $$RAFProvider() { //rAF
  this.$get = ['$window', '$timeout', function($window, $timeout) {
    var requestAnimationFrame = $window.requestAnimationFrame ||
                                $window.webkitRequestAnimationFrame;

    var cancelAnimationFrame = $window.cancelAnimationFrame ||
                               $window.webkitCancelAnimationFrame ||
                               $window.webkitCancelRequestAnimationFrame;

    var rafSupported = !!requestAnimationFrame;
    var raf = rafSupported
      ? function(fn) {
          var id = requestAnimationFrame(fn);
          return function() {
            cancelAnimationFrame(id);
          };
        }
      : function(fn) {
          var timer = $timeout(fn, 16.66, false); // 1000 / 60 = 16.666
          return function() {
            $timeout.cancel(timer);
          };
        };

    raf.supported = rafSupported;

    return raf;
  }];
}

/**
 * DESIGN NOTES
 *
 * The design decisions behind the scope are heavily favored for speed and memory consumption.
 *
 * The typical use of scope is to watch the expressions, which most of the time return the same
 * value as last time so we optimize the operation.
 *
 * Closures construction is expensive in terms of speed as well as memory:
 *   - No closures, instead use prototypical inheritance for API
 *   - Internal state needs to be stored on scope directly, which means that private state is
 *     exposed as $$____ properties
 *
 * Loop operations are optimized by using while(count--) { ... }
 *   - This means that in order to keep the same order of execution as addition we have to add
 *     items to the array at the beginning (unshift) instead of at the end (push)
 *
 * Child scopes are created and removed often
 *   - Using an array would be slow since inserts in the middle are expensive; so we use linked lists
 *
 * There are fewer watches than observers. This is why you don't want the observer to be implemented
 * in the same way as watch. Watch requires return of the initialization function which is expensive
 * to construct.
 */


/**
 * @ngdoc provider
 * @name $rootScopeProvider
 * @description
 *
 * Provider for the $rootScope service.
 */

/**
 * @ngdoc method
 * @name $rootScopeProvider#digestTtl
 * @description
 *
 * Sets the number of `$digest` iterations the scope should attempt to execute before giving up and
 * assuming that the model is unstable.
 *
 * The current default is 10 iterations.
 *
 * In complex applications it's possible that the dependencies between `$watch`s will result in
 * several digest iterations. However if an application needs more than the default 10 digest
 * iterations for its model to stabilize then you should investigate what is causing the model to
 * continuously change during the digest.
 *
 * Increasing the TTL could have performance implications, so you should not change it without
 * proper justification.
 *
 * @param {number} limit The number of digest iterations.
 */


/**
 * @ngdoc service
 * @name $rootScope
 * @this
 *
 * @description
 *
 * Every application has a single root {@link ng.$rootScope.Scope scope}.
 * All other scopes are descendant scopes of the root scope. Scopes provide separation
 * between the model and the view, via a mechanism for watching the model for changes.
 * They also provide event emission/broadcast and subscription facility. See the
 * {@link guide/scope developer guide on scopes}.
 */
function $RootScopeProvider() {
  var TTL = 10;
  var $rootScopeMinErr = minErr('$rootScope');
  var lastDirtyWatch = null;
  var applyAsyncId = null;

  this.digestTtl = function(value) {
    if (arguments.length) {
      TTL = value;
    }
    return TTL;
  };

  function createChildScopeClass(parent) {
    function ChildScope() {
      this.$$watchers = this.$$nextSibling =
          this.$$childHead = this.$$childTail = null;
      this.$$listeners = {};
      this.$$listenerCount = {};
      this.$$watchersCount = 0;
      this.$id = nextUid();
      this.$$ChildScope = null;
    }
    ChildScope.prototype = parent;
    return ChildScope;
  }

  this.$get = ['$exceptionHandler', '$parse', '$browser',
      function($exceptionHandler, $parse, $browser) {

    function destroyChildScope($event) {
        $event.currentScope.$$destroyed = true;
    }

    function cleanUpScope($scope) {

      // Support: IE 9 only
      if (msie === 9) {
        // There is a memory leak in IE9 if all child scopes are not disconnected
        // completely when a scope is destroyed. So this code will recurse up through
        // all this scopes children
        //
        // See issue https://github.com/angular/angular.js/issues/10706
        if ($scope.$$childHead) {
          cleanUpScope($scope.$$childHead);
        }
        if ($scope.$$nextSibling) {
          cleanUpScope($scope.$$nextSibling);
        }
      }

      // The code below works around IE9 and V8's memory leaks
      //
      // See:
      // - https://code.google.com/p/v8/issues/detail?id=2073#c26
      // - https://github.com/angular/angular.js/issues/6794#issuecomment-38648909
      // - https://github.com/angular/angular.js/issues/1313#issuecomment-10378451

      $scope.$parent = $scope.$$nextSibling = $scope.$$prevSibling = $scope.$$childHead =
          $scope.$$childTail = $scope.$root = $scope.$$watchers = null;
    }

    /**
     * @ngdoc type
     * @name $rootScope.Scope
     *
     * @description
     * A root scope can be retrieved using the {@link ng.$rootScope $rootScope} key from the
     * {@link auto.$injector $injector}. Child scopes are created using the
     * {@link ng.$rootScope.Scope#$new $new()} method. (Most scopes are created automatically when
     * compiled HTML template is executed.) See also the {@link guide/scope Scopes guide} for
     * an in-depth introduction and usage examples.
     *
     *
     * # Inheritance
     * A scope can inherit from a parent scope, as in this example:
     * ```js
         var parent = $rootScope;
         var child = parent.$new();

         parent.salutation = "Hello";
         expect(child.salutation).toEqual('Hello');

         child.salutation = "Welcome";
         expect(child.salutation).toEqual('Welcome');
         expect(parent.salutation).toEqual('Hello');
     * ```
     *
     * When interacting with `Scope` in tests, additional helper methods are available on the
     * instances of `Scope` type. See {@link ngMock.$rootScope.Scope ngMock Scope} for additional
     * details.
     *
     *
     * @param {Object.<string, function()>=} providers Map of service factory which need to be
     *                                       provided for the current scope. Defaults to {@link ng}.
     * @param {Object.<string, *>=} instanceCache Provides pre-instantiated services which should
     *                              append/override services provided by `providers`. This is handy
     *                              when unit-testing and having the need to override a default
     *                              service.
     * @returns {Object} Newly created scope.
     *
     */
    function Scope() {
      this.$id = nextUid();
      this.$$phase = this.$parent = this.$$watchers =
                     this.$$nextSibling = this.$$prevSibling =
                     this.$$childHead = this.$$childTail = null;
      this.$root = this;
      this.$$destroyed = false;
      this.$$listeners = {};
      this.$$listenerCount = {};
      this.$$watchersCount = 0;
      this.$$isolateBindings = null;
    }

    /**
     * @ngdoc property
     * @name $rootScope.Scope#$id
     *
     * @description
     * Unique scope ID (monotonically increasing) useful for debugging.
     */

     /**
      * @ngdoc property
      * @name $rootScope.Scope#$parent
      *
      * @description
      * Reference to the parent scope.
      */

      /**
       * @ngdoc property
       * @name $rootScope.Scope#$root
       *
       * @description
       * Reference to the root scope.
       */

    Scope.prototype = {
      constructor: Scope,
      /**
       * @ngdoc method
       * @name $rootScope.Scope#$new
       * @kind function
       *
       * @description
       * Creates a new child {@link ng.$rootScope.Scope scope}.
       *
       * The parent scope will propagate the {@link ng.$rootScope.Scope#$digest $digest()} event.
       * The scope can be removed from the scope hierarchy using {@link ng.$rootScope.Scope#$destroy $destroy()}.
       *
       * {@link ng.$rootScope.Scope#$destroy $destroy()} must be called on a scope when it is
       * desired for the scope and its child scopes to be permanently detached from the parent and
       * thus stop participating in model change detection and listener notification by invoking.
       *
       * @param {boolean} isolate If true, then the scope does not prototypically inherit from the
       *         parent scope. The scope is isolated, as it can not see parent scope properties.
       *         When creating widgets, it is useful for the widget to not accidentally read parent
       *         state.
       *
       * @param {Scope} [parent=this] The {@link ng.$rootScope.Scope `Scope`} that will be the `$parent`
       *                              of the newly created scope. Defaults to `this` scope if not provided.
       *                              This is used when creating a transclude scope to correctly place it
       *                              in the scope hierarchy while maintaining the correct prototypical
       *                              inheritance.
       *
       * @returns {Object} The newly created child scope.
       *
       */
      $new: function(isolate, parent) {
        var child;

        parent = parent || this;

        if (isolate) {
          child = new Scope();
          child.$root = this.$root;
        } else {
          // Only create a child scope class if somebody asks for one,
          // but cache it to allow the VM to optimize lookups.
          if (!this.$$ChildScope) {
            this.$$ChildScope = createChildScopeClass(this);
          }
          child = new this.$$ChildScope();
        }
        child.$parent = parent;
        child.$$prevSibling = parent.$$childTail;
        if (parent.$$childHead) {
          parent.$$childTail.$$nextSibling = child;
          parent.$$childTail = child;
        } else {
          parent.$$childHead = parent.$$childTail = child;
        }

        // When the new scope is not isolated or we inherit from `this`, and
        // the parent scope is destroyed, the property `$$destroyed` is inherited
        // prototypically. In all other cases, this property needs to be set
        // when the parent scope is destroyed.
        // The listener needs to be added after the parent is set
        if (isolate || parent !== this) child.$on('$destroy', destroyChildScope);

        return child;
      },

      /**
       * @ngdoc method
       * @name $rootScope.Scope#$watch
       * @kind function
       *
       * @description
       * Registers a `listener` callback to be executed whenever the `watchExpression` changes.
       *
       * - The `watchExpression` is called on every call to {@link ng.$rootScope.Scope#$digest
       *   $digest()} and should return the value that will be watched. (`watchExpression` should not change
       *   its value when executed multiple times with the same input because it may be executed multiple
       *   times by {@link ng.$rootScope.Scope#$digest $digest()}. That is, `watchExpression` should be
       *   [idempotent](http://en.wikipedia.org/wiki/Idempotence).)
       * - The `listener` is called only when the value from the current `watchExpression` and the
       *   previous call to `watchExpression` are not equal (with the exception of the initial run,
       *   see below). Inequality is determined according to reference inequality,
       *   [strict comparison](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comparison_Operators)
       *    via the `!==` Javascript operator, unless `objectEquality == true`
       *   (see next point)
       * - When `objectEquality == true`, inequality of the `watchExpression` is determined
       *   according to the {@link angular.equals} function. To save the value of the object for
       *   later comparison, the {@link angular.copy} function is used. This therefore means that
       *   watching complex objects will have adverse memory and performance implications.
       * - This should not be used to watch for changes in objects that are
       *   or contain [File](https://developer.mozilla.org/docs/Web/API/File) objects due to limitations with {@link angular.copy `angular.copy`}.
       * - The watch `listener` may change the model, which may trigger other `listener`s to fire.
       *   This is achieved by rerunning the watchers until no changes are detected. The rerun
       *   iteration limit is 10 to prevent an infinite loop deadlock.
       *
       *
       * If you want to be notified whenever {@link ng.$rootScope.Scope#$digest $digest} is called,
       * you can register a `watchExpression` function with no `listener`. (Be prepared for
       * multiple calls to your `watchExpression` because it will execute multiple times in a
       * single {@link ng.$rootScope.Scope#$digest $digest} cycle if a change is detected.)
       *
       * After a watcher is registered with the scope, the `listener` fn is called asynchronously
       * (via {@link ng.$rootScope.Scope#$evalAsync $evalAsync}) to initialize the
       * watcher. In rare cases, this is undesirable because the listener is called when the result
       * of `watchExpression` didn't change. To detect this scenario within the `listener` fn, you
       * can compare the `newVal` and `oldVal`. If these two values are identical (`===`) then the
       * listener was called due to initialization.
       *
       *
       *
       * # Example
       * ```js
           // let's assume that scope was dependency injected as the $rootScope
           var scope = $rootScope;
           scope.name = 'misko';
           scope.counter = 0;

           expect(scope.counter).toEqual(0);
           scope.$watch('name', function(newValue, oldValue) {
             scope.counter = scope.counter + 1;
           });
           expect(scope.counter).toEqual(0);

           scope.$digest();
           // the listener is always called during the first $digest loop after it was registered
           expect(scope.counter).toEqual(1);

           scope.$digest();
           // but now it will not be called unless the value changes
           expect(scope.counter).toEqual(1);

           scope.name = 'adam';
           scope.$digest();
           expect(scope.counter).toEqual(2);



           // Using a function as a watchExpression
           var food;
           scope.foodCounter = 0;
           expect(scope.foodCounter).toEqual(0);
           scope.$watch(
             // This function returns the value being watched. It is called for each turn of the $digest loop
             function() { return food; },
             // This is the change listener, called when the value returned from the above function changes
             function(newValue, oldValue) {
               if ( newValue !== oldValue ) {
                 // Only increment the counter if the value changed
                 scope.foodCounter = scope.foodCounter + 1;
               }
             }
           );
           // No digest has been run so the counter will be zero
           expect(scope.foodCounter).toEqual(0);

           // Run the digest but since food has not changed count will still be zero
           scope.$digest();
           expect(scope.foodCounter).toEqual(0);

           // Update food and run digest.  Now the counter will increment
           food = 'cheeseburger';
           scope.$digest();
           expect(scope.foodCounter).toEqual(1);

       * ```
       *
       *
       *
       * @param {(function()|string)} watchExpression Expression that is evaluated on each
       *    {@link ng.$rootScope.Scope#$digest $digest} cycle. A change in the return value triggers
       *    a call to the `listener`.
       *
       *    - `string`: Evaluated as {@link guide/expression expression}
       *    - `function(scope)`: called with current `scope` as a parameter.
       * @param {function(newVal, oldVal, scope)} listener Callback called whenever the value
       *    of `watchExpression` changes.
       *
       *    - `newVal` contains the current value of the `watchExpression`
       *    - `oldVal` contains the previous value of the `watchExpression`
       *    - `scope` refers to the current scope
       * @param {boolean=} [objectEquality=false] Compare for object equality using {@link angular.equals} instead of
       *     comparing for reference equality.
       * @returns {function()} Returns a deregistration function for this listener.
       */
      $watch: function(watchExp, listener, objectEquality, prettyPrintExpression) {
        var get = $parse(watchExp);

        if (get.$$watchDelegate) {
          return get.$$watchDelegate(this, listener, objectEquality, get, watchExp);
        }
        var scope = this,
            array = scope.$$watchers,
            watcher = {
              fn: listener,
              last: initWatchVal,
              get: get,
              exp: prettyPrintExpression || watchExp,
              eq: !!objectEquality
            };

        lastDirtyWatch = null;

        if (!isFunction(listener)) {
          watcher.fn = noop;
        }

        if (!array) {
          array = scope.$$watchers = [];
          array.$$digestWatchIndex = -1;
        }
        // we use unshift since we use a while loop in $digest for speed.
        // the while loop reads in reverse order.
        array.unshift(watcher);
        array.$$digestWatchIndex++;
        incrementWatchersCount(this, 1);

        return function deregisterWatch() {
          var index = arrayRemove(array, watcher);
          if (index >= 0) {
            incrementWatchersCount(scope, -1);
            if (index < array.$$digestWatchIndex) {
              array.$$digestWatchIndex--;
            }
          }
          lastDirtyWatch = null;
        };
      },

      /**
       * @ngdoc method
       * @name $rootScope.Scope#$watchGroup
       * @kind function
       *
       * @description
       * A variant of {@link ng.$rootScope.Scope#$watch $watch()} where it watches an array of `watchExpressions`.
       * If any one expression in the collection changes the `listener` is executed.
       *
       * - The items in the `watchExpressions` array are observed via the standard `$watch` operation. Their return
       *   values are examined for changes on every call to `$digest`.
       * - The `listener` is called whenever any expression in the `watchExpressions` array changes.
       *
       * @param {Array.<string|Function(scope)>} watchExpressions Array of expressions that will be individually
       * watched using {@link ng.$rootScope.Scope#$watch $watch()}
       *
       * @param {function(newValues, oldValues, scope)} listener Callback called whenever the return value of any
       *    expression in `watchExpressions` changes
       *    The `newValues` array contains the current values of the `watchExpressions`, with the indexes matching
       *    those of `watchExpression`
       *    and the `oldValues` array contains the previous values of the `watchExpressions`, with the indexes matching
       *    those of `watchExpression`
       *    The `scope` refers to the current scope.
       * @returns {function()} Returns a de-registration function for all listeners.
       */
      $watchGroup: function(watchExpressions, listener) {
        var oldValues = new Array(watchExpressions.length);
        var newValues = new Array(watchExpressions.length);
        var deregisterFns = [];
        var self = this;
        var changeReactionScheduled = false;
        var firstRun = true;

        if (!watchExpressions.length) {
          // No expressions means we call the listener ASAP
          var shouldCall = true;
          self.$evalAsync(function() {
            if (shouldCall) listener(newValues, newValues, self);
          });
          return function deregisterWatchGroup() {
            shouldCall = false;
          };
        }

        if (watchExpressions.length === 1) {
          // Special case size of one
          return this.$watch(watchExpressions[0], function watchGroupAction(value, oldValue, scope) {
            newValues[0] = value;
            oldValues[0] = oldValue;
            listener(newValues, (value === oldValue) ? newValues : oldValues, scope);
          });
        }

        forEach(watchExpressions, function(expr, i) {
          var unwatchFn = self.$watch(expr, function watchGroupSubAction(value, oldValue) {
            newValues[i] = value;
            oldValues[i] = oldValue;
            if (!changeReactionScheduled) {
              changeReactionScheduled = true;
              self.$evalAsync(watchGroupAction);
            }
          });
          deregisterFns.push(unwatchFn);
        });

        function watchGroupAction() {
          changeReactionScheduled = false;

          if (firstRun) {
            firstRun = false;
            listener(newValues, newValues, self);
          } else {
            listener(newValues, oldValues, self);
          }
        }

        return function deregisterWatchGroup() {
          while (deregisterFns.length) {
            deregisterFns.shift()();
          }
        };
      },


      /**
       * @ngdoc method
       * @name $rootScope.Scope#$watchCollection
       * @kind function
       *
       * @description
       * Shallow watches the properties of an object and fires whenever any of the properties change
       * (for arrays, this implies watching the array items; for object maps, this implies watching
       * the properties). If a change is detected, the `listener` callback is fired.
       *
       * - The `obj` collection is observed via standard $watch operation and is examined on every
       *   call to $digest() to see if any items have been added, removed, or moved.
       * - The `listener` is called whenever anything within the `obj` has changed. Examples include
       *   adding, removing, and moving items belonging to an object or array.
       *
       *
       * # Example
       * ```js
          $scope.names = ['igor', 'matias', 'misko', 'james'];
          $scope.dataCount = 4;

          $scope.$watchCollection('names', function(newNames, oldNames) {
            $scope.dataCount = newNames.length;
          });

          expect($scope.dataCount).toEqual(4);
          $scope.$digest();

          //still at 4 ... no changes
          expect($scope.dataCount).toEqual(4);

          $scope.names.pop();
          $scope.$digest();

          //now there's been a change
          expect($scope.dataCount).toEqual(3);
       * ```
       *
       *
       * @param {string|function(scope)} obj Evaluated as {@link guide/expression expression}. The
       *    expression value should evaluate to an object or an array which is observed on each
       *    {@link ng.$rootScope.Scope#$digest $digest} cycle. Any shallow change within the
       *    collection will trigger a call to the `listener`.
       *
       * @param {function(newCollection, oldCollection, scope)} listener a callback function called
       *    when a change is detected.
       *    - The `newCollection` object is the newly modified data obtained from the `obj` expression
       *    - The `oldCollection` object is a copy of the former collection data.
       *      Due to performance considerations, the`oldCollection` value is computed only if the
       *      `listener` function declares two or more arguments.
       *    - The `scope` argument refers to the current scope.
       *
       * @returns {function()} Returns a de-registration function for this listener. When the
       *    de-registration function is executed, the internal watch operation is terminated.
       */
      $watchCollection: function(obj, listener) {
        $watchCollectionInterceptor.$stateful = true;

        var self = this;
        // the current value, updated on each dirty-check run
        var newValue;
        // a shallow copy of the newValue from the last dirty-check run,
        // updated to match newValue during dirty-check run
        var oldValue;
        // a shallow copy of the newValue from when the last change happened
        var veryOldValue;
        // only track veryOldValue if the listener is asking for it
        var trackVeryOldValue = (listener.length > 1);
        var changeDetected = 0;
        var changeDetector = $parse(obj, $watchCollectionInterceptor);
        var internalArray = [];
        var internalObject = {};
        var initRun = true;
        var oldLength = 0;

        function $watchCollectionInterceptor(_value) {
          newValue = _value;
          var newLength, key, bothNaN, newItem, oldItem;

          // If the new value is undefined, then return undefined as the watch may be a one-time watch
          if (isUndefined(newValue)) return;

          if (!isObject(newValue)) { // if primitive
            if (oldValue !== newValue) {
              oldValue = newValue;
              changeDetected++;
            }
          } else if (isArrayLike(newValue)) {
            if (oldValue !== internalArray) {
              // we are transitioning from something which was not an array into array.
              oldValue = internalArray;
              oldLength = oldValue.length = 0;
              changeDetected++;
            }

            newLength = newValue.length;

            if (oldLength !== newLength) {
              // if lengths do not match we need to trigger change notification
              changeDetected++;
              oldValue.length = oldLength = newLength;
            }
            // copy the items to oldValue and look for changes.
            for (var i = 0; i < newLength; i++) {
              oldItem = oldValue[i];
              newItem = newValue[i];

              // eslint-disable-next-line no-self-compare
              bothNaN = (oldItem !== oldItem) && (newItem !== newItem);
              if (!bothNaN && (oldItem !== newItem)) {
                changeDetected++;
                oldValue[i] = newItem;
              }
            }
          } else {
            if (oldValue !== internalObject) {
              // we are transitioning from something which was not an object into object.
              oldValue = internalObject = {};
              oldLength = 0;
              changeDetected++;
            }
            // copy the items to oldValue and look for changes.
            newLength = 0;
            for (key in newValue) {
              if (hasOwnProperty.call(newValue, key)) {
                newLength++;
                newItem = newValue[key];
                oldItem = oldValue[key];

                if (key in oldValue) {
                  // eslint-disable-next-line no-self-compare
                  bothNaN = (oldItem !== oldItem) && (newItem !== newItem);
                  if (!bothNaN && (oldItem !== newItem)) {
                    changeDetected++;
                    oldValue[key] = newItem;
                  }
                } else {
                  oldLength++;
                  oldValue[key] = newItem;
                  changeDetected++;
                }
              }
            }
            if (oldLength > newLength) {
              // we used to have more keys, need to find them and destroy them.
              changeDetected++;
              for (key in oldValue) {
                if (!hasOwnProperty.call(newValue, key)) {
                  oldLength--;
                  delete oldValue[key];
                }
              }
            }
          }
          return changeDetected;
        }

        function $watchCollectionAction() {
          if (initRun) {
            initRun = false;
            listener(newValue, newValue, self);
          } else {
            listener(newValue, veryOldValue, self);
          }

          // make a copy for the next time a collection is changed
          if (trackVeryOldValue) {
            if (!isObject(newValue)) {
              //primitive
              veryOldValue = newValue;
            } else if (isArrayLike(newValue)) {
              veryOldValue = new Array(newValue.length);
              for (var i = 0; i < newValue.length; i++) {
                veryOldValue[i] = newValue[i];
              }
            } else { // if object
              veryOldValue = {};
              for (var key in newValue) {
                if (hasOwnProperty.call(newValue, key)) {
                  veryOldValue[key] = newValue[key];
                }
              }
            }
          }
        }

        return this.$watch(changeDetector, $watchCollectionAction);
      },

      /**
       * @ngdoc method
       * @name $rootScope.Scope#$digest
       * @kind function
       *
       * @description
       * Processes all of the {@link ng.$rootScope.Scope#$watch watchers} of the current scope and
       * its children. Because a {@link ng.$rootScope.Scope#$watch watcher}'s listener can change
       * the model, the `$digest()` keeps calling the {@link ng.$rootScope.Scope#$watch watchers}
       * until no more listeners are firing. This means that it is possible to get into an infinite
       * loop. This function will throw `'Maximum iteration limit exceeded.'` if the number of
       * iterations exceeds 10.
       *
       * Usually, you don't call `$digest()` directly in
       * {@link ng.directive:ngController controllers} or in
       * {@link ng.$compileProvider#directive directives}.
       * Instead, you should call {@link ng.$rootScope.Scope#$apply $apply()} (typically from within
       * a {@link ng.$compileProvider#directive directive}), which will force a `$digest()`.
       *
       * If you want to be notified whenever `$digest()` is called,
       * you can register a `watchExpression` function with
       * {@link ng.$rootScope.Scope#$watch $watch()} with no `listener`.
       *
       * In unit tests, you may need to call `$digest()` to simulate the scope life cycle.
       *
       * # Example
       * ```js
           var scope = ...;
           scope.name = 'misko';
           scope.counter = 0;

           expect(scope.counter).toEqual(0);
           scope.$watch('name', function(newValue, oldValue) {
             scope.counter = scope.counter + 1;
           });
           expect(scope.counter).toEqual(0);

           scope.$digest();
           // the listener is always called during the first $digest loop after it was registered
           expect(scope.counter).toEqual(1);

           scope.$digest();
           // but now it will not be called unless the value changes
           expect(scope.counter).toEqual(1);

           scope.name = 'adam';
           scope.$digest();
           expect(scope.counter).toEqual(2);
       * ```
       *
       */
      $digest: function() {
        var watch, value, last, fn, get,
            watchers,
            dirty, ttl = TTL,
            next, current, target = this,
            watchLog = [],
            logIdx, asyncTask;

        beginPhase('$digest');
        // Check for changes to browser url that happened in sync before the call to $digest
        $browser.$$checkUrlChange();

        if (this === $rootScope && applyAsyncId !== null) {
          // If this is the root scope, and $applyAsync has scheduled a deferred $apply(), then
          // cancel the scheduled $apply and flush the queue of expressions to be evaluated.
          $browser.defer.cancel(applyAsyncId);
          flushApplyAsync();
        }

        lastDirtyWatch = null;

        do { // "while dirty" loop
          dirty = false;
          current = target;

          // It's safe for asyncQueuePosition to be a local variable here because this loop can't
          // be reentered recursively. Calling $digest from a function passed to $applyAsync would
          // lead to a '$digest already in progress' error.
          for (var asyncQueuePosition = 0; asyncQueuePosition < asyncQueue.length; asyncQueuePosition++) {
            try {
              asyncTask = asyncQueue[asyncQueuePosition];
              asyncTask.scope.$eval(asyncTask.expression, asyncTask.locals);
            } catch (e) {
              $exceptionHandler(e);
            }
            lastDirtyWatch = null;
          }
          asyncQueue.length = 0;

          traverseScopesLoop:
          do { // "traverse the scopes" loop
            if ((watchers = current.$$watchers)) {
              // process our watches
              watchers.$$digestWatchIndex = watchers.length;
              while (watchers.$$digestWatchIndex--) {
                try {
                  watch = watchers[watchers.$$digestWatchIndex];
                  // Most common watches are on primitives, in which case we can short
                  // circuit it with === operator, only when === fails do we use .equals
                  if (watch) {
                    get = watch.get;
                    if ((value = get(current)) !== (last = watch.last) &&
                        !(watch.eq
                            ? equals(value, last)
                            : (isNumberNaN(value) && isNumberNaN(last)))) {
                      dirty = true;
                      lastDirtyWatch = watch;
                      watch.last = watch.eq ? copy(value, null) : value;
                      fn = watch.fn;
                      fn(value, ((last === initWatchVal) ? value : last), current);
                      if (ttl < 5) {
                        logIdx = 4 - ttl;
                        if (!watchLog[logIdx]) watchLog[logIdx] = [];
                        watchLog[logIdx].push({
                          msg: isFunction(watch.exp) ? 'fn: ' + (watch.exp.name || watch.exp.toString()) : watch.exp,
                          newVal: value,
                          oldVal: last
                        });
                      }
                    } else if (watch === lastDirtyWatch) {
                      // If the most recently dirty watcher is now clean, short circuit since the remaining watchers
                      // have already been tested.
                      dirty = false;
                      break traverseScopesLoop;
                    }
                  }
                } catch (e) {
                  $exceptionHandler(e);
                }
              }
            }

            // Insanity Warning: scope depth-first traversal
            // yes, this code is a bit crazy, but it works and we have tests to prove it!
            // this piece should be kept in sync with the traversal in $broadcast
            if (!(next = ((current.$$watchersCount && current.$$childHead) ||
                (current !== target && current.$$nextSibling)))) {
              while (current !== target && !(next = current.$$nextSibling)) {
                current = current.$parent;
              }
            }
          } while ((current = next));

          // `break traverseScopesLoop;` takes us to here

          if ((dirty || asyncQueue.length) && !(ttl--)) {
            clearPhase();
            throw $rootScopeMinErr('infdig',
                '{0} $digest() iterations reached. Aborting!\n' +
                'Watchers fired in the last 5 iterations: {1}',
                TTL, watchLog);
          }

        } while (dirty || asyncQueue.length);

        clearPhase();

        // postDigestQueuePosition isn't local here because this loop can be reentered recursively.
        while (postDigestQueuePosition < postDigestQueue.length) {
          try {
            postDigestQueue[postDigestQueuePosition++]();
          } catch (e) {
            $exceptionHandler(e);
          }
        }
        postDigestQueue.length = postDigestQueuePosition = 0;
      },


      /**
       * @ngdoc event
       * @name $rootScope.Scope#$destroy
       * @eventType broadcast on scope being destroyed
       *
       * @description
       * Broadcasted when a scope and its children are being destroyed.
       *
       * Note that, in AngularJS, there is also a `$destroy` jQuery event, which can be used to
       * clean up DOM bindings before an element is removed from the DOM.
       */

      /**
       * @ngdoc method
       * @name $rootScope.Scope#$destroy
       * @kind function
       *
       * @description
       * Removes the current scope (and all of its children) from the parent scope. Removal implies
       * that calls to {@link ng.$rootScope.Scope#$digest $digest()} will no longer
       * propagate to the current scope and its children. Removal also implies that the current
       * scope is eligible for garbage collection.
       *
       * The `$destroy()` is usually used by directives such as
       * {@link ng.directive:ngRepeat ngRepeat} for managing the
       * unrolling of the loop.
       *
       * Just before a scope is destroyed, a `$destroy` event is broadcasted on this scope.
       * Application code can register a `$destroy` event handler that will give it a chance to
       * perform any necessary cleanup.
       *
       * Note that, in AngularJS, there is also a `$destroy` jQuery event, which can be used to
       * clean up DOM bindings before an element is removed from the DOM.
       */
      $destroy: function() {
        // We can't destroy a scope that has been already destroyed.
        if (this.$$destroyed) return;
        var parent = this.$parent;

        this.$broadcast('$destroy');
        this.$$destroyed = true;

        if (this === $rootScope) {
          //Remove handlers attached to window when $rootScope is removed
          $browser.$$applicationDestroyed();
        }

        incrementWatchersCount(this, -this.$$watchersCount);
        for (var eventName in this.$$listenerCount) {
          decrementListenerCount(this, this.$$listenerCount[eventName], eventName);
        }

        // sever all the references to parent scopes (after this cleanup, the current scope should
        // not be retained by any of our references and should be eligible for garbage collection)
        if (parent && parent.$$childHead === this) parent.$$childHead = this.$$nextSibling;
        if (parent && parent.$$childTail === this) parent.$$childTail = this.$$prevSibling;
        if (this.$$prevSibling) this.$$prevSibling.$$nextSibling = this.$$nextSibling;
        if (this.$$nextSibling) this.$$nextSibling.$$prevSibling = this.$$prevSibling;

        // Disable listeners, watchers and apply/digest methods
        this.$destroy = this.$digest = this.$apply = this.$evalAsync = this.$applyAsync = noop;
        this.$on = this.$watch = this.$watchGroup = function() { return noop; };
        this.$$listeners = {};

        // Disconnect the next sibling to prevent `cleanUpScope` destroying those too
        this.$$nextSibling = null;
        cleanUpScope(this);
      },

      /**
       * @ngdoc method
       * @name $rootScope.Scope#$eval
       * @kind function
       *
       * @description
       * Executes the `expression` on the current scope and returns the result. Any exceptions in
       * the expression are propagated (uncaught). This is useful when evaluating Angular
       * expressions.
       *
       * # Example
       * ```js
           var scope = ng.$rootScope.Scope();
           scope.a = 1;
           scope.b = 2;

           expect(scope.$eval('a+b')).toEqual(3);
           expect(scope.$eval(function(scope){ return scope.a + scope.b; })).toEqual(3);
       * ```
       *
       * @param {(string|function())=} expression An angular expression to be executed.
       *
       *    - `string`: execute using the rules as defined in  {@link guide/expression expression}.
       *    - `function(scope)`: execute the function with the current `scope` parameter.
       *
       * @param {(object)=} locals Local variables object, useful for overriding values in scope.
       * @returns {*} The result of evaluating the expression.
       */
      $eval: function(expr, locals) {
        return $parse(expr)(this, locals);
      },

      /**
       * @ngdoc method
       * @name $rootScope.Scope#$evalAsync
       * @kind function
       *
       * @description
       * Executes the expression on the current scope at a later point in time.
       *
       * The `$evalAsync` makes no guarantees as to when the `expression` will be executed, only
       * that:
       *
       *   - it will execute after the function that scheduled the evaluation (preferably before DOM
       *     rendering).
       *   - at least one {@link ng.$rootScope.Scope#$digest $digest cycle} will be performed after
       *     `expression` execution.
       *
       * Any exceptions from the execution of the expression are forwarded to the
       * {@link ng.$exceptionHandler $exceptionHandler} service.
       *
       * __Note:__ if this function is called outside of a `$digest` cycle, a new `$digest` cycle
       * will be scheduled. However, it is encouraged to always call code that changes the model
       * from within an `$apply` call. That includes code evaluated via `$evalAsync`.
       *
       * @param {(string|function())=} expression An angular expression to be executed.
       *
       *    - `string`: execute using the rules as defined in {@link guide/expression expression}.
       *    - `function(scope)`: execute the function with the current `scope` parameter.
       *
       * @param {(object)=} locals Local variables object, useful for overriding values in scope.
       */
      $evalAsync: function(expr, locals) {
        // if we are outside of an $digest loop and this is the first time we are scheduling async
        // task also schedule async auto-flush
        if (!$rootScope.$$phase && !asyncQueue.length) {
          $browser.defer(function() {
            if (asyncQueue.length) {
              $rootScope.$digest();
            }
          });
        }

        asyncQueue.push({scope: this, expression: $parse(expr), locals: locals});
      },

      $$postDigest: function(fn) {
        postDigestQueue.push(fn);
      },

      /**
       * @ngdoc method
       * @name $rootScope.Scope#$apply
       * @kind function
       *
       * @description
       * `$apply()` is used to execute an expression in angular from outside of the angular
       * framework. (For example from browser DOM events, setTimeout, XHR or third party libraries).
       * Because we are calling into the angular framework we need to perform proper scope life
       * cycle of {@link ng.$exceptionHandler exception handling},
       * {@link ng.$rootScope.Scope#$digest executing watches}.
       *
       * ## Life cycle
       *
       * # Pseudo-Code of `$apply()`
       * ```js
           function $apply(expr) {
             try {
               return $eval(expr);
             } catch (e) {
               $exceptionHandler(e);
             } finally {
               $root.$digest();
             }
           }
       * ```
       *
       *
       * Scope's `$apply()` method transitions through the following stages:
       *
       * 1. The {@link guide/expression expression} is executed using the
       *    {@link ng.$rootScope.Scope#$eval $eval()} method.
       * 2. Any exceptions from the execution of the expression are forwarded to the
       *    {@link ng.$exceptionHandler $exceptionHandler} service.
       * 3. The {@link ng.$rootScope.Scope#$watch watch} listeners are fired immediately after the
       *    expression was executed using the {@link ng.$rootScope.Scope#$digest $digest()} method.
       *
       *
       * @param {(string|function())=} exp An angular expression to be executed.
       *
       *    - `string`: execute using the rules as defined in {@link guide/expression expression}.
       *    - `function(scope)`: execute the function with current `scope` parameter.
       *
       * @returns {*} The result of evaluating the expression.
       */
      $apply: function(expr) {
        try {
          beginPhase('$apply');
          try {
            return this.$eval(expr);
          } finally {
            clearPhase();
          }
        } catch (e) {
          $exceptionHandler(e);
        } finally {
          try {
            $rootScope.$digest();
          } catch (e) {
            $exceptionHandler(e);
            // eslint-disable-next-line no-unsafe-finally
            throw e;
          }
        }
      },

      /**
       * @ngdoc method
       * @name $rootScope.Scope#$applyAsync
       * @kind function
       *
       * @description
       * Schedule the invocation of $apply to occur at a later time. The actual time difference
       * varies across browsers, but is typically around ~10 milliseconds.
       *
       * This can be used to queue up multiple expressions which need to be evaluated in the same
       * digest.
       *
       * @param {(string|function())=} exp An angular expression to be executed.
       *
       *    - `string`: execute using the rules as defined in {@link guide/expression expression}.
       *    - `function(scope)`: execute the function with current `scope` parameter.
       */
      $applyAsync: function(expr) {
        var scope = this;
        if (expr) {
          applyAsyncQueue.push($applyAsyncExpression);
        }
        expr = $parse(expr);
        scheduleApplyAsync();

        function $applyAsyncExpression() {
          scope.$eval(expr);
        }
      },

      /**
       * @ngdoc method
       * @name $rootScope.Scope#$on
       * @kind function
       *
       * @description
       * Listens on events of a given type. See {@link ng.$rootScope.Scope#$emit $emit} for
       * discussion of event life cycle.
       *
       * The event listener function format is: `function(event, args...)`. The `event` object
       * passed into the listener has the following attributes:
       *
       *   - `targetScope` - `{Scope}`: the scope on which the event was `$emit`-ed or
       *     `$broadcast`-ed.
       *   - `currentScope` - `{Scope}`: the scope that is currently handling the event. Once the
       *     event propagates through the scope hierarchy, this property is set to null.
       *   - `name` - `{string}`: name of the event.
       *   - `stopPropagation` - `{function=}`: calling `stopPropagation` function will cancel
       *     further event propagation (available only for events that were `$emit`-ed).
       *   - `preventDefault` - `{function}`: calling `preventDefault` sets `defaultPrevented` flag
       *     to true.
       *   - `defaultPrevented` - `{boolean}`: true if `preventDefault` was called.
       *
       * @param {string} name Event name to listen on.
       * @param {function(event, ...args)} listener Function to call when the event is emitted.
       * @returns {function()} Returns a deregistration function for this listener.
       */
      $on: function(name, listener) {
        var namedListeners = this.$$listeners[name];
        if (!namedListeners) {
          this.$$listeners[name] = namedListeners = [];
        }
        namedListeners.push(listener);

        var current = this;
        do {
          if (!current.$$listenerCount[name]) {
            current.$$listenerCount[name] = 0;
          }
          current.$$listenerCount[name]++;
        } while ((current = current.$parent));

        var self = this;
        return function() {
          var indexOfListener = namedListeners.indexOf(listener);
          if (indexOfListener !== -1) {
            namedListeners[indexOfListener] = null;
            decrementListenerCount(self, 1, name);
          }
        };
      },


      /**
       * @ngdoc method
       * @name $rootScope.Scope#$emit
       * @kind function
       *
       * @description
       * Dispatches an event `name` upwards through the scope hierarchy notifying the
       * registered {@link ng.$rootScope.Scope#$on} listeners.
       *
       * The event life cycle starts at the scope on which `$emit` was called. All
       * {@link ng.$rootScope.Scope#$on listeners} listening for `name` event on this scope get
       * notified. Afterwards, the event traverses upwards toward the root scope and calls all
       * registered listeners along the way. The event will stop propagating if one of the listeners
       * cancels it.
       *
       * Any exception emitted from the {@link ng.$rootScope.Scope#$on listeners} will be passed
       * onto the {@link ng.$exceptionHandler $exceptionHandler} service.
       *
       * @param {string} name Event name to emit.
       * @param {...*} args Optional one or more arguments which will be passed onto the event listeners.
       * @return {Object} Event object (see {@link ng.$rootScope.Scope#$on}).
       */
      $emit: function(name, args) {
        var empty = [],
            namedListeners,
            scope = this,
            stopPropagation = false,
            event = {
              name: name,
              targetScope: scope,
              stopPropagation: function() {stopPropagation = true;},
              preventDefault: function() {
                event.defaultPrevented = true;
              },
              defaultPrevented: false
            },
            listenerArgs = concat([event], arguments, 1),
            i, length;

        do {
          namedListeners = scope.$$listeners[name] || empty;
          event.currentScope = scope;
          for (i = 0, length = namedListeners.length; i < length; i++) {

            // if listeners were deregistered, defragment the array
            if (!namedListeners[i]) {
              namedListeners.splice(i, 1);
              i--;
              length--;
              continue;
            }
            try {
              //allow all listeners attached to the current scope to run
              namedListeners[i].apply(null, listenerArgs);
            } catch (e) {
              $exceptionHandler(e);
            }
          }
          //if any listener on the current scope stops propagation, prevent bubbling
          if (stopPropagation) {
            event.currentScope = null;
            return event;
          }
          //traverse upwards
          scope = scope.$parent;
        } while (scope);

        event.currentScope = null;

        return event;
      },


      /**
       * @ngdoc method
       * @name $rootScope.Scope#$broadcast
       * @kind function
       *
       * @description
       * Dispatches an event `name` downwards to all child scopes (and their children) notifying the
       * registered {@link ng.$rootScope.Scope#$on} listeners.
       *
       * The event life cycle starts at the scope on which `$broadcast` was called. All
       * {@link ng.$rootScope.Scope#$on listeners} listening for `name` event on this scope get
       * notified. Afterwards, the event propagates to all direct and indirect scopes of the current
       * scope and calls all registered listeners along the way. The event cannot be canceled.
       *
       * Any exception emitted from the {@link ng.$rootScope.Scope#$on listeners} will be passed
       * onto the {@link ng.$exceptionHandler $exceptionHandler} service.
       *
       * @param {string} name Event name to broadcast.
       * @param {...*} args Optional one or more arguments which will be passed onto the event listeners.
       * @return {Object} Event object, see {@link ng.$rootScope.Scope#$on}
       */
      $broadcast: function(name, args) {
        var target = this,
            current = target,
            next = target,
            event = {
              name: name,
              targetScope: target,
              preventDefault: function() {
                event.defaultPrevented = true;
              },
              defaultPrevented: false
            };

        if (!target.$$listenerCount[name]) return event;

        var listenerArgs = concat([event], arguments, 1),
            listeners, i, length;

        //down while you can, then up and next sibling or up and next sibling until back at root
        while ((current = next)) {
          event.currentScope = current;
          listeners = current.$$listeners[name] || [];
          for (i = 0, length = listeners.length; i < length; i++) {
            // if listeners were deregistered, defragment the array
            if (!listeners[i]) {
              listeners.splice(i, 1);
              i--;
              length--;
              continue;
            }

            try {
              listeners[i].apply(null, listenerArgs);
            } catch (e) {
              $exceptionHandler(e);
            }
          }

          // Insanity Warning: scope depth-first traversal
          // yes, this code is a bit crazy, but it works and we have tests to prove it!
          // this piece should be kept in sync with the traversal in $digest
          // (though it differs due to having the extra check for $$listenerCount)
          if (!(next = ((current.$$listenerCount[name] && current.$$childHead) ||
              (current !== target && current.$$nextSibling)))) {
            while (current !== target && !(next = current.$$nextSibling)) {
              current = current.$parent;
            }
          }
        }

        event.currentScope = null;
        return event;
      }
    };

    var $rootScope = new Scope();

    //The internal queues. Expose them on the $rootScope for debugging/testing purposes.
    var asyncQueue = $rootScope.$$asyncQueue = [];
    var postDigestQueue = $rootScope.$$postDigestQueue = [];
    var applyAsyncQueue = $rootScope.$$applyAsyncQueue = [];

    var postDigestQueuePosition = 0;

    return $rootScope;


    function beginPhase(phase) {
      if ($rootScope.$$phase) {
        throw $rootScopeMinErr('inprog', '{0} already in progress', $rootScope.$$phase);
      }

      $rootScope.$$phase = phase;
    }

    function clearPhase() {
      $rootScope.$$phase = null;
    }

    function incrementWatchersCount(current, count) {
      do {
        current.$$watchersCount += count;
      } while ((current = current.$parent));
    }

    function decrementListenerCount(current, count, name) {
      do {
        current.$$listenerCount[name] -= count;

        if (current.$$listenerCount[name] === 0) {
          delete current.$$listenerCount[name];
        }
      } while ((current = current.$parent));
    }

    /**
     * function used as an initial value for watchers.
     * because it's unique we can easily tell it apart from other values
     */
    function initWatchVal() {}

    function flushApplyAsync() {
      while (applyAsyncQueue.length) {
        try {
          applyAsyncQueue.shift()();
        } catch (e) {
          $exceptionHandler(e);
        }
      }
      applyAsyncId = null;
    }

    function scheduleApplyAsync() {
      if (applyAsyncId === null) {
        applyAsyncId = $browser.defer(function() {
          $rootScope.$apply(flushApplyAsync);
        });
      }
    }
  }];
}

/**
 * @ngdoc service
 * @name $rootElement
 *
 * @description
 * The root element of Angular application. This is either the element where {@link
 * ng.directive:ngApp ngApp} was declared or the element passed into
 * {@link angular.bootstrap}. The element represents the root element of application. It is also the
 * location where the application's {@link auto.$injector $injector} service gets
 * published, and can be retrieved using `$rootElement.injector()`.
 */


// the implementation is in angular.bootstrap

/**
 * @this
 * @description
 * Private service to sanitize uris for links and images. Used by $compile and $sanitize.
 */
function $$SanitizeUriProvider() {
  var aHrefSanitizationWhitelist = /^\s*(https?|ftp|mailto|tel|file):/,
    imgSrcSanitizationWhitelist = /^\s*((https?|ftp|file|blob):|data:image\/)/;

  /**
   * @description
   * Retrieves or overrides the default regular expression that is used for whitelisting of safe
   * urls during a[href] sanitization.
   *
   * The sanitization is a security measure aimed at prevent XSS attacks via html links.
   *
   * Any url about to be assigned to a[href] via data-binding is first normalized and turned into
   * an absolute url. Afterwards, the url is matched against the `aHrefSanitizationWhitelist`
   * regular expression. If a match is found, the original url is written into the dom. Otherwise,
   * the absolute url is prefixed with `'unsafe:'` string and only then is it written into the DOM.
   *
   * @param {RegExp=} regexp New regexp to whitelist urls with.
   * @returns {RegExp|ng.$compileProvider} Current RegExp if called without value or self for
   *    chaining otherwise.
   */
  this.aHrefSanitizationWhitelist = function(regexp) {
    if (isDefined(regexp)) {
      aHrefSanitizationWhitelist = regexp;
      return this;
    }
    return aHrefSanitizationWhitelist;
  };


  /**
   * @description
   * Retrieves or overrides the default regular expression that is used for whitelisting of safe
   * urls during img[src] sanitization.
   *
   * The sanitization is a security measure aimed at prevent XSS attacks via html links.
   *
   * Any url about to be assigned to img[src] via data-binding is first normalized and turned into
   * an absolute url. Afterwards, the url is matched against the `imgSrcSanitizationWhitelist`
   * regular expression. If a match is found, the original url is written into the dom. Otherwise,
   * the absolute url is prefixed with `'unsafe:'` string and only then is it written into the DOM.
   *
   * @param {RegExp=} regexp New regexp to whitelist urls with.
   * @returns {RegExp|ng.$compileProvider} Current RegExp if called without value or self for
   *    chaining otherwise.
   */
  this.imgSrcSanitizationWhitelist = function(regexp) {
    if (isDefined(regexp)) {
      imgSrcSanitizationWhitelist = regexp;
      return this;
    }
    return imgSrcSanitizationWhitelist;
  };

  this.$get = function() {
    return function sanitizeUri(uri, isImage) {
      var regex = isImage ? imgSrcSanitizationWhitelist : aHrefSanitizationWhitelist;
      var normalizedVal;
      normalizedVal = urlResolve(uri).href;
      if (normalizedVal !== '' && !normalizedVal.match(regex)) {
        return 'unsafe:' + normalizedVal;
      }
      return uri;
    };
  };
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *     Any commits to this file should be reviewed with security in mind.  *
 *   Changes to this file can potentially create security vulnerabilities. *
 *          An approval from 2 Core members with history of modifying      *
 *                         this file is required.                          *
 *                                                                         *
 *  Does the change somehow allow for arbitrary javascript to be executed? *
 *    Or allows for someone to change the prototype of built-in objects?   *
 *     Or gives undesired access to variables likes document or window?    *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/* exported $SceProvider, $SceDelegateProvider */

var $sceMinErr = minErr('$sce');

var SCE_CONTEXTS = {
  HTML: 'html',
  CSS: 'css',
  URL: 'url',
  // RESOURCE_URL is a subtype of URL used in contexts where a privileged resource is sourced from a
  // url.  (e.g. ng-include, script src, templateUrl)
  RESOURCE_URL: 'resourceUrl',
  JS: 'js'
};

// Helper functions follow.

var UNDERSCORE_LOWERCASE_REGEXP = /_([a-z])/g;

function snakeToCamel(name) {
  return name
    .replace(UNDERSCORE_LOWERCASE_REGEXP, fnCamelCaseReplace);
}

function adjustMatcher(matcher) {
  if (matcher === 'self') {
    return matcher;
  } else if (isString(matcher)) {
    // Strings match exactly except for 2 wildcards - '*' and '**'.
    // '*' matches any character except those from the set ':/.?&'.
    // '**' matches any character (like .* in a RegExp).
    // More than 2 *'s raises an error as it's ill defined.
    if (matcher.indexOf('***') > -1) {
      throw $sceMinErr('iwcard',
          'Illegal sequence *** in string matcher.  String: {0}', matcher);
    }
    matcher = escapeForRegexp(matcher).
                  replace(/\\\*\\\*/g, '.*').
                  replace(/\\\*/g, '[^:/.?&;]*');
    return new RegExp('^' + matcher + '$');
  } else if (isRegExp(matcher)) {
    // The only other type of matcher allowed is a Regexp.
    // Match entire URL / disallow partial matches.
    // Flags are reset (i.e. no global, ignoreCase or multiline)
    return new RegExp('^' + matcher.source + '$');
  } else {
    throw $sceMinErr('imatcher',
        'Matchers may only be "self", string patterns or RegExp objects');
  }
}


function adjustMatchers(matchers) {
  var adjustedMatchers = [];
  if (isDefined(matchers)) {
    forEach(matchers, function(matcher) {
      adjustedMatchers.push(adjustMatcher(matcher));
    });
  }
  return adjustedMatchers;
}




function $SceDelegateProvider() {
  this.SCE_CONTEXTS = SCE_CONTEXTS;

  // Resource URLs can also be trusted by policy.
  var resourceUrlWhitelist = ['self'],
      resourceUrlBlacklist = [];

  
  this.resourceUrlWhitelist = function(value) {
    if (arguments.length) {
      resourceUrlWhitelist = adjustMatchers(value);
    }
    return resourceUrlWhitelist;
  };



  this.resourceUrlBlacklist = function(value) {
    if (arguments.length) {
      resourceUrlBlacklist = adjustMatchers(value);
    }
    return resourceUrlBlacklist;
  };

  this.$get = ['$injector', function($injector) {

    var htmlSanitizer = function htmlSanitizer(html) {
      throw $sceMinErr('unsafe', 'Attempting to use an unsafe value in a safe context.');
    };

    if ($injector.has('$sanitize')) {
      htmlSanitizer = $injector.get('$sanitize');
    }


    function matchUrl(matcher, parsedUrl) {
      if (matcher === 'self') {
        return urlIsSameOrigin(parsedUrl);
      } else {
        // definitely a regex.  See adjustMatchers()
        return !!matcher.exec(parsedUrl.href);
      }
    }

    function isResourceUrlAllowedByPolicy(url) {
      var parsedUrl = urlResolve(url.toString());
      var i, n, allowed = false;
      // Ensure that at least one item from the whitelist allows this url.
      for (i = 0, n = resourceUrlWhitelist.length; i < n; i++) {
        if (matchUrl(resourceUrlWhitelist[i], parsedUrl)) {
          allowed = true;
          break;
        }
      }
      if (allowed) {
        // Ensure that no item from the blacklist blocked this url.
        for (i = 0, n = resourceUrlBlacklist.length; i < n; i++) {
          if (matchUrl(resourceUrlBlacklist[i], parsedUrl)) {
            allowed = false;
            break;
          }
        }
      }
      return allowed;
    }

    function generateHolderType(Base) {
      var holderType = function TrustedValueHolderType(trustedValue) {
        this.$$unwrapTrustedValue = function() {
          return trustedValue;
        };
      };
      if (Base) {
        holderType.prototype = new Base();
      }
      holderType.prototype.valueOf = function sceValueOf() {
        return this.$$unwrapTrustedValue();
      };
      holderType.prototype.toString = function sceToString() {
        return this.$$unwrapTrustedValue().toString();
      };
      return holderType;
    }

    var trustedValueHolderBase = generateHolderType(),
        byType = {};

    byType[SCE_CONTEXTS.HTML] = generateHolderType(trustedValueHolderBase);
    byType[SCE_CONTEXTS.CSS] = generateHolderType(trustedValueHolderBase);
    byType[SCE_CONTEXTS.URL] = generateHolderType(trustedValueHolderBase);
    byType[SCE_CONTEXTS.JS] = generateHolderType(trustedValueHolderBase);
    byType[SCE_CONTEXTS.RESOURCE_URL] = generateHolderType(byType[SCE_CONTEXTS.URL]);

  
    function trustAs(type, trustedValue) {
      var Constructor = (byType.hasOwnProperty(type) ? byType[type] : null);
      if (!Constructor) {
        throw $sceMinErr('icontext',
            'Attempted to trust a value in invalid context. Context: {0}; Value: {1}',
            type, trustedValue);
      }
      if (trustedValue === null || isUndefined(trustedValue) || trustedValue === '') {
        return trustedValue;
      }

      if (typeof trustedValue !== 'string') {
        throw $sceMinErr('itype',
            'Attempted to trust a non-string value in a content requiring a string: Context: {0}',
            type);
      }
      return new Constructor(trustedValue);
    }

    function valueOf(maybeTrusted) {
      if (maybeTrusted instanceof trustedValueHolderBase) {
        return maybeTrusted.$$unwrapTrustedValue();
      } else {
        return maybeTrusted;
      }
    }


    function getTrusted(type, maybeTrusted) {
      if (maybeTrusted === null || isUndefined(maybeTrusted) || maybeTrusted === '') {
        return maybeTrusted;
      }
      var constructor = (byType.hasOwnProperty(type) ? byType[type] : null);
      if (constructor && maybeTrusted instanceof constructor) {
        return maybeTrusted.$$unwrapTrustedValue();
      }
      // If we get here, then we may only take one of two actions.
      // 1. sanitize the value for the requested type, or
      // 2. throw an exception.
      if (type === SCE_CONTEXTS.RESOURCE_URL) {
        if (isResourceUrlAllowedByPolicy(maybeTrusted)) {
          return maybeTrusted;
        } else {
          throw $sceMinErr('insecurl',
              'Blocked loading resource from url not allowed by $sceDelegate policy.  URL: {0}',
              maybeTrusted.toString());
        }
      } else if (type === SCE_CONTEXTS.HTML) {
        return htmlSanitizer(maybeTrusted);
      }
      throw $sceMinErr('unsafe', 'Attempting to use an unsafe value in a safe context.');
    }

    return { trustAs: trustAs,
             getTrusted: getTrusted,
             valueOf: valueOf };
  }];
}


function $SceProvider() {
  var enabled = true;

  this.enabled = function(value) {
    if (arguments.length) {
      enabled = !!value;
    }
    return enabled;
  };



  this.$get = ['$parse', '$sceDelegate', function(
                $parse,   $sceDelegate) {
    // Support: IE 9-11 only
    // Prereq: Ensure that we're not running in IE<11 quirks mode.  In that mode, IE < 11 allow
    // the "expression(javascript expression)" syntax which is insecure.
    if (enabled && msie < 8) {
      throw $sceMinErr('iequirks',
        'Strict Contextual Escaping does not support Internet Explorer version < 11 in quirks ' +
        'mode.  You can fix this by adding the text <!doctype html> to the top of your HTML ' +
        'document.  See http://docs.angularjs.org/api/ng.$sce for more information.');
    }

    var sce = shallowCopy(SCE_CONTEXTS);


    sce.isEnabled = function() {
      return enabled;
    };
    sce.trustAs = $sceDelegate.trustAs;
    sce.getTrusted = $sceDelegate.getTrusted;
    sce.valueOf = $sceDelegate.valueOf;

    if (!enabled) {
      sce.trustAs = sce.getTrusted = function(type, value) { return value; };
      sce.valueOf = identity;
    }


    sce.parseAs = function sceParseAs(type, expr) {
      var parsed = $parse(expr);
      if (parsed.literal && parsed.constant) {
        return parsed;
      } else {
        return $parse(expr, function(value) {
          return sce.getTrusted(type, value);
        });
      }
    };


  

   

 
 

 
    // Shorthand delegations.
    var parse = sce.parseAs,
        getTrusted = sce.getTrusted,
        trustAs = sce.trustAs;

    forEach(SCE_CONTEXTS, function(enumValue, name) {
      var lName = lowercase(name);
      sce[snakeToCamel('parse_as_' + lName)] = function(expr) {
        return parse(enumValue, expr);
      };
      sce[snakeToCamel('get_trusted_' + lName)] = function(value) {
        return getTrusted(enumValue, value);
      };
      sce[snakeToCamel('trust_as_' + lName)] = function(value) {
        return trustAs(enumValue, value);
      };
    });

    return sce;
  }];
}


function $SnifferProvider() {
  this.$get = ['$window', '$document', function($window, $document) {
    var eventSupport = {},

        isChromePackagedApp =
            $window.chrome &&
            ($window.chrome.app && $window.chrome.app.runtime ||
                !$window.chrome.app && $window.chrome.runtime && $window.chrome.runtime.id),
        hasHistoryPushState = !isChromePackagedApp && $window.history && $window.history.pushState,
        android =
          toInt((/android (\d+)/.exec(lowercase(($window.navigator || {}).userAgent)) || [])[1]),
        boxee = /Boxee/i.test(($window.navigator || {}).userAgent),
        document = $document[0] || {},
        bodyStyle = document.body && document.body.style,
        transitions = false,
        animations = false;

    if (bodyStyle) {
      // Support: Android <5, Blackberry Browser 10, default Chrome in Android 4.4.x
      // Mentioned browsers need a -webkit- prefix for transitions & animations.
      transitions = !!('transition' in bodyStyle || 'webkitTransition' in bodyStyle);
      animations = !!('animation' in bodyStyle || 'webkitAnimation' in bodyStyle);
    }


    return {

      history: !!(hasHistoryPushState && !(android < 4) && !boxee),
      hasEvent: function(event) {
       
        if (event === 'input' && msie) return false;

        if (isUndefined(eventSupport[event])) {
          var divElm = document.createElement('div');
          eventSupport[event] = 'on' + event in divElm;
        }

        return eventSupport[event];
      },
      csp: csp(),
      transitions: transitions,
      animations: animations,
      android: android
    };
  }];
}

var $templateRequestMinErr = minErr('$compile');


function $TemplateRequestProvider() {

  var httpOptions;

  this.httpOptions = function(val) {
    if (val) {
      httpOptions = val;
      return this;
    }
    return httpOptions;
  };

  this.$get = ['$exceptionHandler', '$templateCache', '$http', '$q', '$sce',
    function($exceptionHandler, $templateCache, $http, $q, $sce) {

      function handleRequestFn(tpl, ignoreRequestError) {
        handleRequestFn.totalPendingRequests++;

        if (!isString(tpl) || isUndefined($templateCache.get(tpl))) {
          tpl = $sce.getTrustedResourceUrl(tpl);
        }

        var transformResponse = $http.defaults && $http.defaults.transformResponse;

        if (isArray(transformResponse)) {
          transformResponse = transformResponse.filter(function(transformer) {
            return transformer !== defaultHttpResponseTransform;
          });
        } else if (transformResponse === defaultHttpResponseTransform) {
          transformResponse = null;
        }

        return $http.get(tpl, extend({
            cache: $templateCache,
            transformResponse: transformResponse
          }, httpOptions))
          .finally(function() {
            handleRequestFn.totalPendingRequests--;
          })
          .then(function(response) {
            $templateCache.put(tpl, response.data);
            return response.data;
          }, handleError);

        function handleError(resp) {
          if (!ignoreRequestError) {
            resp = $templateRequestMinErr('tpload',
                'Failed to load template: {0} (HTTP status: {1} {2})',
                tpl, resp.status, resp.statusText);

            $exceptionHandler(resp);
          }

          return $q.reject(resp);
        }
      }

      handleRequestFn.totalPendingRequests = 0;

      return handleRequestFn;
    }
  ];
}

/** @this */
function $$TestabilityProvider() {
  this.$get = ['$rootScope', '$browser', '$location',
       function($rootScope,   $browser,   $location) {

  
    var testability = {};

  
    testability.findBindings = function(element, expression, opt_exactMatch) {
      var bindings = element.getElementsByClassName('ng-binding');
      var matches = [];
      forEach(bindings, function(binding) {
        var dataBinding = angular.element(binding).data('$binding');
        if (dataBinding) {
          forEach(dataBinding, function(bindingName) {
            if (opt_exactMatch) {
              var matcher = new RegExp('(^|\\s)' + escapeForRegexp(expression) + '(\\s|\\||$)');
              if (matcher.test(bindingName)) {
                matches.push(binding);
              }
            } else {
              if (bindingName.indexOf(expression) !== -1) {
                matches.push(binding);
              }
            }
          });
        }
      });
      return matches;
    };


    testability.findModels = function(element, expression, opt_exactMatch) {
      var prefixes = ['ng-', 'data-ng-', 'ng\\:'];
      for (var p = 0; p < prefixes.length; ++p) {
        var attributeEquals = opt_exactMatch ? '=' : '*=';
        var selector = '[' + prefixes[p] + 'model' + attributeEquals + '"' + expression + '"]';
        var elements = element.querySelectorAll(selector);
        if (elements.length) {
          return elements;
        }
      }
    };


    testability.getLocation = function() {
      return $location.url();
    };

  
    testability.setLocation = function(url) {
      if (url !== $location.url()) {
        $location.url(url);
        $rootScope.$digest();
      }
    };

   
    testability.whenStable = function(callback) {
      $browser.notifyWhenNoOutstandingRequests(callback);
    };

    return testability;
  }];
}

/** @this */
function $TimeoutProvider() {
  this.$get = ['$rootScope', '$browser', '$q', '$$q', '$exceptionHandler',
       function($rootScope,   $browser,   $q,   $$q,   $exceptionHandler) {

    var deferreds = {};


     
    function timeout(fn, delay, invokeApply) {
      if (!isFunction(fn)) {
        invokeApply = delay;
        delay = fn;
        fn = noop;
      }

      var args = sliceArgs(arguments, 3),
          skipApply = (isDefined(invokeApply) && !invokeApply),
          deferred = (skipApply ? $$q : $q).defer(),
          promise = deferred.promise,
          timeoutId;

      timeoutId = $browser.defer(function() {
        try {
          deferred.resolve(fn.apply(null, args));
        } catch (e) {
          deferred.reject(e);
          $exceptionHandler(e);
        } finally {
          delete deferreds[promise.$$timeoutId];
        }

        if (!skipApply) $rootScope.$apply();
      }, delay);

      promise.$$timeoutId = timeoutId;
      deferreds[timeoutId] = deferred;

      return promise;
    }


    timeout.cancel = function(promise) {
      if (promise && promise.$$timeoutId in deferreds) {
        // Timeout cancels should not report an unhandled promise.
        deferreds[promise.$$timeoutId].promise.catch(noop);
        deferreds[promise.$$timeoutId].reject('canceled');
        delete deferreds[promise.$$timeoutId];
        return $browser.defer.cancel(promise.$$timeoutId);
      }
      return false;
    };

    return timeout;
  }];
}


var urlParsingNode = window.document.createElement('a');
var originUrl = urlResolve(window.location.href);



function urlResolve(url) {
  var href = url;

  // Support: IE 9-11 only
  if (msie) {
    // Normalize before parse.  Refer Implementation Notes on why this is
    // done in two steps on IE.
    urlParsingNode.setAttribute('href', href);
    href = urlParsingNode.href;
  }

  urlParsingNode.setAttribute('href', href);

  // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
  return {
    href: urlParsingNode.href,
    protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
    host: urlParsingNode.host,
    search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
    hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
    hostname: urlParsingNode.hostname,
    port: urlParsingNode.port,
    pathname: (urlParsingNode.pathname.charAt(0) === '/')
      ? urlParsingNode.pathname
      : '/' + urlParsingNode.pathname
  };
}


function urlIsSameOrigin(requestUrl) {
  var parsed = (isString(requestUrl)) ? urlResolve(requestUrl) : requestUrl;
  return (parsed.protocol === originUrl.protocol &&
          parsed.host === originUrl.host);
}


function $WindowProvider() {
  this.$get = valueFn(window);
}


function $$CookieReader($document) {
  var rawDocument = $document[0] || {};
  var lastCookies = {};
  var lastCookieString = '';

  function safeGetCookie(rawDocument) {
    try {
      return rawDocument.cookie || '';
    } catch (e) {
      return '';
    }
  }

  function safeDecodeURIComponent(str) {
    try {
      return decodeURIComponent(str);
    } catch (e) {
      return str;
    }
  }

  return function() {
    var cookieArray, cookie, i, index, name;
    var currentCookieString = safeGetCookie(rawDocument);

    if (currentCookieString !== lastCookieString) {
      lastCookieString = currentCookieString;
      cookieArray = lastCookieString.split('; ');
      lastCookies = {};

      for (i = 0; i < cookieArray.length; i++) {
        cookie = cookieArray[i];
        index = cookie.indexOf('=');
        if (index > 0) { //ignore nameless cookies
          name = safeDecodeURIComponent(cookie.substring(0, index));
          // the first value that is seen for a cookie is the most
          // specific one.  values for the same cookie name that
          // follow are for less specific paths.
          if (isUndefined(lastCookies[name])) {
            lastCookies[name] = safeDecodeURIComponent(cookie.substring(index + 1));
          }
        }
      }
    }
    return lastCookies;
  };
}

$$CookieReader.$inject = ['$document'];

/** @this */
function $$CookieReaderProvider() {
  this.$get = $$CookieReader;
}

$FilterProvider.$inject = ['$provide'];
/** @this */
function $FilterProvider($provide) {
  var suffix = 'Filter';


  function register(name, factory) {
    if (isObject(name)) {
      var filters = {};
      forEach(name, function(filter, key) {
        filters[key] = register(key, filter);
      });
      return filters;
    } else {
      return $provide.factory(name + suffix, factory);
    }
  }
  this.register = register;

  this.$get = ['$injector', function($injector) {
    return function(name) {
      return $injector.get(name + suffix);
    };
  }];



  register('currency', currencyFilter);
  register('date', dateFilter);
  register('filter', filterFilter);
  register('json', jsonFilter);
  register('limitTo', limitToFilter);
  register('lowercase', lowercaseFilter);
  register('number', numberFilter);
  register('orderBy', orderByFilter);
  register('uppercase', uppercaseFilter);
}


function filterFilter() {
  return function(array, expression, comparator, anyPropertyKey) {
    if (!isArrayLike(array)) {
      if (array == null) {
        return array;
      } else {
        throw minErr('filter')('notarray', 'Expected array but received: {0}', array);
      }
    }

    anyPropertyKey = anyPropertyKey || '$';
    var expressionType = getTypeForFilter(expression);
    var predicateFn;
    var matchAgainstAnyProp;

    switch (expressionType) {
      case 'function':
        predicateFn = expression;
        break;
      case 'boolean':
      case 'null':
      case 'number':
      case 'string':
        matchAgainstAnyProp = true;
        // falls through
      case 'object':
        predicateFn = createPredicateFn(expression, comparator, anyPropertyKey, matchAgainstAnyProp);
        break;
      default:
        return array;
    }

    return Array.prototype.filter.call(array, predicateFn);
  };
}

// Helper functions for `filterFilter`
function createPredicateFn(expression, comparator, anyPropertyKey, matchAgainstAnyProp) {
  var shouldMatchPrimitives = isObject(expression) && (anyPropertyKey in expression);
  var predicateFn;

  if (comparator === true) {
    comparator = equals;
  } else if (!isFunction(comparator)) {
    comparator = function(actual, expected) {
      if (isUndefined(actual)) {
        // No substring matching against `undefined`
        return false;
      }
      if ((actual === null) || (expected === null)) {
        // No substring matching against `null`; only match against `null`
        return actual === expected;
      }
      if (isObject(expected) || (isObject(actual) && !hasCustomToString(actual))) {
        // Should not compare primitives against objects, unless they have custom `toString` method
        return false;
      }

      actual = lowercase('' + actual);
      expected = lowercase('' + expected);
      return actual.indexOf(expected) !== -1;
    };
  }

  predicateFn = function(item) {
    if (shouldMatchPrimitives && !isObject(item)) {
      return deepCompare(item, expression[anyPropertyKey], comparator, anyPropertyKey, false);
    }
    return deepCompare(item, expression, comparator, anyPropertyKey, matchAgainstAnyProp);
  };

  return predicateFn;
}

function deepCompare(actual, expected, comparator, anyPropertyKey, matchAgainstAnyProp, dontMatchWholeObject) {
  var actualType = getTypeForFilter(actual);
  var expectedType = getTypeForFilter(expected);

  if ((expectedType === 'string') && (expected.charAt(0) === '!')) {
    return !deepCompare(actual, expected.substring(1), comparator, anyPropertyKey, matchAgainstAnyProp);
  } else if (isArray(actual)) {
    // In case `actual` is an array, consider it a match
    // if ANY of it's items matches `expected`
    return actual.some(function(item) {
      return deepCompare(item, expected, comparator, anyPropertyKey, matchAgainstAnyProp);
    });
  }

  switch (actualType) {
    case 'object':
      var key;
      if (matchAgainstAnyProp) {
        for (key in actual) {
          if ((key.charAt(0) !== '$') && deepCompare(actual[key], expected, comparator, anyPropertyKey, true)) {
            return true;
          }
        }
        return dontMatchWholeObject ? false : deepCompare(actual, expected, comparator, anyPropertyKey, false);
      } else if (expectedType === 'object') {
        for (key in expected) {
          var expectedVal = expected[key];
          if (isFunction(expectedVal) || isUndefined(expectedVal)) {
            continue;
          }

          var matchAnyProperty = key === anyPropertyKey;
          var actualVal = matchAnyProperty ? actual : actual[key];
          if (!deepCompare(actualVal, expectedVal, comparator, anyPropertyKey, matchAnyProperty, matchAnyProperty)) {
            return false;
          }
        }
        return true;
      } else {
        return comparator(actual, expected);
      }
    case 'function':
      return false;
    default:
      return comparator(actual, expected);
  }
}

// Used for easily differentiating between `null` and actual `object`
function getTypeForFilter(val) {
  return (val === null) ? 'null' : typeof val;
}

var MAX_DIGITS = 22;
var DECIMAL_SEP = '.';
var ZERO_CHAR = '0';

currencyFilter.$inject = ['$locale'];
function currencyFilter($locale) {
  var formats = $locale.NUMBER_FORMATS;
  return function(amount, currencySymbol, fractionSize) {
    if (isUndefined(currencySymbol)) {
      currencySymbol = formats.CURRENCY_SYM;
    }

    if (isUndefined(fractionSize)) {
      fractionSize = formats.PATTERNS[1].maxFrac;
    }

    // if null or undefined pass it through
    return (amount == null)
        ? amount
        : formatNumber(amount, formats.PATTERNS[1], formats.GROUP_SEP, formats.DECIMAL_SEP, fractionSize).
            replace(/\u00A4/g, currencySymbol);
  };
}


numberFilter.$inject = ['$locale'];
function numberFilter($locale) {
  var formats = $locale.NUMBER_FORMATS;
  return function(number, fractionSize) {

    // if null or undefined pass it through
    return (number == null)
        ? number
        : formatNumber(number, formats.PATTERNS[0], formats.GROUP_SEP, formats.DECIMAL_SEP,
                       fractionSize);
  };
}


function parse(numStr) {
  var exponent = 0, digits, numberOfIntegerDigits;
  var i, j, zeros;

  // Decimal point?
  if ((numberOfIntegerDigits = numStr.indexOf(DECIMAL_SEP)) > -1) {
    numStr = numStr.replace(DECIMAL_SEP, '');
  }

  // Exponential form?
  if ((i = numStr.search(/e/i)) > 0) {
    // Work out the exponent.
    if (numberOfIntegerDigits < 0) numberOfIntegerDigits = i;
    numberOfIntegerDigits += +numStr.slice(i + 1);
    numStr = numStr.substring(0, i);
  } else if (numberOfIntegerDigits < 0) {
    // There was no decimal point or exponent so it is an integer.
    numberOfIntegerDigits = numStr.length;
  }

  // Count the number of leading zeros.
  for (i = 0; numStr.charAt(i) === ZERO_CHAR; i++) { /* empty */ }

  if (i === (zeros = numStr.length)) {
    // The digits are all zero.
    digits = [0];
    numberOfIntegerDigits = 1;
  } else {
    // Count the number of trailing zeros
    zeros--;
    while (numStr.charAt(zeros) === ZERO_CHAR) zeros--;

    // Trailing zeros are insignificant so ignore them
    numberOfIntegerDigits -= i;
    digits = [];
    // Convert string to array of digits without leading/trailing zeros.
    for (j = 0; i <= zeros; i++, j++) {
      digits[j] = +numStr.charAt(i);
    }
  }

  // If the number overflows the maximum allowed digits then use an exponent.
  if (numberOfIntegerDigits > MAX_DIGITS) {
    digits = digits.splice(0, MAX_DIGITS - 1);
    exponent = numberOfIntegerDigits - 1;
    numberOfIntegerDigits = 1;
  }

  return { d: digits, e: exponent, i: numberOfIntegerDigits };
}

/**
 * Round the parsed number to the specified number of decimal places
 * This function changed the parsedNumber in-place
 */
function roundNumber(parsedNumber, fractionSize, minFrac, maxFrac) {
    var digits = parsedNumber.d;
    var fractionLen = digits.length - parsedNumber.i;

    // determine fractionSize if it is not specified; `+fractionSize` converts it to a number
    fractionSize = (isUndefined(fractionSize)) ? Math.min(Math.max(minFrac, fractionLen), maxFrac) : +fractionSize;

    // The index of the digit to where rounding is to occur
    var roundAt = fractionSize + parsedNumber.i;
    var digit = digits[roundAt];

    if (roundAt > 0) {
      // Drop fractional digits beyond `roundAt`
      digits.splice(Math.max(parsedNumber.i, roundAt));

      // Set non-fractional digits beyond `roundAt` to 0
      for (var j = roundAt; j < digits.length; j++) {
        digits[j] = 0;
      }
    } else {
      // We rounded to zero so reset the parsedNumber
      fractionLen = Math.max(0, fractionLen);
      parsedNumber.i = 1;
      digits.length = Math.max(1, roundAt = fractionSize + 1);
      digits[0] = 0;
      for (var i = 1; i < roundAt; i++) digits[i] = 0;
    }

    if (digit >= 5) {
      if (roundAt - 1 < 0) {
        for (var k = 0; k > roundAt; k--) {
          digits.unshift(0);
          parsedNumber.i++;
        }
        digits.unshift(1);
        parsedNumber.i++;
      } else {
        digits[roundAt - 1]++;
      }
    }

    // Pad out with zeros to get the required fraction length
    for (; fractionLen < Math.max(0, fractionSize); fractionLen++) digits.push(0);


    // Do any carrying, e.g. a digit was rounded up to 10
    var carry = digits.reduceRight(function(carry, d, i, digits) {
      d = d + carry;
      digits[i] = d % 10;
      return Math.floor(d / 10);
    }, 0);
    if (carry) {
      digits.unshift(carry);
      parsedNumber.i++;
    }
}


function formatNumber(number, pattern, groupSep, decimalSep, fractionSize) {

  if (!(isString(number) || isNumber(number)) || isNaN(number)) return '';

  var isInfinity = !isFinite(number);
  var isZero = false;
  var numStr = Math.abs(number) + '',
      formattedText = '',
      parsedNumber;

  if (isInfinity) {
    formattedText = '\u221e';
  } else {
    parsedNumber = parse(numStr);

    roundNumber(parsedNumber, fractionSize, pattern.minFrac, pattern.maxFrac);

    var digits = parsedNumber.d;
    var integerLen = parsedNumber.i;
    var exponent = parsedNumber.e;
    var decimals = [];
    isZero = digits.reduce(function(isZero, d) { return isZero && !d; }, true);

    // pad zeros for small numbers
    while (integerLen < 0) {
      digits.unshift(0);
      integerLen++;
    }

    // extract decimals digits
    if (integerLen > 0) {
      decimals = digits.splice(integerLen, digits.length);
    } else {
      decimals = digits;
      digits = [0];
    }

    // format the integer digits with grouping separators
    var groups = [];
    if (digits.length >= pattern.lgSize) {
      groups.unshift(digits.splice(-pattern.lgSize, digits.length).join(''));
    }
    while (digits.length > pattern.gSize) {
      groups.unshift(digits.splice(-pattern.gSize, digits.length).join(''));
    }
    if (digits.length) {
      groups.unshift(digits.join(''));
    }
    formattedText = groups.join(groupSep);

    // append the decimal digits
    if (decimals.length) {
      formattedText += decimalSep + decimals.join('');
    }

    if (exponent) {
      formattedText += 'e+' + exponent;
    }
  }
  if (number < 0 && !isZero) {
    return pattern.negPre + formattedText + pattern.negSuf;
  } else {
    return pattern.posPre + formattedText + pattern.posSuf;
  }
}

function padNumber(num, digits, trim, negWrap) {
  var neg = '';
  if (num < 0 || (negWrap && num <= 0)) {
    if (negWrap) {
      num = -num + 1;
    } else {
      num = -num;
      neg = '-';
    }
  }
  num = '' + num;
  while (num.length < digits) num = ZERO_CHAR + num;
  if (trim) {
    num = num.substr(num.length - digits);
  }
  return neg + num;
}


function dateGetter(name, size, offset, trim, negWrap) {
  offset = offset || 0;
  return function(date) {
    var value = date['get' + name]();
    if (offset > 0 || value > -offset) {
      value += offset;
    }
    if (value === 0 && offset === -12) value = 12;
    return padNumber(value, size, trim, negWrap);
  };
}

function dateStrGetter(name, shortForm, standAlone) {
  return function(date, formats) {
    var value = date['get' + name]();
    var propPrefix = (standAlone ? 'STANDALONE' : '') + (shortForm ? 'SHORT' : '');
    var get = uppercase(propPrefix + name);

    return formats[get][value];
  };
}

function timeZoneGetter(date, formats, offset) {
  var zone = -1 * offset;
  var paddedZone = (zone >= 0) ? '+' : '';

  paddedZone += padNumber(Math[zone > 0 ? 'floor' : 'ceil'](zone / 60), 2) +
                padNumber(Math.abs(zone % 60), 2);

  return paddedZone;
}

function getFirstThursdayOfYear(year) {
    // 0 = index of January
    var dayOfWeekOnFirst = (new Date(year, 0, 1)).getDay();
    // 4 = index of Thursday (+1 to account for 1st = 5)
    // 11 = index of *next* Thursday (+1 account for 1st = 12)
    return new Date(year, 0, ((dayOfWeekOnFirst <= 4) ? 5 : 12) - dayOfWeekOnFirst);
}

function getThursdayThisWeek(datetime) {
    return new Date(datetime.getFullYear(), datetime.getMonth(),
      // 4 = index of Thursday
      datetime.getDate() + (4 - datetime.getDay()));
}

function weekGetter(size) {
   return function(date) {
      var firstThurs = getFirstThursdayOfYear(date.getFullYear()),
         thisThurs = getThursdayThisWeek(date);

      var diff = +thisThurs - +firstThurs,
         result = 1 + Math.round(diff / 6.048e8); // 6.048e8 ms per week

      return padNumber(result, size);
   };
}

function ampmGetter(date, formats) {
  return date.getHours() < 12 ? formats.AMPMS[0] : formats.AMPMS[1];
}

function eraGetter(date, formats) {
  return date.getFullYear() <= 0 ? formats.ERAS[0] : formats.ERAS[1];
}

function longEraGetter(date, formats) {
  return date.getFullYear() <= 0 ? formats.ERANAMES[0] : formats.ERANAMES[1];
}

var DATE_FORMATS = {
  yyyy: dateGetter('FullYear', 4, 0, false, true),
    yy: dateGetter('FullYear', 2, 0, true, true),
     y: dateGetter('FullYear', 1, 0, false, true),
  MMMM: dateStrGetter('Month'),
   MMM: dateStrGetter('Month', true),
    MM: dateGetter('Month', 2, 1),
     M: dateGetter('Month', 1, 1),
  LLLL: dateStrGetter('Month', false, true),
    dd: dateGetter('Date', 2),
     d: dateGetter('Date', 1),
    HH: dateGetter('Hours', 2),
     H: dateGetter('Hours', 1),
    hh: dateGetter('Hours', 2, -12),
     h: dateGetter('Hours', 1, -12),
    mm: dateGetter('Minutes', 2),
     m: dateGetter('Minutes', 1),
    ss: dateGetter('Seconds', 2),
     s: dateGetter('Seconds', 1),
     // while ISO 8601 requires fractions to be prefixed with `.` or `,`
     // we can be just safely rely on using `sss` since we currently don't support single or two digit fractions
   sss: dateGetter('Milliseconds', 3),
  EEEE: dateStrGetter('Day'),
   EEE: dateStrGetter('Day', true),
     a: ampmGetter,
     Z: timeZoneGetter,
    ww: weekGetter(2),
     w: weekGetter(1),
     G: eraGetter,
     GG: eraGetter,
     GGG: eraGetter,
     GGGG: longEraGetter
};

var DATE_FORMATS_SPLIT = /((?:[^yMLdHhmsaZEwG']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|L+|d+|H+|h+|m+|s+|a|Z|G+|w+))(.*)/,
    NUMBER_STRING = /^-?\d+$/;

dateFilter.$inject = ['$locale'];
function dateFilter($locale) {


  var R_ISO8601_STR = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
                     // 1        2       3         4          5          6          7          8  9     10      11
  function jsonStringToDate(string) {
    var match;
    if ((match = string.match(R_ISO8601_STR))) {
      var date = new Date(0),
          tzHour = 0,
          tzMin  = 0,
          dateSetter = match[8] ? date.setUTCFullYear : date.setFullYear,
          timeSetter = match[8] ? date.setUTCHours : date.setHours;

      if (match[9]) {
        tzHour = toInt(match[9] + match[10]);
        tzMin = toInt(match[9] + match[11]);
      }
      dateSetter.call(date, toInt(match[1]), toInt(match[2]) - 1, toInt(match[3]));
      var h = toInt(match[4] || 0) - tzHour;
      var m = toInt(match[5] || 0) - tzMin;
      var s = toInt(match[6] || 0);
      var ms = Math.round(parseFloat('0.' + (match[7] || 0)) * 1000);
      timeSetter.call(date, h, m, s, ms);
      return date;
    }
    return string;
  }


  return function(date, format, timezone) {
    var text = '',
        parts = [],
        fn, match;

    format = format || 'mediumDate';
    format = $locale.DATETIME_FORMATS[format] || format;
    if (isString(date)) {
      date = NUMBER_STRING.test(date) ? toInt(date) : jsonStringToDate(date);
    }

    if (isNumber(date)) {
      date = new Date(date);
    }

    if (!isDate(date) || !isFinite(date.getTime())) {
      return date;
    }

    while (format) {
      match = DATE_FORMATS_SPLIT.exec(format);
      if (match) {
        parts = concat(parts, match, 1);
        format = parts.pop();
      } else {
        parts.push(format);
        format = null;
      }
    }

    var dateTimezoneOffset = date.getTimezoneOffset();
    if (timezone) {
      dateTimezoneOffset = timezoneToOffset(timezone, dateTimezoneOffset);
      date = convertTimezoneToLocal(date, timezone, true);
    }
    forEach(parts, function(value) {
      fn = DATE_FORMATS[value];
      text += fn ? fn(date, $locale.DATETIME_FORMATS, dateTimezoneOffset)
                 : value === '\'\'' ? '\'' : value.replace(/(^'|'$)/g, '').replace(/''/g, '\'');
    });

    return text;
  };
}



function jsonFilter() {
  return function(object, spacing) {
    if (isUndefined(spacing)) {
        spacing = 2;
    }
    return toJson(object, spacing);
  };
}



var lowercaseFilter = valueFn(lowercase);



var uppercaseFilter = valueFn(uppercase);


function limitToFilter() {
  return function(input, limit, begin) {
    if (Math.abs(Number(limit)) === Infinity) {
      limit = Number(limit);
    } else {
      limit = toInt(limit);
    }
    if (isNumberNaN(limit)) return input;

    if (isNumber(input)) input = input.toString();
    if (!isArrayLike(input)) return input;

    begin = (!begin || isNaN(begin)) ? 0 : toInt(begin);
    begin = (begin < 0) ? Math.max(0, input.length + begin) : begin;

    if (limit >= 0) {
      return sliceFn(input, begin, begin + limit);
    } else {
      if (begin === 0) {
        return sliceFn(input, limit, input.length);
      } else {
        return sliceFn(input, Math.max(0, begin + limit), begin);
      }
    }
  };
}

function sliceFn(input, begin, end) {
  if (isString(input)) return input.slice(begin, end);

  return slice.call(input, begin, end);
}

orderByFilter.$inject = ['$parse'];
function orderByFilter($parse) {
  return function(array, sortPredicate, reverseOrder, compareFn) {

    if (array == null) return array;
    if (!isArrayLike(array)) {
      throw minErr('orderBy')('notarray', 'Expected array but received: {0}', array);
    }

    if (!isArray(sortPredicate)) { sortPredicate = [sortPredicate]; }
    if (sortPredicate.length === 0) { sortPredicate = ['+']; }

    var predicates = processPredicates(sortPredicate);

    var descending = reverseOrder ? -1 : 1;

    // Define the `compare()` function. Use a default comparator if none is specified.
    var compare = isFunction(compareFn) ? compareFn : defaultCompare;

    // The next three lines are a version of a Swartzian Transform idiom from Perl
    // (sometimes called the Decorate-Sort-Undecorate idiom)
    // See https://en.wikipedia.org/wiki/Schwartzian_transform
    var compareValues = Array.prototype.map.call(array, getComparisonObject);
    compareValues.sort(doComparison);
    array = compareValues.map(function(item) { return item.value; });

    return array;

    function getComparisonObject(value, index) {
      // NOTE: We are adding an extra `tieBreaker` value based on the element's index.
      // This will be used to keep the sort stable when none of the input predicates can
      // distinguish between two elements.
      return {
        value: value,
        tieBreaker: {value: index, type: 'number', index: index},
        predicateValues: predicates.map(function(predicate) {
          return getPredicateValue(predicate.get(value), index);
        })
      };
    }

    function doComparison(v1, v2) {
      for (var i = 0, ii = predicates.length; i < ii; i++) {
        var result = compare(v1.predicateValues[i], v2.predicateValues[i]);
        if (result) {
          return result * predicates[i].descending * descending;
        }
      }

      return compare(v1.tieBreaker, v2.tieBreaker) * descending;
    }
  };

  function processPredicates(sortPredicates) {
    return sortPredicates.map(function(predicate) {
      var descending = 1, get = identity;

      if (isFunction(predicate)) {
        get = predicate;
      } else if (isString(predicate)) {
        if ((predicate.charAt(0) === '+' || predicate.charAt(0) === '-')) {
          descending = predicate.charAt(0) === '-' ? -1 : 1;
          predicate = predicate.substring(1);
        }
        if (predicate !== '') {
          get = $parse(predicate);
          if (get.constant) {
            var key = get();
            get = function(value) { return value[key]; };
          }
        }
      }
      return {get: get, descending: descending};
    });
  }

  function isPrimitive(value) {
    switch (typeof value) {
      case 'number': /* falls through */
      case 'boolean': /* falls through */
      case 'string':
        return true;
      default:
        return false;
    }
  }

  function objectValue(value) {
    // If `valueOf` is a valid function use that
    if (isFunction(value.valueOf)) {
      value = value.valueOf();
      if (isPrimitive(value)) return value;
    }
    // If `toString` is a valid function and not the one from `Object.prototype` use that
    if (hasCustomToString(value)) {
      value = value.toString();
      if (isPrimitive(value)) return value;
    }

    return value;
  }

  function getPredicateValue(value, index) {
    var type = typeof value;
    if (value === null) {
      type = 'string';
      value = 'null';
    } else if (type === 'object') {
      value = objectValue(value);
    }
    return {value: value, type: type, index: index};
  }

  function defaultCompare(v1, v2) {
    var result = 0;
    var type1 = v1.type;
    var type2 = v2.type;

    if (type1 === type2) {
      var value1 = v1.value;
      var value2 = v2.value;

      if (type1 === 'string') {
        // Compare strings case-insensitively
        value1 = value1.toLowerCase();
        value2 = value2.toLowerCase();
      } else if (type1 === 'object') {
        // For basic objects, use the position of the object
        // in the collection instead of the value
        if (isObject(value1)) value1 = v1.index;
        if (isObject(value2)) value2 = v2.index;
      }

      if (value1 !== value2) {
        result = value1 < value2 ? -1 : 1;
      }
    } else {
      result = type1 < type2 ? -1 : 1;
    }

    return result;
  }
}

function ngDirective(directive) {
  if (isFunction(directive)) {
    directive = {
      link: directive
    };
  }
  directive.restrict = directive.restrict || 'AC';
  return valueFn(directive);
}


var htmlAnchorDirective = valueFn({
  restrict: 'E',
  compile: function(element, attr) {
    if (!attr.href && !attr.xlinkHref) {
      return function(scope, element) {
        // If the linked element is not an anchor tag anymore, do nothing
        if (element[0].nodeName.toLowerCase() !== 'a') return;

        // SVGAElement does not use the href attribute, but rather the 'xlinkHref' attribute.
        var href = toString.call(element.prop('href')) === '[object SVGAnimatedString]' ?
                   'xlink:href' : 'href';
        element.on('click', function(event) {
          // if we have no href url, then don't navigate anywhere.
          if (!element.attr(href)) {
            event.preventDefault();
          }
        });
      };
    }
  }
});



var ngAttributeAliasDirectives = {};

// boolean attrs are evaluated
forEach(BOOLEAN_ATTR, function(propName, attrName) {
  // binding to multiple is not supported
  if (propName === 'multiple') return;

  function defaultLinkFn(scope, element, attr) {
    scope.$watch(attr[normalized], function ngBooleanAttrWatchAction(value) {
      attr.$set(attrName, !!value);
    });
  }

  var normalized = directiveNormalize('ng-' + attrName);
  var linkFn = defaultLinkFn;

  if (propName === 'checked') {
    linkFn = function(scope, element, attr) {
      // ensuring ngChecked doesn't interfere with ngModel when both are set on the same input
      if (attr.ngModel !== attr[normalized]) {
        defaultLinkFn(scope, element, attr);
      }
    };
  }

  ngAttributeAliasDirectives[normalized] = function() {
    return {
      restrict: 'A',
      priority: 100,
      link: linkFn
    };
  };
});

// aliased input attrs are evaluated
forEach(ALIASED_ATTR, function(htmlAttr, ngAttr) {
  ngAttributeAliasDirectives[ngAttr] = function() {
    return {
      priority: 100,
      link: function(scope, element, attr) {
        //special case ngPattern when a literal regular expression value
        //is used as the expression (this way we don't have to watch anything).
        if (ngAttr === 'ngPattern' && attr.ngPattern.charAt(0) === '/') {
          var match = attr.ngPattern.match(REGEX_STRING_REGEXP);
          if (match) {
            attr.$set('ngPattern', new RegExp(match[1], match[2]));
            return;
          }
        }

        scope.$watch(attr[ngAttr], function ngAttrAliasWatchAction(value) {
          attr.$set(ngAttr, value);
        });
      }
    };
  };
});

// ng-src, ng-srcset, ng-href are interpolated
forEach(['src', 'srcset', 'href'], function(attrName) {
  var normalized = directiveNormalize('ng-' + attrName);
  ngAttributeAliasDirectives[normalized] = function() {
    return {
      priority: 99, // it needs to run after the attributes are interpolated
      link: function(scope, element, attr) {
        var propName = attrName,
            name = attrName;

        if (attrName === 'href' &&
            toString.call(element.prop('href')) === '[object SVGAnimatedString]') {
          name = 'xlinkHref';
          attr.$attr[name] = 'xlink:href';
          propName = null;
        }

        attr.$observe(normalized, function(value) {
          if (!value) {
            if (attrName === 'href') {
              attr.$set(name, null);
            }
            return;
          }

          attr.$set(name, value);

          // Support: IE 9-11 only
          // On IE, if "ng:src" directive declaration is used and "src" attribute doesn't exist
          // then calling element.setAttribute('src', 'foo') doesn't do anything, so we need
          // to set the property as well to achieve the desired effect.
          // We use attr[attrName] value since $set can sanitize the url.
          if (msie && propName) element.prop(propName, attr[name]);
        });
      }
    };
  };
});

/* global -nullFormCtrl, -PENDING_CLASS, -SUBMITTED_CLASS
 */
var nullFormCtrl = {
  $addControl: noop,
  $$renameControl: nullFormRenameControl,
  $removeControl: noop,
  $setValidity: noop,
  $setDirty: noop,
  $setPristine: noop,
  $setSubmitted: noop
},
PENDING_CLASS = 'ng-pending',
SUBMITTED_CLASS = 'ng-submitted';

function nullFormRenameControl(control, name) {
  control.$name = name;
}


FormController.$inject = ['$element', '$attrs', '$scope', '$animate', '$interpolate'];
function FormController($element, $attrs, $scope, $animate, $interpolate) {
  this.$$controls = [];

  // init state
  this.$error = {};
  this.$$success = {};
  this.$pending = undefined;
  this.$name = $interpolate($attrs.name || $attrs.ngForm || '')($scope);
  this.$dirty = false;
  this.$pristine = true;
  this.$valid = true;
  this.$invalid = false;
  this.$submitted = false;
  this.$$parentForm = nullFormCtrl;

  this.$$element = $element;
  this.$$animate = $animate;

  setupValidity(this);
}

FormController.prototype = {
 
  $rollbackViewValue: function() {
    forEach(this.$$controls, function(control) {
      control.$rollbackViewValue();
    });
  },


  $commitViewValue: function() {
    forEach(this.$$controls, function(control) {
      control.$commitViewValue();
    });
  },

 
  $addControl: function(control) {
    // Breaking change - before, inputs whose name was "hasOwnProperty" were quietly ignored
    // and not added to the scope.  Now we throw an error.
    assertNotHasOwnProperty(control.$name, 'input');
    this.$$controls.push(control);

    if (control.$name) {
      this[control.$name] = control;
    }

    control.$$parentForm = this;
  },

  // Private API: rename a form control
  $$renameControl: function(control, newName) {
    var oldName = control.$name;

    if (this[oldName] === control) {
      delete this[oldName];
    }
    this[newName] = control;
    control.$name = newName;
  },


  $removeControl: function(control) {
    if (control.$name && this[control.$name] === control) {
      delete this[control.$name];
    }
    forEach(this.$pending, function(value, name) {
      // eslint-disable-next-line no-invalid-this
      this.$setValidity(name, null, control);
    }, this);
    forEach(this.$error, function(value, name) {
      // eslint-disable-next-line no-invalid-this
      this.$setValidity(name, null, control);
    }, this);
    forEach(this.$$success, function(value, name) {
      // eslint-disable-next-line no-invalid-this
      this.$setValidity(name, null, control);
    }, this);

    arrayRemove(this.$$controls, control);
    control.$$parentForm = nullFormCtrl;
  },


  $setDirty: function() {
    this.$$animate.removeClass(this.$$element, PRISTINE_CLASS);
    this.$$animate.addClass(this.$$element, DIRTY_CLASS);
    this.$dirty = true;
    this.$pristine = false;
    this.$$parentForm.$setDirty();
  },

  $setPristine: function() {
    this.$$animate.setClass(this.$$element, PRISTINE_CLASS, DIRTY_CLASS + ' ' + SUBMITTED_CLASS);
    this.$dirty = false;
    this.$pristine = true;
    this.$submitted = false;
    forEach(this.$$controls, function(control) {
      control.$setPristine();
    });
  },


  $setUntouched: function() {
    forEach(this.$$controls, function(control) {
      control.$setUntouched();
    });
  },


  $setSubmitted: function() {
    this.$$animate.addClass(this.$$element, SUBMITTED_CLASS);
    this.$submitted = true;
    this.$$parentForm.$setSubmitted();
  }
};


addSetValidityMethod({
  clazz: FormController,
  set: function(object, property, controller) {
    var list = object[property];
    if (!list) {
      object[property] = [controller];
    } else {
      var index = list.indexOf(controller);
      if (index === -1) {
        list.push(controller);
      }
    }
  },
  unset: function(object, property, controller) {
    var list = object[property];
    if (!list) {
      return;
    }
    arrayRemove(list, controller);
    if (list.length === 0) {
      delete object[property];
    }
  }
});



 
var formDirectiveFactory = function(isNgForm) {
  return ['$timeout', '$parse', function($timeout, $parse) {
    var formDirective = {
      name: 'form',
      restrict: isNgForm ? 'EAC' : 'E',
      require: ['form', '^^?form'], //first is the form's own ctrl, second is an optional parent form
      controller: FormController,
      compile: function ngFormCompile(formElement, attr) {
        // Setup initial state of the control
        formElement.addClass(PRISTINE_CLASS).addClass(VALID_CLASS);

        var nameAttr = attr.name ? 'name' : (isNgForm && attr.ngForm ? 'ngForm' : false);

        return {
          pre: function ngFormPreLink(scope, formElement, attr, ctrls) {
            var controller = ctrls[0];

            // if `action` attr is not present on the form, prevent the default action (submission)
            if (!('action' in attr)) {
              // we can't use jq events because if a form is destroyed during submission the default
              // action is not prevented. see #1238
              //
              // IE 9 is not affected because it doesn't fire a submit event and try to do a full
              // page reload if the form was destroyed by submission of the form via a click handler
              // on a button in the form. Looks like an IE9 specific bug.
              var handleFormSubmission = function(event) {
                scope.$apply(function() {
                  controller.$commitViewValue();
                  controller.$setSubmitted();
                });

                event.preventDefault();
              };

              formElement[0].addEventListener('submit', handleFormSubmission);

              // unregister the preventDefault listener so that we don't not leak memory but in a
              // way that will achieve the prevention of the default action.
              formElement.on('$destroy', function() {
                $timeout(function() {
                  formElement[0].removeEventListener('submit', handleFormSubmission);
                }, 0, false);
              });
            }

            var parentFormCtrl = ctrls[1] || controller.$$parentForm;
            parentFormCtrl.$addControl(controller);

            var setter = nameAttr ? getSetter(controller.$name) : noop;

            if (nameAttr) {
              setter(scope, controller);
              attr.$observe(nameAttr, function(newValue) {
                if (controller.$name === newValue) return;
                setter(scope, undefined);
                controller.$$parentForm.$$renameControl(controller, newValue);
                setter = getSetter(controller.$name);
                setter(scope, controller);
              });
            }
            formElement.on('$destroy', function() {
              controller.$$parentForm.$removeControl(controller);
              setter(scope, undefined);
              extend(controller, nullFormCtrl); //stop propagating child destruction handlers upwards
            });
          }
        };
      }
    };

    return formDirective;

    function getSetter(expression) {
      if (expression === '') {
        //create an assignable expression, so forms with an empty name can be renamed later
        return $parse('this[""]').assign;
      }
      return $parse(expression).assign || noop;
    }
  }];
};

var formDirective = formDirectiveFactory();
var ngFormDirective = formDirectiveFactory(true);



// helper methods
function setupValidity(instance) {
  instance.$$classCache = {};
  instance.$$classCache[INVALID_CLASS] = !(instance.$$classCache[VALID_CLASS] = instance.$$element.hasClass(VALID_CLASS));
}
function addSetValidityMethod(context) {
  var clazz = context.clazz,
      set = context.set,
      unset = context.unset;

  clazz.prototype.$setValidity = function(validationErrorKey, state, controller) {
    if (isUndefined(state)) {
      createAndSet(this, '$pending', validationErrorKey, controller);
    } else {
      unsetAndCleanup(this, '$pending', validationErrorKey, controller);
    }
    if (!isBoolean(state)) {
      unset(this.$error, validationErrorKey, controller);
      unset(this.$$success, validationErrorKey, controller);
    } else {
      if (state) {
        unset(this.$error, validationErrorKey, controller);
        set(this.$$success, validationErrorKey, controller);
      } else {
        set(this.$error, validationErrorKey, controller);
        unset(this.$$success, validationErrorKey, controller);
      }
    }
    if (this.$pending) {
      cachedToggleClass(this, PENDING_CLASS, true);
      this.$valid = this.$invalid = undefined;
      toggleValidationCss(this, '', null);
    } else {
      cachedToggleClass(this, PENDING_CLASS, false);
      this.$valid = isObjectEmpty(this.$error);
      this.$invalid = !this.$valid;
      toggleValidationCss(this, '', this.$valid);
    }

    // re-read the state as the set/unset methods could have
    // combined state in this.$error[validationError] (used for forms),
    // where setting/unsetting only increments/decrements the value,
    // and does not replace it.
    var combinedState;
    if (this.$pending && this.$pending[validationErrorKey]) {
      combinedState = undefined;
    } else if (this.$error[validationErrorKey]) {
      combinedState = false;
    } else if (this.$$success[validationErrorKey]) {
      combinedState = true;
    } else {
      combinedState = null;
    }

    toggleValidationCss(this, validationErrorKey, combinedState);
    this.$$parentForm.$setValidity(validationErrorKey, combinedState, this);
  };

  function createAndSet(ctrl, name, value, controller) {
    if (!ctrl[name]) {
      ctrl[name] = {};
    }
    set(ctrl[name], value, controller);
  }

  function unsetAndCleanup(ctrl, name, value, controller) {
    if (ctrl[name]) {
      unset(ctrl[name], value, controller);
    }
    if (isObjectEmpty(ctrl[name])) {
      ctrl[name] = undefined;
    }
  }

  function cachedToggleClass(ctrl, className, switchValue) {
    if (switchValue && !ctrl.$$classCache[className]) {
      ctrl.$$animate.addClass(ctrl.$$element, className);
      ctrl.$$classCache[className] = true;
    } else if (!switchValue && ctrl.$$classCache[className]) {
      ctrl.$$animate.removeClass(ctrl.$$element, className);
      ctrl.$$classCache[className] = false;
    }
  }

  function toggleValidationCss(ctrl, validationErrorKey, isValid) {
    validationErrorKey = validationErrorKey ? '-' + snake_case(validationErrorKey, '-') : '';

    cachedToggleClass(ctrl, VALID_CLASS + validationErrorKey, isValid === true);
    cachedToggleClass(ctrl, INVALID_CLASS + validationErrorKey, isValid === false);
  }
}

function isObjectEmpty(obj) {
  if (obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }
  }
  return true;
}



var ISO_DATE_REGEXP = /^\d{4,}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+(?:[+-][0-2]\d:[0-5]\d|Z)$/;

var URL_REGEXP = /^[a-z][a-z\d.+-]*:\/*(?:[^:@]+(?::[^@]+)?@)?(?:[^\s:/?#]+|\[[a-f\d:]+])(?::\d+)?(?:\/[^?#]*)?(?:\?[^#]*)?(?:#.*)?$/i;
// eslint-disable-next-line max-len
var EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
var NUMBER_REGEXP = /^\s*(-|\+)?(\d+|(\d*(\.\d*)))([eE][+-]?\d+)?\s*$/;
var DATE_REGEXP = /^(\d{4,})-(\d{2})-(\d{2})$/;
var DATETIMELOCAL_REGEXP = /^(\d{4,})-(\d\d)-(\d\d)T(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/;
var WEEK_REGEXP = /^(\d{4,})-W(\d\d)$/;
var MONTH_REGEXP = /^(\d{4,})-(\d\d)$/;
var TIME_REGEXP = /^(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/;

var PARTIAL_VALIDATION_EVENTS = 'keydown wheel mousedown';
var PARTIAL_VALIDATION_TYPES = createMap();
forEach('date,datetime-local,month,time,week'.split(','), function(type) {
  PARTIAL_VALIDATION_TYPES[type] = true;
});

var inputType = {

  'text': textInputType,

  'date': createDateInputType('date', DATE_REGEXP,
         createDateParser(DATE_REGEXP, ['yyyy', 'MM', 'dd']),
         'yyyy-MM-dd'),

  
  'datetime-local': createDateInputType('datetimelocal', DATETIMELOCAL_REGEXP,
      createDateParser(DATETIMELOCAL_REGEXP, ['yyyy', 'MM', 'dd', 'HH', 'mm', 'ss', 'sss']),
      'yyyy-MM-ddTHH:mm:ss.sss'),

  'time': createDateInputType('time', TIME_REGEXP,
      createDateParser(TIME_REGEXP, ['HH', 'mm', 'ss', 'sss']),
     'HH:mm:ss.sss'),

  'week': createDateInputType('week', WEEK_REGEXP, weekParser, 'yyyy-Www'),


  'month': createDateInputType('month', MONTH_REGEXP,
     createDateParser(MONTH_REGEXP, ['yyyy', 'MM']),
     'yyyy-MM'),


  'number': numberInputType,


  'url': urlInputType,
  'email': emailInputType,


  'radio': radioInputType,

  
  'range': rangeInputType,

  
  'checkbox': checkboxInputType,

  'hidden': noop,
  'button': noop,
  'submit': noop,
  'reset': noop,
  'file': noop
};

function stringBasedInputType(ctrl) {
  ctrl.$formatters.push(function(value) {
    return ctrl.$isEmpty(value) ? value : value.toString();
  });
}

function textInputType(scope, element, attr, ctrl, $sniffer, $browser) {
  baseInputType(scope, element, attr, ctrl, $sniffer, $browser);
  stringBasedInputType(ctrl);
}

function baseInputType(scope, element, attr, ctrl, $sniffer, $browser) {
  var type = lowercase(element[0].type);

  // In composition mode, users are still inputting intermediate text buffer,
  // hold the listener until composition is done.
  // More about composition events: https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent
  if (!$sniffer.android) {
    var composing = false;

    element.on('compositionstart', function() {
      composing = true;
    });

    element.on('compositionend', function() {
      composing = false;
      listener();
    });
  }

  var timeout;

  var listener = function(ev) {
    if (timeout) {
      $browser.defer.cancel(timeout);
      timeout = null;
    }
    if (composing) return;
    var value = element.val(),
        event = ev && ev.type;

    // By default we will trim the value
    // If the attribute ng-trim exists we will avoid trimming
    // If input type is 'password', the value is never trimmed
    if (type !== 'password' && (!attr.ngTrim || attr.ngTrim !== 'false')) {
      value = trim(value);
    }

    // If a control is suffering from bad input (due to native validators), browsers discard its
    // value, so it may be necessary to revalidate (by calling $setViewValue again) even if the
    // control's value is the same empty value twice in a row.
    if (ctrl.$viewValue !== value || (value === '' && ctrl.$$hasNativeValidators)) {
      ctrl.$setViewValue(value, event);
    }
  };

  // if the browser does support "input" event, we are fine - except on IE9 which doesn't fire the
  // input event on backspace, delete or cut
  if ($sniffer.hasEvent('input')) {
    element.on('input', listener);
  } else {
    var deferListener = function(ev, input, origValue) {
      if (!timeout) {
        timeout = $browser.defer(function() {
          timeout = null;
          if (!input || input.value !== origValue) {
            listener(ev);
          }
        });
      }
    };

    element.on('keydown', /** @this */ function(event) {
      var key = event.keyCode;

      // ignore
      //    command            modifiers                   arrows
      if (key === 91 || (15 < key && key < 19) || (37 <= key && key <= 40)) return;

      deferListener(event, this, this.value);
    });

    // if user modifies input value using context menu in IE, we need "paste" and "cut" events to catch it
    if ($sniffer.hasEvent('paste')) {
      element.on('paste cut', deferListener);
    }
  }

  // if user paste into input using mouse on older browser
  // or form autocomplete on newer browser, we need "change" event to catch it
  element.on('change', listener);

  // Some native input types (date-family) have the ability to change validity without
  // firing any input/change events.
  // For these event types, when native validators are present and the browser supports the type,
  // check for validity changes on various DOM events.
  if (PARTIAL_VALIDATION_TYPES[type] && ctrl.$$hasNativeValidators && type === attr.type) {
    element.on(PARTIAL_VALIDATION_EVENTS, /** @this */ function(ev) {
      if (!timeout) {
        var validity = this[VALIDITY_STATE_PROPERTY];
        var origBadInput = validity.badInput;
        var origTypeMismatch = validity.typeMismatch;
        timeout = $browser.defer(function() {
          timeout = null;
          if (validity.badInput !== origBadInput || validity.typeMismatch !== origTypeMismatch) {
            listener(ev);
          }
        });
      }
    });
  }

  ctrl.$render = function() {
    // Workaround for Firefox validation #12102.
    var value = ctrl.$isEmpty(ctrl.$viewValue) ? '' : ctrl.$viewValue;
    if (element.val() !== value) {
      element.val(value);
    }
  };
}

function weekParser(isoWeek, existingDate) {
  if (isDate(isoWeek)) {
    return isoWeek;
  }

  if (isString(isoWeek)) {
    WEEK_REGEXP.lastIndex = 0;
    var parts = WEEK_REGEXP.exec(isoWeek);
    if (parts) {
      var year = +parts[1],
          week = +parts[2],
          hours = 0,
          minutes = 0,
          seconds = 0,
          milliseconds = 0,
          firstThurs = getFirstThursdayOfYear(year),
          addDays = (week - 1) * 7;

      if (existingDate) {
        hours = existingDate.getHours();
        minutes = existingDate.getMinutes();
        seconds = existingDate.getSeconds();
        milliseconds = existingDate.getMilliseconds();
      }

      return new Date(year, 0, firstThurs.getDate() + addDays, hours, minutes, seconds, milliseconds);
    }
  }

  return NaN;
}

function createDateParser(regexp, mapping) {
  return function(iso, date) {
    var parts, map;

    if (isDate(iso)) {
      return iso;
    }

    if (isString(iso)) {
      // When a date is JSON'ified to wraps itself inside of an extra
      // set of double quotes. This makes the date parsing code unable
      // to match the date string and parse it as a date.
      if (iso.charAt(0) === '"' && iso.charAt(iso.length - 1) === '"') {
        iso = iso.substring(1, iso.length - 1);
      }
      if (ISO_DATE_REGEXP.test(iso)) {
        return new Date(iso);
      }
      regexp.lastIndex = 0;
      parts = regexp.exec(iso);

      if (parts) {
        parts.shift();
        if (date) {
          map = {
            yyyy: date.getFullYear(),
            MM: date.getMonth() + 1,
            dd: date.getDate(),
            HH: date.getHours(),
            mm: date.getMinutes(),
            ss: date.getSeconds(),
            sss: date.getMilliseconds() / 1000
          };
        } else {
          map = { yyyy: 1970, MM: 1, dd: 1, HH: 0, mm: 0, ss: 0, sss: 0 };
        }

        forEach(parts, function(part, index) {
          if (index < mapping.length) {
            map[mapping[index]] = +part;
          }
        });
        return new Date(map.yyyy, map.MM - 1, map.dd, map.HH, map.mm, map.ss || 0, map.sss * 1000 || 0);
      }
    }

    return NaN;
  };
}

function createDateInputType(type, regexp, parseDate, format) {
  return function dynamicDateInputType(scope, element, attr, ctrl, $sniffer, $browser, $filter) {
    badInputChecker(scope, element, attr, ctrl);
    baseInputType(scope, element, attr, ctrl, $sniffer, $browser);
    var timezone = ctrl && ctrl.$options.getOption('timezone');
    var previousDate;

    ctrl.$$parserName = type;
    ctrl.$parsers.push(function(value) {
      if (ctrl.$isEmpty(value)) return null;
      if (regexp.test(value)) {
        // Note: We cannot read ctrl.$modelValue, as there might be a different
        // parser/formatter in the processing chain so that the model
        // contains some different data format!
        var parsedDate = parseDate(value, previousDate);
        if (timezone) {
          parsedDate = convertTimezoneToLocal(parsedDate, timezone);
        }
        return parsedDate;
      }
      return undefined;
    });

    ctrl.$formatters.push(function(value) {
      if (value && !isDate(value)) {
        throw ngModelMinErr('datefmt', 'Expected `{0}` to be a date', value);
      }
      if (isValidDate(value)) {
        previousDate = value;
        if (previousDate && timezone) {
          previousDate = convertTimezoneToLocal(previousDate, timezone, true);
        }
        return $filter('date')(value, format, timezone);
      } else {
        previousDate = null;
        return '';
      }
    });

    if (isDefined(attr.min) || attr.ngMin) {
      var minVal;
      ctrl.$validators.min = function(value) {
        return !isValidDate(value) || isUndefined(minVal) || parseDate(value) >= minVal;
      };
      attr.$observe('min', function(val) {
        minVal = parseObservedDateValue(val);
        ctrl.$validate();
      });
    }

    if (isDefined(attr.max) || attr.ngMax) {
      var maxVal;
      ctrl.$validators.max = function(value) {
        return !isValidDate(value) || isUndefined(maxVal) || parseDate(value) <= maxVal;
      };
      attr.$observe('max', function(val) {
        maxVal = parseObservedDateValue(val);
        ctrl.$validate();
      });
    }

    function isValidDate(value) {
      // Invalid Date: getTime() returns NaN
      return value && !(value.getTime && value.getTime() !== value.getTime());
    }

    function parseObservedDateValue(val) {
      return isDefined(val) && !isDate(val) ? parseDate(val) || undefined : val;
    }
  };
}

function badInputChecker(scope, element, attr, ctrl) {
  var node = element[0];
  var nativeValidation = ctrl.$$hasNativeValidators = isObject(node.validity);
  if (nativeValidation) {
    ctrl.$parsers.push(function(value) {
      var validity = element.prop(VALIDITY_STATE_PROPERTY) || {};
      return validity.badInput || validity.typeMismatch ? undefined : value;
    });
  }
}

function numberFormatterParser(ctrl) {
  ctrl.$$parserName = 'number';
  ctrl.$parsers.push(function(value) {
    if (ctrl.$isEmpty(value))      return null;
    if (NUMBER_REGEXP.test(value)) return parseFloat(value);
    return undefined;
  });

  ctrl.$formatters.push(function(value) {
    if (!ctrl.$isEmpty(value)) {
      if (!isNumber(value)) {
        throw ngModelMinErr('numfmt', 'Expected `{0}` to be a number', value);
      }
      value = value.toString();
    }
    return value;
  });
}

function parseNumberAttrVal(val) {
  if (isDefined(val) && !isNumber(val)) {
    val = parseFloat(val);
  }
  return !isNumberNaN(val) ? val : undefined;
}

function isNumberInteger(num) {
  // See http://stackoverflow.com/questions/14636536/how-to-check-if-a-variable-is-an-integer-in-javascript#14794066
  // (minus the assumption that `num` is a number)

  // eslint-disable-next-line no-bitwise
  return (num | 0) === num;
}

function countDecimals(num) {
  var numString = num.toString();
  var decimalSymbolIndex = numString.indexOf('.');

  if (decimalSymbolIndex === -1) {
    if (-1 < num && num < 1) {
      // It may be in the exponential notation format (`1e-X`)
      var match = /e-(\d+)$/.exec(numString);

      if (match) {
        return Number(match[1]);
      }
    }

    return 0;
  }

  return numString.length - decimalSymbolIndex - 1;
}

function isValidForStep(viewValue, stepBase, step) {
  // At this point `stepBase` and `step` are expected to be non-NaN values
  // and `viewValue` is expected to be a valid stringified number.
  var value = Number(viewValue);

  // Due to limitations in Floating Point Arithmetic (e.g. `0.3 - 0.2 !== 0.1` or
  // `0.5 % 0.1 !== 0`), we need to convert all numbers to integers.
  if (!isNumberInteger(value) || !isNumberInteger(stepBase) || !isNumberInteger(step)) {
    var decimalCount = Math.max(countDecimals(value), countDecimals(stepBase), countDecimals(step));
    var multiplier = Math.pow(10, decimalCount);

    value = value * multiplier;
    stepBase = stepBase * multiplier;
    step = step * multiplier;
  }

  return (value - stepBase) % step === 0;
}

function numberInputType(scope, element, attr, ctrl, $sniffer, $browser) {
  badInputChecker(scope, element, attr, ctrl);
  numberFormatterParser(ctrl);
  baseInputType(scope, element, attr, ctrl, $sniffer, $browser);

  var minVal;
  var maxVal;

  if (isDefined(attr.min) || attr.ngMin) {
    ctrl.$validators.min = function(value) {
      return ctrl.$isEmpty(value) || isUndefined(minVal) || value >= minVal;
    };

    attr.$observe('min', function(val) {
      minVal = parseNumberAttrVal(val);
      // TODO(matsko): implement validateLater to reduce number of validations
      ctrl.$validate();
    });
  }

  if (isDefined(attr.max) || attr.ngMax) {
    ctrl.$validators.max = function(value) {
      return ctrl.$isEmpty(value) || isUndefined(maxVal) || value <= maxVal;
    };

    attr.$observe('max', function(val) {
      maxVal = parseNumberAttrVal(val);
      // TODO(matsko): implement validateLater to reduce number of validations
      ctrl.$validate();
    });
  }

  if (isDefined(attr.step) || attr.ngStep) {
    var stepVal;
    ctrl.$validators.step = function(modelValue, viewValue) {
      return ctrl.$isEmpty(viewValue) || isUndefined(stepVal) ||
             isValidForStep(viewValue, minVal || 0, stepVal);
    };

    attr.$observe('step', function(val) {
      stepVal = parseNumberAttrVal(val);
      // TODO(matsko): implement validateLater to reduce number of validations
      ctrl.$validate();
    });
  }
}

function rangeInputType(scope, element, attr, ctrl, $sniffer, $browser) {
  badInputChecker(scope, element, attr, ctrl);
  numberFormatterParser(ctrl);
  baseInputType(scope, element, attr, ctrl, $sniffer, $browser);

  var supportsRange = ctrl.$$hasNativeValidators && element[0].type === 'range',
      minVal = supportsRange ? 0 : undefined,
      maxVal = supportsRange ? 100 : undefined,
      stepVal = supportsRange ? 1 : undefined,
      validity = element[0].validity,
      hasMinAttr = isDefined(attr.min),
      hasMaxAttr = isDefined(attr.max),
      hasStepAttr = isDefined(attr.step);

  var originalRender = ctrl.$render;

  ctrl.$render = supportsRange && isDefined(validity.rangeUnderflow) && isDefined(validity.rangeOverflow) ?
    //Browsers that implement range will set these values automatically, but reading the adjusted values after
    //$render would cause the min / max validators to be applied with the wrong value
    function rangeRender() {
      originalRender();
      ctrl.$setViewValue(element.val());
    } :
    originalRender;

  if (hasMinAttr) {
    ctrl.$validators.min = supportsRange ?
      // Since all browsers set the input to a valid value, we don't need to check validity
      function noopMinValidator() { return true; } :
      // non-support browsers validate the min val
      function minValidator(modelValue, viewValue) {
        return ctrl.$isEmpty(viewValue) || isUndefined(minVal) || viewValue >= minVal;
      };

    setInitialValueAndObserver('min', minChange);
  }

  if (hasMaxAttr) {
    ctrl.$validators.max = supportsRange ?
      // Since all browsers set the input to a valid value, we don't need to check validity
      function noopMaxValidator() { return true; } :
      // non-support browsers validate the max val
      function maxValidator(modelValue, viewValue) {
        return ctrl.$isEmpty(viewValue) || isUndefined(maxVal) || viewValue <= maxVal;
      };

    setInitialValueAndObserver('max', maxChange);
  }

  if (hasStepAttr) {
    ctrl.$validators.step = supportsRange ?
      function nativeStepValidator() {
        // Currently, only FF implements the spec on step change correctly (i.e. adjusting the
        // input element value to a valid value). It's possible that other browsers set the stepMismatch
        // validity error instead, so we can at least report an error in that case.
        return !validity.stepMismatch;
      } :
      // ngStep doesn't set the setp attr, so the browser doesn't adjust the input value as setting step would
      function stepValidator(modelValue, viewValue) {
        return ctrl.$isEmpty(viewValue) || isUndefined(stepVal) ||
               isValidForStep(viewValue, minVal || 0, stepVal);
      };

    setInitialValueAndObserver('step', stepChange);
  }

  function setInitialValueAndObserver(htmlAttrName, changeFn) {
    // interpolated attributes set the attribute value only after a digest, but we need the
    // attribute value when the input is first rendered, so that the browser can adjust the
    // input value based on the min/max value
    element.attr(htmlAttrName, attr[htmlAttrName]);
    attr.$observe(htmlAttrName, changeFn);
  }

  function minChange(val) {
    minVal = parseNumberAttrVal(val);
    // ignore changes before model is initialized
    if (isNumberNaN(ctrl.$modelValue)) {
      return;
    }

    if (supportsRange) {
      var elVal = element.val();
      // IE11 doesn't set the el val correctly if the minVal is greater than the element value
      if (minVal > elVal) {
        elVal = minVal;
        element.val(elVal);
      }
      ctrl.$setViewValue(elVal);
    } else {
      // TODO(matsko): implement validateLater to reduce number of validations
      ctrl.$validate();
    }
  }

  function maxChange(val) {
    maxVal = parseNumberAttrVal(val);
    // ignore changes before model is initialized
    if (isNumberNaN(ctrl.$modelValue)) {
      return;
    }

    if (supportsRange) {
      var elVal = element.val();
      // IE11 doesn't set the el val correctly if the maxVal is less than the element value
      if (maxVal < elVal) {
        element.val(maxVal);
        // IE11 and Chrome don't set the value to the minVal when max < min
        elVal = maxVal < minVal ? minVal : maxVal;
      }
      ctrl.$setViewValue(elVal);
    } else {
      // TODO(matsko): implement validateLater to reduce number of validations
      ctrl.$validate();
    }
  }

  function stepChange(val) {
    stepVal = parseNumberAttrVal(val);
    // ignore changes before model is initialized
    if (isNumberNaN(ctrl.$modelValue)) {
      return;
    }

    // Some browsers don't adjust the input value correctly, but set the stepMismatch error
    if (supportsRange && ctrl.$viewValue !== element.val()) {
      ctrl.$setViewValue(element.val());
    } else {
      // TODO(matsko): implement validateLater to reduce number of validations
      ctrl.$validate();
    }
  }
}

function urlInputType(scope, element, attr, ctrl, $sniffer, $browser) {
  // Note: no badInputChecker here by purpose as `url` is only a validation
  // in browsers, i.e. we can always read out input.value even if it is not valid!
  baseInputType(scope, element, attr, ctrl, $sniffer, $browser);
  stringBasedInputType(ctrl);

  ctrl.$$parserName = 'url';
  ctrl.$validators.url = function(modelValue, viewValue) {
    var value = modelValue || viewValue;
    return ctrl.$isEmpty(value) || URL_REGEXP.test(value);
  };
}

function emailInputType(scope, element, attr, ctrl, $sniffer, $browser) {
  // Note: no badInputChecker here by purpose as `url` is only a validation
  // in browsers, i.e. we can always read out input.value even if it is not valid!
  baseInputType(scope, element, attr, ctrl, $sniffer, $browser);
  stringBasedInputType(ctrl);

  ctrl.$$parserName = 'email';
  ctrl.$validators.email = function(modelValue, viewValue) {
    var value = modelValue || viewValue;
    return ctrl.$isEmpty(value) || EMAIL_REGEXP.test(value);
  };
}

function radioInputType(scope, element, attr, ctrl) {
  var doTrim = !attr.ngTrim || trim(attr.ngTrim) !== 'false';
  // make the name unique, if not defined
  if (isUndefined(attr.name)) {
    element.attr('name', nextUid());
  }

  var listener = function(ev) {
    var value;
    if (element[0].checked) {
      value = attr.value;
      if (doTrim) {
        value = trim(value);
      }
      ctrl.$setViewValue(value, ev && ev.type);
    }
  };

  element.on('click', listener);

  ctrl.$render = function() {
    var value = attr.value;
    if (doTrim) {
      value = trim(value);
    }
    element[0].checked = (value === ctrl.$viewValue);
  };

  attr.$observe('value', ctrl.$render);
}

function parseConstantExpr($parse, context, name, expression, fallback) {
  var parseFn;
  if (isDefined(expression)) {
    parseFn = $parse(expression);
    if (!parseFn.constant) {
      throw ngModelMinErr('constexpr', 'Expected constant expression for `{0}`, but saw ' +
                                   '`{1}`.', name, expression);
    }
    return parseFn(context);
  }
  return fallback;
}

function checkboxInputType(scope, element, attr, ctrl, $sniffer, $browser, $filter, $parse) {
  var trueValue = parseConstantExpr($parse, scope, 'ngTrueValue', attr.ngTrueValue, true);
  var falseValue = parseConstantExpr($parse, scope, 'ngFalseValue', attr.ngFalseValue, false);

  var listener = function(ev) {
    ctrl.$setViewValue(element[0].checked, ev && ev.type);
  };

  element.on('click', listener);

  ctrl.$render = function() {
    element[0].checked = ctrl.$viewValue;
  };

  // Override the standard `$isEmpty` because the $viewValue of an empty checkbox is always set to `false`
  // This is because of the parser below, which compares the `$modelValue` with `trueValue` to convert
  // it to a boolean.
  ctrl.$isEmpty = function(value) {
    return value === false;
  };

  ctrl.$formatters.push(function(value) {
    return equals(value, trueValue);
  });

  ctrl.$parsers.push(function(value) {
    return value ? trueValue : falseValue;
  });
}



var inputDirective = ['$browser', '$sniffer', '$filter', '$parse',
    function($browser, $sniffer, $filter, $parse) {
  return {
    restrict: 'E',
    require: ['?ngModel'],
    link: {
      pre: function(scope, element, attr, ctrls) {
        if (ctrls[0]) {
          (inputType[lowercase(attr.type)] || inputType.text)(scope, element, attr, ctrls[0], $sniffer,
                                                              $browser, $filter, $parse);
        }
      }
    }
  };
}];



var CONSTANT_VALUE_REGEXP = /^(true|false|\d+)$/;

var ngValueDirective = function() {
 
  function updateElementValue(element, attr, value) {
    element.prop('value', value);
    attr.$set('value', value);
  }

  return {
    restrict: 'A',
    priority: 100,
    compile: function(tpl, tplAttr) {
      if (CONSTANT_VALUE_REGEXP.test(tplAttr.ngValue)) {
        return function ngValueConstantLink(scope, elm, attr) {
          var value = scope.$eval(attr.ngValue);
          updateElementValue(elm, attr, value);
        };
      } else {
        return function ngValueLink(scope, elm, attr) {
          scope.$watch(attr.ngValue, function valueWatchAction(value) {
            updateElementValue(elm, attr, value);
          });
        };
      }
    }
  };
};


var ngBindDirective = ['$compile', function($compile) {
  return {
    restrict: 'AC',
    compile: function ngBindCompile(templateElement) {
      $compile.$$addBindingClass(templateElement);
      return function ngBindLink(scope, element, attr) {
        $compile.$$addBindingInfo(element, attr.ngBind);
        element = element[0];
        scope.$watch(attr.ngBind, function ngBindWatchAction(value) {
          element.textContent = stringify(value);
        });
      };
    }
  };
}];


var ngBindTemplateDirective = ['$interpolate', '$compile', function($interpolate, $compile) {
  return {
    compile: function ngBindTemplateCompile(templateElement) {
      $compile.$$addBindingClass(templateElement);
      return function ngBindTemplateLink(scope, element, attr) {
        var interpolateFn = $interpolate(element.attr(attr.$attr.ngBindTemplate));
        $compile.$$addBindingInfo(element, interpolateFn.expressions);
        element = element[0];
        attr.$observe('ngBindTemplate', function(value) {
          element.textContent = isUndefined(value) ? '' : value;
        });
      };
    }
  };
}];



var ngBindHtmlDirective = ['$sce', '$parse', '$compile', function($sce, $parse, $compile) {
  return {
    restrict: 'A',
    compile: function ngBindHtmlCompile(tElement, tAttrs) {
      var ngBindHtmlGetter = $parse(tAttrs.ngBindHtml);
      var ngBindHtmlWatch = $parse(tAttrs.ngBindHtml, function sceValueOf(val) {
        // Unwrap the value to compare the actual inner safe value, not the wrapper object.
        return $sce.valueOf(val);
      });
      $compile.$$addBindingClass(tElement);

      return function ngBindHtmlLink(scope, element, attr) {
        $compile.$$addBindingInfo(element, attr.ngBindHtml);

        scope.$watch(ngBindHtmlWatch, function ngBindHtmlWatchAction() {
          // The watched value is the unwrapped value. To avoid re-escaping, use the direct getter.
          var value = ngBindHtmlGetter(scope);
          element.html($sce.getTrustedHtml(value) || '');
        });
      };
    }
  };
}];


var ngChangeDirective = valueFn({
  restrict: 'A',
  require: 'ngModel',
  link: function(scope, element, attr, ctrl) {
    ctrl.$viewChangeListeners.push(function() {
      scope.$eval(attr.ngChange);
    });
  }
});

/* exported
  ngClassDirective,
  ngClassEvenDirective,
  ngClassOddDirective
*/

function classDirective(name, selector) {
  name = 'ngClass' + name;
  var indexWatchExpression;

  return ['$parse', function($parse) {
    return {
      restrict: 'AC',
      link: function(scope, element, attr) {
        var expression = attr[name].trim();
        var isOneTime = (expression.charAt(0) === ':') && (expression.charAt(1) === ':');

        var watchInterceptor = isOneTime ? toFlatValue : toClassString;
        var watchExpression = $parse(expression, watchInterceptor);
        var watchAction = isOneTime ? ngClassOneTimeWatchAction : ngClassWatchAction;

        var classCounts = element.data('$classCounts');
        var oldModulo = true;
        var oldClassString;

        if (!classCounts) {
          // Use createMap() to prevent class assumptions involving property
          // names in Object.prototype
          classCounts = createMap();
          element.data('$classCounts', classCounts);
        }

        if (name !== 'ngClass') {
          if (!indexWatchExpression) {
            indexWatchExpression = $parse('$index', function moduloTwo($index) {
              // eslint-disable-next-line no-bitwise
              return $index & 1;
            });
          }

          scope.$watch(indexWatchExpression, ngClassIndexWatchAction);
        }

        scope.$watch(watchExpression, watchAction, isOneTime);

        function addClasses(classString) {
          classString = digestClassCounts(split(classString), 1);
          attr.$addClass(classString);
        }

        function removeClasses(classString) {
          classString = digestClassCounts(split(classString), -1);
          attr.$removeClass(classString);
        }

        function updateClasses(oldClassString, newClassString) {
          var oldClassArray = split(oldClassString);
          var newClassArray = split(newClassString);

          var toRemoveArray = arrayDifference(oldClassArray, newClassArray);
          var toAddArray = arrayDifference(newClassArray, oldClassArray);

          var toRemoveString = digestClassCounts(toRemoveArray, -1);
          var toAddString = digestClassCounts(toAddArray, 1);

          attr.$addClass(toAddString);
          attr.$removeClass(toRemoveString);
        }

        function digestClassCounts(classArray, count) {
          var classesToUpdate = [];

          forEach(classArray, function(className) {
            if (count > 0 || classCounts[className]) {
              classCounts[className] = (classCounts[className] || 0) + count;
              if (classCounts[className] === +(count > 0)) {
                classesToUpdate.push(className);
              }
            }
          });

          return classesToUpdate.join(' ');
        }

        function ngClassIndexWatchAction(newModulo) {
          // This watch-action should run before the `ngClass[OneTime]WatchAction()`, thus it
          // adds/removes `oldClassString`. If the `ngClass` expression has changed as well, the
          // `ngClass[OneTime]WatchAction()` will update the classes.
          if (newModulo === selector) {
            addClasses(oldClassString);
          } else {
            removeClasses(oldClassString);
          }

          oldModulo = newModulo;
        }

        function ngClassOneTimeWatchAction(newClassValue) {
          var newClassString = toClassString(newClassValue);

          if (newClassString !== oldClassString) {
            ngClassWatchAction(newClassString);
          }
        }

        function ngClassWatchAction(newClassString) {
          if (oldModulo === selector) {
            updateClasses(oldClassString, newClassString);
          }

          oldClassString = newClassString;
        }
      }
    };
  }];

  // Helpers
  function arrayDifference(tokens1, tokens2) {
    if (!tokens1 || !tokens1.length) return [];
    if (!tokens2 || !tokens2.length) return tokens1;

    var values = [];

    outer:
    for (var i = 0; i < tokens1.length; i++) {
      var token = tokens1[i];
      for (var j = 0; j < tokens2.length; j++) {
        if (token === tokens2[j]) continue outer;
      }
      values.push(token);
    }

    return values;
  }

  function split(classString) {
    return classString && classString.split(' ');
  }

  function toClassString(classValue) {
    var classString = classValue;

    if (isArray(classValue)) {
      classString = classValue.map(toClassString).join(' ');
    } else if (isObject(classValue)) {
      classString = Object.keys(classValue).
        filter(function(key) { return classValue[key]; }).
        join(' ');
    }

    return classString;
  }

  function toFlatValue(classValue) {
    var flatValue = classValue;

    if (isArray(classValue)) {
      flatValue = classValue.map(toFlatValue);
    } else if (isObject(classValue)) {
      var hasUndefined = false;

      flatValue = Object.keys(classValue).filter(function(key) {
        var value = classValue[key];

        if (!hasUndefined && isUndefined(value)) {
          hasUndefined = true;
        }

        return value;
      });

      if (hasUndefined) {
        // Prevent the `oneTimeLiteralWatchInterceptor` from unregistering
        // the watcher, by including at least one `undefined` value.
        flatValue.push(undefined);
      }
    }

    return flatValue;
  }
}


var ngClassDirective = classDirective('', true);


var ngClassOddDirective = classDirective('Odd', 0);


var ngClassEvenDirective = classDirective('Even', 1);

var ngCloakDirective = ngDirective({
  compile: function(element, attr) {
    attr.$set('ngCloak', undefined);
    element.removeClass('ng-cloak');
  }
});

var ngControllerDirective = [function() {
  return {
    restrict: 'A',
    scope: true,
    controller: '@',
    priority: 500
  };
}];

var ngEventDirectives = {};

// For events that might fire synchronously during DOM manipulation
// we need to execute their event handlers asynchronously using $evalAsync,
// so that they are not executed in an inconsistent state.
var forceAsyncEvents = {
  'blur': true,
  'focus': true
};
forEach(
  'click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste'.split(' '),
  function(eventName) {
    var directiveName = directiveNormalize('ng-' + eventName);
    ngEventDirectives[directiveName] = ['$parse', '$rootScope', function($parse, $rootScope) {
      return {
        restrict: 'A',
        compile: function($element, attr) {
          // We expose the powerful $event object on the scope that provides access to the Window,
          // etc. that isn't protected by the fast paths in $parse.  We explicitly request better
          // checks at the cost of speed since event handler expressions are not executed as
          // frequently as regular change detection.
          var fn = $parse(attr[directiveName], /* interceptorFn */ null, /* expensiveChecks */ true);
          return function ngEventHandler(scope, element) {
            element.on(eventName, function(event) {
              var callback = function() {
                fn(scope, {$event:event});
              };
              if (forceAsyncEvents[eventName] && $rootScope.$$phase) {
                scope.$evalAsync(callback);
              } else {
                scope.$apply(callback);
              }
            });
          };
        }
      };
    }];
  }
);



var ngIfDirective = ['$animate', '$compile', function($animate, $compile) {
  return {
    multiElement: true,
    transclude: 'element',
    priority: 600,
    terminal: true,
    restrict: 'A',
    $$tlb: true,
    link: function($scope, $element, $attr, ctrl, $transclude) {
        var block, childScope, previousElements;
        $scope.$watch($attr.ngIf, function ngIfWatchAction(value) {

          if (value) {
            if (!childScope) {
              $transclude(function(clone, newScope) {
                childScope = newScope;
                clone[clone.length++] = $compile.$$createComment('end ngIf', $attr.ngIf);
                // Note: We only need the first/last node of the cloned nodes.
                // However, we need to keep the reference to the jqlite wrapper as it might be changed later
                // by a directive with templateUrl when its template arrives.
                block = {
                  clone: clone
                };
                $animate.enter(clone, $element.parent(), $element);
              });
            }
          } else {
            if (previousElements) {
              previousElements.remove();
              previousElements = null;
            }
            if (childScope) {
              childScope.$destroy();
              childScope = null;
            }
            if (block) {
              previousElements = getBlockNodes(block.clone);
              $animate.leave(previousElements).done(function(response) {
                if (response !== false) previousElements = null;
              });
              block = null;
            }
          }
        });
    }
  };
}];


var ngIncludeDirective = ['$templateRequest', '$anchorScroll', '$animate',
                  function($templateRequest,   $anchorScroll,   $animate) {
  return {
    restrict: 'ECA',
    priority: 400,
    terminal: true,
    transclude: 'element',
    controller: angular.noop,
    compile: function(element, attr) {
      var srcExp = attr.ngInclude || attr.src,
          onloadExp = attr.onload || '',
          autoScrollExp = attr.autoscroll;

      return function(scope, $element, $attr, ctrl, $transclude) {
        var changeCounter = 0,
            currentScope,
            previousElement,
            currentElement;

        var cleanupLastIncludeContent = function() {
          if (previousElement) {
            previousElement.remove();
            previousElement = null;
          }
          if (currentScope) {
            currentScope.$destroy();
            currentScope = null;
          }
          if (currentElement) {
            $animate.leave(currentElement).done(function(response) {
              if (response !== false) previousElement = null;
            });
            previousElement = currentElement;
            currentElement = null;
          }
        };

        scope.$watch(srcExp, function ngIncludeWatchAction(src) {
          var afterAnimation = function(response) {
            if (response !== false && isDefined(autoScrollExp) &&
              (!autoScrollExp || scope.$eval(autoScrollExp))) {
                $anchorScroll();
            }
          };
          var thisChangeId = ++changeCounter;

          if (src) {
            //set the 2nd param to true to ignore the template request error so that the inner
            //contents and scope can be cleaned up.
            $templateRequest(src, true).then(function(response) {
              if (scope.$$destroyed) return;

              if (thisChangeId !== changeCounter) return;
              var newScope = scope.$new();
              ctrl.template = response;

              var clone = $transclude(newScope, function(clone) {
                cleanupLastIncludeContent();
                $animate.enter(clone, null, $element).done(afterAnimation);
              });

              currentScope = newScope;
              currentElement = clone;

              currentScope.$emit('$includeContentLoaded', src);
              scope.$eval(onloadExp);
            }, function() {
              if (scope.$$destroyed) return;

              if (thisChangeId === changeCounter) {
                cleanupLastIncludeContent();
                scope.$emit('$includeContentError', src);
              }
            });
            scope.$emit('$includeContentRequested', src);
          } else {
            cleanupLastIncludeContent();
            ctrl.template = null;
          }
        });
      };
    }
  };
}];


var ngIncludeFillContentDirective = ['$compile',
  function($compile) {
    return {
      restrict: 'ECA',
      priority: -400,
      require: 'ngInclude',
      link: function(scope, $element, $attr, ctrl) {
        if (toString.call($element[0]).match(/SVG/)) {
          // WebKit: https://bugs.webkit.org/show_bug.cgi?id=135698 --- SVG elements do not
          // support innerHTML, so detect this here and try to generate the contents
          // specially.
          $element.empty();
          $compile(jqLiteBuildFragment(ctrl.template, window.document).childNodes)(scope,
              function namespaceAdaptedClone(clone) {
            $element.append(clone);
          }, {futureParentElement: $element});
          return;
        }

        $element.html(ctrl.template);
        $compile($element.contents())(scope);
      }
    };
  }];

var ngInitDirective = ngDirective({
  priority: 450,
  compile: function() {
    return {
      pre: function(scope, element, attrs) {
        scope.$eval(attrs.ngInit);
      }
    };
  }
});

var ngListDirective = function() {
  return {
    restrict: 'A',
    priority: 100,
    require: 'ngModel',
    link: function(scope, element, attr, ctrl) {
      var ngList = attr.ngList || ', ';
      var trimValues = attr.ngTrim !== 'false';
      var separator = trimValues ? trim(ngList) : ngList;

      var parse = function(viewValue) {
        // If the viewValue is invalid (say required but empty) it will be `undefined`
        if (isUndefined(viewValue)) return;

        var list = [];

        if (viewValue) {
          forEach(viewValue.split(separator), function(value) {
            if (value) list.push(trimValues ? trim(value) : value);
          });
        }

        return list;
      };

      ctrl.$parsers.push(parse);
      ctrl.$formatters.push(function(value) {
        if (isArray(value)) {
          return value.join(ngList);
        }

        return undefined;
      });

      // Override the standard $isEmpty because an empty array means the input is empty.
      ctrl.$isEmpty = function(value) {
        return !value || !value.length;
      };
    }
  };
};




var VALID_CLASS = 'ng-valid',
    INVALID_CLASS = 'ng-invalid',
    PRISTINE_CLASS = 'ng-pristine',
    DIRTY_CLASS = 'ng-dirty',
    UNTOUCHED_CLASS = 'ng-untouched',
    TOUCHED_CLASS = 'ng-touched',
    EMPTY_CLASS = 'ng-empty',
    NOT_EMPTY_CLASS = 'ng-not-empty';

var ngModelMinErr = minErr('ngModel');


NgModelController.$inject = ['$scope', '$exceptionHandler', '$attrs', '$element', '$parse', '$animate', '$timeout', '$q', '$interpolate'];
function NgModelController($scope, $exceptionHandler, $attr, $element, $parse, $animate, $timeout, $q, $interpolate) {
  this.$viewValue = Number.NaN;
  this.$modelValue = Number.NaN;
  this.$$rawModelValue = undefined; // stores the parsed modelValue / model set from scope regardless of validity.
  this.$validators = {};
  this.$asyncValidators = {};
  this.$parsers = [];
  this.$formatters = [];
  this.$viewChangeListeners = [];
  this.$untouched = true;
  this.$touched = false;
  this.$pristine = true;
  this.$dirty = false;
  this.$valid = true;
  this.$invalid = false;
  this.$error = {}; // keep invalid keys here
  this.$$success = {}; // keep valid keys here
  this.$pending = undefined; // keep pending keys here
  this.$name = $interpolate($attr.name || '', false)($scope);
  this.$$parentForm = nullFormCtrl;
  this.$options = defaultModelOptions;

  this.$$parsedNgModel = $parse($attr.ngModel);
  this.$$parsedNgModelAssign = this.$$parsedNgModel.assign;
  this.$$ngModelGet = this.$$parsedNgModel;
  this.$$ngModelSet = this.$$parsedNgModelAssign;
  this.$$pendingDebounce = null;
  this.$$parserValid = undefined;

  this.$$currentValidationRunId = 0;

  this.$$scope = $scope;
  this.$$attr = $attr;
  this.$$element = $element;
  this.$$animate = $animate;
  this.$$timeout = $timeout;
  this.$$parse = $parse;
  this.$$q = $q;
  this.$$exceptionHandler = $exceptionHandler;

  setupValidity(this);
  setupModelWatcher(this);
}

NgModelController.prototype = {
  $$initGetterSetters: function() {
    if (this.$options.getOption('getterSetter')) {
      var invokeModelGetter = this.$$parse(this.$$attr.ngModel + '()'),
          invokeModelSetter = this.$$parse(this.$$attr.ngModel + '($$$p)');

      this.$$ngModelGet = function($scope) {
        var modelValue = this.$$parsedNgModel($scope);
        if (isFunction(modelValue)) {
          modelValue = invokeModelGetter($scope);
        }
        return modelValue;
      };
      this.$$ngModelSet = function($scope, newValue) {
        if (isFunction(this.$$parsedNgModel($scope))) {
          invokeModelSetter($scope, {$$$p: newValue});
        } else {
          this.$$parsedNgModelAssign($scope, newValue);
        }
      };
    } else if (!this.$$parsedNgModel.assign) {
      throw ngModelMinErr('nonassign', 'Expression \'{0}\' is non-assignable. Element: {1}',
          this.$$attr.ngModel, startingTag(this.$$element));
    }
  },

  $render: noop,


  $isEmpty: function(value) {
    // eslint-disable-next-line no-self-compare
    return isUndefined(value) || value === '' || value === null || value !== value;
  },

  $$updateEmptyClasses: function(value) {
    if (this.$isEmpty(value)) {
      this.$$animate.removeClass(this.$$element, NOT_EMPTY_CLASS);
      this.$$animate.addClass(this.$$element, EMPTY_CLASS);
    } else {
      this.$$animate.removeClass(this.$$element, EMPTY_CLASS);
      this.$$animate.addClass(this.$$element, NOT_EMPTY_CLASS);
    }
  },


  $setPristine: function() {
    this.$dirty = false;
    this.$pristine = true;
    this.$$animate.removeClass(this.$$element, DIRTY_CLASS);
    this.$$animate.addClass(this.$$element, PRISTINE_CLASS);
  },

  $setDirty: function() {
    this.$dirty = true;
    this.$pristine = false;
    this.$$animate.removeClass(this.$$element, PRISTINE_CLASS);
    this.$$animate.addClass(this.$$element, DIRTY_CLASS);
    this.$$parentForm.$setDirty();
  },


  $setUntouched: function() {
    this.$touched = false;
    this.$untouched = true;
    this.$$animate.setClass(this.$$element, UNTOUCHED_CLASS, TOUCHED_CLASS);
  },

  $setTouched: function() {
    this.$touched = true;
    this.$untouched = false;
    this.$$animate.setClass(this.$$element, TOUCHED_CLASS, UNTOUCHED_CLASS);
  },

 
  $rollbackViewValue: function() {
    this.$$timeout.cancel(this.$$pendingDebounce);
    this.$viewValue = this.$$lastCommittedViewValue;
    this.$render();
  },


  $validate: function() {
    // ignore $validate before model is initialized
    if (isNumberNaN(this.$modelValue)) {
      return;
    }

    var viewValue = this.$$lastCommittedViewValue;
    // Note: we use the $$rawModelValue as $modelValue might have been
    // set to undefined during a view -> model update that found validation
    // errors. We can't parse the view here, since that could change
    // the model although neither viewValue nor the model on the scope changed
    var modelValue = this.$$rawModelValue;

    var prevValid = this.$valid;
    var prevModelValue = this.$modelValue;

    var allowInvalid = this.$options.getOption('allowInvalid');

    var that = this;
    this.$$runValidators(modelValue, viewValue, function(allValid) {
      // If there was no change in validity, don't update the model
      // This prevents changing an invalid modelValue to undefined
      if (!allowInvalid && prevValid !== allValid) {
        // Note: Don't check this.$valid here, as we could have
        // external validators (e.g. calculated on the server),
        // that just call $setValidity and need the model value
        // to calculate their validity.
        that.$modelValue = allValid ? modelValue : undefined;

        if (that.$modelValue !== prevModelValue) {
          that.$$writeModelToScope();
        }
      }
    });
  },

  $$runValidators: function(modelValue, viewValue, doneCallback) {
    this.$$currentValidationRunId++;
    var localValidationRunId = this.$$currentValidationRunId;
    var that = this;

    // check parser error
    if (!processParseErrors()) {
      validationDone(false);
      return;
    }
    if (!processSyncValidators()) {
      validationDone(false);
      return;
    }
    processAsyncValidators();

    function processParseErrors() {
      var errorKey = that.$$parserName || 'parse';
      if (isUndefined(that.$$parserValid)) {
        setValidity(errorKey, null);
      } else {
        if (!that.$$parserValid) {
          forEach(that.$validators, function(v, name) {
            setValidity(name, null);
          });
          forEach(that.$asyncValidators, function(v, name) {
            setValidity(name, null);
          });
        }
        // Set the parse error last, to prevent unsetting it, should a $validators key == parserName
        setValidity(errorKey, that.$$parserValid);
        return that.$$parserValid;
      }
      return true;
    }

    function processSyncValidators() {
      var syncValidatorsValid = true;
      forEach(that.$validators, function(validator, name) {
        var result = Boolean(validator(modelValue, viewValue));
        syncValidatorsValid = syncValidatorsValid && result;
        setValidity(name, result);
      });
      if (!syncValidatorsValid) {
        forEach(that.$asyncValidators, function(v, name) {
          setValidity(name, null);
        });
        return false;
      }
      return true;
    }

    function processAsyncValidators() {
      var validatorPromises = [];
      var allValid = true;
      forEach(that.$asyncValidators, function(validator, name) {
        var promise = validator(modelValue, viewValue);
        if (!isPromiseLike(promise)) {
          throw ngModelMinErr('nopromise',
            'Expected asynchronous validator to return a promise but got \'{0}\' instead.', promise);
        }
        setValidity(name, undefined);
        validatorPromises.push(promise.then(function() {
          setValidity(name, true);
        }, function() {
          allValid = false;
          setValidity(name, false);
        }));
      });
      if (!validatorPromises.length) {
        validationDone(true);
      } else {
        that.$$q.all(validatorPromises).then(function() {
          validationDone(allValid);
        }, noop);
      }
    }

    function setValidity(name, isValid) {
      if (localValidationRunId === that.$$currentValidationRunId) {
        that.$setValidity(name, isValid);
      }
    }

    function validationDone(allValid) {
      if (localValidationRunId === that.$$currentValidationRunId) {

        doneCallback(allValid);
      }
    }
  },

  
  $commitViewValue: function() {
    var viewValue = this.$viewValue;

    this.$$timeout.cancel(this.$$pendingDebounce);

  
    if (this.$$lastCommittedViewValue === viewValue && (viewValue !== '' || !this.$$hasNativeValidators)) {
      return;
    }
    this.$$updateEmptyClasses(viewValue);
    this.$$lastCommittedViewValue = viewValue;

    // change to dirty
    if (this.$pristine) {
      this.$setDirty();
    }
    this.$$parseAndValidate();
  },

  $$parseAndValidate: function() {
    var viewValue = this.$$lastCommittedViewValue;
    var modelValue = viewValue;
    var that = this;

    this.$$parserValid = isUndefined(modelValue) ? undefined : true;

    if (this.$$parserValid) {
      for (var i = 0; i < this.$parsers.length; i++) {
        modelValue = this.$parsers[i](modelValue);
        if (isUndefined(modelValue)) {
          this.$$parserValid = false;
          break;
        }
      }
    }
    if (isNumberNaN(this.$modelValue)) {
      // this.$modelValue has not been touched yet...
      this.$modelValue = this.$$ngModelGet(this.$$scope);
    }
    var prevModelValue = this.$modelValue;
    var allowInvalid = this.$options.getOption('allowInvalid');
    this.$$rawModelValue = modelValue;

    if (allowInvalid) {
      this.$modelValue = modelValue;
      writeToModelIfNeeded();
    }

    // Pass the $$lastCommittedViewValue here, because the cached viewValue might be out of date.
    // This can happen if e.g. $setViewValue is called from inside a parser
    this.$$runValidators(modelValue, this.$$lastCommittedViewValue, function(allValid) {
      if (!allowInvalid) {
        // Note: Don't check this.$valid here, as we could have
        // external validators (e.g. calculated on the server),
        // that just call $setValidity and need the model value
        // to calculate their validity.
        that.$modelValue = allValid ? modelValue : undefined;
        writeToModelIfNeeded();
      }
    });

    function writeToModelIfNeeded() {
      if (that.$modelValue !== prevModelValue) {
        that.$$writeModelToScope();
      }
    }
  },

  $$writeModelToScope: function() {
    this.$$ngModelSet(this.$$scope, this.$modelValue);
    forEach(this.$viewChangeListeners, function(listener) {
      try {
        listener();
      } catch (e) {
        // eslint-disable-next-line no-invalid-this
        this.$$exceptionHandler(e);
      }
    }, this);
  },

  $setViewValue: function(value, trigger) {
    this.$viewValue = value;
    if (this.$options.getOption('updateOnDefault')) {
      this.$$debounceViewValueCommit(trigger);
    }
  },

  $$debounceViewValueCommit: function(trigger) {
    var debounceDelay = this.$options.getOption('debounce');

    if (isNumber(debounceDelay[trigger])) {
      debounceDelay = debounceDelay[trigger];
    } else if (isNumber(debounceDelay['default'])) {
      debounceDelay = debounceDelay['default'];
    }

    this.$$timeout.cancel(this.$$pendingDebounce);
    var that = this;
    if (debounceDelay > 0) { // this fails if debounceDelay is an object
      this.$$pendingDebounce = this.$$timeout(function() {
        that.$commitViewValue();
      }, debounceDelay);
    } else if (this.$$scope.$root.$$phase) {
      this.$commitViewValue();
    } else {
      this.$$scope.$apply(function() {
        that.$commitViewValue();
      });
    }
  }
};

function setupModelWatcher(ctrl) {
  // model -> value
  // Note: we cannot use a normal scope.$watch as we want to detect the following:
  // 1. scope value is 'a'
  // 2. user enters 'b'
  // 3. ng-change kicks in and reverts scope value to 'a'
  //    -> scope value did not change since the last digest as
  //       ng-change executes in apply phase
  // 4. view should be changed back to 'a'
  ctrl.$$scope.$watch(function ngModelWatch() {
    var modelValue = ctrl.$$ngModelGet(ctrl.$$scope);

    // if scope model value and ngModel value are out of sync
    // TODO(perf): why not move this to the action fn?
    if (modelValue !== ctrl.$modelValue &&
       // checks for NaN is needed to allow setting the model to NaN when there's an asyncValidator
        // eslint-disable-next-line no-self-compare
       (ctrl.$modelValue === ctrl.$modelValue || modelValue === modelValue)
    ) {
      ctrl.$modelValue = ctrl.$$rawModelValue = modelValue;
      ctrl.$$parserValid = undefined;

      var formatters = ctrl.$formatters,
          idx = formatters.length;

      var viewValue = modelValue;
      while (idx--) {
        viewValue = formatters[idx](viewValue);
      }
      if (ctrl.$viewValue !== viewValue) {
        ctrl.$$updateEmptyClasses(viewValue);
        ctrl.$viewValue = ctrl.$$lastCommittedViewValue = viewValue;
        ctrl.$render();

        // It is possible that model and view value have been updated during render
        ctrl.$$runValidators(ctrl.$modelValue, ctrl.$viewValue, noop);
      }
    }

    return modelValue;
  });
}


addSetValidityMethod({
  clazz: NgModelController,
  set: function(object, property) {
    object[property] = true;
  },
  unset: function(object, property) {
    delete object[property];
  }
});


var ngModelDirective = ['$rootScope', function($rootScope) {
  return {
    restrict: 'A',
    require: ['ngModel', '^?form', '^?ngModelOptions'],
    controller: NgModelController,
    // Prelink needs to run before any input directive
    // so that we can set the NgModelOptions in NgModelController
    // before anyone else uses it.
    priority: 1,
    compile: function ngModelCompile(element) {
      // Setup initial state of the control
      element.addClass(PRISTINE_CLASS).addClass(UNTOUCHED_CLASS).addClass(VALID_CLASS);

      return {
        pre: function ngModelPreLink(scope, element, attr, ctrls) {
          var modelCtrl = ctrls[0],
              formCtrl = ctrls[1] || modelCtrl.$$parentForm,
              optionsCtrl = ctrls[2];

          if (optionsCtrl) {
            modelCtrl.$options = optionsCtrl.$options;
          }

          modelCtrl.$$initGetterSetters();

          // notify others, especially parent forms
          formCtrl.$addControl(modelCtrl);

          attr.$observe('name', function(newValue) {
            if (modelCtrl.$name !== newValue) {
              modelCtrl.$$parentForm.$$renameControl(modelCtrl, newValue);
            }
          });

          scope.$on('$destroy', function() {
            modelCtrl.$$parentForm.$removeControl(modelCtrl);
          });
        },
        post: function ngModelPostLink(scope, element, attr, ctrls) {
          var modelCtrl = ctrls[0];
          if (modelCtrl.$options.getOption('updateOn')) {
            element.on(modelCtrl.$options.getOption('updateOn'), function(ev) {
              modelCtrl.$$debounceViewValueCommit(ev && ev.type);
            });
          }

          function setTouched() {
            modelCtrl.$setTouched();
          }

          element.on('blur', function() {
            if (modelCtrl.$touched) return;

            if ($rootScope.$$phase) {
              scope.$evalAsync(setTouched);
            } else {
              scope.$apply(setTouched);
            }
          });
        }
      };
    }
  };
}];

/* exported defaultModelOptions */
var defaultModelOptions;
var DEFAULT_REGEXP = /(\s+|^)default(\s+|$)/;


function ModelOptions(options) {
  this.$$options = options;
}

ModelOptions.prototype = {


  getOption: function(name) {
    return this.$$options[name];
  },


  createChild: function(options) {
    var inheritAll = false;

    // make a shallow copy
    options = extend({}, options);

    // Inherit options from the parent if specified by the value `"$inherit"`
    forEach(options, /* @this */ function(option, key) {
      if (option === '$inherit') {
        if (key === '*') {
          inheritAll = true;
        } else {
          options[key] = this.$$options[key];
          // `updateOn` is special so we must also inherit the `updateOnDefault` option
          if (key === 'updateOn') {
            options.updateOnDefault = this.$$options.updateOnDefault;
          }
        }
      } else {
        if (key === 'updateOn') {
          // If the `updateOn` property contains the `default` event then we have to remove
          // it from the event list and set the `updateOnDefault` flag.
          options.updateOnDefault = false;
          options[key] = trim(option.replace(DEFAULT_REGEXP, function() {
            options.updateOnDefault = true;
            return ' ';
          }));
        }
      }
    }, this);

    if (inheritAll) {
      // We have a property of the form: `"*": "$inherit"`
      delete options['*'];
      defaults(options, this.$$options);
    }

    // Finally add in any missing defaults
    defaults(options, defaultModelOptions.$$options);

    return new ModelOptions(options);
  }
};


defaultModelOptions = new ModelOptions({
  updateOn: '',
  updateOnDefault: true,
  debounce: 0,
  getterSetter: false,
  allowInvalid: false,
  timezone: null
});


var ngModelOptionsDirective = function() {
  NgModelOptionsController.$inject = ['$attrs', '$scope'];
  function NgModelOptionsController($attrs, $scope) {
    this.$$attrs = $attrs;
    this.$$scope = $scope;
  }
  NgModelOptionsController.prototype = {
    $onInit: function() {
      var parentOptions = this.parentCtrl ? this.parentCtrl.$options : defaultModelOptions;
      var modelOptionsDefinition = this.$$scope.$eval(this.$$attrs.ngModelOptions);

      this.$options = parentOptions.createChild(modelOptionsDefinition);
    }
  };

  return {
    restrict: 'A',
    // ngModelOptions needs to run before ngModel and input directives
    priority: 10,
    require: {parentCtrl: '?^^ngModelOptions'},
    bindToController: true,
    controller: NgModelOptionsController
  };
};


// shallow copy over values from `src` that are not already specified on `dst`
function defaults(dst, src) {
  forEach(src, function(value, key) {
    if (!isDefined(dst[key])) {
      dst[key] = value;
    }
  });
}

var ngNonBindableDirective = ngDirective({ terminal: true, priority: 1000 });



var ngOptionsMinErr = minErr('ngOptions');


var NG_OPTIONS_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?(?:\s+disable\s+when\s+([\s\S]+?))?\s+for\s+(?:([$\w][$\w]*)|(?:\(\s*([$\w][$\w]*)\s*,\s*([$\w][$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/;


var ngOptionsDirective = ['$compile', '$document', '$parse', function($compile, $document, $parse) {

  function parseOptionsExpression(optionsExp, selectElement, scope) {

    var match = optionsExp.match(NG_OPTIONS_REGEXP);
    if (!(match)) {
      throw ngOptionsMinErr('iexp',
        'Expected expression in form of ' +
        '\'_select_ (as _label_)? for (_key_,)?_value_ in _collection_\'' +
        ' but got \'{0}\'. Element: {1}',
        optionsExp, startingTag(selectElement));
    }

    // Extract the parts from the ngOptions expression

    // The variable name for the value of the item in the collection
    var valueName = match[5] || match[7];
    // The variable name for the key of the item in the collection
    var keyName = match[6];

    // An expression that generates the viewValue for an option if there is a label expression
    var selectAs = / as /.test(match[0]) && match[1];
    // An expression that is used to track the id of each object in the options collection
    var trackBy = match[9];
    // An expression that generates the viewValue for an option if there is no label expression
    var valueFn = $parse(match[2] ? match[1] : valueName);
    var selectAsFn = selectAs && $parse(selectAs);
    var viewValueFn = selectAsFn || valueFn;
    var trackByFn = trackBy && $parse(trackBy);

    // Get the value by which we are going to track the option
    // if we have a trackFn then use that (passing scope and locals)
    // otherwise just hash the given viewValue
    var getTrackByValueFn = trackBy ?
                              function(value, locals) { return trackByFn(scope, locals); } :
                              function getHashOfValue(value) { return hashKey(value); };
    var getTrackByValue = function(value, key) {
      return getTrackByValueFn(value, getLocals(value, key));
    };

    var displayFn = $parse(match[2] || match[1]);
    var groupByFn = $parse(match[3] || '');
    var disableWhenFn = $parse(match[4] || '');
    var valuesFn = $parse(match[8]);

    var locals = {};
    var getLocals = keyName ? function(value, key) {
      locals[keyName] = key;
      locals[valueName] = value;
      return locals;
    } : function(value) {
      locals[valueName] = value;
      return locals;
    };


    function Option(selectValue, viewValue, label, group, disabled) {
      this.selectValue = selectValue;
      this.viewValue = viewValue;
      this.label = label;
      this.group = group;
      this.disabled = disabled;
    }

    function getOptionValuesKeys(optionValues) {
      var optionValuesKeys;

      if (!keyName && isArrayLike(optionValues)) {
        optionValuesKeys = optionValues;
      } else {
        // if object, extract keys, in enumeration order, unsorted
        optionValuesKeys = [];
        for (var itemKey in optionValues) {
          if (optionValues.hasOwnProperty(itemKey) && itemKey.charAt(0) !== '$') {
            optionValuesKeys.push(itemKey);
          }
        }
      }
      return optionValuesKeys;
    }

    return {
      trackBy: trackBy,
      getTrackByValue: getTrackByValue,
      getWatchables: $parse(valuesFn, function(optionValues) {
        // Create a collection of things that we would like to watch (watchedArray)
        // so that they can all be watched using a single $watchCollection
        // that only runs the handler once if anything changes
        var watchedArray = [];
        optionValues = optionValues || [];

        var optionValuesKeys = getOptionValuesKeys(optionValues);
        var optionValuesLength = optionValuesKeys.length;
        for (var index = 0; index < optionValuesLength; index++) {
          var key = (optionValues === optionValuesKeys) ? index : optionValuesKeys[index];
          var value = optionValues[key];

          var locals = getLocals(value, key);
          var selectValue = getTrackByValueFn(value, locals);
          watchedArray.push(selectValue);

          // Only need to watch the displayFn if there is a specific label expression
          if (match[2] || match[1]) {
            var label = displayFn(scope, locals);
            watchedArray.push(label);
          }

          // Only need to watch the disableWhenFn if there is a specific disable expression
          if (match[4]) {
            var disableWhen = disableWhenFn(scope, locals);
            watchedArray.push(disableWhen);
          }
        }
        return watchedArray;
      }),

      getOptions: function() {

        var optionItems = [];
        var selectValueMap = {};

        // The option values were already computed in the `getWatchables` fn,
        // which must have been called to trigger `getOptions`
        var optionValues = valuesFn(scope) || [];
        var optionValuesKeys = getOptionValuesKeys(optionValues);
        var optionValuesLength = optionValuesKeys.length;

        for (var index = 0; index < optionValuesLength; index++) {
          var key = (optionValues === optionValuesKeys) ? index : optionValuesKeys[index];
          var value = optionValues[key];
          var locals = getLocals(value, key);
          var viewValue = viewValueFn(scope, locals);
          var selectValue = getTrackByValueFn(viewValue, locals);
          var label = displayFn(scope, locals);
          var group = groupByFn(scope, locals);
          var disabled = disableWhenFn(scope, locals);
          var optionItem = new Option(selectValue, viewValue, label, group, disabled);

          optionItems.push(optionItem);
          selectValueMap[selectValue] = optionItem;
        }

        return {
          items: optionItems,
          selectValueMap: selectValueMap,
          getOptionFromViewValue: function(value) {
            return selectValueMap[getTrackByValue(value)];
          },
          getViewValueFromOption: function(option) {
            // If the viewValue could be an object that may be mutated by the application,
            // we need to make a copy and not return the reference to the value on the option.
            return trackBy ? copy(option.viewValue) : option.viewValue;
          }
        };
      }
    };
  }


  // we can't just jqLite('<option>') since jqLite is not smart enough
  // to create it in <select> and IE barfs otherwise.
  var optionTemplate = window.document.createElement('option'),
      optGroupTemplate = window.document.createElement('optgroup');

    function ngOptionsPostLink(scope, selectElement, attr, ctrls) {

      var selectCtrl = ctrls[0];
      var ngModelCtrl = ctrls[1];
      var multiple = attr.multiple;

      // The emptyOption allows the application developer to provide their own custom "empty"
      // option when the viewValue does not match any of the option values.
      for (var i = 0, children = selectElement.children(), ii = children.length; i < ii; i++) {
        if (children[i].value === '') {
          selectCtrl.hasEmptyOption = true;
          selectCtrl.emptyOption = children.eq(i);
          break;
        }
      }

      var providedEmptyOption = !!selectCtrl.emptyOption;

      var unknownOption = jqLite(optionTemplate.cloneNode(false));
      unknownOption.val('?');

      var options;
      var ngOptions = parseOptionsExpression(attr.ngOptions, selectElement, scope);
      // This stores the newly created options before they are appended to the select.
      // Since the contents are removed from the fragment when it is appended,
      // we only need to create it once.
      var listFragment = $document[0].createDocumentFragment();

      // Overwrite the implementation. ngOptions doesn't use hashes
      selectCtrl.generateUnknownOptionValue = function(val) {
        return '?';
      };

      // Update the controller methods for multiple selectable options
      if (!multiple) {

        selectCtrl.writeValue = function writeNgOptionsValue(value) {
          var selectedOption = options.selectValueMap[selectElement.val()];
          var option = options.getOptionFromViewValue(value);

          // Make sure to remove the selected attribute from the previously selected option
          // Otherwise, screen readers might get confused
          if (selectedOption) selectedOption.element.removeAttribute('selected');

          if (option) {
            // Don't update the option when it is already selected.
            // For example, the browser will select the first option by default. In that case,
            // most properties are set automatically - except the `selected` attribute, which we
            // set always

            if (selectElement[0].value !== option.selectValue) {
              selectCtrl.removeUnknownOption();
              selectCtrl.unselectEmptyOption();

              selectElement[0].value = option.selectValue;
              option.element.selected = true;
            }

            option.element.setAttribute('selected', 'selected');
          } else {

            if (providedEmptyOption) {
              selectCtrl.selectEmptyOption();
            } else if (selectCtrl.unknownOption.parent().length) {
              selectCtrl.updateUnknownOption(value);
            } else {
              selectCtrl.renderUnknownOption(value);
            }
          }
        };

        selectCtrl.readValue = function readNgOptionsValue() {

          var selectedOption = options.selectValueMap[selectElement.val()];

          if (selectedOption && !selectedOption.disabled) {
            selectCtrl.unselectEmptyOption();
            selectCtrl.removeUnknownOption();
            return options.getViewValueFromOption(selectedOption);
          }
          return null;
        };

        // If we are using `track by` then we must watch the tracked value on the model
        // since ngModel only watches for object identity change
        // FIXME: When a user selects an option, this watch will fire needlessly
        if (ngOptions.trackBy) {
          scope.$watch(
            function() { return ngOptions.getTrackByValue(ngModelCtrl.$viewValue); },
            function() { ngModelCtrl.$render(); }
          );
        }

      } else {

        selectCtrl.writeValue = function writeNgOptionsMultiple(values) {
          // Only set `<option>.selected` if necessary, in order to prevent some browsers from
          // scrolling to `<option>` elements that are outside the `<select>` element's viewport.

          var selectedOptions = values && values.map(getAndUpdateSelectedOption) || [];

          options.items.forEach(function(option) {
            if (option.element.selected && !includes(selectedOptions, option)) {
              option.element.selected = false;
            }
          });
        };


        selectCtrl.readValue = function readNgOptionsMultiple() {
          var selectedValues = selectElement.val() || [],
              selections = [];

          forEach(selectedValues, function(value) {
            var option = options.selectValueMap[value];
            if (option && !option.disabled) selections.push(options.getViewValueFromOption(option));
          });

          return selections;
        };

        // If we are using `track by` then we must watch these tracked values on the model
        // since ngModel only watches for object identity change
        if (ngOptions.trackBy) {

          scope.$watchCollection(function() {
            if (isArray(ngModelCtrl.$viewValue)) {
              return ngModelCtrl.$viewValue.map(function(value) {
                return ngOptions.getTrackByValue(value);
              });
            }
          }, function() {
            ngModelCtrl.$render();
          });

        }
      }

      if (providedEmptyOption) {

        // we need to remove it before calling selectElement.empty() because otherwise IE will
        // remove the label from the element. wtf?
        selectCtrl.emptyOption.remove();

        // compile the element since there might be bindings in it
        $compile(selectCtrl.emptyOption)(scope);

        if (selectCtrl.emptyOption[0].nodeType === NODE_TYPE_COMMENT) {
          // This means the empty option has currently no actual DOM node, probably because
          // it has been modified by a transclusion directive.
          selectCtrl.hasEmptyOption = false;

          // Redefine the registerOption function, which will catch
          // options that are added by ngIf etc. (rendering of the node is async because of
          // lazy transclusion)
          selectCtrl.registerOption = function(optionScope, optionEl) {
            if (optionEl.val() === '') {
              selectCtrl.hasEmptyOption = true;
              selectCtrl.emptyOption = optionEl;
              selectCtrl.emptyOption.removeClass('ng-scope');
              // This ensures the new empty option is selected if previously no option was selected
              ngModelCtrl.$render();

              optionEl.on('$destroy', function() {
                selectCtrl.hasEmptyOption = false;
                selectCtrl.emptyOption = undefined;
              });
            }
          };

        } else {
          // remove the class, which is added automatically because we recompile the element and it
          // becomes the compilation root
          selectCtrl.emptyOption.removeClass('ng-scope');
        }

      }

      selectElement.empty();

      // We need to do this here to ensure that the options object is defined
      // when we first hit it in writeNgOptionsValue
      updateOptions();

      // We will re-render the option elements if the option values or labels change
      scope.$watchCollection(ngOptions.getWatchables, updateOptions);

      // ------------------------------------------------------------------ //

      function addOptionElement(option, parent) {
        var optionElement = optionTemplate.cloneNode(false);
        parent.appendChild(optionElement);
        updateOptionElement(option, optionElement);
      }

      function getAndUpdateSelectedOption(viewValue) {
        var option = options.getOptionFromViewValue(viewValue);
        var element = option && option.element;

        if (element && !element.selected) element.selected = true;

        return option;
      }

      function updateOptionElement(option, element) {
        option.element = element;
        element.disabled = option.disabled;
        // NOTE: The label must be set before the value, otherwise IE10/11/EDGE create unresponsive
        // selects in certain circumstances when multiple selects are next to each other and display
        // the option list in listbox style, i.e. the select is [multiple], or specifies a [size].
        // See https://github.com/angular/angular.js/issues/11314 for more info.
        // This is unfortunately untestable with unit / e2e tests
        if (option.label !== element.label) {
          element.label = option.label;
          element.textContent = option.label;
        }
        element.value = option.selectValue;
      }

      function updateOptions() {
        var previousValue = options && selectCtrl.readValue();

        // We must remove all current options, but cannot simply set innerHTML = null
        // since the providedEmptyOption might have an ngIf on it that inserts comments which we
        // must preserve.
        // Instead, iterate over the current option elements and remove them or their optgroup
        // parents
        if (options) {

          for (var i = options.items.length - 1; i >= 0; i--) {
            var option = options.items[i];
            if (isDefined(option.group)) {
              jqLiteRemove(option.element.parentNode);
            } else {
              jqLiteRemove(option.element);
            }
          }
        }

        options = ngOptions.getOptions();

        var groupElementMap = {};

        // Ensure that the empty option is always there if it was explicitly provided
        if (providedEmptyOption) {
          selectElement.prepend(selectCtrl.emptyOption);
        }

        options.items.forEach(function addOption(option) {
          var groupElement;

          if (isDefined(option.group)) {

            // This option is to live in a group
            // See if we have already created this group
            groupElement = groupElementMap[option.group];

            if (!groupElement) {

              groupElement = optGroupTemplate.cloneNode(false);
              listFragment.appendChild(groupElement);

              // Update the label on the group element
              // "null" is special cased because of Safari
              groupElement.label = option.group === null ? 'null' : option.group;

              // Store it for use later
              groupElementMap[option.group] = groupElement;
            }

            addOptionElement(option, groupElement);

          } else {

            // This option is not in a group
            addOptionElement(option, listFragment);
          }
        });

        selectElement[0].appendChild(listFragment);

        ngModelCtrl.$render();

        // Check to see if the value has changed due to the update to the options
        if (!ngModelCtrl.$isEmpty(previousValue)) {
          var nextValue = selectCtrl.readValue();
          var isNotPrimitive = ngOptions.trackBy || multiple;
          if (isNotPrimitive ? !equals(previousValue, nextValue) : previousValue !== nextValue) {
            ngModelCtrl.$setViewValue(nextValue);
            ngModelCtrl.$render();
          }
        }

      }
  }

  return {
    restrict: 'A',
    terminal: true,
    require: ['select', 'ngModel'],
    link: {
      pre: function ngOptionsPreLink(scope, selectElement, attr, ctrls) {
        // Deactivate the SelectController.register method to prevent
        // option directives from accidentally registering themselves
        // (and unwanted $destroy handlers etc.)
        ctrls[0].registerOption = noop;
      },
      post: ngOptionsPostLink
    }
  };
}];

var ngPluralizeDirective = ['$locale', '$interpolate', '$log', function($locale, $interpolate, $log) {
  var BRACE = /{}/g,
      IS_WHEN = /^when(Minus)?(.+)$/;

  return {
    link: function(scope, element, attr) {
      var numberExp = attr.count,
          whenExp = attr.$attr.when && element.attr(attr.$attr.when), // we have {{}} in attrs
          offset = attr.offset || 0,
          whens = scope.$eval(whenExp) || {},
          whensExpFns = {},
          startSymbol = $interpolate.startSymbol(),
          endSymbol = $interpolate.endSymbol(),
          braceReplacement = startSymbol + numberExp + '-' + offset + endSymbol,
          watchRemover = angular.noop,
          lastCount;

      forEach(attr, function(expression, attributeName) {
        var tmpMatch = IS_WHEN.exec(attributeName);
        if (tmpMatch) {
          var whenKey = (tmpMatch[1] ? '-' : '') + lowercase(tmpMatch[2]);
          whens[whenKey] = element.attr(attr.$attr[attributeName]);
        }
      });
      forEach(whens, function(expression, key) {
        whensExpFns[key] = $interpolate(expression.replace(BRACE, braceReplacement));

      });

      scope.$watch(numberExp, function ngPluralizeWatchAction(newVal) {
        var count = parseFloat(newVal);
        var countIsNaN = isNumberNaN(count);

        if (!countIsNaN && !(count in whens)) {
          // If an explicit number rule such as 1, 2, 3... is defined, just use it.
          // Otherwise, check it against pluralization rules in $locale service.
          count = $locale.pluralCat(count - offset);
        }

        // If both `count` and `lastCount` are NaN, we don't need to re-register a watch.
        // In JS `NaN !== NaN`, so we have to explicitly check.
        if ((count !== lastCount) && !(countIsNaN && isNumberNaN(lastCount))) {
          watchRemover();
          var whenExpFn = whensExpFns[count];
          if (isUndefined(whenExpFn)) {
            if (newVal != null) {
              $log.debug('ngPluralize: no rule defined for \'' + count + '\' in ' + whenExp);
            }
            watchRemover = noop;
            updateElementText();
          } else {
            watchRemover = scope.$watch(whenExpFn, updateElementText);
          }
          lastCount = count;
        }
      });

      function updateElementText(newText) {
        element.text(newText || '');
      }
    }
  };
}];


var ngRepeatDirective = ['$parse', '$animate', '$compile', function($parse, $animate, $compile) {
  var NG_REMOVED = '$$NG_REMOVED';
  var ngRepeatMinErr = minErr('ngRepeat');

  var updateScope = function(scope, index, valueIdentifier, value, keyIdentifier, key, arrayLength) {
    // TODO(perf): generate setters to shave off ~40ms or 1-1.5%
    scope[valueIdentifier] = value;
    if (keyIdentifier) scope[keyIdentifier] = key;
    scope.$index = index;
    scope.$first = (index === 0);
    scope.$last = (index === (arrayLength - 1));
    scope.$middle = !(scope.$first || scope.$last);
    // eslint-disable-next-line no-bitwise
    scope.$odd = !(scope.$even = (index & 1) === 0);
  };

  var getBlockStart = function(block) {
    return block.clone[0];
  };

  var getBlockEnd = function(block) {
    return block.clone[block.clone.length - 1];
  };


  return {
    restrict: 'A',
    multiElement: true,
    transclude: 'element',
    priority: 1000,
    terminal: true,
    $$tlb: true,
    compile: function ngRepeatCompile($element, $attr) {
      var expression = $attr.ngRepeat;
      var ngRepeatEndComment = $compile.$$createComment('end ngRepeat', expression);

      var match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);

      if (!match) {
        throw ngRepeatMinErr('iexp', 'Expected expression in form of \'_item_ in _collection_[ track by _id_]\' but got \'{0}\'.',
            expression);
      }

      var lhs = match[1];
      var rhs = match[2];
      var aliasAs = match[3];
      var trackByExp = match[4];

      match = lhs.match(/^(?:(\s*[$\w]+)|\(\s*([$\w]+)\s*,\s*([$\w]+)\s*\))$/);

      if (!match) {
        throw ngRepeatMinErr('iidexp', '\'_item_\' in \'_item_ in _collection_\' should be an identifier or \'(_key_, _value_)\' expression, but got \'{0}\'.',
            lhs);
      }
      var valueIdentifier = match[3] || match[1];
      var keyIdentifier = match[2];

      if (aliasAs && (!/^[$a-zA-Z_][$a-zA-Z0-9_]*$/.test(aliasAs) ||
          /^(null|undefined|this|\$index|\$first|\$middle|\$last|\$even|\$odd|\$parent|\$root|\$id)$/.test(aliasAs))) {
        throw ngRepeatMinErr('badident', 'alias \'{0}\' is invalid --- must be a valid JS identifier which is not a reserved name.',
          aliasAs);
      }

      var trackByExpGetter, trackByIdExpFn, trackByIdArrayFn, trackByIdObjFn;
      var hashFnLocals = {$id: hashKey};

      if (trackByExp) {
        trackByExpGetter = $parse(trackByExp);
      } else {
        trackByIdArrayFn = function(key, value) {
          return hashKey(value);
        };
        trackByIdObjFn = function(key) {
          return key;
        };
      }

      return function ngRepeatLink($scope, $element, $attr, ctrl, $transclude) {

        if (trackByExpGetter) {
          trackByIdExpFn = function(key, value, index) {
            // assign key, value, and $index to the locals so that they can be used in hash functions
            if (keyIdentifier) hashFnLocals[keyIdentifier] = key;
            hashFnLocals[valueIdentifier] = value;
            hashFnLocals.$index = index;
            return trackByExpGetter($scope, hashFnLocals);
          };
        }

        // Store a list of elements from previous run. This is a hash where key is the item from the
        // iterator, and the value is objects with following properties.
        //   - scope: bound scope
        //   - element: previous element.
        //   - index: position
        //
        // We are using no-proto object so that we don't need to guard against inherited props via
        // hasOwnProperty.
        var lastBlockMap = createMap();

        //watch props
        $scope.$watchCollection(rhs, function ngRepeatAction(collection) {
          var index, length,
              previousNode = $element[0],     // node that cloned nodes should be inserted after
                                              // initialized to the comment node anchor
              nextNode,
              // Same as lastBlockMap but it has the current state. It will become the
              // lastBlockMap on the next iteration.
              nextBlockMap = createMap(),
              collectionLength,
              key, value, // key/value of iteration
              trackById,
              trackByIdFn,
              collectionKeys,
              block,       // last object information {scope, element, id}
              nextBlockOrder,
              elementsToRemove;

          if (aliasAs) {
            $scope[aliasAs] = collection;
          }

          if (isArrayLike(collection)) {
            collectionKeys = collection;
            trackByIdFn = trackByIdExpFn || trackByIdArrayFn;
          } else {
            trackByIdFn = trackByIdExpFn || trackByIdObjFn;
            // if object, extract keys, in enumeration order, unsorted
            collectionKeys = [];
            for (var itemKey in collection) {
              if (hasOwnProperty.call(collection, itemKey) && itemKey.charAt(0) !== '$') {
                collectionKeys.push(itemKey);
              }
            }
          }

          collectionLength = collectionKeys.length;
          nextBlockOrder = new Array(collectionLength);

          // locate existing items
          for (index = 0; index < collectionLength; index++) {
            key = (collection === collectionKeys) ? index : collectionKeys[index];
            value = collection[key];
            trackById = trackByIdFn(key, value, index);
            if (lastBlockMap[trackById]) {
              // found previously seen block
              block = lastBlockMap[trackById];
              delete lastBlockMap[trackById];
              nextBlockMap[trackById] = block;
              nextBlockOrder[index] = block;
            } else if (nextBlockMap[trackById]) {
              // if collision detected. restore lastBlockMap and throw an error
              forEach(nextBlockOrder, function(block) {
                if (block && block.scope) lastBlockMap[block.id] = block;
              });
              throw ngRepeatMinErr('dupes',
                  'Duplicates in a repeater are not allowed. Use \'track by\' expression to specify unique keys. Repeater: {0}, Duplicate key: {1}, Duplicate value: {2}',
                  expression, trackById, value);
            } else {
              // new never before seen block
              nextBlockOrder[index] = {id: trackById, scope: undefined, clone: undefined};
              nextBlockMap[trackById] = true;
            }
          }

          // remove leftover items
          for (var blockKey in lastBlockMap) {
            block = lastBlockMap[blockKey];
            elementsToRemove = getBlockNodes(block.clone);
            $animate.leave(elementsToRemove);
            if (elementsToRemove[0].parentNode) {
              // if the element was not removed yet because of pending animation, mark it as deleted
              // so that we can ignore it later
              for (index = 0, length = elementsToRemove.length; index < length; index++) {
                elementsToRemove[index][NG_REMOVED] = true;
              }
            }
            block.scope.$destroy();
          }

          // we are not using forEach for perf reasons (trying to avoid #call)
          for (index = 0; index < collectionLength; index++) {
            key = (collection === collectionKeys) ? index : collectionKeys[index];
            value = collection[key];
            block = nextBlockOrder[index];

            if (block.scope) {
              // if we have already seen this object, then we need to reuse the
              // associated scope/element

              nextNode = previousNode;

              // skip nodes that are already pending removal via leave animation
              do {
                nextNode = nextNode.nextSibling;
              } while (nextNode && nextNode[NG_REMOVED]);

              if (getBlockStart(block) !== nextNode) {
                // existing item which got moved
                $animate.move(getBlockNodes(block.clone), null, previousNode);
              }
              previousNode = getBlockEnd(block);
              updateScope(block.scope, index, valueIdentifier, value, keyIdentifier, key, collectionLength);
            } else {
              // new item which we don't know about
              $transclude(function ngRepeatTransclude(clone, scope) {
                block.scope = scope;
                // http://jsperf.com/clone-vs-createcomment
                var endNode = ngRepeatEndComment.cloneNode(false);
                clone[clone.length++] = endNode;

                $animate.enter(clone, null, previousNode);
                previousNode = endNode;
                // Note: We only need the first/last node of the cloned nodes.
                // However, we need to keep the reference to the jqlite wrapper as it might be changed later
                // by a directive with templateUrl when its template arrives.
                block.clone = clone;
                nextBlockMap[block.id] = block;
                updateScope(block.scope, index, valueIdentifier, value, keyIdentifier, key, collectionLength);
              });
            }
          }
          lastBlockMap = nextBlockMap;
        });
      };
    }
  };
}];

var NG_HIDE_CLASS = 'ng-hide';
var NG_HIDE_IN_PROGRESS_CLASS = 'ng-hide-animate';

var ngShowDirective = ['$animate', function($animate) {
  return {
    restrict: 'A',
    multiElement: true,
    link: function(scope, element, attr) {
      scope.$watch(attr.ngShow, function ngShowWatchAction(value) {
        // we're adding a temporary, animation-specific class for ng-hide since this way
        // we can control when the element is actually displayed on screen without having
        // to have a global/greedy CSS selector that breaks when other animations are run.
        // Read: https://github.com/angular/angular.js/issues/9103#issuecomment-58335845
        $animate[value ? 'removeClass' : 'addClass'](element, NG_HIDE_CLASS, {
          tempClasses: NG_HIDE_IN_PROGRESS_CLASS
        });
      });
    }
  };
}];


var ngHideDirective = ['$animate', function($animate) {
  return {
    restrict: 'A',
    multiElement: true,
    link: function(scope, element, attr) {
      scope.$watch(attr.ngHide, function ngHideWatchAction(value) {
        // The comment inside of the ngShowDirective explains why we add and
        // remove a temporary class for the show/hide animation
        $animate[value ? 'addClass' : 'removeClass'](element,NG_HIDE_CLASS, {
          tempClasses: NG_HIDE_IN_PROGRESS_CLASS
        });
      });
    }
  };
}];


var ngStyleDirective = ngDirective(function(scope, element, attr) {
  scope.$watch(attr.ngStyle, function ngStyleWatchAction(newStyles, oldStyles) {
    if (oldStyles && (newStyles !== oldStyles)) {
      forEach(oldStyles, function(val, style) { element.css(style, '');});
    }
    if (newStyles) element.css(newStyles);
  }, true);
});

var ngSwitchDirective = ['$animate', '$compile', function($animate, $compile) {
  return {
    require: 'ngSwitch',

    // asks for $scope to fool the BC controller module
    controller: ['$scope', function NgSwitchController() {
     this.cases = {};
    }],
    link: function(scope, element, attr, ngSwitchController) {
      var watchExpr = attr.ngSwitch || attr.on,
          selectedTranscludes = [],
          selectedElements = [],
          previousLeaveAnimations = [],
          selectedScopes = [];

      var spliceFactory = function(array, index) {
          return function(response) {
            if (response !== false) array.splice(index, 1);
          };
      };

      scope.$watch(watchExpr, function ngSwitchWatchAction(value) {
        var i, ii;

        // Start with the last, in case the array is modified during the loop
        while (previousLeaveAnimations.length) {
          $animate.cancel(previousLeaveAnimations.pop());
        }

        for (i = 0, ii = selectedScopes.length; i < ii; ++i) {
          var selected = getBlockNodes(selectedElements[i].clone);
          selectedScopes[i].$destroy();
          var runner = previousLeaveAnimations[i] = $animate.leave(selected);
          runner.done(spliceFactory(previousLeaveAnimations, i));
        }

        selectedElements.length = 0;
        selectedScopes.length = 0;

        if ((selectedTranscludes = ngSwitchController.cases['!' + value] || ngSwitchController.cases['?'])) {
          forEach(selectedTranscludes, function(selectedTransclude) {
            selectedTransclude.transclude(function(caseElement, selectedScope) {
              selectedScopes.push(selectedScope);
              var anchor = selectedTransclude.element;
              caseElement[caseElement.length++] = $compile.$$createComment('end ngSwitchWhen');
              var block = { clone: caseElement };

              selectedElements.push(block);
              $animate.enter(caseElement, anchor.parent(), anchor);
            });
          });
        }
      });
    }
  };
}];

var ngSwitchWhenDirective = ngDirective({
  transclude: 'element',
  priority: 1200,
  require: '^ngSwitch',
  multiElement: true,
  link: function(scope, element, attrs, ctrl, $transclude) {

    var cases = attrs.ngSwitchWhen.split(attrs.ngSwitchWhenSeparator).sort().filter(
      // Filter duplicate cases
      function(element, index, array) { return array[index - 1] !== element; }
    );

    forEach(cases, function(whenCase) {
      ctrl.cases['!' + whenCase] = (ctrl.cases['!' + whenCase] || []);
      ctrl.cases['!' + whenCase].push({ transclude: $transclude, element: element });
    });
  }
});

var ngSwitchDefaultDirective = ngDirective({
  transclude: 'element',
  priority: 1200,
  require: '^ngSwitch',
  multiElement: true,
  link: function(scope, element, attr, ctrl, $transclude) {
    ctrl.cases['?'] = (ctrl.cases['?'] || []);
    ctrl.cases['?'].push({ transclude: $transclude, element: element });
   }
});


var ngTranscludeMinErr = minErr('ngTransclude');
var ngTranscludeDirective = ['$compile', function($compile) {
  return {
    restrict: 'EAC',
    terminal: true,
    compile: function ngTranscludeCompile(tElement) {

      // Remove and cache any original content to act as a fallback
      var fallbackLinkFn = $compile(tElement.contents());
      tElement.empty();

      return function ngTranscludePostLink($scope, $element, $attrs, controller, $transclude) {

        if (!$transclude) {
          throw ngTranscludeMinErr('orphan',
          'Illegal use of ngTransclude directive in the template! ' +
          'No parent directive that requires a transclusion found. ' +
          'Element: {0}',
          startingTag($element));
        }


        // If the attribute is of the form: `ng-transclude="ng-transclude"` then treat it like the default
        if ($attrs.ngTransclude === $attrs.$attr.ngTransclude) {
          $attrs.ngTransclude = '';
        }
        var slotName = $attrs.ngTransclude || $attrs.ngTranscludeSlot;

        // If the slot is required and no transclusion content is provided then this call will throw an error
        $transclude(ngTranscludeCloneAttachFn, null, slotName);

        // If the slot is optional and no transclusion content is provided then use the fallback content
        if (slotName && !$transclude.isSlotFilled(slotName)) {
          useFallbackContent();
        }

        function ngTranscludeCloneAttachFn(clone, transcludedScope) {
          if (clone.length && notWhitespace(clone)) {
            $element.append(clone);
          } else {
            useFallbackContent();
            // There is nothing linked against the transcluded scope since no content was available,
            // so it should be safe to clean up the generated scope.
            transcludedScope.$destroy();
          }
        }

        function useFallbackContent() {
          // Since this is the fallback content rather than the transcluded content,
          // we link against the scope of this directive rather than the transcluded scope
          fallbackLinkFn($scope, function(clone) {
            $element.append(clone);
          });
        }

        function notWhitespace(nodes) {
          for (var i = 0, ii = nodes.length; i < ii; i++) {
            var node = nodes[i];
            if (node.nodeType !== NODE_TYPE_TEXT || node.nodeValue.trim()) {
              return true;
            }
          }
        }
      };
    }
  };
}];


var scriptDirective = ['$templateCache', function($templateCache) {
  return {
    restrict: 'E',
    terminal: true,
    compile: function(element, attr) {
      if (attr.type === 'text/ng-template') {
        var templateUrl = attr.id,
            text = element[0].text;

        $templateCache.put(templateUrl, text);
      }
    }
  };
}];

/* exported selectDirective, optionDirective */

var noopNgModelController = { $setViewValue: noop, $render: noop };


var SelectController =
        ['$element', '$scope', /** @this */ function($element, $scope) {

  var self = this,
      optionsMap = new HashMap();

  self.selectValueMap = {}; // Keys are the hashed values, values the original values

  // If the ngModel doesn't get provided then provide a dummy noop version to prevent errors
  self.ngModelCtrl = noopNgModelController;
  self.multiple = false;

 
  self.unknownOption = jqLite(window.document.createElement('option'));

  self.hasEmptyOption = false;
  self.emptyOption = undefined;

  self.renderUnknownOption = function(val) {
    var unknownVal = self.generateUnknownOptionValue(val);
    self.unknownOption.val(unknownVal);
    $element.prepend(self.unknownOption);
    setOptionAsSelected(self.unknownOption);
    $element.val(unknownVal);
  };

  self.updateUnknownOption = function(val) {
    var unknownVal = self.generateUnknownOptionValue(val);
    self.unknownOption.val(unknownVal);
    setOptionAsSelected(self.unknownOption);
    $element.val(unknownVal);
  };

  self.generateUnknownOptionValue = function(val) {
    return '? ' + hashKey(val) + ' ?';
  };

  self.removeUnknownOption = function() {
    if (self.unknownOption.parent()) self.unknownOption.remove();
  };

  self.selectEmptyOption = function() {
    if (self.emptyOption) {
      $element.val('');
      setOptionAsSelected(self.emptyOption);
    }
  };

  self.unselectEmptyOption = function() {
    if (self.hasEmptyOption) {
      self.emptyOption.removeAttr('selected');
    }
  };

  $scope.$on('$destroy', function() {
    // disable unknown option so that we don't do work when the whole select is being destroyed
    self.renderUnknownOption = noop;
  });

  // Read the value of the select control, the implementation of this changes depending
  // upon whether the select can have multiple values and whether ngOptions is at work.
  self.readValue = function readSingleValue() {
    var val = $element.val();
    // ngValue added option values are stored in the selectValueMap, normal interpolations are not
    var realVal = val in self.selectValueMap ? self.selectValueMap[val] : val;

    if (self.hasOption(realVal)) {
      return realVal;
    }

    return null;
  };


  // Write the value to the select control, the implementation of this changes depending
  // upon whether the select can have multiple values and whether ngOptions is at work.
  self.writeValue = function writeSingleValue(value) {
    // Make sure to remove the selected attribute from the previously selected option
    // Otherwise, screen readers might get confused
    var currentlySelectedOption = $element[0].options[$element[0].selectedIndex];
    if (currentlySelectedOption) currentlySelectedOption.removeAttribute('selected');

    if (self.hasOption(value)) {
      self.removeUnknownOption();

      var hashedVal = hashKey(value);
      $element.val(hashedVal in self.selectValueMap ? hashedVal : value);

      // Set selected attribute and property on selected option for screen readers
      var selectedOption = $element[0].options[$element[0].selectedIndex];
      setOptionAsSelected(jqLite(selectedOption));
    } else {
      if (value == null && self.emptyOption) {
        self.removeUnknownOption();
        self.selectEmptyOption();
      } else if (self.unknownOption.parent().length) {
        self.updateUnknownOption(value);
      } else {
        self.renderUnknownOption(value);
      }
    }
  };


  // Tell the select control that an option, with the given value, has been added
  self.addOption = function(value, element) {
    // Skip comment nodes, as they only pollute the `optionsMap`
    if (element[0].nodeType === NODE_TYPE_COMMENT) return;

    assertNotHasOwnProperty(value, '"option value"');
    if (value === '') {
      self.hasEmptyOption = true;
      self.emptyOption = element;
    }
    var count = optionsMap.get(value) || 0;
    optionsMap.put(value, count + 1);
    // Only render at the end of a digest. This improves render performance when many options
    // are added during a digest and ensures all relevant options are correctly marked as selected
    scheduleRender();
  };

  // Tell the select control that an option, with the given value, has been removed
  self.removeOption = function(value) {
    var count = optionsMap.get(value);
    if (count) {
      if (count === 1) {
        optionsMap.remove(value);
        if (value === '') {
          self.hasEmptyOption = false;
          self.emptyOption = undefined;
        }
      } else {
        optionsMap.put(value, count - 1);
      }
    }
  };

  // Check whether the select control has an option matching the given value
  self.hasOption = function(value) {
    return !!optionsMap.get(value);
  };


  var renderScheduled = false;
  function scheduleRender() {
    if (renderScheduled) return;
    renderScheduled = true;
    $scope.$$postDigest(function() {
      renderScheduled = false;
      self.ngModelCtrl.$render();
    });
  }

  var updateScheduled = false;
  function scheduleViewValueUpdate(renderAfter) {
    if (updateScheduled) return;

    updateScheduled = true;

    $scope.$$postDigest(function() {
      if ($scope.$$destroyed) return;

      updateScheduled = false;
      self.ngModelCtrl.$setViewValue(self.readValue());
      if (renderAfter) self.ngModelCtrl.$render();
    });
  }


  self.registerOption = function(optionScope, optionElement, optionAttrs, interpolateValueFn, interpolateTextFn) {

    if (optionAttrs.$attr.ngValue) {
      // The value attribute is set by ngValue
      var oldVal, hashedVal = NaN;
      optionAttrs.$observe('value', function valueAttributeObserveAction(newVal) {

        var removal;
        var previouslySelected = optionElement.prop('selected');

        if (isDefined(hashedVal)) {
          self.removeOption(oldVal);
          delete self.selectValueMap[hashedVal];
          removal = true;
        }

        hashedVal = hashKey(newVal);
        oldVal = newVal;
        self.selectValueMap[hashedVal] = newVal;
        self.addOption(newVal, optionElement);
        // Set the attribute directly instead of using optionAttrs.$set - this stops the observer
        // from firing a second time. Other $observers on value will also get the result of the
        // ngValue expression, not the hashed value
        optionElement.attr('value', hashedVal);

        if (removal && previouslySelected) {
          scheduleViewValueUpdate();
        }

      });
    } else if (interpolateValueFn) {
      // The value attribute is interpolated
      optionAttrs.$observe('value', function valueAttributeObserveAction(newVal) {
        // This method is overwritten in ngOptions and has side-effects!
        self.readValue();

        var removal;
        var previouslySelected = optionElement.prop('selected');

        if (isDefined(oldVal)) {
          self.removeOption(oldVal);
          removal = true;
        }
        oldVal = newVal;
        self.addOption(newVal, optionElement);

        if (removal && previouslySelected) {
          scheduleViewValueUpdate();
        }
      });
    } else if (interpolateTextFn) {
      // The text content is interpolated
      optionScope.$watch(interpolateTextFn, function interpolateWatchAction(newVal, oldVal) {
        optionAttrs.$set('value', newVal);
        var previouslySelected = optionElement.prop('selected');
        if (oldVal !== newVal) {
          self.removeOption(oldVal);
        }
        self.addOption(newVal, optionElement);

        if (oldVal && previouslySelected) {
          scheduleViewValueUpdate();
        }
      });
    } else {
      // The value attribute is static
      self.addOption(optionAttrs.value, optionElement);
    }


    optionAttrs.$observe('disabled', function(newVal) {

      // Since model updates will also select disabled options (like ngOptions),
      // we only have to handle options becoming disabled, not enabled

      if (newVal === 'true' || newVal && optionElement.prop('selected')) {
        if (self.multiple) {
          scheduleViewValueUpdate(true);
        } else {
          self.ngModelCtrl.$setViewValue(null);
          self.ngModelCtrl.$render();
        }
      }
    });

    optionElement.on('$destroy', function() {
      var currentValue = self.readValue();
      var removeValue = optionAttrs.value;

      self.removeOption(removeValue);
      self.ngModelCtrl.$render();

      if (self.multiple && currentValue && currentValue.indexOf(removeValue) !== -1 ||
          currentValue === removeValue
      ) {
        // When multiple (selected) options are destroyed at the same time, we don't want
        // to run a model update for each of them. Instead, run a single update in the $$postDigest
        scheduleViewValueUpdate(true);
      }
    });
  };

  function setOptionAsSelected(optionEl) {
    optionEl.prop('selected', true); // needed for IE
    optionEl.attr('selected', true);
  }
}];


var selectDirective = function() {

  return {
    restrict: 'E',
    require: ['select', '?ngModel'],
    controller: SelectController,
    priority: 1,
    link: {
      pre: selectPreLink,
      post: selectPostLink
    }
  };

  function selectPreLink(scope, element, attr, ctrls) {

      var selectCtrl = ctrls[0];
      var ngModelCtrl = ctrls[1];

      // if ngModel is not defined, we don't need to do anything but set the registerOption
      // function to noop, so options don't get added internally
      if (!ngModelCtrl) {
        selectCtrl.registerOption = noop;
        return;
      }


      selectCtrl.ngModelCtrl = ngModelCtrl;

      // When the selected item(s) changes we delegate getting the value of the select control
      // to the `readValue` method, which can be changed if the select can have multiple
      // selected values or if the options are being generated by `ngOptions`
      element.on('change', function() {
        selectCtrl.removeUnknownOption();
        scope.$apply(function() {
          ngModelCtrl.$setViewValue(selectCtrl.readValue());
        });
      });

      // If the select allows multiple values then we need to modify how we read and write
      // values from and to the control; also what it means for the value to be empty and
      // we have to add an extra watch since ngModel doesn't work well with arrays - it
      // doesn't trigger rendering if only an item in the array changes.
      if (attr.multiple) {
        selectCtrl.multiple = true;

        // Read value now needs to check each option to see if it is selected
        selectCtrl.readValue = function readMultipleValue() {
          var array = [];
          forEach(element.find('option'), function(option) {
            if (option.selected && !option.disabled) {
              var val = option.value;
              array.push(val in selectCtrl.selectValueMap ? selectCtrl.selectValueMap[val] : val);
            }
          });
          return array;
        };

        // Write value now needs to set the selected property of each matching option
        selectCtrl.writeValue = function writeMultipleValue(value) {
          var items = new HashMap(value);
          forEach(element.find('option'), function(option) {
            option.selected = isDefined(items.get(option.value)) || isDefined(items.get(selectCtrl.selectValueMap[option.value]));
          });
        };

        // we have to do it on each watch since ngModel watches reference, but
        // we need to work of an array, so we need to see if anything was inserted/removed
        var lastView, lastViewRef = NaN;
        scope.$watch(function selectMultipleWatch() {
          if (lastViewRef === ngModelCtrl.$viewValue && !equals(lastView, ngModelCtrl.$viewValue)) {
            lastView = shallowCopy(ngModelCtrl.$viewValue);
            ngModelCtrl.$render();
          }
          lastViewRef = ngModelCtrl.$viewValue;
        });

        // If we are a multiple select then value is now a collection
        // so the meaning of $isEmpty changes
        ngModelCtrl.$isEmpty = function(value) {
          return !value || value.length === 0;
        };

      }
    }

    function selectPostLink(scope, element, attrs, ctrls) {
      // if ngModel is not defined, we don't need to do anything
      var ngModelCtrl = ctrls[1];
      if (!ngModelCtrl) return;

      var selectCtrl = ctrls[0];

      // We delegate rendering to the `writeValue` method, which can be changed
      // if the select can have multiple selected values or if the options are being
      // generated by `ngOptions`.
      // This must be done in the postLink fn to prevent $render to be called before
      // all nodes have been linked correctly.
      ngModelCtrl.$render = function() {
        selectCtrl.writeValue(ngModelCtrl.$viewValue);
      };
    }
};


// The option directive is purely designed to communicate the existence (or lack of)
// of dynamically created (and destroyed) option elements to their containing select
// directive via its controller.
var optionDirective = ['$interpolate', function($interpolate) {
  return {
    restrict: 'E',
    priority: 100,
    compile: function(element, attr) {
      var interpolateValueFn, interpolateTextFn;

      if (isDefined(attr.ngValue)) {
        // Will be handled by registerOption
      } else if (isDefined(attr.value)) {
        // If the value attribute is defined, check if it contains an interpolation
        interpolateValueFn = $interpolate(attr.value, true);
      } else {
        // If the value attribute is not defined then we fall back to the
        // text content of the option element, which may be interpolated
        interpolateTextFn = $interpolate(element.text(), true);
        if (!interpolateTextFn) {
          attr.$set('value', element.text());
        }
      }

      return function(scope, element, attr) {
        // This is an optimization over using ^^ since we don't want to have to search
        // all the way to the root of the DOM for every single option element
        var selectCtrlName = '$selectController',
            parent = element.parent(),
            selectCtrl = parent.data(selectCtrlName) ||
              parent.parent().data(selectCtrlName); // in case we are in optgroup

        if (selectCtrl) {
          selectCtrl.registerOption(scope, element, attr, interpolateValueFn, interpolateTextFn);
        }
      };
    }
  };
}];


var requiredDirective = function() {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function(scope, elm, attr, ctrl) {
      if (!ctrl) return;
      attr.required = true; // force truthy in case we are on non input element

      ctrl.$validators.required = function(modelValue, viewValue) {
        return !attr.required || !ctrl.$isEmpty(viewValue);
      };

      attr.$observe('required', function() {
        ctrl.$validate();
      });
    }
  };
};


var patternDirective = function() {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function(scope, elm, attr, ctrl) {
      if (!ctrl) return;

      var regexp, patternExp = attr.ngPattern || attr.pattern;
      attr.$observe('pattern', function(regex) {
        if (isString(regex) && regex.length > 0) {
          regex = new RegExp('^' + regex + '$');
        }

        if (regex && !regex.test) {
          throw minErr('ngPattern')('noregexp',
            'Expected {0} to be a RegExp but was {1}. Element: {2}', patternExp,
            regex, startingTag(elm));
        }

        regexp = regex || undefined;
        ctrl.$validate();
      });

      ctrl.$validators.pattern = function(modelValue, viewValue) {
        // HTML5 pattern constraint validates the input value, so we validate the viewValue
        return ctrl.$isEmpty(viewValue) || isUndefined(regexp) || regexp.test(viewValue);
      };
    }
  };
};


var maxlengthDirective = function() {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function(scope, elm, attr, ctrl) {
      if (!ctrl) return;

      var maxlength = -1;
      attr.$observe('maxlength', function(value) {
        var intVal = toInt(value);
        maxlength = isNumberNaN(intVal) ? -1 : intVal;
        ctrl.$validate();
      });
      ctrl.$validators.maxlength = function(modelValue, viewValue) {
        return (maxlength < 0) || ctrl.$isEmpty(viewValue) || (viewValue.length <= maxlength);
      };
    }
  };
};


var minlengthDirective = function() {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function(scope, elm, attr, ctrl) {
      if (!ctrl) return;

      var minlength = 0;
      attr.$observe('minlength', function(value) {
        minlength = toInt(value) || 0;
        ctrl.$validate();
      });
      ctrl.$validators.minlength = function(modelValue, viewValue) {
        return ctrl.$isEmpty(viewValue) || viewValue.length >= minlength;
      };
    }
  };
};

if (window.angular.bootstrap) {
  // AngularJS is already loaded, so we can return here...
  if (window.console) {
    console.log('WARNING: Tried to load angular more than once.');
  }
  return;
}

// try to bind to jquery now so that one can write jqLite(fn)
// but we will rebind on bootstrap again.
bindJQuery();

publishExternalAPI(angular);

angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
function getDecimals(n) {
  n = n + '';
  var i = n.indexOf('.');
  return (i == -1) ? 0 : n.length - i - 1;
}

function getVF(n, opt_precision) {
  var v = opt_precision;

  if (undefined === v) {
    v = Math.min(getDecimals(n), 3);
  }

  var base = Math.pow(10, v);
  var f = ((n * base) | 0) % base;
  return {v: v, f: f};
}

$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "AM",
      "PM"
    ],
    "DAY": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    "ERANAMES": [
      "Before Christ",
      "Anno Domini"
    ],
    "ERAS": [
      "BC",
      "AD"
    ],
    "FIRSTDAYOFWEEK": 6,
    "MONTH": [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ],
    "SHORTDAY": [
      "Sun",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat"
    ],
    "SHORTMONTH": [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ],
    "STANDALONEMONTH": [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE, MMMM d, y",
    "longDate": "MMMM d, y",
    "medium": "MMM d, y h:mm:ss a",
    "mediumDate": "MMM d, y",
    "mediumTime": "h:mm:ss a",
    "short": "M/d/yy h:mm a",
    "shortDate": "M/d/yy",
    "shortTime": "h:mm a"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "$",
    "DECIMAL_SEP": ".",
    "GROUP_SEP": ",",
    "PATTERNS": [
      {
        "gSize": 3,
        "lgSize": 3,
        "maxFrac": 3,
        "minFrac": 0,
        "minInt": 1,
        "negPre": "-",
        "negSuf": "",
        "posPre": "",
        "posSuf": ""
      },
      {
        "gSize": 3,
        "lgSize": 3,
        "maxFrac": 2,
        "minFrac": 2,
        "minInt": 1,
        "negPre": "-\u00a4",
        "negSuf": "",
        "posPre": "\u00a4",
        "posSuf": ""
      }
    ]
  },
  "id": "en-us",
  "localeID": "en_US",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);

  jqLite(function() {
    angularInit(window.document, bootstrap);
  });

})(window);

!window.angular.$$csp().noInlineStyle && window.angular.element(document.head).prepend('<style type="text/css">@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide:not(.ng-hide-animate){display:none !important;}ng\\:form{display:block;}.ng-animate-shim{visibility:hidden;}.ng-anchor{position:absolute;}</style>');