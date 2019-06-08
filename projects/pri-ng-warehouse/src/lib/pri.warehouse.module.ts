import {ModuleWithProviders, NgModule} from '@angular/core';
import {LocalForageToken} from './token/local.forage.token';
import {PriWarehouseConfigToken} from './token/pri.warehouse.config.token';
import {DEFAULT_CONFIG} from './constants/pri.warehouse.default.config';
import {PriWarehouseService} from './services/pri.warehouse.service';
import {PriWarehouseConfig} from './entities/pri.warehouse.config';
import * as localforage from 'localforage';

@NgModule()
export class PriWarehouseModule {
  /**configure*/
  static configure(config: PriWarehouseConfig[]): ModuleWithProviders {
    return {
      ngModule: PriWarehouseModule,
      providers: [
        {
          provide: LocalForageToken,
          useFactory: localforageFactory
        },
        {
          provide: PriWarehouseConfigToken,
          useValue: config || DEFAULT_CONFIG
        },
        PriWarehouseService
      ]
    };
  }
}


export function localforageFactory(): any {
  return localforage;
}
