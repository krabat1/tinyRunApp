import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { UserService } from './services/auth/user.service';
import { AuthService } from './services/auth/auth.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'tasks';
  constructor(public userService: UserService, private authService:AuthService) {}
  ngOnInit(): void {
    this.authService.getCurrentUser()
  }
}
