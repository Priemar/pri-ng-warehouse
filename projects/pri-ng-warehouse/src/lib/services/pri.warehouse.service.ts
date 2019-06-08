import {DRIVER_TYPE, PriWarehouseConfig} from '../entities/pri.warehouse.config';
import {BehaviorSubject, from, of} from 'rxjs';
import {Inject, Injectable, OnDestroy, PLATFORM_ID} from '@angular/core';
import {PriWarehouseConfigToken} from '../token/pri.warehouse.config.token';
import {LocalForageToken} from '../token/local.forage.token';
import {first, map, switchMap} from 'rxjs/operators';
import {DEFAULT_CONFIG} from '../constants/pri.warehouse.default.config';
import {InMemoryStorageDriver} from '../drivers/inmemory.storage.driver';
import {PriWarehouseSystemInfo} from '../entities/pri.warehouse.system.info';
import {isPlatformBrowser} from '@angular/common';

@Injectable()
export class PriWarehouseService  implements OnDestroy {

  constructor(@Inject(LocalForageToken) private _localForage: any,
              @Inject(PLATFORM_ID) private platformId: any,
              @Inject(PriWarehouseConfigToken) _configs: PriWarehouseConfig[]) {
    this._defineCustomDrivers()
      .then(() => {
        this._init(_configs);
        this._initialized$.next(true);
      })
      .catch(ex => {
        throw new Error('Warehouse: error while defining custom driver: ' + ex );
      });
  }

  /** initialized */
  private readonly _initialized$ = new BehaviorSubject<boolean>(false);
  /** stores */
  private _stores: { [id: string]: any } = {};

  /**
   * Gets an item from the storage.
   * If the key does not exist, getItem() will return null.
   *
   * Even if there isn't a value stored, null will be returned
   */
  get<T = any>(key: string, warehouseId: string = DEFAULT_CONFIG.warehouseId): Promise<T> {
    return this._initialized$.pipe(
      first(init => init),
      switchMap(() => {
        const promise: Promise<T> = this._stores[warehouseId].getItem(key);
        return from(promise);
      })
    ).toPromise();
  }

  /**
   * Saves the value with following types
   *   - Array
   *   - ArrayBuffer
   *   - Blob
   *   - Float32Array
   *   - Float64Array
   *   - Int8Array
   *   - Int16Array
   *   - Int32Array
   *   - Number
   *   - Object
   *   - Uint8Array
   *   - Uint8ClampedArray
   *   - Uint16Array
   *   - Uint32Array
   *   - String
   */
  set<T = any>(key: string, value: T, warehouseId: string = DEFAULT_CONFIG.warehouseId): Promise<T> {
    return this._initialized$.pipe(
      first(init => init),
      switchMap(() => {
        const promise: Promise<T> = this._stores[warehouseId].setItem(key, value);
        return from(promise);
      })
    ).toPromise();
  }

  /**
   * Removes the value of a key from the offline store.
   */
  remove(key: string, warehouseId: string = DEFAULT_CONFIG.warehouseId): Promise<any> {
    return this._initialized$.pipe(
      first(init => init),
      switchMap(() => {
        const promise: Promise<any> = this._stores[warehouseId].removeItem(key);
        return from(promise);
      })
    ).toPromise();
  }

  /**
   * USE WITH CAUTION:
   * Removes every key from the store
   */
  destroy(warehouseId: string = DEFAULT_CONFIG.warehouseId): Promise<boolean | Error> {
    const promise: Promise<any> = this._stores[warehouseId].clear();
    return this._initialized$.pipe(
      first(init => init),
      switchMap(() => from(promise))
    ).toPromise();
  }

  /**
   * returns the number of stored entries
   */
  count(warehouseId: string = DEFAULT_CONFIG.warehouseId): Promise<number> {
    return this._initialized$.pipe(
      first(init => init),
      switchMap(() => {
        const promise: Promise<any> = this._stores[warehouseId].length();
        return from(promise);
      })
    ).toPromise();
  }

