import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashbordSecretaireComponent } from './dashbord-secretaire/dashbord-secretaire.component';
import { authGuard } from '../services/auth.guard';

const routes: Routes = [
  {path:'secretaire', component:DashbordSecretaireComponent, canActivate:[authGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecretaireRoutingModule { }
