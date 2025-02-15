import { Component } from '@angular/core';
import { Paiement } from '../../models/paiement';
import { Patient } from '../../models/patient';
import { PaiementService } from '../../services/paiement.service';
import { PatientService } from '../../services/patient.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { NgxPaginationModule } from 'ngx-pagination';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-paiement',
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './paiement.component.html',
  styleUrl: './paiement.component.scss'
})
export class PaiementComponent {

  paiements: Paiement[] = [];
  patients: Patient[] = [];
  filtredPaiement: Paiement[] = [];
  currentPage: number = 1; // Page actuelle
  itemsPerPage: number = 8; // Nombre d'éléments par page
  Math = Math;

  constructor(private paiementService: PaiementService,
    private patientService: PatientService,
    private searchService: SearchService
  ) { }

  ngOnInit(): void {
    // Récupérer tous les paiements
    this.paiementService.getAllPaiement().subscribe((paiement) => {
      this.paiements = paiement;
      this.filtredPaiement = paiement; // Initialiser la liste filtrée avec tous les paiement
    });

    // Récupérer tous les patients pour le formulaire
    this.patientService.getAllPatients().subscribe((patients) => {
      this.patients = patients;
    });

    // Écouter les modifications de recherche
    this.searchService.currentSearch.subscribe((searchText) => {
      this.filtredPaiement = this.filterPaiement(searchText);
    });
  }

  filterPaiement(searchText: string): Paiement[] {
      if (!searchText) {
        // Si le texte de recherche est vide, afficher tous les paiements
        return this.paiements;
      }
  
      // Filtrer les paiement par patient (nom/prénom) ou montant
      return this.paiements.filter((paiement) =>
        `${paiement.patient?.nom || ''} ${paiement.patient?.prenom || ''} ${paiement.montant || ''}`
          .toLowerCase()
          .includes(searchText.toLowerCase())
      );
    }

  getPatients() {
    this.patientService.getAllPatients().subscribe(
      (data: Patient[]) => {
        this.patients = data;
      },
      (error) => {
        console.error('Erreur de chargement des patients', error);
      }
    )
  }

  getPaiements() {
    this.paiementService.getAllPaiement().subscribe(
      (data: Paiement[]) => {
        this.paiements = data;
        console.log(this.paiements)
      },
      (error) => {
        console.error('Erreur de chargement des paiements', error);
      }
    )
  }

  openPaiementForm(paiement: Paiement = { montant: 0, date: '', patient: { id: 0, nom: 'Inconnu', prenom: '', adresse: '', telephone: '' } }) {
    console.log("Patients disponibles:", this.patients);

    let patientsOptions = this.patients.length > 0
      ? this.patients.map(patient =>
        `<option value="${patient.id}" ${patient.id === paiement.patient?.id ? 'selected' : ''}>
                  ${patient.nom} ${patient.prenom}
                </option>`
      ).join('')
      : `<option disabled selected>Aucun patient disponible</option>`;

    Swal.fire({
      title: paiement.id ? 'Modifier Paiement' : 'Ajouter Paiement',
      html: `
                <input id="montant" type="number" step="0.01" class="swal2-input" placeholder="Montant" value="${paiement.montant}">
                <input id="date" class="swal2-input" placeholder="Date (AAAA-MM-JJ)" value="${paiement.date}">
                ${this.patients.length > 0 ? `
                    <select id="patient" class="swal2-input">
                        ${patientsOptions}
                    </select>
                ` : '<p style="color: red;">Aucun patient disponible</p>'}
            `,
      showCancelButton: true,
      confirmButtonText: paiement.id ? 'Modifier' : 'Ajouter',
      preConfirm: () => {
        const montant = parseFloat((document.getElementById('montant') as HTMLInputElement).value);
        const date = (document.getElementById('date') as HTMLInputElement).value.trim();
        const patientElement = document.getElementById('patient') as HTMLSelectElement | null;
        const patientId = patientElement ? parseInt(patientElement.value) : null;

        if (isNaN(montant) || montant <= 0 || !date || (this.patients.length > 0 && !patientId)) {
          Swal.showValidationMessage('Tous les champs sont obligatoires et le montant doit être valide.');
          return false;
        }

        let selectedPatient = this.patients.find(patient => patient.id === patientId);
        if (!selectedPatient) {
          Swal.showValidationMessage('Veuillez sélectionner un patient valide.');
          return false;
        }

        const paiementData: Paiement = {
          montant: montant,
          date: date,
          patient: selectedPatient
        };

        if (!paiement.id) {
          delete paiementData.id;
        }

        console.log("Objet envoyé au backend :", JSON.stringify(paiementData, null, 2));

        return paiementData;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        let paiementData = result.value;

        console.log("Envoi des données finales:", JSON.stringify(paiementData, null, 2));

        if (paiement.id) {
          // 🔄 Modification d'un paiement existant
          this.paiementService.updatePaiement(paiementData, paiement.id).subscribe(() => {
            this.getPaiements();
            Swal.fire('Modifié!', 'Paiement mis à jour.', 'success');
          }, error => {
            Swal.fire('Erreur!', 'Erreur lors de la mise à jour', 'error');
            console.error("Erreur lors de la mise à jour:", error);
          });
        } else {
          // ➕ Ajout d'un nouveau paiement
          this.paiementService.addPaiement(paiementData).subscribe(() => {
            this.getPaiements();
            Swal.fire('Ajouté!', 'Nouveau paiement ajouté.', 'success');
          }, error => {
            Swal.fire('Erreur!', "Erreur lors de l'ajout du paiement", 'error');
            console.error("Erreur lors de l'ajout du paiement:", error);
          });
        }
      }
    });
  }



  deletePaiement(id: number) {
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
        this.paiementService.deletePaiement(id).subscribe(() => {
          this.getPaiements();
          Swal.fire('supprimé!', 'Paiement a été supprimé.', 'success');
        })
      }
    })
  }


  downloadPaiementsPDF() {
    const doc = new jsPDF();

    // Titre du PDF
    doc.setFontSize(18);
    doc.text('Liste des Paiements', 10, 10);

    // Ajout des colonnes
    const columns = ['Patient', 'Montant', 'Date'];
    const rows: any[] = [];

    // Remplir les lignes avec les données des paiements
    this.paiements.forEach((paiement) => {
      rows.push([
        paiement.patient?.nom || paiement.patient?.prenom || 'Non attribué',
        paiement.montant || '0',
        paiement.date || 'Pas de date'
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
    doc.save('Paiements.pdf');
  }

}
