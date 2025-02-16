import { Component,HostListener,OnInit,ViewChild  } from '@angular/core';
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
export class DashbordAdminComponent implements OnInit{
  activeRoute: string = '';
  private routerSubscription: Subscription;
  upcomingRendezVous: RendezVous[] = [];
  users: User[] = [];
  adminLogin: string | null = null;

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private searchService: SearchService,
    private rendezService: RendezvousService,
    private userService: UtilisateursService,
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

  ngOnInit(): void {
    // Récupérer le login de l'admin depuis localStorage
    this.adminLogin = localStorage.getItem('login') || 'Admin';
    console.log('Admin Login récupéré depuis localStorage :', this.adminLogin);
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
        // Construire une liste HTML des rendez-vous imminents
        const rendezVousList = this.upcomingRendezVous.map(
          (rendez) => `
            <li>
              <strong>${rendez.patient?.nom || rendez.patient?.prenom || 'Un patient'}</strong> - 
              ${rendez.date} à ${rendez.heure}
            </li>
          `
        ).join('');
    
        Swal.fire({
          title: 'Rendez-vous imminents',
          html: `<ul style="text-align: left;">${rendezVousList}</ul>`, // Affiche la liste formatée
          icon: 'info',
          timer: 15000, // Affiche la notification pendant 15 secondes
          showCloseButton: true, // Ajouter un bouton pour fermer la fenêtre
        });
      } else {
        Swal.fire({
          title: 'Aucune notification',
          text: 'Il n’y a pas de rendez-vous imminent.',
          icon: 'info',
          timer: 5000, // Affiche la notification pendant 5 secondes
        });
      }
    }
    
    



  // Méthode appelée lorsque l'utilisateur clique sur "Déconnexion"
  onLogout() {
    this.authService.logout(); // Supprimer le token
    localStorage.removeItem('login'); // Supprimer le login
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
