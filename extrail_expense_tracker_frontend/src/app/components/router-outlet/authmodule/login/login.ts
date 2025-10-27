import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators, FormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Login as LoginService } from '../../../../services/login/login';
import { Auth } from '../../../../services/auth/auth';
import { UserAuthModel } from '../../../../models/user-auth-model';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit{
   loginForm!: FormGroup;
  errorMessage = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;

    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Invalid credentials. Please try again.';
      }
    });
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
