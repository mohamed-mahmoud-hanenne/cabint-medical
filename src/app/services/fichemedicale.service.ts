import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Fichemedicale } from '../models/fichemedicale';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FichemedicaleService {

  private apiUrl = 'http://localhost:8080/api/fiche';
    constructor(private http: HttpClient) { }
  
    getAllFiche(): Observable<Fichemedicale[]> {
      return this.http.get<Fichemedicale[]>(`${this.apiUrl}/allfiche`);
    }
  
  
    addFiche(fiche: Fichemedicale) : Observable<Fichemedicale>{
      return this.http.post<Fichemedicale>(`${this.apiUrl}/addfiche`, fiche);
    }
  
    updateFiche(fiche: Fichemedicale, id:number) : Observable<Fichemedicale>{
      return this.http.put<Fichemedicale>(`${this.apiUrl}/${id}`, fiche);
    }
  
    deleteFiche(id:number): Observable<any>{
      return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
