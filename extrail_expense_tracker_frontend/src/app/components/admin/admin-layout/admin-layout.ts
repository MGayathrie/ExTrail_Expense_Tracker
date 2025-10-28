import { Component } from '@angular/core';
import { AdminTopbar } from '../admin-topbar/admin-topbar';
import { AdminSidebar } from '../admin-sidebar/admin-sidebar';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  imports: [CommonModule, RouterOutlet, AdminSidebar, AdminTopbar],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {

}
