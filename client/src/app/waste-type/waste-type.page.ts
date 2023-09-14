import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, ModalController, ToastController } from '@ionic/angular';
import { WasteTypeService } from '../_services/waste-type.service';
import { WasteType } from '../_models/wasteType.model';
import { WasteTypeUpdateComponent } from './waste-type-update/waste-type-update.component';

@Component({
  selector: 'app-waste-type',
  templateUrl: './waste-type.page.html',
  styleUrls: ['./waste-type.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class WasteTypePage implements OnInit {

  types: WasteType[] = [];

  constructor(
    private wasteTypeSer: WasteTypeService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
  ) { }

  async ngOnInit() {
    this.types = await this.wasteTypeSer.getTypes();
  }

  async onDelete(type: WasteType) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Delete',
      message: `This will delete waste type ${type.name.toUpperCase()} 
                and all waste entries for this waste type.`,
      buttons: [
        { text: 'Cancel', role: 'cancel'},
        { text: 'Confirm', role: 'confirm'}
      ],
    });

    await alert.present();
    const alertData = await alert.onDidDismiss();
    if (alertData.role && alertData.role !== 'confirm') return;

    this.wasteTypeSer.deleteType(this.types, type)
      .then(res => this.types = res);
  }

  async onUpdate(type: WasteType) {
    const modal = await this.modalCtrl.create({
      component: WasteTypeUpdateComponent,
      componentProps: {
        wasteType: type,
      }
    });

    await modal.present();
  }
}
