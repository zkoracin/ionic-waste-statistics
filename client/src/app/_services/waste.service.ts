import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Waste } from '../_models/waste.model';

@Injectable({
  providedIn: 'root'
})
export class WasteService {

  constructor(
    private storageSer: StorageService,
  ) { }

  getWasteByType(type: string): Promise<Waste[]> {
    return this.storageSer.getValue(type);
  }

  async createWaste(type: string, waste: Waste): Promise<Waste[]> {
    const data = await this.getWasteByType(type);
    data.push(waste);
    return this.storageSer.setValue(type, data);
  }

  async updateWaste(type: string, waste:Waste): Promise<Waste[]> {
    const data = await this.getWasteByType(type);
    const index = data.findIndex(i => i.id === waste.id);
    data[index] = waste;
    return this.storageSer.setValue(type, data);
  }

  async deleteWaste(type: string, id: string): Promise<Waste[]> {
    const data: Waste[] = await this.getWasteByType(type);
    return this.storageSer.setValue(type, data.filter(i => i.id !== id));
  }

  getYearsToSelect(data: Waste[]) {
   return [...new Set(data.map(obj => obj.date.getFullYear()))];
  }

  getWasteByYear(data: Waste[], year: number) {
    return data.filter(i => i.date.getFullYear() === year);
  }

  getWasteSum(data: Waste[]) {
    return data.reduce((acc, currentValue) => acc + currentValue.value, 0);
  }
  
  getWasteSumByMonth(data: Waste[]) {
    let months = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    data.forEach(i => months[i.date.getMonth()] += i.value);
    return months
  }
}
