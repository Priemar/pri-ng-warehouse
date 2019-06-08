export enum DRIVER_TYPE {
  DEFAULT = 'default',
  INDEXEDDB = 'indexeddb',
  WEBSQL = 'websql',
  LOCALSTORAGE = 'localstorage',
  INMEMORY = 'inMemory'
}

export interface PriWarehouseConfig {
  driver: DRIVER_TYPE;
  warehouseId?: string;
  name: string;
  version: number;
  storeName: string;
  description: string;
}
