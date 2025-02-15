import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashbordSecretaireComponent } from './dashbord-secretaire/dashbord-secretaire.component';
import { authGuard } from '../services/auth.guard';
import { RendezvousComponent } from '../admin/rendezvous/rendezvous.component';




const routes: Routes = [
  {path: 'rendezvous', component: RendezvousComponent},
  {
    
    path:'secretaire', component:DashbordSecretaireComponent, canActivate:[authGuard],
    children : [
      {path: 'rendezvous', component: RendezvousComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecretaireRoutingModule { }
