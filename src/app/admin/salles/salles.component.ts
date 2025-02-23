import { Component, OnInit } from '@angular/core';
import { SallesService } from '../../services/salles.service';
import { Salle } from '../../models/salle';
import { error } from 'console';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-salles',
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './salles.component.html',
  styleUrl: './salles.component.scss'
})
export class SallesComponent implements OnInit {

  salles: Salle[] = [];
  filtredSalles: Salle[] = [];
  currentPage: number = 1; // Page actuelle
  itemsPerPage: number = 6; // Nombre d'éléments par page
  Math = Math;
  constructor(private salleService: SallesService, private searchService: SearchService) { }

  ngOnInit(): void {
    // Charger les salles
    this.salleService.getAllSalles().subscribe((salles) => {
      this.salles = salles;
      this.filtredSalles = salles; // Initialiser la liste filtrée avec toutes les salles
    });

    // Écouter les modifications de recherche
    this.searchService.currentSearch.subscribe((searchText) => {
      this.filtredSalles = this.filterSalles(searchText);
    });
  }

  // Méthode pour filtrer les salles
  filterSalles(searchText: string): Salle[] {
    if (!searchText) {
      // Si aucune recherche, retourner toutes les salles
      return this.salles;
    }

    return this.salles.filter((salle) =>
      `${salle.nom || ''} ${salle.nombreMachines || ''}`
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );
  }

  getSalles() {
    this.salleService.getAllSalles().subscribe(
      (data: Salle[]) => {
        this.salles = data;
      },
      (error) => {
        console.log('Erreur de chargement des salles', error);
      }
    );
  }



  openSalleForm(salle: Salle = { nom: '', nombreMachines: 0, nombreLits: 0 }) {
    Swal.fire({
      title: salle.id ? 'Modifier Salle' : 'Ajouter Salle',
      html: `
            <input id="nom" class="swal2-input" placeholder="Nom de la salle" value="${salle.nom}">
            <input id="nombreMachines" type="number" class="swal2-input" placeholder="Nombre de machines" value="${salle.nombreMachines}">
            <input id="nombreLits" type="number" class="swal2-input" placeholder="Nombre de lits" value="${salle.nombreLits}">
        `,
      showCancelButton: true,
      confirmButtonText: salle.id ? 'Modifier' : 'Ajouter',
      preConfirm: () => {
        const nom = (document.getElementById('nom') as HTMLInputElement).value.trim();
        const nombreMachines = parseInt((document.getElementById('nombreMachines') as HTMLInputElement).value);
        const nombreLits = parseInt((document.getElementById('nombreLits') as HTMLInputElement).value);

        if (!nom || isNaN(nombreMachines) || nombreMachines < 0 || isNaN(nombreLits) || nombreLits < 0) {
          Swal.showValidationMessage('Tous les champs sont obligatoires et les nombres doivent être valides.');
          return false;
        }

        return { id: salle.id, nom, nombreMachines, nombreLits } as Salle;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        let salleData = result.value;

        console.log("Envoi des données :", JSON.stringify(salleData, null, 2));

        if (salle.id) {
          // 🔄 Modification d'une salle existante
          this.salleService.updateSalle(salleData, salle.id).subscribe(() => {
            // Charger les salles
            this.salleService.getAllSalles().subscribe((salles) => {
              this.salles = salles;
              this.filtredSalles = salles; // Initialiser la liste filtrée avec toutes les salles
            });
            Swal.fire('Modifié!', 'Salle mise à jour.', 'success');
          }, error => {
            Swal.fire('Erreur!', 'Erreur lors de la mise à jour', 'error');
            console.error("Erreur lors de la mise à jour:", error);
          });
        } else {
          // ➕ Ajout d'une nouvelle salle
          this.salleService.addSalle(salleData).subscribe(() => {
            // Charger les salles
            this.salleService.getAllSalles().subscribe((salles) => {
              this.salles = salles;
              this.filtredSalles = salles; // Initialiser la liste filtrée avec toutes les salles
            });
            Swal.fire('Ajouté!', 'Nouvelle salle ajoutée.', 'success');
          }, error => {
            Swal.fire('Erreur!', "Erreur lors de l'ajout du salle", 'error');
            console.error("Erreur lors de l'ajout de la salle:", error);
          });
        }
      }
    });
  }





  deleteSalle(id: number) {
    if (id === undefined) return;
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Cette action est irréversible!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.salleService.deleteSalle(id).subscribe(() => {
          // Charger les salles
          this.salleService.getAllSalles().subscribe((salles) => {
            this.salles = salles;
            this.filtredSalles = salles; // Initialiser la liste filtrée avec toutes les salles
          });
          Swal.fire('supprimé!', 'Salle a été supprimé.', 'success');
        })
      }
    })
  }
}
