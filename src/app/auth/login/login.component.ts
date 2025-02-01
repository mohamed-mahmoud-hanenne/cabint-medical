import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  userlogin = {login:'', password:''};
  message: string = '';

  constructor(private authService: AuthService, private router: Router){}

  onLogin(){
    this.authService.login(this.userlogin).subscribe({
      next: (res) => {
        console.log("Réponse du backend :", res);

        if(res.role === 'admin'){
          this.router.navigate(['admin']);
        } else if(res.role === 'secretaire'){
          this.router.navigate(['secretaire'])
        }

        this.message = res.message;
      },
      error: (err) => {
        console.error("Erreur de connexion :", err);
        this.message = err.error.message || 'Identifiants incorrects';
      }
    });
  }
}
