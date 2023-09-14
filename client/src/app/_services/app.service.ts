import { Injectable } from '@angular/core';
import { MenuData } from '../_models/data.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private pages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Waste Types', url: '/waste-type', icon: 'settings'}
  ];
  private pagesSrc = new BehaviorSubject<MenuData[]>(this.pages);
  pages$ = this.pagesSrc.asObservable();

  constructor(
  ) {}

  addMenuPage(name: string) {
    const newPage: MenuData = {
      title: name,
      url: `waste/${name}`,
      icon: 'trash'
    }
    this.pages.push(newPage);
    this.pagesSrc.next(this.pages);
  }

  deleteMenuPage(name: string) {
    this.pages = this.pages.filter(i => i.title !== name);
    this.pagesSrc.next(this.pages);
  }

  updateMenuPage(oldName: string, newName: string) {
    const index = this.pages.findIndex(i => i.title === oldName);
    const updatedPage: MenuData = {
      title: newName,
      url: `waste/${newName}`,
      icon: 'trash'
    }
    this.pages[index] = updatedPage;
    this.pagesSrc.next(this.pages); 
  }

  setMenuPages(types: string[]) {
    types.forEach(type => this.addMenuPage(type));
  }
}
