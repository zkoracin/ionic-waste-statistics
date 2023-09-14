import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Waste } from '../_models/waste.model';
import { v4 as uuidv4 } from 'uuid';
import { WasteService } from '../_services/waste.service';
import { WasteTypeService } from '../_services/waste-type.service';

@Component({
  selector: 'app-waste-create',
  templateUrl: './waste-create.page.html',
  styleUrls: ['./waste-create.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class WasteCreatePage implements OnInit {

  form: FormGroup = this.fb.group({
    type: ['', [Validators.required]],
    value: ['', [Validators.required]],
    date: [new Date().toISOString(), [Validators.required]],
  });

  wasteTypes: string[] = [];
  enableForm = true;

  constructor(
    private fb: FormBuilder,
    private toastCtrl: ToastController,
    private wasteSer: WasteService,
    private wasteTypeSer: WasteTypeService,
  ) { }

  async ngOnInit() {
    const types = await this.wasteTypeSer.getTypes();
    if (!types.length) {
      this.enableForm = false;
      return;
    }
    this.wasteTypes = this.wasteTypeSer.getTypeNames(types);
  }

  onAdd() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.value;
    const newWaste: Waste = {
      id: uuidv4(),
      value: values.value,
      date: new Date(values.date)
    }

    this.wasteSer.createWaste(values.type, newWaste)
      .then(res => {
        this.presentToast();
        this.form.controls['type'].reset();
        this.form.controls['value'].reset();
      });
  }

  private async presentToast() {
    const toast = await this.toastCtrl.create({
      message: 'Waste entry created',
      duration: 2000,
      position: 'bottom',
    });

    await toast.present();
  }
}
