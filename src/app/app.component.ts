import {ChangeDetectionStrategy, Component} from '@angular/core';
import {StorageService} from './services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  /**
   * constructor
   * @param storageService storage service
   */
  constructor(public storageService: StorageService) {}
}
