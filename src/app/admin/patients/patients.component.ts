import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../models/patient';
import { Observable } from 'rxjs';
import { error } from 'console';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-patients',
  imports: [CommonModule, FormsModule],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.scss'
})
export class PatientsComponent implements OnInit{

  patients: Patient[] = []
  constructor(private patientService: PatientService){}

  ngOnInit(): void {
    this.getPatient()
  }

  getPatient(){
    this.patientService.getAllPatients().subscribe(
      (data:Patient[]) =>{
        this.patients = data
      },
      (error) =>{
        console.error('Erreur de chargement des patients', error);
      }
    )
  }

  openPatientForm(patient: Patient = {nom: '', prenom: '', adresse: '',telephone:''}){
    Swal.fire({
      title: patient.id ? 'Modifier patient' : 'Ajouter patient',
      html: `
      <input id="nom" class="swal2-input" placeholder="Nom" value="${patient.nom}">
      <input id="prenom" class="swal2-input"  placeholder="Prénom" value="${patient.prenom}">
      <input id="adresse" class="swal2-input"  placeholder="Adresse" value="${patient.adresse}">
      <input id="telephone" class="swal2-input"  placeholder="Telephone" value="${patient.telephone}">
      `,
      showCancelButton:true,
      confirmButtonText: patient.id ? 'Modifier' : 'Ajouter',
      preConfirm: () => {
        const nom = (document.getElementById('nom') as HTMLInputElement).value;
        const prenom = (document.getElementById('prenom') as HTMLInputElement).value;
        const adresse = (document.getElementById('adresse') as HTMLInputElement).value;
        const telephone = (document.getElementById('telephone') as HTMLInputElement).value;

        if(!nom || !prenom || !adresse || !telephone){
          Swal.showValidationMessage('Tous les champs sont obligatoires');
          return false;
        }

        return {id: patient.id, nom, prenom, adresse, telephone} as Patient;
      } 
    }).then((result) => {
      if(result.isConfirmed){
        if(patient.id){
          this.patientService.updatePatient(result.value, patient.id).subscribe(() =>{
            this.getPatient();
            Swal.fire('Modifié!', 'Patient mis à jour.', 'success')
          });
        }else{
          this.patientService.addPatient(result.value).subscribe(() =>{
            this.getPatient();
            Swal.fire('Ajouté!', 'Nouvel Patient ajouté.', 'success');
          });
        }
      }
    })
  }

  deletePatient(id:number){
    if(id === undefined) return;
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Cette action est irréversible!",
      icon:'warning',
      showCancelButton:true,
      confirmButtonColor:'#3085d6',
      cancelButtonColor:'#d33',
      confirmButtonText:'Oui, supprimer!',
    }).then((result) => {
      if(result.isConfirmed){
        this.patientService.deletePatient(id).subscribe(() => {
          this.getPatient();
          Swal.fire('supprimé!', 'L’utilisateur a été supprimé.','success');
        })
      }
    })
  }
  
}
