import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { WasteTypeService } from './_services/waste-type.service';
import { AppService } from './_services/app.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink, RouterLinkActive, CommonModule],
})
export class AppComponent {
  
  public options = [
    { title: 'Add Waste', url: '/waste-create', icon: 'add'},
    { title: 'Create Waste Type', url: '/waste-type-create', icon: 'add'},
  ];
  constructor(
    private storage: Storage,
    private wasteTypeSer: WasteTypeService,
    public appSer: AppService,
  ) {}

  async ngOnInit() {
    await this.storage.create();
    await this.wasteTypeSer.setTypesStorage();

    const types = await this.wasteTypeSer.getTypes();
    const typeNames = this.wasteTypeSer.getTypeNames(types);
    
    this.appSer.setMenuPages(typeNames);
  }
}
