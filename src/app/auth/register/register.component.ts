import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user';
import { RouterLink} from '@angular/router';
@Component({
  selector: 'app-register',
  standalone:true,
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  user: User = {
    nom: '', 
    prenom: '', 
    login: '',password: '', 
    role: 'admin'
  };

  message: string = '';

  constructor(private authService: AuthService){}

  onRegister(){
    console.log("Données envoyées :", this.user);
    this.authService.register(this.user).subscribe({
      next: (res) => this.message = res.message,
      error: (err) => this.message = err.error.message || 'Erreur lors de l’inscription'
    });
  }
}
