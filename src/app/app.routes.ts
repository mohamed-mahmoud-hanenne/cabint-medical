import { Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { DashbordAdminComponent } from './admin/dashbord-admin/dashbord-admin.component';
import { DashbordSecretaireComponent } from './secretaire/dashbord-secretaire/dashbord-secretaire.component';
import { UtilisateursComponent } from './admin/utilisateurs/utilisateurs.component';
import { RendezvousComponent } from './admin/rendezvous/rendezvous.component';
import { PaiementComponent } from './admin/paiement/paiement.component';
import { PatientsComponent } from './admin/patients/patients.component';
import { FichemedicaleComponent } from './admin/fichemedicale/fichemedicale.component';
import { SallesComponent } from './admin/salles/salles.component';
import { PrestationsComponent } from './admin/prestations/prestations.component';
import { authGuard } from './services/auth.guard';
import { StatisticsComponent } from './admin/statistics/statistics.component';

export const routes: Routes = [
    { path: 'register', component:RegisterComponent},
    { path: 'login', component: LoginComponent},

    { 
        path: 'admin', component: DashbordAdminComponent, 
        canActivate: [authGuard], // Protection de la route admin
        children: [
            { path: 'statis', component: StatisticsComponent },
            { path: 'users', component: UtilisateursComponent }, //Route enfant
            { path: 'rendezvous', component: RendezvousComponent } ,
            { path: 'paiements', component: PaiementComponent },
            { path: 'patients', component: PatientsComponent },
            { path: 'fiche', component: FichemedicaleComponent },
            { path: 'prestation', component: PrestationsComponent },
            { path: 'salles', component: SallesComponent }

        ]
    },

    { 
        path: 'secretaire', component: DashbordSecretaireComponent,
        canActivate: [authGuard], // Protection de la route secretaire
        children: [
            { path: 'rendezvous', component: RendezvousComponent } ,
        ]

    },

     {
        path: '',
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
      },


    { path: '', redirectTo:'/login', pathMatch: 'full'}
];
