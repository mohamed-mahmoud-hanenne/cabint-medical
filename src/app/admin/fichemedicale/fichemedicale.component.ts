import { Component } from '@angular/core';
import { Fichemedicale } from '../../models/fichemedicale';
import { Patient } from '../../models/patient';
import { FichemedicaleService } from '../../services/fichemedicale.service';
import { PatientService } from '../../services/patient.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { NgxPaginationModule } from 'ngx-pagination';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-fichemedicale',
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './fichemedicale.component.html',
  styleUrl: './fichemedicale.component.scss'
})
export class FichemedicaleComponent {

  fiches: Fichemedicale[] = [];
  filteredFiches: Fichemedicale[] = []; // Liste filtrée pour affichage
  patients: Patient[] = [];
  currentPage: number = 1; // Page actuelle
  itemsPerPage: number = 6; // Nombre d'éléments par page
  Math = Math;

  constructor(
    private ficheService: FichemedicaleService,
    private patientService: PatientService,
    private searchService: SearchService
  ) { }


  ngOnInit(): void {
    // Charger les fiches médicales
    this.ficheService.getAllFiche().subscribe((fiches) => {
      this.fiches = fiches;
      this.filteredFiches = fiches; // Initialiser la liste filtrée avec toutes les fiches
    });

    // Charger les patients
    this.patientService.getAllPatients().subscribe((patients) => {
      this.patients = patients;
    });

    // Écouter les modifications de recherche
    this.searchService.currentSearch.subscribe((searchText) => {
      this.filteredFiches = this.filterFiches(searchText);
    });
  }

  // Méthode pour filtrer les fiches médicales
  filterFiches(searchText: string): Fichemedicale[] {
    if (!searchText) {
      // Si aucune recherche, retourner toutes les fiches
      return this.fiches;
    }

    return this.fiches.filter((fiche) =>
      `${fiche.patient?.nom || ''} ${fiche.patient?.prenom || ''} ${fiche.description || ''}`
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );
  }

  getPatient() {
    this.patientService.getAllPatients().subscribe(
      (data: Patient[]) => {
        this.patients = data
      },
      (error) => {
        console.error('Erreur de chargement des patients', error);
      }
    )
  }

  getFiches() {
    this.ficheService.getAllFiche().subscribe(
      (data: Fichemedicale[]) => {
        this.fiches = data;
        console.log(this.ficheService)
      },
      (error) => {
        console.error('Erreur de chargement des fiches medicales', error);
      }
    )
  }


