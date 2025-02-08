import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paiement } from '../models/paiement';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaiementService {

     private apiUrl = 'http://localhost:8080/api/paiement';
          constructor(private http: HttpClient) { }
        
          getAllPaiement(): Observable<Paiement[]> {
            return this.http.get<Paiement[]>(`${this.apiUrl}/allpaiement`);
          }
        
        
          addPaiement(paiement: Paiement) : Observable<Paiement>{
            return this.http.post<Paiement>(`${this.apiUrl}/addpaiement`, paiement);
          }
        
          updatePaiement(paiement: Paiement, id:number) : Observable<Paiement>{
            return this.http.put<Paiement>(`${this.apiUrl}/${id}`, paiement);
          }
        
          deletePaiement(id:number): Observable<any>{
            return this.http.delete(`${this.apiUrl}/${id}`);
          }
}
