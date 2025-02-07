import { Patient } from './patient'; 

export interface RendezVous {
    id?: number;
    patient?: Patient | null; 
    date: string; 
    heure: string; 
    statut: string; 
}