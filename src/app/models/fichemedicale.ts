import { Patient } from "./patient";

export interface Fichemedicale {
    id?:number,
    patient?: Patient | null,
    description:string
}