  /**
   * Get the name of a key based on its ID.
   * @deprecated
   */
  key(index: number, warehouseId: string = DEFAULT_CONFIG.warehouseId): Promise<string> {
    return this._initialized$.pipe(
      first(init => init),
      switchMap(() => {
        const promise: Promise<any> = this._stores[warehouseId].key(index);
        return from(promise);
      })
    ).toPromise();
  }

  /** has key */
  hasKey(key: string, warehouseId: string = DEFAULT_CONFIG.warehouseId): Promise<boolean> {
    return this._initialized$.pipe(
      first(init => init),
      switchMap(() =>
        from(this._stores[warehouseId].keys()).pipe(
          map((keys: string[]) => {
            return keys.indexOf(key) >= 0;
          })
        )
      )
    ).toPromise();
  }
  /**
   * Get the list of all keys in the datastore.
   */
  keys(warehouseId: string = DEFAULT_CONFIG.warehouseId): Promise<string[]> {
    return this._initialized$.pipe(
      first(init => init),
      switchMap(() => {
        const promise: Promise<any> = this._stores[warehouseId].keys();
        return from(promise);
      })
    ).toPromise();
  }


  /**
   * get storage system info
   */
  getWarehouseSystemInfo(): Promise<PriWarehouseSystemInfo> {
    if (isPlatformBrowser(this.platformId)) {
      const result: PriWarehouseSystemInfo = {
        indexedDb: window.indexedDB !== undefined,
        webSql: (window as any).openDatabase !== undefined,
        localStorage: localStorage !== undefined,
        isCacheSizeAvailable: false
      };
      // calculate storage size if supported
      if ('storage' in navigator && 'estimate' in (navigator as any).storage) {
        return (navigator as any).storage.estimate().then(estimate => {
          result.isCacheSizeAvailable = true;
          result.cacheSize = estimate.quota;
          result.cacheUsage = estimate.usage;
          return result;
        });
      } else {
        return of(result).toPromise();
      }
    } else {
      return of({
        indexedDb: false,
        isCacheSizeAvailable: false,
        localStorage: false,
        webSql: false
      } as PriWarehouseSystemInfo).toPromise();
    }
  }

  /** on destroy */
  ngOnDestroy(): void {
    this._initialized$.complete();
  }

  /** define custom drivers */
  private _defineCustomDrivers(): Promise<void> {
    return this._localForage.defineDriver(new InMemoryStorageDriver());
  }

  /** init local forage */
  private _init(configs: PriWarehouseConfig[]) {
    if (!configs || configs.length <= 0) {
      console.error('Cant initialize warehouse, configuration(s) missing');
    } else {
      // init in memory driver
      configs.map(conf => {
        // use default as warehouse id if its already set
        const warehouseId = conf.warehouseId ? conf.warehouseId : DEFAULT_CONFIG.warehouseId;
        if (this._stores[warehouseId]) {
          console.error('warehouse with warehouse id already exists :', conf.warehouseId);
        } else {
          // create store instance
          this._stores[warehouseId] = this._localForage.createInstance({
            driver: this._getDriver(conf.driver),
            name: conf.name,
            version: conf.version,
            description: conf.description,
            storeName: conf.storeName
          });
        }
      });
    }
  }
  /** returns the driver */
  private _getDriver(driver: DRIVER_TYPE): string | string[] {
    switch (driver) {
      case DRIVER_TYPE.INDEXEDDB:
        return this._localForage.INDEXEDDB;
      case DRIVER_TYPE.WEBSQL:
        return this._localForage.WEBSQL;
      case DRIVER_TYPE.LOCALSTORAGE:
        return this._localForage.LOCALSTORAGE;
      case DRIVER_TYPE.INMEMORY:
        return DRIVER_TYPE.INMEMORY;
      default:
        return [
          this._localForage.INDEXEDDB,
          this._localForage.WEBSQL,
          this._localForage.LOCALSTORAGE,
          DRIVER_TYPE.INMEMORY
        ];
    }
  }
}
