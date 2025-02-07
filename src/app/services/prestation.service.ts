import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Prestation } from '../models/prestation';

@Injectable({
  providedIn: 'root'
})
export class PrestationService {

    private apiUrl = 'http://localhost:8080/api/prestation';
      constructor(private http: HttpClient) { }
    
      getAllPrestations(): Observable<Prestation[]> {
        return this.http.get<Prestation[]>(`${this.apiUrl}/allprestation`);
      }
    
    
      addPrestation(prestation: Prestation) : Observable<Prestation>{
        return this.http.post<Prestation>(`${this.apiUrl}/addprestation`, prestation);
      }
    
      updatePrestation(prestation: Prestation, id:number) : Observable<Prestation>{
        return this.http.put<Prestation>(`${this.apiUrl}/${id}`, prestation);
      }
    
      deletePrestation(id:number): Observable<any>{
        return this.http.delete(`${this.apiUrl}/${id}`);
      }
}
