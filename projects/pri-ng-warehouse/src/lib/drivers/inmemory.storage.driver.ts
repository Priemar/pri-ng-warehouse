import {DRIVER_TYPE} from '../entities/pri.warehouse.config';

/** all properties and methods will be copied in the local forage instance -> this means we have a new instance of our in memory store
 * in each local forage instance
 */
export class InMemoryStorageDriver implements LocalForageDriver {
  _driver = DRIVER_TYPE.INMEMORY;
  dropInstance: LocalForageDropInstanceFn;
  _support = true;
  /** in memory store */
  private _inMemoryStore: {[key: string]: any};
  private ready: (callback?: (error: any) => void) => Promise<void>;

  /** init storage */
  _initStorage = function(options: LocalForageOptions) {
    if (options.storeName) {
      this._inMemoryStore = {};
    } else {
      throw Error('Warehouse driver: InMemory error! Missing storeName');
    }
  };

  /**clear*/
  clear = function(callback?: (err: any) => void): Promise<void> {
    const self = this;
    return self.ready().then( function() {
      return new Promise<void>(resolve => {
        self._inMemoryStore = {};
        if (typeof callback === 'function') {
          callback(null);
        }
        resolve();
      });
    });
  };

  /** get item */
  getItem = function<T>(key: string, callback?: (err: any, value: T) => void): Promise<T> {
    const self = this;
    return self.ready().then(function() {
      return new Promise<T>(resolve => {
        const value = self._inMemoryStore[key];
        if (typeof callback === 'function') {
          callback(null, value);
        }
        resolve(value);
      });
    });
  };

  /** iterate */
  iterate = function<T, U>(iteratee: (value: T, key: string, iterationNumber: number) => U, callback?: (err: any, result: U) => void)
    : Promise<U> {
    const self = this;
    return self.ready().then(function() {
      return new Promise<U>(resolve => {
        let idx = 1;
        for (const prop in self._inMemoryStore) {
          if (self._inMemoryStore.hasOwnProperty(prop)) {
            const value = self._inMemoryStore[prop];
            const result = iteratee(value, value, idx++);
            if (value !== void (0)) {
              if (typeof callback === 'function') {
                callback(null, result);
              }
              resolve(result);
              return;
            }
          }
        }
      });
    });
  };

  /** get key */
  key = function(keyIndex: number, callback?: (err: any, key: string) => void): Promise<string> {
    const self = this;
    return self.ready().then(function() {
      return new Promise<string>(resolve => {
        let idx = 0;
        let result;
        for (const prop in self._inMemoryStore) {
          if (self._inMemoryStore.hasOwnProperty(prop)) {
            if (keyIndex === idx) {
              result = prop;
              break;
            }
            idx++;
          }
        }
        if (typeof callback === 'function') {
          callback(null, result);
        }
        resolve(result);
      });
    });
  };

  /** keys */
  keys = function(callback?: (err: any, keys: string[]) => void): Promise<string[]> {
    const self = this;
    return self.ready().then(function() {
      return new Promise<string[]>(resolve => {
        const result: string[] = [];
        for (const prop in self._inMemoryStore) {
          if (self._inMemoryStore.hasOwnProperty(prop)) {
            result.push(prop);
          }
        }
        if (typeof callback === 'function') {
          callback(null, result);
        }
        resolve(result);
      });
    });
  };

  /** length */
  length = function(callback?: (err: any, numberOfKeys: number) => void): Promise<number> {
    const self = this;
    return self.keys().then(function(keys) {
      return new Promise<number>(resolve => {
        if (typeof callback === 'function') {
          callback(null, keys.length);
        }
        resolve(keys.length);
      });
    });
  };

  /** remove item */
  removeItem = function(key: string, callback?: (err: any) => void): Promise<void> {
    const self = this;
    return self.ready().then(function() {
      return new Promise<void>(resolve => {
        delete self._inMemoryStore[key];
        if (typeof callback === 'function') {
          callback(null);
        }
        resolve();
      });
    });
  };

  /** set item */
  setItem = function<T>(key: string, value: T, callback?: (err: any, value: T) => void): Promise<T> {
    const self = this;
    return self.ready().then(function() {
      return new Promise<T>(resolve => {
        self._inMemoryStore[key] = value;
        if (typeof callback === 'function') {
          callback(null, value);
        }
        resolve(value);
      });
    });
  };
}
