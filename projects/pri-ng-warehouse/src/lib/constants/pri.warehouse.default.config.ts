import {DRIVER_TYPE, PriWarehouseConfig} from '../entities/pri.warehouse.config';

export const DEFAULT_CONFIG: PriWarehouseConfig = {
  driver: DRIVER_TYPE.DEFAULT,
  warehouseId: 'default',
  name: 'pri-warehouse',
  version: 1.0,
  storeName: 'pri_warehouse_store', // Should be alphanumeric, with underscores.
  description: 'Default pri-warehouse store'
};
