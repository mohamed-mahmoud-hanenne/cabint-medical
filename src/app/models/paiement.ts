import { Patient } from "./patient";

export interface Paiement {
    id?: number;
    patient?: Patient | null;
    montant: number;
    date: string;
}
