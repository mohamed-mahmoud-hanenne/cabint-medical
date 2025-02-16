import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/utilisateurs';
  private tokenKey = 'authToken';  // Clé pour stocker le token

  constructor(private http:HttpClient) { }

  register(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(userlogin: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`,userlogin)
  }

    // Vérifie si l'utilisateur est connecté
  isLoggedIn(): boolean {
    const token = localStorage.getItem(this.tokenKey);  // Récupère le token depuis localStorage
    return !!token; // Retourne true si un token existe, sinon false
  }

   // Enregistre le token après une connexion réussie
  saveToken(token: string): void{
    localStorage.setItem(this.tokenKey, token);
  }

   // Supprime le token lors de la déconnexion
  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  getAdminLogin(): string {
    return localStorage.getItem('login') || 'Admin';
  }
  
}
