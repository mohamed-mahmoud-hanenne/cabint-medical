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
@Component({
  selector: 'app-dashbord-admin',
  imports: [
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './dashbord-admin.component.html',
  styleUrl: './dashbord-admin.component.scss'
})
export class DashbordAdminComponent {

  private routerSubscription: Subscription;

  constructor(private authService: AuthService, private router: Router) {
    // Détecter lorsque l'utilisateur quitte le dashboard
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Si l'utilisateur quitte la route admin
        if (!event.urlAfterRedirects.includes('/admin')) {
          this.authService.logout(); // Déconnexion
        }
      }
    });
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
}
