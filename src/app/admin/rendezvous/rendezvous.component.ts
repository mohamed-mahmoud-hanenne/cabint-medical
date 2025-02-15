import { Component, OnInit } from '@angular/core';
import { RendezVous } from '../../models/rendezvous';
import { RendezvousService } from '../../services/rendezvous.service';
import { error } from 'console';
import Swal from 'sweetalert2';
import { Patient } from '../../models/patient';
import { PatientService } from '../../services/patient.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-rendezvous',
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './rendezvous.component.html',
  styleUrl: './rendezvous.component.scss'
})
export class RendezvousComponent implements OnInit{

  rendezvous: RendezVous[] = [];
  patients: Patient[] = [];
  filtredRendezVous: RendezVous[] = [];
  upcomingRendezVous: RendezVous[] = [];
  currentPage: number = 1; // Page actuelle
  itemsPerPage: number = 5; // Nombre d'éléments par page
  Math = Math;

  constructor(private rendezService: RendezvousService, 
              private patientService: PatientService,
              private searchService: SearchService
  ){}

  getPatient(){
    this.patientService.getAllPatients().subscribe(
      (data:Patient[]) =>{
        this.patients = data
      },
      (error) =>{
        console.error('Erreur de chargement des rendez vous', error);
      }
    )
  }

  getRendezVous() {
    this.rendezService.getAllRendezVous().subscribe(
      (data:RendezVous[]) => {
        this.rendezvous = data;
        console.log(this.rendezService)
      },
      (error) => {
        console.error('Erreur de chargement des patients', error);
      }
    )
  }


  ngOnInit(): void {
    // Récupérer tous les rendez-vous
    this.rendezService.getAllRendezVous().subscribe((rendez) => {
      this.rendezvous = rendez;
      this.filtredRendezVous = rendez; // Initialiser la liste filtrée avec tous les rendez-vous
    });

    // Récupérer tous les patients pour le formulaire
    this.patientService.getAllPatients().subscribe((patients) => {
      this.patients = patients;
    });

    // Écouter les modifications de recherche
    this.searchService.currentSearch.subscribe((searchText) => {
      this.filtredRendezVous = this.filterRendez(searchText);
    });

    setInterval(() => {
      this.checkUpcomingRendezVous();
    }, 10000); // Vérifie toutes les 10 secondes
    
  }

  checkUpcomingRendezVous(): void {
    this.rendezService.getAllRendezVous().subscribe((data) => {
      const currentDate = new Date();
      const upcomingDate = new Date(Date.now() + 2 * 60 * 60 * 1000); // Prochaines 2 heures
      this.upcomingRendezVous = data.filter((rendez) => {
        const rendezDate = new Date(`${rendez.date}T${rendez.heure}`);
        return rendezDate >= currentDate && rendezDate <= upcomingDate;
      });

      console.log('Rendez-vous imminents détectés :', this.upcomingRendezVous); // Ajoutez ceci pour vérifier

      if (this.upcomingRendezVous.length > 0) {
        // this.showNotification();
      }
    });
  }
  

  // showNotification(): void {
  //   this.upcomingRendezVous.forEach((rendez) => {
  //     console.log(`Notification pour le rendez-vous :`, rendez); // Ajoutez un log pour voir la notification
  //     Swal.fire({
  //       title: 'Rendez-vous imminent',
  //       text: `Rendez-vous avec ${rendez.patient?.nom || 'un patient'} à ${rendez.heure}`,
  //       icon: 'info',
  //       timer: 10000 // Affiche la notification pendant 10 secondes
  //     });
  //   });
  // }

  filterRendez(searchText: string): RendezVous[] {
    if (!searchText) {
      // Si le texte de recherche est vide, afficher tous les rendez-vous
      return this.rendezvous;
    }

    // Filtrer les rendez-vous par patient (nom/prénom) ou statut
    return this.rendezvous.filter((rendez) =>
      `${rendez.patient?.nom || ''} ${rendez.patient?.prenom || ''} ${rendez.statut || ''}`
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );
  }


