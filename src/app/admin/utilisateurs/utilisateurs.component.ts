import { Component, OnInit } from '@angular/core';
import { UtilisateursService } from '../../services/utilisateurs.service';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgxPaginationModule } from 'ngx-pagination';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-utilisateurs',
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './utilisateurs.component.html',
  styleUrl: './utilisateurs.component.scss'
})
export class UtilisateursComponent implements OnInit {
  users: User[] = [];
  filtredUsers: User[] = [];
  currentPage: number = 1; // Page actuelle
  itemsPerPage: number = 8; // Nombre d'éléments par page
  Math = Math;
  constructor(private userService: UtilisateursService, private searchService: SearchService) { }

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe((users) => {
      this.users = users;
      this.filtredUsers = users; // Initialiser filteredUsers une fois que les données sont disponibles
    });
    this.searchService.currentSearch.subscribe((searchText) => {
      this.filtredUsers = this.filterUsers(searchText);
    });
    console.log('Page actuelle:', this.currentPage); // Vérifiez si la page actuelle est bien définie
    console.log('Éléments par page:', this.itemsPerPage);
  }

  getUsers() {
    this.userService.getAllUsers().subscribe(
      (data: User[]) => {
        this.users = data;
        console.log('Utilisateurs chargés:', this.users);
      },
      (error) => {
        console.error('Erreur de chargement des utilisateurs', error);
      }
    );

      // // Initialiser `filteredUsers` avec tous les utilisateurs
      // this.filtredUsers = [...this.users];
  } 

  filterUsers(searchText: string): any[] {
    if (!searchText) {
      // Si le texte de recherche est vide, retourner tous les utilisateurs
      return this.users;
    }
  
    // Filtrer les utilisateurs en fonction du texte de recherche
    return this.users.filter((user) =>
      `${user.nom} ${user.prenom} ${user.login} ${user.role}`
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );
  }
  


  openUserForm(user: User = { nom: '', prenom: '', password: '', login: '', role: 'admin' }) {
    Swal.fire({
      title: user.id ? 'Modifier Utilisateur' : 'Ajouter Utilisateur',
      html: `
      <input id="nom" class="swal2-input" placeholder="Nom" value="${user.nom}">
      <input id="prenom" class="swal2-input"  placeholder="Prénom" value="${user.prenom}">
      <input id="password" type="password" class="swal2-input" placeholder="Mot de passe" value="${user.password}">
      <input id="login" class="swal2-input" placeholder="Login" value="${user.login}">
      <select id="role" class="swal2-input">
          <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
          <option value="secretaire" ${user.role === 'secretaire' ? 'selected' : ''}>Secrétaire</option>
      </select>
      `,
      showCancelButton: true,
      confirmButtonText: user.id ? 'Modifier' : 'Ajouter',
      preConfirm: () => {
        const nom = (document.getElementById('nom') as HTMLInputElement).value;
        const prenom = (document.getElementById('prenom') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;
        const login = (document.getElementById('login') as HTMLInputElement).value;
        const role = (document.getElementById('role') as HTMLInputElement).value as 'admin' | 'secretaire';;

        if (!nom || !prenom || !login) {
          Swal.showValidationMessage('Tous les champs sont obligatoires');
          return false;
        }

        return { id: user.id, nom, prenom, password, login, role } as User;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        if (user.id) {
          this.userService.updateUser(result.value, user.id).subscribe(() => {
            this.userService.getAllUsers().subscribe((users) => {
              this.users = users;
              this.filtredUsers = users; // Initialiser filteredUsers une fois que les données sont disponibles
            });
            Swal.fire('Modifié!', 'Utilisateur mis à jour.', 'success');
          },
            error => {
              Swal.fire('Erreur!', 'Erreur lors de la mise à jour', 'error');
              console.error("Erreur lors de la mise à jour:", error);
            });
        } else {
          this.userService.addUser(result.value).subscribe(() => {
            this.userService.getAllUsers().subscribe((users) => {
              this.users = users;
              this.filtredUsers = users; // Initialiser filteredUsers une fois que les données sont disponibles
            });
            Swal.fire('Ajouté!', 'Nouvel utilisateur ajouté.', 'success');
          },
            error => {
              Swal.fire('Erreur!', "Erreur lors de l'ajout d'utilisateur", 'error');
              console.error("Erreur lors de l'ajout d'utilisateur:", error);
            });
        }
      }
    });
  }

  deleteUser(id: number) {
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
        this.userService.deleteUser(id).subscribe(() => {
          this.userService.getAllUsers().subscribe((users) => {
            this.users = users;
            this.filtredUsers = users; // Initialiser filteredUsers une fois que les données sont disponibles
          });
          Swal.fire('supprimé!', 'L’utilisateur a été supprimé.', 'success');
        })
      }
    })
  }
}
