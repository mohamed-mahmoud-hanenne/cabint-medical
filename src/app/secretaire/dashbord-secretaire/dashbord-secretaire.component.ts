import { Component, HostListener } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-dashbord-secretaire',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './dashbord-secretaire.component.html',
  styleUrl: './dashbord-secretaire.component.scss'
})
export class DashbordSecretaireComponent {

    // private routerSubscription: Subscription;
  
    constructor(private authService: AuthService, private router: Router, private searchService:SearchService) {
      // Détecter lorsque l'utilisateur quitte le dashboard
      // this.routerSubscription = this.router.events.subscribe((event) => {
      //   if (event instanceof NavigationEnd) {
      //     // Si l'utilisateur quitte la route secretaire
      //     if (!event.urlAfterRedirects.includes('/secretaire')) {
      //       this.authService.logout(); // Déconnexion
      //     }
      //   }
      // });
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
