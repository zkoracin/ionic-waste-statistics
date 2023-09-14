import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { Waste } from 'src/app/_models/waste.model';
import { WasteService } from 'src/app/_services/waste.service';

@Component({
  selector: 'app-waste-update',
  templateUrl: './waste-update.component.html',
  styleUrls: ['./waste-update.component.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule]
})
export class WasteUpdateComponent implements OnInit {

  form!: FormGroup;
  data!: {
    type: string,
    waste: Waste,
  };

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private wasteSer: WasteService,
  ) { }

  ngOnInit() {
    this.initForm();
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }

  onSubmit() {
    if (this.form.invalid) return;
    const values: {value: number, date: Date} = this.form.value;
    const updatedWaste: Waste = {
      id: this.data.waste.id,
      value: values.value,
      date: new Date(values.date)
    };

    this.wasteSer.updateWaste(this.data.type, updatedWaste)
      .then(res => {
        this.presentToast();
        this.modalCtrl.dismiss(res,'confirm');
      });
  }

  private initForm() {
    this.form = this.fb.group({
      value: [this.data.waste.value, [Validators.required]],
      date: [this.data.waste.date.toISOString(), [Validators.required]],
    });
  }

  private async presentToast() {
    const toast = await this.toastCtrl.create({
      message: 'Waste entry updated',
      duration: 2000,
      position: 'bottom',
    });
    await toast.present();
  }

}
