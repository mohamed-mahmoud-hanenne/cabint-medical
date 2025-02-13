import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UtilisateursComponent } from './utilisateurs/utilisateurs.component';
import { DashbordAdminComponent } from './dashbord-admin/dashbord-admin.component';
import { RendezvousComponent } from './rendezvous/rendezvous.component';
import { PaiementComponent } from './paiement/paiement.component';
import { PatientsComponent } from './patients/patients.component';
import { FichemedicaleComponent } from './fichemedicale/fichemedicale.component';
import { PrestationsComponent } from './prestations/prestations.component';
import { SallesComponent } from './salles/salles.component';
import { authGuard } from '../services/auth.guard';
import { StatisticsComponent } from './statistics/statistics.component';

const routes: Routes = [
    { path: 'users', component: UtilisateursComponent},
        
        { 
            path: 'admin', component: DashbordAdminComponent, canActivate: [authGuard],
            children: [
                { path: 'statis', component: StatisticsComponent },
                { path: 'users', component: UtilisateursComponent }, // Route enfant
                { path: 'rendezvous', component: RendezvousComponent },
                { path: 'paiements', component: PaiementComponent },
                { path: 'patients', component: PatientsComponent },
                { path: 'fiche', component: FichemedicaleComponent },
                { path: 'prestation', component: PrestationsComponent },
                { path: 'salles', component: SallesComponent }
                 
            ]
        },

        {
            path: 'login',
            loadChildren: () => import('../auth/auth.module').then(m => m.AuthModule),
          },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
