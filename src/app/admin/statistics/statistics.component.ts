import { Component, OnInit } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { PrestationService } from '../../services/prestation.service';
import { SallesService } from '../../services/salles.service';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    NgxEchartsModule
  ],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  prestationChartOptions: any;
  salleChartOptions: any;

  constructor(
    private prestationService: PrestationService,
    private salleService: SallesService
  ) {}

  ngOnInit(): void {
    this.loadSalleStatistics();
    this.loadPrestationStatistics();
  }

  // Charge les données pour les salles
  loadSalleStatistics(): void {
    this.salleService.getSalleStatistics().subscribe((data) => {
      this.salleChartOptions = {
        title: { text: 'Utilisation des Salles (Machines)', left: 'center' },
        tooltip: { trigger: 'item' },
        series: [
          {
            name: 'Salles',
            type: 'pie',
            radius: '50%',
            data: data // Données dynamiques du backend
          }
        ]
      };
    });
  }

  // Charge les données pour les prestations
  loadPrestationStatistics(): void {
    this.prestationService.getPrestationStatistics().subscribe((data) => {
      const names = data.map((item: any) => item.name); // Labels pour l'axe X
      const values = data.map((item: any) => item.value); // Valeurs pour les barres
  
      this.prestationChartOptions = {
        title: { text: 'Statistiques des Prestations', left: 'center' },
        tooltip: { trigger: 'axis' }, // Tooltip pour les barres
        xAxis: {
          type: 'category', // Axe X basé sur les catégories
          data: names // Labels des catégories (types de prestations)
        },
        yAxis: {
          type: 'value' // Axe Y basé sur des valeurs numériques
        },
        series: [
          {
            name: 'Prestations',
            type: 'bar',
            data: values // Données des barres
          }
        ]
      };
    });
  }
  


}
