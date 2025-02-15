import { Component,HostListener,ViewChild  } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSidenav } from '@angular/material/sidenav';
import { RouterOutlet, RouterLink, Router, NavigationEnd} from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { SearchService } from '../../services/search.service';
import { CommonModule } from '@angular/common';
import { RendezVous } from '../../models/rendezvous';
import { RendezvousService } from '../../services/rendezvous.service';
import Swal from 'sweetalert2';
import { UtilisateursService } from '../../services/utilisateurs.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-dashbord-admin',
  imports: [
    RouterOutlet,
    RouterLink,
    CommonModule
  ],
  templateUrl: './dashbord-admin.component.html',
  styleUrl: './dashbord-admin.component.scss'
})
export class DashbordAdminComponent {
  activeRoute: string = '';
  private routerSubscription: Subscription;
  upcomingRendezVous: RendezVous[] = [];
  users: User[] = [];

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private searchService: SearchService,
    private rendezService: RendezvousService,
    private userService: UtilisateursService
  ) {
    // Détecter lorsque l'utilisateur quitte le dashboard
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Si l'utilisateur quitte la route admin
        if (!event.urlAfterRedirects.includes('/admin')) {
          this.authService.logout(); // Déconnexion
        }
      }
    });

        // Écoute les changements de route
        this.router.events.subscribe((event: any) => {
          if (event.url) {
            this.activeRoute = event.url; // Par exemple : '/admin/users'
          }
        });

        setInterval(() => {
          this.checkUpcomingRendezVous();
        }, 10000); // Vérifie toutes les 10 secondes
        

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


  checkUpcomingRendezVous(): void {
    this.rendezService.getAllRendezVous().subscribe((data) => {
      const currentDate = new Date();
      const upcomingDate = new Date(Date.now() + 2 * 60 * 60 * 1000); // Prochaines 2 heures
      this.upcomingRendezVous = data.filter((rendez) => {
        const rendezDate = new Date(`${rendez.date}T${rendez.heure}`);
        return rendezDate >= currentDate && rendezDate <= upcomingDate;
      });
  
      if (this.upcomingRendezVous.length > 0) {
        // this.showNotification();
      }
    });
  }
  
    // showNotification(): void {
    //   this.upcomingRendezVous.forEach((rendez) => {
    //     Swal.fire({
    //       title: 'Rendez-vous imminent',
    //       text: `Rendez-vous avec ${rendez.patient?.nom || 'un patient'} à ${rendez.heure}`,
    //       icon: 'info',
    //       timer: 10000 // Affiche la notification pendant 10 secondes
    //     });
    //   });
    // }

    handleNotificationClick(): void {
      if (this.upcomingRendezVous.length > 0) {
        // Exemple : Afficher les rendez-vous imminents dans une alerte
        this.upcomingRendezVous.forEach((rendez) => {
        Swal.fire({
        title: 'Rendez-vous imminent',
        text: `Rendez-vous avec ${rendez.patient?.nom || 'un patient'} à ${rendez.heure}`,
        icon: 'info',
        timer: 10000 // Affiche la notification pendant 10 secondes
      });
          // alert(`Rendez-vous imminent : ${rendez.patient?.nom || 'un patient'}, à ${rendez.heure}`);
        });
      } else {
        console.log('Aucune notification.');
      }
    }
    



  // Méthode appelée lorsque l'utilisateur clique sur "Déconnexion"
  onLogout() {
    this.authService.logout(); // Supprimer le token
    this.router.navigate(['/login']); // Rediriger vers la page de connexion
  }

  ngOnDestroy() {
    // Désabonner pour éviter les fuites de mémoire
    this.routerSubscription.unsubscribe();
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {
    // Déconnexion lors d'un rafraîchissement ou fermeture de l'onglet
    this.authService.logout();
  }

  onSearch(searchText: string): void {
    this.searchService.updateSearch(searchText);
  }

  // Méthode pour la barre de recherche
  onSearchInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement; // Cast explicite
    const searchText = inputElement.value || ''; // Gérer le cas `null` ou `undefined`
    this.searchService.updateSearch(searchText);
  }
}
