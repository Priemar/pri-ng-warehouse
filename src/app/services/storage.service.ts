import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, forkJoin, from, Observable} from 'rxjs';
import {StorageEntry} from '../entities/storage.entry';
import {DemoStorage} from '../enumerations/demo.storage';
import {PriWarehouseService, PriWarehouseSystemInfo} from 'pri-ng-warehouse';
import {map} from 'rxjs/operators';

@Injectable()
export class StorageService implements OnDestroy {

  /**
   * constructor
   */
  constructor(private warehouse: PriWarehouseService) {
    this._primaryStoreEntries = new BehaviorSubject([]);
    this.$primaryStoreEntries = this._primaryStoreEntries.asObservable();
    this._secondaryStoreEntries = new BehaviorSubject([]);
    this.$secondaryStoreEntries = this._secondaryStoreEntries.asObservable();

    this._getStorageEntries(DemoStorage.default).then(entries => this._primaryStoreEntries.next(entries));
    this._getStorageEntries(DemoStorage.secondary).then(entries => this._secondaryStoreEntries.next(entries));

    this._warehouseSystemInfo = new BehaviorSubject(null);
    this.$warehouseSystemInfo = this._warehouseSystemInfo.asObservable();

    this._refreshSystemInfos();
  }

  /**
   * primary store entries
   */
  private readonly _primaryStoreEntries: BehaviorSubject<StorageEntry[]>;
  readonly $primaryStoreEntries: Observable<StorageEntry[]>;

  /**
   * secondary store
   */
  private readonly _secondaryStoreEntries: BehaviorSubject<StorageEntry[]>;
  readonly $secondaryStoreEntries: Observable<StorageEntry[]>;

  /**
   * warehouse system info
   */
  private readonly _warehouseSystemInfo: BehaviorSubject<PriWarehouseSystemInfo>;
  readonly $warehouseSystemInfo: Observable<PriWarehouseSystemInfo>;

  /**
   * add new item to store
   * @param entry store entry
   * @param warehouseId warehouse id
   */
  add(entry: StorageEntry, warehouseId: DemoStorage) {
    this.warehouse.set(entry.key, entry.value, warehouseId).then(_ => {
      const storeSub = this._getStorageSubject(warehouseId);
      storeSub.next([
        ...storeSub.value.filter(el => el.key !== entry.key),
        entry
      ]);
    });
  }

  /**
   * remove entry from store
   * @param key entry key
   * @param warehouseId warehouse id
   */
  remove(key: string, warehouseId: DemoStorage) {
    this.warehouse.remove(key, warehouseId).then(_ => {
      const storeSub = this._getStorageSubject(warehouseId);
      storeSub.next([
        ...storeSub.value.filter(el => el.key !== key),
      ]);
    });
  }

  /**
   * returns the storage entries observable
   * @param warehouseId demo store id
   */
  getStorageEntries(warehouseId: DemoStorage): Observable<StorageEntry[]> {
    switch (warehouseId) {
      // primary
      case 'default': {
        return this.$primaryStoreEntries;
      }
      // secondary
      case 'secondary': {
        return this.$secondaryStoreEntries;
      }
    }
  }

  /**
   * destroy
   */
  ngOnDestroy(): void {
    this._primaryStoreEntries.complete();
    this._secondaryStoreEntries.complete();
  }

  /**
   * returns the storage subject
   * @param warehouseId demo store id
   */
  private _getStorageSubject(warehouseId: DemoStorage): BehaviorSubject<StorageEntry[]> {
    switch (warehouseId) {
      // primary
      case 'default': {
        return this._primaryStoreEntries;
      }
      // secondary
      case 'secondary': {
        return this._secondaryStoreEntries;
      }
    }
  }

  /** init storage */
  private _getStorageEntries(warehouseId: DemoStorage): Promise<StorageEntry[]> {
    // get all keys in warehouse
    return this.warehouse.keys(warehouseId).then(keys => {
      const loadValues = keys.reduce((prev, item) => {
        return [
          ...prev,
          from(this.warehouse.get(item, warehouseId)).pipe(
            map(val => {
              return { key: item, value: val } as StorageEntry;
            })
          )
        ];
      }, []);
      return loadValues.length > 0 ? forkJoin(loadValues[0]).toPromise() : [];
    }) as Promise<StorageEntry[]>;
  }

  /**
   * refresh system infos
   */
  private _refreshSystemInfos() {
    this.warehouse.getWarehouseSystemInfo().then(info => this._warehouseSystemInfo.next(info));
  }
}
