import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { Waste } from '../_models/waste.model';
import { WasteUpdateComponent } from './waste-update/waste-update.component';
import { WasteService } from '../_services/waste.service';

@Component({
  selector: 'app-waste',
  templateUrl: './waste.page.html',
  styleUrls: ['./waste.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, NgChartsModule]
})
export class WastePage implements OnInit {
  wasteType!: string;

  wasteByType: Waste[] = [];

  years: number[] = [];
  selectedYear = 0;

  wasteByYear: Waste[] = [];
  wasteSumByYear = 0;
  wasteByMonths: Waste[] = []
  
  @ViewChild(BaseChartDirective)
  chart?: BaseChartDirective;
  barChartLegend = true;

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
    datasets: [
      { data: [],  label: 'KG' },
    ]
  };
  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    backgroundColor: '#3880ff',
  };
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private wasteSer: WasteService,
  ) { }

  async ngOnInit() {
    this.wasteType = this.activatedRoute.snapshot.paramMap.get('id') as string;
    const wasteByType = await this.wasteSer.getWasteByType(this.wasteType);
    if (!wasteByType.length) return;
    this.setData(wasteByType);
  }

  onDelete(id: string) {
    this.wasteSer.deleteWaste(this.wasteType, id)
      .then(async res => {
        this.presentToast('Waste entry deleted');
        this.setData(res);
      });
  }

  async onUpdate(waste: Waste) {
    const modal = await this.modalCtrl.create({
      component: WasteUpdateComponent,
      componentProps: {
        data: {
          type: this.wasteType,
          waste
        }
      }
    });
    await modal.present();
    const {data, role} = await modal.onWillDismiss();
    if (role === 'confirm') {
      this.setData(data);
    }
  }

  compareWith(o1: any, o2: any) {
    return o1 == o2;
  };

  handleChange(e: any) {
    this.selectedYear = e.detail.value;
    this.setWasteByYear();
    this.setChartData();
  }

  private setData(wasteByType: Waste[]) {
    this.wasteByType = wasteByType;
    this.setYears();
    this.setWasteByYear();
    this.setChartData();
  }

  private setWasteByYear() {
    this.wasteByYear = this.wasteSer.getWasteByYear(this.wasteByType, this.selectedYear);
    this.wasteSumByYear = this.wasteSer.getWasteSum(this.wasteByYear);
  }

  private setChartData() {
    this.barChartData.datasets[0].data = this.wasteSer.getWasteSumByMonth(this.wasteByYear);
    this.chart?.chart?.update();
  }

  private setYears() {
    this.years = this.wasteSer.getYearsToSelect(this.wasteByType);
    // In case that user delete or update all entries for one year,
    // switch to new year otherwise stay at selected
    if (this.years.findIndex(i => i === this.selectedYear) === -1) {
      this.selectedYear = this.years[this.years.length - 1];
    }
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
