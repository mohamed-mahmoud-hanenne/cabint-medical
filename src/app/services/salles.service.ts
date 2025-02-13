import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Salle } from '../models/salle';

@Injectable({
  providedIn: 'root'
})
export class SallesService {

   private apiUrl = 'http://localhost:8080/api/salle';
        constructor(private http: HttpClient) { }
      
        getAllSalles(): Observable<Salle[]> {
          return this.http.get<Salle[]>(`${this.apiUrl}/allsalle`);
        }

        getSalleStatistics(): Observable<any> {
          return this.http.get<any>(`${this.apiUrl}/statistics`);
        }
        
      
      
        addSalle(salle: Salle) : Observable<Salle>{
          return this.http.post<Salle>(`${this.apiUrl}/addsalle`, salle);
        }
      
        updateSalle(salle: Salle, id:number) : Observable<Salle>{
          return this.http.put<Salle>(`${this.apiUrl}/${id}`, salle);
        }
      
        deleteSalle(id:number): Observable<any>{
          return this.http.delete(`${this.apiUrl}/${id}`);
        }
}
