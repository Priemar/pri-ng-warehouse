import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {StorageService} from '../services/storage.service';
import {StorageEntry} from '../entities/storage.entry';

@Component({
  selector: 'app-storage-add',
  templateUrl: 'storage.add.component.html',
  styleUrls: ['./storage.add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class StorageAddComponent {

  /** constructor */
  constructor(private fb: FormBuilder, private storageService: StorageService) {
    this.valueForm = fb.group({
      key: [null, Validators.required],
      value: null
    });
  }

  /** store id */
  @Input() storeId: DemoStorage;

  /** value form group */
  readonly valueForm: FormGroup;

  /** add entry to store */
  add() {
    this.storageService.add(this.valueForm.getRawValue() as StorageEntry, this.storeId);
  }
}
