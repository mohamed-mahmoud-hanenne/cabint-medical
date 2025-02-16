import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { SearchService } from '../../services/search.service';
import { RendezVous } from '../../models/rendezvous';
import Swal from 'sweetalert2';
import { RendezvousService } from '../../services/rendezvous.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashbord-secretaire',
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './dashbord-secretaire.component.html',
  styleUrl: './dashbord-secretaire.component.scss'
})
export class DashbordSecretaireComponent implements OnInit{

    // private routerSubscription: Subscription;
    upcomingRendezVous: RendezVous[] = [];
    secreLogin: string | null = null;
  
    constructor(
      private authService: AuthService, private router: Router, 
      private searchService:SearchService,
      private rendezService: RendezvousService
    ) {
      // Détecter lorsque l'utilisateur quitte le dashboard
      // this.routerSubscription = this.router.events.subscribe((event) => {
      //   if (event instanceof NavigationEnd) {
      //     // Si l'utilisateur quitte la route secretaire
      //     if (!event.urlAfterRedirects.includes('/secretaire')) {
      //       this.authService.logout(); // Déconnexion
      //     }
      //   }
      // });

      setInterval(() => {
        this.checkUpcomingRendezVous();
      }, 10000); // Vérifie toutes les 10 secondes
    }

    ngOnInit(): void {
      // Récupérer le login de l'admin depuis localStorage
      this.secreLogin = localStorage.getItem('login') || 'Admin';
      console.log('Admin Login récupéré depuis localStorage :', this.secreLogin);
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
      this.router.navigate(['/login']); // Rediriger vers la page de connexion
    }
  
    // ngOnDestroy() {
    //   // Désabonner pour éviter les fuites de mémoire
    //   this.routerSubscription.unsubscribe();
    // }
  
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
