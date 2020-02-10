<p align="center">  
  <h1 align="center">Warehouse: pri-ng-warehouse</h1>  
</p>

Simple API to access browser storage's. (*IndexedDB, LocalStorage, WebSql, InMemory*)

#### Angular   9: version >= 2.x
#### Angular < 9: version < 2.x

    
<ul>
  <li>Simple API</li>
  <li>Same API for different storage types</li>
  <li>Storage types: <i>indexedDB, websql, localstorage, inmemory</i></li>
  <li>Fallback to supported storage type if configured storage is not available</li>
  <li>Use multiple storages at the same time</li>
  <li>Compatible with SSR</li>
</ul>


## Table of Contents

- [Live Demo](https://priemar.github.io/pri-ng-warehouse/)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [PriWarehouseService](#PriWarehouseService)

**More**
- [Development](#development)
- [Issues](#issues)
- [Planned](#planned)
- [Author](#author)
- [Credit](#credit)
- [More Stuff](#more-stuff)


## Installation

**NPM**

```bash
npm install --save pri-ng-warehouse localforage
```

<a name="usage"/>

## Usage

Import `PriWarehouseModule` in your root module.

````ts
import { PriWarehouseModule } from 'pri-ng-warehouse';

@NgModule({
  imports: [
    PriWarehouseModule.configure()
  ]
})
````

Inject and use PriWarehouseService
````ts

@Component({ ... })
export class MyComponent {
 constructor(private warehouse: PriWarehouseService) {}
 
 writeToStorage() {
  this.warehouse.set('storage-key', 'my value').then(_ => {
    console.log('value written to storage');
  });
 }
 
 readFromStorage() {
  this.warehouse.get('storage-key').then(value => {
      console.log('value from storage: ', value);
    }); 
 }
}
````


<a name="configuration"/>

## Configuration

#### PriWarehouseConfig

possibility to customize your warehouse configuration

or use multiple warehouses, each needs his own configuration

- **[driver]**: DRIVER_TYPE ('default', 'indexeddb', 'websql', 'localstorage', 'inMemory')

  defines your preferred storage type. If this type is default it will automatically use the first available type.
  
  *be careful when defining a specific type, not every browser supports all types*
  
- **[name]**: string

  the warehouse name
  
- **[version]**: string

  warehouse version
  
- **[warehouseId]**: string

  if you are using multiple warehouses in your application this id need to be a unique for each warehouse. (only effects the internal storage key)
  
- **[storageName]**: string

  storage name (only effects the internal storage key)
  
- **[description]**: string

  description


###### Configuration usage 

i.e. use multiple warehouses in one application
````ts
const FIRST_WAREHOUSE_CONFIG: PriWarehouseConfig = {
 ...
}
const SECOND_WAREHOUSE_CONFIG: PriWarehouseConfig = {
 ...
}

@NgModule({
  imports: [
    PriWarehouseModule.configure([FIRST_WAREHOUSE_CONFIG, SECOND_WAREHOUSE_CONFIG])
  ]
})
````


If you are using multiple warehouses or a custom configuration you need to add the warehouseId when accessing the warehouse.

i.e.

````ts
this.warehouse.set('storage-key', 'my value', 'your-warehouse-id')
this.warehouse.get('storage-key', 'your-warehouse-id')
````


<a name="PriWarehouseService"/>

## PriWarehouseService

#### Methods

- **get(key: string, warehouseId?: string)**

   Gets an item from the storage.
   If the key does not exist, getItem() will return null.
   
   Even if there isn't a value stored, null will be returned

- **getJson(key: string, warehouseId?: string)**

  get javascript object to store (object must be serializable)

- **set(key: string, value: any, warehouseId?: string)**

  Saves a value to the store, the following types are allowed:
  
  *Array, ArrayBuffer, Blob, Float32Array, Float64Array, Int8Array, Int16Array, Int32Array, Number, Object, Uint8Array, Uint8ClampedArray, Uint16Array, Uint32Array, String*

- **setJson(key: string, value: any, warehouseId?: string)**

  set javascript object to store (object must be serializable)
  
- **remove(key: string, warehouseId?: string)**

  Removes from the store
  
- **destroy(warehouseId?: string)**

  Removes every key from the store
  
- **count(warehouseId?: string)**

  Returns the number of stored entries
  
- **hasKey(key: string, warehouseId?: string)**

  Return if a storage entry with the given key exists
  
- **keys(warehouseId?: string)**

  Returns all keys from the storage
  
- **getWarehouseSystemInfo()**

  Returns a system information which storages are available, the storage size and usage (if supported)


<a name="development"/>

## Development

This project uses the Angular CLI for building the library

```bash
$ npm run build:lib
$ npm run start
```

or if you want to get live updates on lib source changes

Terminal 1: 
```bash
$ npm run start:lib 
``` 
Terminal 2:
```bash
$ npm run start
```

<a name="issues"/>

## Issues

If you identify any errors in the library, or have an idea for an improvement, please open an [issue](https://github.com/Priemar/pri-ng-warehouse/issues).

<a name="planned"/>

## Planned

- add unit tests
- add IE 11 support for demo app *even if i dont know how IE is still alive*

<a name="author"/>

## Author

- Mario Prieschl [Github](https://github.com/Priemar)

<a name="credit"/>

## Credit

- Based on [localforage](https://github.com/localForage/localForage).

<a name="more-stuff"/>

## More Stuff

- [pri-ng-scrollbar](https://github.com/Priemar/pri-ng-scrollbar)
- [finapi.crypto.csharp](https://github.com/Priemar/finapi.crypto.csharp)
- [tscodedom](https://github.com/Priemar/tscodedom)
