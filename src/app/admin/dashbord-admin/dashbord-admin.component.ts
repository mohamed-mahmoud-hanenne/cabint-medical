import { Component,ViewChild  } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSidenav } from '@angular/material/sidenav';
import { RouterOutlet, RouterLink} from '@angular/router';
@Component({
  selector: 'app-dashbord-admin',
  imports: [
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './dashbord-admin.component.html',
  styleUrl: './dashbord-admin.component.scss'
})
export class DashbordAdminComponent {
  constructor() {}
}
