import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../../../services/auth/auth';

@Component({
  selector: 'app-authmodule',
  imports: [CommonModule],
  templateUrl: './authmodule.html',
  styleUrl: './authmodule.css',
})
export class Authmodule {
// constructor(private auth: Auth, private router: Router) {}
//   ngOnInit(): void {
//    // Use this component for logout route
//     this.logout();
//   }
//   logout(): void {
//    this.auth.logout();
//    this.router.navigate(['/login']);
//   }

}
