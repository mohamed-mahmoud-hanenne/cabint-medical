import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Patient } from '../models/patient';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private apiUrl = 'http://localhost:8080/api/patients'

  constructor(private http:HttpClient) { }

  getAllPatients() : Observable<Patient[]>{
    return this.http.get<Patient[]>(`${this.apiUrl}/allpatients`);
  }

  getPatientStatistics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/statistics`);
  }

  addPatient(patient: Patient): Observable<Patient>{
    return this.http.post<Patient>(`${this.apiUrl}/addpatient`,patient)
  }

  updatePatient(patient: Patient, id:number): Observable<Patient>{
    return this.http.put<Patient>(`${this.apiUrl}/${id}`,patient);
  }

  deletePatient(id:number):Observable<any>{
    return this.http.delete(`${this.apiUrl}/${id}`)
  }
}
