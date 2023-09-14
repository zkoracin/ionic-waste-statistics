import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private prefix = environment.dbPrefix;

  constructor(
    private storage: Storage,
  ) {}

  setValue(prop: string, value: any) {
    const key = `${this.prefix}-${prop}`;
    return this.storage.set(key, value);
  }

  getValue(prop: string) {
    const key = `${this.prefix}-${prop}`;
    return this.storage.get(key);
  }

  removeValue(prop: string) {
    const key = `${this.prefix}-${prop}`;
    return this.storage.remove(key);
  }
}
