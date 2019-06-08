export interface PriWarehouseSystemInfo {
  indexedDb: boolean;
  webSql: boolean;
  localStorage: boolean;
  isCacheSizeAvailable: boolean;
  cacheUsage?: number;
  cacheSize?: number;
}
