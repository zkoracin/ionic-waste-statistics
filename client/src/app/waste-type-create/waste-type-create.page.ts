import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { WasteTypeService } from '../_services/waste-type.service';
import { WasteType } from '../_models/wasteType.model';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-waste-type-create',
  templateUrl: './waste-type-create.page.html',
  styleUrls: ['./waste-type-create.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class WasteTypeCreatePage {

  form: FormGroup = this.fb.group({
    name: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private wasteTypeSer: WasteTypeService,
    private toastCtrl: ToastController,
  ) { }

  async onCreate() {
    if (this.form.invalid) return;

    const name = (this.form.value.name as string).toLowerCase();

    const types = await this.wasteTypeSer.getTypes();
    if (types.find(type => type.name === name)) {
      this.presentToast(`Waste type ${name.toUpperCase()} already exists`);
      return;
    }

    const newType: WasteType = {
      id: uuidv4(),
      name: name
    }

    this.wasteTypeSer.createType(types, newType)
      .then(_ => {
        this.presentToast(`Waste type ${name.toUpperCase()} created.`);
        this.form.reset();
      });
  }

  private async presentToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'bottom',
    });

    await toast.present();
  }

}
