import { getFromPath, createPath, extend } from '@sublimemedia/wicker-man-utilities';
import WMBee from '@sublimemedia/wicker-man-bee';


export default class WMContent {
  constructor() {
    this.store = {};
    this.observed = {};
  }

  get(prop) {
    if (this.store) {
      if (prop) {
        return getFromPath(prop, extend(true, {}, this.store));
      } else {
        return this.store;
      }
    }
  }

  set(key, val) {
    if (key && typeof key === 'string') {
      const pathInfo = createPath(key, this.store, true);

      pathInfo.parent[pathInfo.key] = val;

      this.fireObservers(key, val);
    } else if (key && typeof key === 'object') {
      Object.keys(key)
      .forEach(item => {
        if (item) {
          this.set(item, key[item]);
        }
      });
    }

    return this;
  }

  observe(prop) {
    const bee = new WMBee();

    if (prop && typeof prop === 'string') {
      const path = createPath(prop, this.observed);

      path._hooks = path._hooks || [];
      path._hooks.push(bee.set.bind(bee));
    }

    return bee;
  }

  fireSpecificObservers(keyPath) {
    if (keyPath) {
      const hooks = getFromPath(keyPath, this.observed),
        val = getFromPath(keyPath, this.store);

      if (hooks && hooks._hooks) {
        hooks._hooks
        .forEach(callback => {
          callback(val);
        });
      }
    }
  }

  fireObservers(prop, val) {
    let fired = [];

    this.getEndPoints(prop, val)
    .forEach(endpoint => {
      let keyPath = '';

      getFromPath(endpoint, this.observed, false, function(pathInfo) {
        if (pathInfo) {
          keyPath += '.' + pathInfo.key;

          // Prevent previously fired parents from firing again.
          if (!~fired.indexOf(keyPath)) {
            fired.push(keyPath);
            this.fireSpecificObservers(keyPath);
          }
        }
      }.bind(this));
    });
  }

  getEndPoints(prop, val) {
    let endPoints = [];

    if (val && typeof val === 'object') {
      const keys = Object.keys(val);

      keys
      .forEach(key => {
        const end = this.getEndPoints(prop + '.' + key, val[key]);
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
  }
}

