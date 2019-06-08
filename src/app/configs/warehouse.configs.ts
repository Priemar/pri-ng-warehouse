import {DemoStorage} from '../enumerations/demo.storage';
import {DRIVER_TYPE, PriWarehouseConfig} from 'pri-ng-warehouse';

export const DEFAULT_WAREHOUSE_CONFIG: PriWarehouseConfig = {
  driver: DRIVER_TYPE.DEFAULT,
  name: 'DEMO:WAREHOUSE:DEFAULT',
  version: 1.0,
  warehouseId: DemoStorage.default,
  storeName: `pri-warehouse-${DemoStorage.default}`,
  description: 'default storage'
};

export const SECONDARY_WAREHOUSE_CONFIG: PriWarehouseConfig = {
  driver: DRIVER_TYPE.LOCALSTORAGE,
  name: 'DEMO:WAREHOUSE:SECONDARY',
  version: 1.0,
  warehouseId: DemoStorage.secondary,
  storeName: `pri-warehouse-${DemoStorage.secondary}`,
  description: 'secondary storage'
};
