import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators, FormsModule, FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Users } from '../../../../services/users/users';
import { Auth } from '../../../../services/auth/auth';
import { UserCreateModel } from '../../../../models/user.model';
import { UserAuthModel } from '../../../../models/user-auth-model';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit{
  registerForm!: FormGroup;
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^[0-9]{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  get username() {
    return this.registerForm.get('username');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get phone() {
    return this.registerForm.get('phone');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  onRegister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    const { username, email, password, phone } = this.registerForm.value;

    this.authService.register(username, email, password, phone).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Registration successful! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
