import { Component, OnInit } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { PrestationService } from '../../services/prestation.service';
import { SallesService } from '../../services/salles.service';
import { PatientService } from '../../services/patient.service';
import { RendezvousService } from '../../services/rendezvous.service';
import { FichemedicaleService } from '../../services/fichemedicale.service';

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
  patientChartOptions: any;
  rendezvousChartOptions: any;
  ficheMedicaleChartOptions: any;

  constructor(
    private prestationService: PrestationService,
    private salleService: SallesService,
    private patientService: PatientService,
    private rendezVousService: RendezvousService,
    private ficheMedicaleService: FichemedicaleService
  ) {}

  ngOnInit(): void {
    this.loadSalleStatistics();
    this.loadPrestationStatistics();
    this.loadPatientStatistics();
    this.loadRendezVousStatistics();
    this.loadFicheMedicaleStatistics();

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


  loadPatientStatistics(): void {
    this.patientService.getPatientStatistics().subscribe((data) => {
      this.patientChartOptions = {
        title: { text: 'Patients par Adresse', left: 'center' },
        tooltip: { trigger: 'item' },
        series: [
          {
            name: 'Patients',
            type: 'pie',
            radius: '50%',
            data: data // Données dynamiques
          }
        ]
      };
    });
  }
  

  loadRendezVousStatistics(): void {
    this.rendezVousService.getRendezVousStatistics().subscribe((data) => {
      this.rendezvousChartOptions = {
        title: { text: 'Statistiques des Rendez-vous', left: 'center' },
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: data.map((item: any) => item.name) // Statuts des rendez-vous
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'Rendez-vous',
            type: 'bar',
            data: data.map((item: any) => item.value) // Nombre de rendez-vous
          }
        ]
      };
    });
  }


  loadFicheMedicaleStatistics(): void {
    this.ficheMedicaleService.getFicheMedicaleStatistics().subscribe((data) => {
      this.ficheMedicaleChartOptions = {
        title: { text: 'Fiches Médicales par Patient', left: 'center' },
        tooltip: { trigger: 'item' },
        series: [
          {
            name: 'Fiches Médicales',
            type: 'pie',
            radius: '50%',
            data: data // Données dynamiques
          }
        ]
      };
    });
  }

}
