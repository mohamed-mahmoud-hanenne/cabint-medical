import { Component } from '@angular/core';
import { Fichemedicale } from '../../models/fichemedicale';
import { Patient } from '../../models/patient';
import { FichemedicaleService } from '../../services/fichemedicale.service';
import { PatientService } from '../../services/patient.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-fichemedicale',
  imports: [CommonModule,FormsModule],
  templateUrl: './fichemedicale.component.html',
  styleUrl: './fichemedicale.component.scss'
})
export class FichemedicaleComponent {

  fiches: Fichemedicale[] = [];
    patients: Patient[] = [];
  
    constructor(private ficheService: FichemedicaleService, 
                private patientService: PatientService
    ){}
  
    getPatient(){
      this.patientService.getAllPatients().subscribe(
        (data:Patient[]) =>{
          this.patients = data
        },
        (error) =>{
          console.error('Erreur de chargement des fiche medicale', error);
        }
      )
    }
  
    getFiches() {
      this.ficheService.getAllFiche().subscribe(
        (data:Fichemedicale[]) => {
          this.fiches = data;
          console.log(this.ficheService)
        },
        (error) => {
          console.error('Erreur de chargement des patients', error);
        }
      )
    }
    ngOnInit(): void {
      this.getFiches();
      this.getPatient();
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
                      this.getFiches();
                      Swal.fire('Modifié!', 'Fiche médicale mise à jour.', 'success');
                  }, error => {
                      console.error("Erreur lors de la mise à jour:", error);
                  });
              } else {
                  // ➕ Ajout d'une nouvelle fiche médicale
                  this.ficheService.addFiche(ficheMedicaleData).subscribe(() => {
                      this.getFiches();
                      Swal.fire('Ajouté!', 'Nouvelle fiche médicale ajoutée.', 'success');
                  }, error => {
                      console.error("Erreur lors de l'ajout de la fiche médicale:", error);
                  });
              }
          }
      });
  }
  
  
  
  
  
      deleteFiche(id:number){
        if(id === undefined) return;
        Swal.fire({
          title: 'Êtes-vous sûr?',
          text: "Cette action est irréversible!",
          icon:'warning',
          showCancelButton:true,
          confirmButtonColor:'#3085d6',
          cancelButtonColor:'#d33',
          confirmButtonText:'Oui, supprimer!',
        }).then((result) => {
          if(result.isConfirmed){
            this.ficheService.deleteFiche(id).subscribe(() => {
              this.getFiches();
              Swal.fire('supprimé!', 'Fiche medicale a été supprimé.','success');
            })
          }
        })
      }
}
