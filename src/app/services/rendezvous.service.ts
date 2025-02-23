import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RendezVous } from '../models/rendezvous';

@Injectable({
  providedIn: 'root'
})
export class RendezvousService {

  private apiUrl = 'http://localhost:8080/api/rendezvous';
  constructor(private http: HttpClient) { }

  getAllRendezVous(): Observable<RendezVous[]> {
    return this.http.get<RendezVous[]>(`${this.apiUrl}/allrendez`);
  }

    // // Méthode pour récupérer les rendez-vous imminents
    // getUpcomingRendezVous(): Observable<RendezVous[]> {
    //   const currentDate = new Date().toISOString();
    //   const upcomingDate = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(); // Prochaines 2 heures
    //   return this.http.get<RendezVous[]>(`${this.apiUrl}?date_gte=${currentDate}&date_lte=${upcomingDate}`);
    // }

  getRendezVousStatistics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/statistics`)
  }

  updateRendezVousStatut(rendezId: number, statut: string): Observable<any>{
    return this.http.patch(`${this.apiUrl}/${rendezId}`, {statut})
  }


  addRendezVous(rendez: RendezVous) : Observable<RendezVous>{
    return this.http.post<RendezVous>(`${this.apiUrl}/addrendez`, rendez);
  }

  updateRendezVous(rendez: RendezVous, id:number) : Observable<RendezVous>{
    return this.http.put<RendezVous>(`${this.apiUrl}/${id}`, rendez);
  }

  deleteRendezVous(id:number): Observable<any>{
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
