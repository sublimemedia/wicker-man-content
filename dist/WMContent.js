(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', 'wicker-man-utilities', 'wicker-man-bee'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('wicker-man-utilities'), require('wicker-man-bee'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.wickerManUtilities, global.WMBee);
    global.WMContent = mod.exports;
  }
})(this, function (exports, module, _wickerManUtilities, _wickerManBee) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _WMBee = _interopRequireDefault(_wickerManBee);

  var WMContent = (function () {
    function WMContent() {
      _classCallCheck(this, WMContent);

      this.store = {};
      this.observed = {};
    }

    WMContent.prototype.get = function get(prop) {
      if (this.store) {
        if (prop) {
          return (0, _wickerManUtilities.getFromPath)(prop, (0, _wickerManUtilities.extend)(true, {}, this.store));
        } else {
          return this.store;
        }
      }
    };

    WMContent.prototype.set = function set(key, val) {
      var _this = this;

      if (key && typeof key === 'string') {
        var pathInfo = (0, _wickerManUtilities.createPath)(key, this.store, true);

        pathInfo.parent[pathInfo.key] = val;

        this.fireObservers(key, val);
      } else if (key && typeof key === 'object') {
        Object.keys(key).forEach(function (item) {
          if (item) {
            _this.set(item, key[item]);
          }
        });
      }

      return this;
    };

    WMContent.prototype.observe = function observe(prop) {
      var bee = new _WMBee['default']();

      if (prop && typeof prop === 'string') {
        var path = (0, _wickerManUtilities.createPath)(prop, this.observed);

        path._hooks = path._hooks || [];
        path._hooks.push(bee.set.bind(bee));
      }

      return bee;
    };

    WMContent.prototype.fireSpecificObservers = function fireSpecificObservers(keyPath) {
      var _this2 = this;

      if (keyPath) {
        (function () {
          var hooks = (0, _wickerManUtilities.getFromPath)(keyPath, _this2.observed),
              val = (0, _wickerManUtilities.getFromPath)(keyPath, _this2.store);

          if (hooks && hooks._hooks) {
            hooks._hooks.forEach(function (callback) {
              callback(val);
            });
          }
        })();
      }
    };

    WMContent.prototype.fireObservers = function fireObservers(prop, val) {
      var _this3 = this;

      var fired = [];

      this.getEndPoints(prop, val).forEach(function (endpoint) {
        var keyPath = '';

        (0, _wickerManUtilities.getFromPath)(endpoint, _this3.observed, false, (function (pathInfo) {
          if (pathInfo) {
            keyPath += '.' + pathInfo.key;

            // Prevent previously fired parents from firing again.
            if (! ~fired.indexOf(keyPath)) {
              fired.push(keyPath);
              this.fireSpecificObservers(keyPath);
            }
          }
        }).bind(_this3));
      });
    };

    WMContent.prototype.getEndPoints = function getEndPoints(prop, val) {
      var _this4 = this;

      var endPoints = [];

      if (val && typeof val === 'object') {
        var keys = Object.keys(val);

        keys.forEach(function (key) {
          var end = _this4.getEndPoints(prop + '.' + key, val[key]);
          if (end.length) {
            endPoints = endPoints.concat(end);
          }
        });

        if (!keys.length) {
          endPoints.push(prop);
        }
      } else {
        endPoints.push(prop);
      }

      return endPoints;
    };

    return WMContent;
  })();

  module.exports = WMContent;
});