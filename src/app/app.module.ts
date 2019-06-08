import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {MatButtonModule, MatCardModule, MatIconModule, MatInputModule, MatTableModule, MatToolbarModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {IconsModule} from './+icons/icons.module';
import {PriScrollbarModule} from 'pri-ng-scrollbar';
import {StorageAddComponent} from './storage-add/storage.add.component';
import {ReactiveFormsModule} from '@angular/forms';
import {StorageService} from './services/storage.service';
import {StorageTableComponent} from './store-table/storage.table.component';
import {PriWarehouseModule} from 'pri-ng-warehouse';
import {DEFAULT_WAREHOUSE_CONFIG, SECONDARY_WAREHOUSE_CONFIG} from './configs/warehouse.configs';
import {FileSizePipe} from './pipes/file.size.pipe';





@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatTableModule,
    IconsModule,
    ReactiveFormsModule,
    PriScrollbarModule,
    PriWarehouseModule.configure([DEFAULT_WAREHOUSE_CONFIG, SECONDARY_WAREHOUSE_CONFIG])
  ],
  declarations: [
    AppComponent,
    StorageAddComponent,
    StorageTableComponent,
    FileSizePipe
  ],
  providers: [
    StorageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
