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
    PriScrollbarModule
  ],
  declarations: [
    AppComponent,
    StorageAddComponent,
    StorageTableComponent
  ],
  providers: [
    StorageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
