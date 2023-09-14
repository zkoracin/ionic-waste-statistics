import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { WasteType } from '../_models/wasteType.model';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root'
})
export class WasteTypeService {

  constructor(
    private storageSer: StorageService,
    private appSer: AppService,
  ) { }

  async setTypesStorage() {
    const typesExists = await this.getTypes();
    if (typesExists) return;
    await this.storageSer.setValue('types', []);
  }

  getTypes(): Promise<WasteType[]> {
    return this.storageSer.getValue('types');
  }

  getTypeNames(types: WasteType[]) {
    return types.map(type => type.name);
  }

  async createType(types: WasteType[], newType: WasteType) {
    types.push(newType);
    await this.storageSer.setValue('types', types);
    await this.storageSer.setValue(newType.name, []);
    this.appSer.addMenuPage(newType.name);
  }

  async updateType(types: WasteType[], oldName: string, newType: WasteType) {
    
    // Get existing data for type
    const data = await this.storageSer.getValue(oldName);
    
    // Copy data to new key
    await this.storageSer.setValue(newType.name, data);
    
    // Delete old data
    await this.storageSer.removeValue(oldName);
    
    // Update key=types storage
    const index = types.findIndex(i => i.id === newType.id);
    types[index] = newType;
    await this.storageSer.setValue('types', types);

    // Update menu pages
    this.appSer.updateMenuPage(oldName, newType.name);
  }

  async deleteType(types: WasteType[], type: WasteType): Promise<WasteType[]> {
    const remainingTypes = types.filter(i => i.id !== type.id);
    await this.storageSer.removeValue(type.name);
    this.appSer.deleteMenuPage(type.name);
    return this.storageSer.setValue('types', remainingTypes);
  }
}