  openMedicalRecordForm(ficheMedicale: Fichemedicale = {
    description: '',
    patient: { id: 0, nom: 'Inconnu', prenom: '', adresse: '', telephone: '' }
  }) {
    console.log("Patients disponibles:", this.patients);

    let patientsOptions = this.patients.length > 0
      ? this.patients.map(patient =>
        `<option value="${patient.id}" ${patient.id === ficheMedicale.patient?.id ? 'selected' : ''}>
                ${patient.nom} ${patient.prenom}
              </option>`
      ).join('')
      : `<option disabled selected>Aucun patient disponible</option>`;

    Swal.fire({
      title: ficheMedicale.id ? 'Modifier fiche médicale' : 'Ajouter fiche médicale',
      html: `
              <input id="description" class="swal2-input" placeholder="Description" value="${ficheMedicale.description}">
              ${this.patients.length > 0 ? `
                  <select id="patient" class="swal2-input">
                      ${patientsOptions}
                  </select>
              ` : '<p style="color: red;">Aucun patient disponible</p>'}
          `,
      showCancelButton: true,
      confirmButtonText: ficheMedicale.id ? 'Modifier' : 'Ajouter',
      preConfirm: () => {
        const description = (document.getElementById('description') as HTMLInputElement).value;
        const patientElement = document.getElementById('patient') as HTMLSelectElement | null;
        const patientId = patientElement ? parseInt(patientElement.value) : null;

        if (!description || (this.patients.length > 0 && !patientId)) {
          Swal.showValidationMessage('Tous les champs sont obligatoires');
          return false;
        }

        let selectedPatient = this.patients.find(patient => patient.id === patientId);
        if (!selectedPatient) {
          Swal.showValidationMessage('Veuillez sélectionner un patient valide.');
          return false;
        }

        // 🔥 Create the Medical Record Object
        const ficheMedicaleData: Fichemedicale = {
          description: description,
          patient: selectedPatient
        };

        // 🔥 Remove `id` if it's a new medical record
        if (!ficheMedicale.id) {
          delete ficheMedicaleData.id;
        }

        console.log("Objet envoyé au backend :", JSON.stringify(ficheMedicaleData, null, 2));

        return ficheMedicaleData;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        let ficheMedicaleData = result.value;

        console.log("Envoi des données finales:", JSON.stringify(ficheMedicaleData, null, 2));

        if (ficheMedicale.id) {
          // 🔄 Modification d'une fiche médicale existante
          this.ficheService.updateFiche(ficheMedicaleData, ficheMedicale.id).subscribe(() => {
            // Charger les fiches médicales
            this.ficheService.getAllFiche().subscribe((fiches) => {
              this.fiches = fiches;
              this.filteredFiches = fiches; // Initialiser la liste filtrée avec toutes les fiches
            });

            // Charger les patients
            this.patientService.getAllPatients().subscribe((patients) => {
              this.patients = patients;
            });
            Swal.fire('Modifié!', 'Fiche médicale mise à jour.', 'success');
          }, error => {
            Swal.fire('Erreur!', 'Erreur lors de la mise à jour', 'error');
            console.error("Erreur lors de la mise à jour:", error);
          });
        } else {
          // ➕ Ajout d'une nouvelle fiche médicale
          this.ficheService.addFiche(ficheMedicaleData).subscribe(() => {
            // Charger les fiches médicales
            this.ficheService.getAllFiche().subscribe((fiches) => {
              this.fiches = fiches;
              this.filteredFiches = fiches; // Initialiser la liste filtrée avec toutes les fiches
            });

            // Charger les patients
            this.patientService.getAllPatients().subscribe((patients) => {
              this.patients = patients;
            });
            Swal.fire('Ajouté!', 'Nouvelle fiche médicale ajoutée.', 'success');
          }, error => {
            Swal.fire('Erreur!', "Erreur lors de l'ajout du fiche medicale", 'error');
            console.error("Erreur lors de l'ajout de la fiche médicale:", error);
          });
        }
      }
    });
  }



  deleteFiche(id: number) {
    if (id === undefined) return;
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Cette action est irréversible!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.ficheService.deleteFiche(id).subscribe(() => {
          // Charger les fiches médicales
          this.ficheService.getAllFiche().subscribe((fiches) => {
            this.fiches = fiches;
            this.filteredFiches = fiches; // Initialiser la liste filtrée avec toutes les fiches
          });

          // Charger les patients
          this.patientService.getAllPatients().subscribe((patients) => {
            this.patients = patients;
          });
          Swal.fire('supprimé!', 'Fiche medicale a été supprimé.', 'success');
        })
      }
    })
  }


  downloadFichePDF() {
    const doc = new jsPDF();

    // Titre du PDF
    doc.setFontSize(18);
    doc.text('Liste des Fiches Médicales', 10, 10);

    // Ajout des colonnes
    const columns = ['Patient', 'Description'];
    const rows: any[] = [];

    // Remplir les lignes avec les données des fiches
    this.fiches.forEach((fiche) => {
      rows.push([
        fiche.patient?.nom || fiche.patient?.prenom || 'Non attribué',
        fiche.description || 'Pas de description'
      ]);
    });

    // Ajouter les données dans un tableau au PDF
    (doc as any).autoTable({
      head: [columns],
      body: rows,
      startY: 20, // Position de début
      styles: { fontSize: 10 }
    });

    // Sauvegarder le PDF
    doc.save('Fiches_Medicales.pdf');
  }

}
