import { Component } from '@angular/core';
import { Prestation } from '../../models/prestation';
import { PrestationService } from '../../services/prestation.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-prestations',
  imports: [CommonModule,FormsModule],
  templateUrl: './prestations.component.html',
  styleUrl: './prestations.component.scss'
})
export class PrestationsComponent {

    prestations: Prestation[] = [];
    constructor(private prestationService: PrestationService){}
  
    ngOnInit(): void {
      this.getPrestations();
    }
  
    getPrestations(){
      this.prestationService.getAllPrestations().subscribe(
        (data:Prestation[]) => {
          this.prestations = data;
        },
        (error) => {
          console.error('Erreur de chargement des prestations', error);
        }
      );
    }

    openPrestationForm(prestation: Prestation = { nom: '', type: '', tarif: 0 }) {
      Swal.fire({
          title: prestation.id ? 'Modifier Prestation' : 'Ajouter Prestation',
          html: `
              <input id="nom" class="swal2-input" placeholder="Nom de la prestation" value="${prestation.nom}">
              <input id="type" class="swal2-input" placeholder="Type de prestation" value="${prestation.type}">
              <input id="tarif" type="number" step="0.01" class="swal2-input" placeholder="Tarif" value="${prestation.tarif}">
          `,
          showCancelButton: true,
          confirmButtonText: prestation.id ? 'Modifier' : 'Ajouter',
          preConfirm: () => {
              const nom = (document.getElementById('nom') as HTMLInputElement).value.trim();
              const type = (document.getElementById('type') as HTMLInputElement).value.trim();
              const tarif = parseFloat((document.getElementById('tarif') as HTMLInputElement).value);
  
              if (!nom || !type || isNaN(tarif) || tarif <= 0) {
                  Swal.showValidationMessage('Tous les champs sont obligatoires et le tarif doit être valide.');
                  return false;
              }
  
              return { id: prestation.id, nom, type, tarif } as Prestation;
          }
      }).then((result) => {
          if (result.isConfirmed) {
              let prestationData = result.value;
  
              console.log("Envoi des données :", JSON.stringify(prestationData, null, 2));
  
              if (prestation.id) {
                  // 🔄 Modification d'une prestation existante
                  this.prestationService.updatePrestation(prestationData, prestation.id).subscribe(() => {
                      this.getPrestations();
                      Swal.fire('Modifié!', 'Prestation mise à jour.', 'success');
                  }, error => {
                      console.error("Erreur lors de la mise à jour:", error);
                  });
              } else {
                  // ➕ Ajout d'une nouvelle prestation
                  this.prestationService.addPrestation(prestationData).subscribe(() => {
                      this.getPrestations();
                      Swal.fire('Ajouté!', 'Nouvelle prestation ajoutée.', 'success');
                  }, error => {
                      console.error("Erreur lors de l'ajout de la prestation:", error);
                  });
              }
          }
      });
  }
  


      deletePrestation(id: number){
        if(id === undefined) return; 
        Swal.fire({
          title: 'Êtes-vous sûr?',
          text: "Cette action est irréversible!",
          icon:'warning',
          showCancelButton:true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Oui, supprimer!'
        }).then((result) => {
          if(result.isConfirmed){
            this.prestationService.deletePrestation(id).subscribe(() => {
              this.getPrestations();
              Swal.fire('supprimé!', 'Prestation a été supprimé.','success');
            })
          }
        })
      }

}
