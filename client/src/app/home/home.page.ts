import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { WasteService } from '../_services/waste.service';
import { WasteTypeService } from '../_services/waste-type.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, NgChartsModule, CommonModule],
})
export class HomePage implements OnInit {
  types: string[] = [];
  sumByType: {type: string, sum: number}[] = [];
  wasteSum = 0;

  pieChartLabels: string[] = [];
  pieChartLegend = true;
  pieChartData = [{ data: [0]}];

  constructor(
    private wasteSer: WasteService,
    private wasteTypeSer: WasteTypeService,
  ) {}

  async ngOnInit() {
    const types = await this.wasteTypeSer.getTypes();
    this.types = this.wasteTypeSer.getTypeNames(types);

    await Promise.all(this.types.map(async (type) => {
      const waste = await this.wasteSer.getWasteByType(type);
      const sum = this.wasteSer.getWasteSum(waste); 
      this.wasteSum += sum;
      this.sumByType.push({
        type,
        sum: sum
      });
    }));
    
    this.setChartData();
  }
  
  private setChartData() {
    this.pieChartLabels = this.types;
    this.pieChartData[0].data = []; 
    this.sumByType.forEach(i => {
      this.pieChartData[0].data.push(i.sum);
    });
  }
}
