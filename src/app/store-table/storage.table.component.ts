import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {StorageService} from '../services/storage.service';

@Component({
  selector: 'app-storage-table',
  templateUrl: 'storage.table.component.html',
  styleUrls: ['./storage.table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class StorageTableComponent {

  /**
   * constructor
   * @param storeService storage service
   */
  constructor(public storeService: StorageService) {
  }

  /** store id */
  @Input() storeId: DemoStorage;

  /**
   * display columns
   */
  readonly displayColumns = ['key', 'value' , 'actions'];
}
