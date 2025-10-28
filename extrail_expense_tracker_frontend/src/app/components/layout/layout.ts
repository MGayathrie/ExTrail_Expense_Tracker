import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { Topbar } from '../topbar/topbar';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterOutlet, Sidebar, Topbar],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {

}
