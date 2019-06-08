import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {StorageEntry} from '../entities/storage.entry';

@Injectable()
export class StorageService implements OnDestroy {

  /**
   * constructor
   */
  constructor() {
    this._primaryStoreEntries = new BehaviorSubject([]);
    this.$primaryStoreEntries = this._primaryStoreEntries.asObservable();
    this._secondaryStoreEntries = new BehaviorSubject([]);
    this.$secondaryStoreEntries = this._secondaryStoreEntries.asObservable();
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
   * add new item to store
   * @param entry store entry
   * @param storeId store identifier
   */
  add(entry: StorageEntry, storeId: DemoStorage) {

    const storeSub = this._getStorageSubject(storeId);
    storeSub.next([
      ...storeSub.value.filter(el => el.key !== entry.key),
      entry
    ]);
  }

  /**
   * remove entry from store
   * @param key entry key
   * @param storeId store id
   */
  remove(key: string, storeId: DemoStorage) {

    const storeSub = this._getStorageSubject(storeId);
    storeSub.next([
      ...storeSub.value.filter(el => el.key !== key),
    ]);
  }

  /**
   * returns the storage entries observable
   * @param storeId demo store id
   */
  getStorageEntries(storeId: DemoStorage): Observable<StorageEntry[]> {
    switch (storeId) {
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
   * @param storeId demo store id
   */
  private _getStorageSubject(storeId: DemoStorage): BehaviorSubject<StorageEntry[]> {
    switch (storeId) {
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
}
