export interface User {
    id? :number
    nom: string;
    prenom: string;
    login: string;
    password: string;
    role: 'admin' | 'secretaire'; 
  }
  