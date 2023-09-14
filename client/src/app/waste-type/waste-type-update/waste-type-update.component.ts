import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { WasteType } from 'src/app/_models/wasteType.model';
import { WasteTypeService } from 'src/app/_services/waste-type.service';

@Component({
  selector: 'app-waste-type-update',
  templateUrl: './waste-type-update.component.html',
  styleUrls: ['./waste-type-update.component.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule]
})
export class WasteTypeUpdateComponent  implements OnInit {

  wasteType!: WasteType;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private wasteTypeSer: WasteTypeService,
    private toastCtrl: ToastController,
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: [this.wasteType.name, Validators.required]
    });
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }

  async onSubmit() {
    if (this.form.invalid) return;

    const oldName = this.wasteType.name;
    const newName = (this.form.value.name as string).toLowerCase();

    const types = await this.wasteTypeSer.getTypes();
    const type = types.find(type => type.name === newName);
    if (type) {
      this.presentToast(newName);
      return;
    }

    this.wasteType.name = newName;
    
    this.wasteTypeSer.updateType(types, oldName, this.wasteType)
      .then(_ => this.onCancel());
  }

  private async presentToast(name: string) {
    const toast = await this.toastCtrl.create({
      message: `Waste type ${name.toUpperCase()} already exists`,
      duration: 2000,
      position: 'bottom',
    });
    await toast.present();
  }

}