  openRendezVousForm(rendezVous: RendezVous = { 
    date: '', 
    heure: '', 
    statut: '', 
    patient: { id: 0, nom: 'Inconnu', prenom: '', adresse: '', telephone: '' }  
}) {
    console.log("Patients disponibles:", this.patients); // Debug

    let patientsOptions = this.patients.length > 0 
        ? this.patients.map(patient => 
            `<option value="${patient.id}" ${patient.id === rendezVous.patient?.id ? 'selected' : ''}>
              ${patient.nom} ${patient.prenom}
            </option>`
        ).join('')
        : `<option disabled selected>Aucun patient disponible</option>`;

    Swal.fire({
        title: rendezVous.id ? 'Modifier rendez-vous' : 'Ajouter rendez-vous',
        html: `
            <input id="date" class="swal2-input" placeholder="Date (AAAA-MM-JJ)" value="${rendezVous.date}">
            <input id="heure" class="swal2-input" placeholder="Heure (HH:MM:SS)" value="${rendezVous.heure}">
            <input id="statut" class="swal2-input" placeholder="Statut" value="${rendezVous.statut}">
            ${this.patients.length > 0 ? `
                <select id="patient" class="swal2-input">
                    ${patientsOptions}
                </select>
            ` : '<p style="color: red;">Aucun patient disponible</p>'}
        `,
        showCancelButton: true,
        confirmButtonText: rendezVous.id ? 'Modifier' : 'Ajouter',
        preConfirm: () => {
            const date = (document.getElementById('date') as HTMLInputElement).value;
            const heure = (document.getElementById('heure') as HTMLInputElement).value;
            const statut = (document.getElementById('statut') as HTMLInputElement).value;
            const patientElement = document.getElementById('patient') as HTMLSelectElement | null;
            const patientId = patientElement ? parseInt(patientElement.value) : null;

            if (!date || !heure || !statut || (this.patients.length > 0 && !patientId)) {
                Swal.showValidationMessage('Tous les champs sont obligatoires');
                return false;
            }

            let selectedPatient = this.patients.find(patient => patient.id === patientId);
            if (!selectedPatient) {
                Swal.showValidationMessage('Veuillez sélectionner un patient valide.');
                return false;
            }

            // Correction : Adapter au format `LocalDate` et `LocalTime`
            const rendezVousData: RendezVous = {
                date: date,  // Format `YYYY-MM-DD`
                heure: heure + ":00",  // Format `HH:MM:SS`
                statut: statut,
                patient: selectedPatient  // Objet `patient` complet
            };

            // Supprimer `id` si c'est une création
            if (!rendezVous.id) {
                delete rendezVousData.id;
            }

            console.log("Objet envoyé au backend :", JSON.stringify(rendezVousData, null, 2));

            return rendezVousData;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            let rendezVousData = result.value;

            console.log("Envoi des données finales:", JSON.stringify(rendezVousData, null, 2));

            if (rendezVous.id) {
                // Modification d'un rendez-vous existant
                this.rendezService.updateRendezVous(rendezVousData, rendezVous.id).subscribe(() => {
                    this.getRendezVous();
                    Swal.fire('Modifié!', 'Rendez-vous mis à jour.', 'success');
                }, error => {
                  Swal.fire('Erreur!', 'Erreur lors de la mise à jour', 'error');
                    console.error("Erreur lors de la mise à jour:", error);
                });
            } else {
                // Ajout d'un nouveau rendez-vous
                this.rendezService.addRendezVous(rendezVousData).subscribe(() => {
                    this.getRendezVous();
                    Swal.fire('Ajouté!', 'Nouveau rendez-vous ajouté.', 'success');
                }, error => {
                    Swal.fire('Erreur!', "Erreur lors de l'ajout du rendez-vous", 'error');
                    console.error("Erreur lors de l'ajout du rendez-vous:", error);
                });
            }
        }
    });
}


     confirmRendezVous(rendezId:number, currentStatut: string): void{
      if (currentStatut === 'Confirmé') {
        alert('Ce rendez-vous est déjà confirmé');
        return;
      }
     
      const updatedStatut = 'Confirmé';
      this.rendezService.updateRendezVousStatut(rendezId, updatedStatut).subscribe({
        next : () =>{
          Swal.fire('Modifié!', 'Le statut du rendez-vous a été mis à jour en "Confirmé" ', 'success');
          // alert('Le statut du rendez-vous a été mis à jour en "Confirmé".');
          this.getRendezVous();
        },
        error: (err) => {
          Swal.fire('Erreur!', 'Erreur lors de la mise à jour du statut', 'error');
          console.error('Erreur lors de la mise à jour du statut :', err);
        }
      })
     }

     
   

    deleteRendez(id:number){
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
          this.rendezService.deleteRendezVous(id).subscribe(() => {
            this.getRendezVous();
            Swal.fire('supprimé!', 'Rendez vous a été supprimé.','success');
          })
        }
      })
    }
}
