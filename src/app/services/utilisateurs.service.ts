import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilisateursService {

  private apiUrl = 'http://localhost:8080/api/utilisateurs';

  constructor(private http: HttpClient) { }

getAllUsers(): Observable<User[]>{
    return this.http.get<User[]>(`${this.apiUrl}/allusers`);
  }

  addUser(user:User): Observable<User>{
    return this.http.post<User>(`${this.apiUrl}/register`,user)
  }

  updateUser(user:User, id:number): Observable<User>{
    return this.http.put<User>(`${this.apiUrl}/${id}`, user)
  }

  deleteUser(id: number): Observable<any>{
   return this.http.delete(`${this.apiUrl}/${id}`)
  }

}
