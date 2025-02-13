import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';


export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Vérification de l'authentification
  if (authService.isLoggedIn()){
    return true;
  }

  else {
    router.navigate(['/login']); // Rediriger vers la page de connexion
    return false;  // Bloquer l'accès
  }
};
